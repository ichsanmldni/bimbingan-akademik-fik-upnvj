import prisma from '../../../lib/prisma';

interface SesiChatbotMahasiswa {
  id?: number; // Optional for POST, required for GET
  mahasiswa_id: number;
  waktu_mulai: Date; // Adjust type according to your schema
  pesan_pertama: string; // Add this field as required by your schema
}

export async function GET(req: Request): Promise<Response> {
  try {
    // Mengambil data sesi chatbot mahasiswa dari database
    const sesiChatbotMahasiswa = await prisma.sesichatbotmahasiswa.findMany({
      include: {
        mahasiswa: true,
      },
    });

    // Mengembalikan data sesi chatbot mahasiswa sebagai JSON
    return new Response(JSON.stringify(sesiChatbotMahasiswa), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // Menangani kesalahan
    return new Response(
      JSON.stringify({ message: 'Something went wrong', error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body: SesiChatbotMahasiswa = await req.json();

    const { mahasiswa_id, waktu_mulai, pesan_pertama } = body; // Include pesan_pertama

    if (!mahasiswa_id || !waktu_mulai || !pesan_pertama) { // Check for pesan_pertama
      return new Response(
        JSON.stringify({ message: 'All fields are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const sesiChatbotMahasiswa = await prisma.sesichatbotmahasiswa.create({
      data: {
        mahasiswa_id,
        waktu_mulai,
        pesan_pertama, // Include pesan_pertama in the data
      },
    });

    return new Response(JSON.stringify(sesiChatbotMahasiswa), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Something went wrong', error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
