import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    // Cek apakah token tersedia
    if (!token) {
      return NextResponse.json(
        { message: "Token tidak ditemukan" },
        { status: 400 }
      );
    }

    // Verifikasi token JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json(
        { message: "Token tidak valid atau kadaluarsa" },
        { status: 400 }
      );
    }

    const { id } = decoded as { id: number };

    // Cek apakah user dengan token ini ada & belum expired
    let user = await prisma.dosenpa.findFirst({
      where: {
        id,
        reset_token: token,
        reset_token_expires: { gte: new Date() }, // Token harus masih berlaku
      },
    });

    if (!user) {
      user = await prisma.kaprodi.findFirst({
        where: {
          id,
          reset_token: token,
          reset_token_expires: { gte: new Date() }, // Token harus masih berlaku
        },
      });
    }

    if (!user) {
      return NextResponse.json(
        { message: "Token tidak valid atau sudah kadaluarsa" },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "Token valid" });
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan server", error: error.message },
      { status: 500 }
    );
  }
}
