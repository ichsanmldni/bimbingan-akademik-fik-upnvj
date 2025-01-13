import prisma from '../../../lib/prisma';

export async function GET(req: Request): Promise<Response> {
  try {
    const riwayatPesanChatbot = await prisma.riwayatpesanchatbot.findMany();

    return new Response(JSON.stringify(riwayatPesanChatbot), {
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
    const body = await req.json();

    const { sesi_chatbot_mahasiswa_id, role, pesan, waktu_kirim } = body;

    if (!sesi_chatbot_mahasiswa_id || !pesan || !waktu_kirim || !role) {
      return new Response(
        JSON.stringify({ message: 'All fields are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const riwayatPesanChatbot = await prisma.riwayatpesanchatbot.create({
      data: {
        sesi_chatbot_mahasiswa_id,
        pesan,
        role,
        waktu_kirim,
      },
    });

    return new Response(JSON.stringify(riwayatPesanChatbot), {
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
