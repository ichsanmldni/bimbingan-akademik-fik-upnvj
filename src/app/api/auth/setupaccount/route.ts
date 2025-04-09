import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const { token, newPassword, noWa } = await req.json();

  // Verifikasi token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch (err) {
    return NextResponse.json(
      { message: "Token tidak valid atau kadaluarsa" },
      { status: 400 }
    );
  }

  const { id } = decoded as { id: string };

  // Cek user berdasarkan token
  let user = await prisma.dosenpa.findFirst({
    where: { id, reset_token: token },
  });
  let userType = "dosenpa";

  if (!user) {
    user = await prisma.kaprodi.findFirst({
      where: { id, reset_token: token },
    });
    userType = "kaprodi";
  }

  if (!user) {
    return NextResponse.json({ message: "Token tidak valid" }, { status: 400 });
  }

  // Hash password baru
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password di database dan hapus token
  await prisma[userType].update({
    where: { id },
    data: {
      hp: noWa,
      password: hashedPassword,
      reset_token: null,
      reset_token_expires: null,
    },
  });

  return NextResponse.json({ message: "Password berhasil diperbarui" });
}
