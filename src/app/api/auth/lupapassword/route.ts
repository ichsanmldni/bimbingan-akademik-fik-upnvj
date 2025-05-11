import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { email } = await req.json();

  // Cek apakah email terdaftar
  let user = await prisma.dosenpa.findUnique({ where: { email } });
  let userType = "dosenpa";

  if (!user) {
    user = await prisma.kaprodi.findUnique({ where: { email } });
    userType = "kaprodi";
  }

  if (!user) {
    return NextResponse.json(
      { message: "Email tidak ditemukan" },
      { status: 404 }
    );
  }

  // Generate token valid 15 menit
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  });

  // Update sesuai dengan tabel yang ditemukan
  await prisma[userType].update({
    where: { email },
    data: {
      reset_token: token,
      reset_token_expires: new Date(Date.now() + 15 * 60 * 1000),
    },
  });

  // Kirim email dengan Nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetLink = `${process.env.NEXT_PUBLIC_API_BASE_URL}/reset-password?token=${token}`;
  await transporter.sendMail({
    from: `"Admin BIMAFIK" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Password",
    html: `
      <p>Klik link berikut untuk reset password: </p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Link ini akan kedaluwarsa dalam 1 jam.</p>
    `,
  });

  return NextResponse.json({ message: "Cek email untuk reset password" });
}
