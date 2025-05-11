// /app/api/datadosen/route.ts
import prisma from "../../../lib/prisma";

interface ChatbotMahasiswaRequestBody {
  sesi_chatbot_mahasiswa_id?: number; // Change to number
  pesan: string;
  waktu_kirim: string;
  mahasiswa_id?: number;
}

export async function GET(req: Request): Promise<Response> {
  try {
    // Fetching data from the database
    const chatbotMahasiswa = await prisma.pesanchatbotmahasiswa.findMany();

    // Returning data as JSON
    return new Response(JSON.stringify(chatbotMahasiswa), {
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
    const body: ChatbotMahasiswaRequestBody = await req.json();
    const { sesi_chatbot_mahasiswa_id, pesan, waktu_kirim, mahasiswa_id } =
      body;
    console.log(body);

    // Check if sesi_chatbot_mahasiswa_id is not provided and mahasiswa_id is provided
    if (!sesi_chatbot_mahasiswa_id && mahasiswa_id) {
      const sesiChatbotMahasiswa = await prisma.sesichatbotmahasiswa.create({
        data: {
          mahasiswa_id,
          pesan_pertama: pesan,
          waktu_mulai: waktu_kirim,
        },
      });

      const chatbotMahasiswa = await prisma.pesanchatbotmahasiswa.create({
        data: {
          sesi_chatbot_mahasiswa_id: sesiChatbotMahasiswa.id,
          pesan,
          waktu_kirim,
        },
      });

      await prisma.riwayatpesanchatbot.create({
        data: {
          sesi_chatbot_mahasiswa_id: sesiChatbotMahasiswa.id, // Ensure this is a number
          pesan,
          role: "user",
          waktu_kirim,
        },
      });

      return new Response(JSON.stringify(chatbotMahasiswa), {
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

    // Ensure sesi_chatbot_mahasiswa_id is defined before using it
    if (sesi_chatbot_mahasiswa_id === undefined) {
      return new Response(
        JSON.stringify({ message: "sesi_chatbot_mahasiswa_id is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const chatbotMahasiswa = await prisma.pesanchatbotmahasiswa.create({
      data: {
        sesi_chatbot_mahasiswa_id,
        pesan,
        waktu_kirim,
      },
    });

    await prisma.riwayatpesanchatbot.create({
      data: {
        sesi_chatbot_mahasiswa_id, // Ensure this is a number
        pesan,
        role: "user",
        waktu_kirim,
      },
    });

    return new Response(JSON.stringify(chatbotMahasiswa), {
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
