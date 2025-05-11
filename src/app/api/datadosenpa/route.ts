// /app/api/datadosen/route.ts
import fs from "fs/promises";
import path from "path";
import prisma from "../../../lib/prisma";

interface DosenRequestBody {
  id: number;
  nama_lengkap: string;
  email: string;
  no_whatsapp: string;
  profile_image?: string;
}

export async function GET(req: Request): Promise<Response> {
  try {
    // Fetching data from the database
    const dosen = await prisma.dosenpa.findMany({
      select: {
        id: true,
        nama: true,
        email: true,
        hp: true,
        profile_image: true,
        isDeleted: true,
      },
    });

    // Returning data as JSON
    return new Response(JSON.stringify(dosen), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Handling errors
    return new Response(
      JSON.stringify({
        message: "Something went wrong",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function PATCH(req: Request): Promise<Response> {
  try {
    const body: any = await req.json();
    const { nama, email, hp, profile_image } = body;

    // Validasi input
    if (!nama || !email || !hp) {
      return new Response(JSON.stringify({ message: "Invalid data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const existingRecord = await prisma.dosenpa.findUnique({
      where: { email },
    });

    if (!existingRecord) {
      return new Response(JSON.stringify({ message: "Record not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Simpan base64 langsung ke database
    const updatedDosen = await prisma.dosenpa.update({
      where: { email },
      data: {
        nama,
        email,
        hp,
        profile_image: profile_image ?? existingRecord.profile_image,
      },
    });

    return new Response(
      JSON.stringify({
        message: "Update berhasil",
        dosen: {
          nama,
          email,
          hp,
          profile_image: updatedDosen.profile_image,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Something went wrong",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
