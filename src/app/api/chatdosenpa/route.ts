// /app/api/datadosen/route.ts
import prisma from '../../../lib/prisma';

interface ChatDosenPARequestBody {
  chat_pribadi_id: number; // Assuming this is a string; change to number if needed
  pesan: string;
  waktu_kirim: string;
}

export async function GET(req: Request): Promise<Response> {
  try {
    // Fetching data from the database
    const chatDosenPA = await prisma.pesanchatdosenpa.findMany();

    // Returning data as JSON
    return new Response(JSON.stringify(chatDosenPA), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // Handling errors
    return new Response(
      JSON.stringify({ message: 'Something went wrong', error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body: ChatDosenPARequestBody = await req.json();
    const { chat_pribadi_id, pesan, waktu_kirim } = body;

    // Validate required fields
    if (!chat_pribadi_id || !pesan || !waktu_kirim) {
      return new Response(
        JSON.stringify({ message: 'All fields are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create a new chat entry
    const chatDosenPA = await prisma.pesanchatdosenpa.create({
      data: {
        chat_pribadi_id,
        pesan,
        waktu_kirim,
      },
    });

    // Check if the chat record exists
    const existingRecord = await prisma.chatpribadi.findUnique({
      where: { id: chat_pribadi_id },
    });

    if (!existingRecord) {
      return new Response(
        JSON.stringify({ message: 'Record not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update the existing chat record
    const chatPribadi = await prisma.chatpribadi.update({
      where: { id: chat_pribadi_id },
      data: {
        pesan_terakhir: pesan,
        waktu_pesan_terakhir: waktu_kirim,
        is_pesan_terakhir_read: false,
        pengirim_pesan_terakhir: "Dosen PA",
      },
    });

    return new Response(JSON.stringify(chatDosenPA), {
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
