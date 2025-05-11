// /app/api/datadosen/route.ts
import fs from "fs/promises";
import path from "path";
import prisma from "../../../lib/prisma";

interface MahasiswaRequestBody {
  id: number; // Assuming this is a string; change to number if needed
  nama_lengkap: string;
  email: string;
  nim: string;
  no_whatsapp: string;
  jurusan: string;
  peminatan: string;
  dosen_pa_id: number; // Assuming this is a string; change to number if needed
  profile_image?: string; // Optional, as it may not be provided
}

export async function GET(req: Request): Promise<Response> {
  try {
    // Fetching data from the database
    const mahasiswa = await prisma.mahasiswa.findMany({
      select: {
        id: true,
        nama: true,
        email: true,
        nim: true,
        hp: true,
        jurusan: true,
        peminatan: true,
        ipk: true,
        profile_image: true,
        dosen_pa_id: true,
        status_lulus: true,
      },
    });

    // Returning data as JSON
    return new Response(JSON.stringify(mahasiswa), {
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
    const {
      nama,
      email,
      nim,
      hp,
      jurusan,
      peminatan,
      dosen_pa_id,
      profile_image,
      ipk,
    } = body;

    // Validasi input
    if (!nama || !email || !nim || !hp || !jurusan) {
      return new Response(JSON.stringify({ message: "Invalid data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const ipkRegex = /^(0(\.00)?|[0-3](\.\d{2})?|4(\.00)?)$/;
    if (!ipkRegex.test(ipk)) {
      return new Response(
        JSON.stringify({
          message:
            "Format IPK yang Anda input tidak valid. IPK harus berupa string yang mewakili angka antara 0 dan 4 dengan tepat 2 angka di belakang koma.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Cari data lama
    const existingRecord = await prisma.mahasiswa.findUnique({
      where: { nim },
    });

    if (!existingRecord) {
      return new Response(JSON.stringify({ message: "Record not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Simpan base64 langsung ke kolom DB
    const updatedMahasiswa = await prisma.mahasiswa.update({
      where: { nim },
      data: {
        nama,
        email,
        nim,
        hp,
        jurusan,
        peminatan,
        dosen_pa_id,
        ipk,
        profile_image: profile_image ?? existingRecord.profile_image,
      },
    });

    return new Response(JSON.stringify(updatedMahasiswa), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
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
