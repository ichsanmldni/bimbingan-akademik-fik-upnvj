import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("authBMFK")?.value;
  console.log(token);

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Unauthorized: Token not found" },
      { status: 401 }
    );
  }

  let decoded: any;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
    console.log(decoded);
  } catch (err) {
    console.error("JWT verification failed:", err);
    return NextResponse.json(
      { success: false, message: "Invalid or expired token" },
      { status: 403 }
    );
  }

  const { nim, email, role } = decoded;
  console.log(decoded);
  if (!role) {
    return NextResponse.json(
      { success: false, message: "Token payload incomplete" },
      { status: 400 }
    );
  }

  // Determine role & userId
  let userId: number | null = null;
  let keyField: "mahasiswa_id" | "dosen_pa_id" | "kaprodi_id";

  if (role.toLowerCase() === "mahasiswa") {
    if (!nim)
      return NextResponse.json(
        { success: false, message: "NIM missing" },
        { status: 400 }
      );

    const mahasiswa = await prisma.mahasiswa.findUnique({ where: { nim } });
    if (!mahasiswa) {
      return NextResponse.json(
        { success: false, message: "Mahasiswa tidak ditemukan" },
        { status: 404 }
      );
    }

    userId = mahasiswa.id;
    keyField = "mahasiswa_id";
  } else if (role.toLowerCase() === "dosen pa") {
    if (!email)
      return NextResponse.json(
        { success: false, message: "Email missing" },
        { status: 400 }
      );

    const dosen = await prisma.dosenpa.findUnique({ where: { email } });
    if (!dosen) {
      return NextResponse.json(
        { success: false, message: "Dosen tidak ditemukan" },
        { status: 404 }
      );
    }

    userId = dosen.id;
    keyField = "dosen_pa_id";
  } else if (role.toLowerCase() === "kaprodi") {
    if (!email)
      return NextResponse.json(
        { success: false, message: "Email missing" },
        { status: 400 }
      );

    const kaprodi = await prisma.kaprodi.findUnique({ where: { email } });
    if (!kaprodi) {
      return NextResponse.json(
        { success: false, message: "Kaprodi tidak ditemukan" },
        { status: 404 }
      );
    }

    userId = kaprodi.id;
    keyField = "kaprodi_id";
  } else {
    return NextResponse.json(
      { success: false, message: "Unknown role" },
      { status: 400 }
    );
  }

  const subscription = await req.json();

  const data: Record<string, any> = {
    endpoint: subscription.endpoint,
    keys: subscription.keys,
    [keyField]: userId,
  };

  try {
    // Sebelum upsert, kosongkan role lain jika endpoint sudah ada
    const existing = await prisma.pushsubscription.findUnique({
      where: { endpoint: subscription.endpoint },
    });

    const data: any = {
      endpoint: subscription.endpoint,
      keys: subscription.keys,
      mahasiswa_id: null,
      dosen_pa_id: null,
      kaprodi_id: null,
    };

    if (role === "Mahasiswa") data.mahasiswa_id = userId;
    else if (role === "Dosen PA") data.dosen_pa_id = userId;
    else if (role === "Kaprodi") data.kaprodi_id = userId;

    await prisma.pushsubscription.upsert({
      where: { endpoint: subscription.endpoint },
      update: data,
      create: data,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
