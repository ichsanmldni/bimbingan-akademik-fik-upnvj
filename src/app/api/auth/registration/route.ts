// app/api/auth/registration/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, nama_lengkap, role } = body;

  console.log(email, nama_lengkap, role);

  try {
    // Cek apakah user sudah ada
    const existingUser =
      role === "Dosen PA"
        ? await prisma.dosenpa.findFirst({ where: { nama: nama_lengkap } })
        : await prisma.kaprodi.findFirst({ where: { nama: nama_lengkap } });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Buat user baru tanpa token dulu
    let user;
    if (role === "Dosen PA") {
      user = await prisma.dosenpa.create({
        data: {
          email,
          nama: nama_lengkap,
        },
      });
    } else if (role === "Kaprodi") {
      user = await prisma.kaprodi.create({
        data: {
          email,
          nama: nama_lengkap,
        },
      });
    }

    if (!user) {
      return NextResponse.json(
        { message: "Gagal membuat user." },
        { status: 500 }
      );
    }

    // Buat token dan expired time
    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
    const resetTokenExpires = new Date(Date.now() + 3600 * 1000); // 1 jam

    // Update user dengan reset_token dan reset_token_expires
    if (role === "Dosen PA") {
      await prisma.dosenpa.update({
        where: { id: user.id },
        data: {
          reset_token: resetToken,
          reset_token_expires: resetTokenExpires,
        },
      });
    } else if (role === "Kaprodi") {
      await prisma.kaprodi.update({
        where: { id: user.id },
        data: {
          reset_token: resetToken,
          reset_token_expires: resetTokenExpires,
        },
      });
    }

    // Kirim Email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `${process.env.NEXT_PUBLIC_API_BASE_URL}/setup-account?token=${resetToken}`;

    await transporter.sendMail({
      from: `"Admin BIMAFIK" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Atur Password Anda",
      html: `
        <p>Halo ${nama_lengkap},</p>
        <p>Silakan klik link di bawah untuk setup akun Anda:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Link ini akan kedaluwarsa dalam 1 jam.</p>
      `,
    });

    return NextResponse.json({
      message: "Registrasi berhasil, cek email Anda.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
