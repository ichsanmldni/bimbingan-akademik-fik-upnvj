// /app/api/datadosen/route.ts
import { sendPushNotification } from "@/lib/sendPushNotification";
import prisma from "../../../lib/prisma";

interface ChatMahasiswaRequestBody {
  chat_pribadi_id?: number;
  mahasiswa_id: number;
  dosen_pa_id: number;
  pesan: string;
  waktu_kirim: string;
}

export async function GET(req: Request): Promise<Response> {
  try {
    // Fetching data from the database
    const chatMahasiswa = await prisma.pesanchatmahasiswa.findMany();

    // Returning data as JSON
    return new Response(JSON.stringify(chatMahasiswa), {
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
    const body: ChatMahasiswaRequestBody = await req.json();
    const { chat_pribadi_id, mahasiswa_id, dosen_pa_id, pesan, waktu_kirim } =
      body;

    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { id: mahasiswa_id },
    });
    // If chat_pribadi_id is not provided, create a new chat record
    if (!chat_pribadi_id) {
      const chatPribadi = await prisma.chatpribadi.create({
        data: {
          mahasiswa_id,
          dosen_pa_id,
          waktu_pesan_terakhir: waktu_kirim,
          is_dosenpa_pesan_terakhir_read: false,
          is_mahasiswa_pesan_terakhir_read: true,
          pesan_terakhir: pesan,
          pengirim_pesan_terakhir: "Mahasiswa",
        },
      });

      const chatMahasiswa = await prisma.pesanchatmahasiswa.create({
        data: {
          chat_pribadi_id: chatPribadi.id,
          pesan,
          waktu_kirim,
        },
      });

      await sendPushNotification({
        role: "dosen pa",
        userId: dosen_pa_id,
        title: "Anda Memiliki Pesan Pribadi Baru",
        body: `${mahasiswa.nama} : ${pesan}`,
        url: "/chatpribadi", // atau rute detail pengajuan
      });

      return new Response(JSON.stringify(chatMahasiswa), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Validate required fields
    if (!pesan || !waktu_kirim) {
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const chatMahasiswa = await prisma.pesanchatmahasiswa.create({
      data: {
        chat_pribadi_id,
        pesan,
        waktu_kirim,
      },
    });

    await sendPushNotification({
      role: "dosen pa",
      userId: dosen_pa_id,
      title: "Anda Memiliki Pesan Pribadi Baru",
      body: `${mahasiswa.nama} : ${pesan}`,
      url: "/chatpribadi", // atau rute detail pengajuan
    });

    const existingRecord = await prisma.chatpribadi.findUnique({
      where: { id: chat_pribadi_id },
    });

    if (!existingRecord) {
      return new Response(JSON.stringify({ message: "Record not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const chatPribadi = await prisma.chatpribadi.update({
      where: { id: chat_pribadi_id },
      data: {
        pesan_terakhir: pesan,
        waktu_pesan_terakhir: waktu_kirim,
        is_mahasiswa_pesan_terakhir_read: true,
        is_dosenpa_pesan_terakhir_read: false,
        pengirim_pesan_terakhir: "Mahasiswa",
      },
    });

    return new Response(JSON.stringify(chatMahasiswa), {
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
