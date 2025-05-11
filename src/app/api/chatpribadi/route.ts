// /app/api/datadosen/route.ts
import prisma from "../../../lib/prisma";

interface ChatPribadiRequestBody {
  mahasiswa_id: number;
  dosen_pa_id: number;
  waktu_pesan_terakhir: string;
  pesan_terakhir: string;
  pengirim_pesan_terakhir: string;
}

interface PatchRequestBody {
  id: number;
  pesan_terakhir: string;
  waktu_pesan_terakhir: string;
  pengirim_pesan_terakhir: string;
}

export async function GET(req: Request): Promise<Response> {
  try {
    // Fetching data from the database
    const chatPribadi = await prisma.chatpribadi.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        mahasiswa: true,
        dosen_pa: true,
      },
    });

    // Returning data as JSON
    return new Response(JSON.stringify(chatPribadi), {
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

export async function POST(req: Request): Promise<Response> {
  try {
    const body: any = await req.json();
    const {
      mahasiswa_id,
      dosen_pa_id,
      waktu_pesan_terakhir,
      is_mahasiswa_pesan_terakhir_read,
      is_dosenpa_pesan_terakhir_read,
      pesan_terakhir,
      pengirim_pesan_terakhir,
    } = body;

    // Validate required fields
    if (
      !mahasiswa_id ||
      !dosen_pa_id ||
      !waktu_pesan_terakhir ||
      is_mahasiswa_pesan_terakhir_read === undefined ||
      is_dosenpa_pesan_terakhir_read === undefined ||
      !pesan_terakhir ||
      !pengirim_pesan_terakhir
    ) {
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const chatPribadi = await prisma.chatpribadi.create({
      data: {
        mahasiswa_id,
        dosen_pa_id,
        waktu_pesan_terakhir,
        is_mahasiswa_pesan_terakhir_read,
        is_dosenpa_pesan_terakhir_read,
        pesan_terakhir,
        pengirim_pesan_terakhir,
      },
    });

    return new Response(JSON.stringify(chatPribadi), {
      status: 201,
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

export async function PATCH(req: Request): Promise<Response> {
  try {
    const body: PatchRequestBody = await req.json();
    const {
      id,
      pesan_terakhir,
      waktu_pesan_terakhir,
      pengirim_pesan_terakhir,
    } = body;

    // Validate required fields
    if (
      !id ||
      !pesan_terakhir ||
      !waktu_pesan_terakhir ||
      !pengirim_pesan_terakhir
    ) {
      return new Response(JSON.stringify({ message: "Invalid data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const existingRecord = await prisma.chatpribadi.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return new Response(JSON.stringify({ message: "Record not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const chatPribadi = await prisma.chatpribadi.update({
      where: { id },
      data: { pesan_terakhir, waktu_pesan_terakhir, pengirim_pesan_terakhir },
    });

    return new Response(JSON.stringify(chatPribadi), {
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
