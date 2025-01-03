import prisma from '../../../lib/prisma';

interface PesanBot {
  id?: number; // Optional for POST, required for GET
  sesi_chatbot_mahasiswa_id: number;
  pesan: string;
  waktu_kirim: Date; // Adjust type according to your schema
}

interface RiwayatPesanChatbot {
  sesi_chatbot_mahasiswa_id: number;
  pesan: string;
  role: string; // Assuming role is a string, adjust if necessary
  waktu_kirim: Date; // Adjust type according to your schema
}

export async function GET(req: Request): Promise<Response> {
  try {
    const pesanBot = await prisma.pesanbot.findMany();

    return new Response(JSON.stringify(pesanBot), {
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
    const body: PesanBot = await req.json();

    const { sesi_chatbot_mahasiswa_id, pesan, waktu_kirim } = body;

    if (!sesi_chatbot_mahasiswa_id || !pesan || !waktu_kirim) {
      return new Response(
        JSON.stringify({ message: 'All fields are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const pesanBot = await prisma.pesanbot.create({
      data: {
        sesi_chatbot_mahasiswa_id,
        pesan,
        waktu_kirim,
      },
    });

    const riwayatPesanChatbot: RiwayatPesanChatbot = {
      sesi_chatbot_mahasiswa_id,
      pesan,
      role: "assistant",
      waktu_kirim,
    };

    await prisma.riwayatpesanchatbot.create({
      data: riwayatPesanChatbot,
    });

    return new Response(JSON.stringify(pesanBot), {
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
