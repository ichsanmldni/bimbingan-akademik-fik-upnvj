// /app/api/datadosen/route.js
import prisma from '../../../lib/prisma';

export async function GET(req) {
  try {
    // Mengambil data dosen dari database
    const chatDosenPA = await prisma.pesanchatdosenpa.findMany(
    );
    
    // Mengembalikan data dosen sebagai JSON
    return new Response(JSON.stringify(chatDosenPA), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // Menangani kesalahan
    return new Response(
      JSON.stringify({ message: 'Something went wrong', error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

      const { chat_pribadi_id, pesan, waktu_kirim} = body;

      if (!chat_pribadi_id || !pesan || !waktu_kirim) {
        return new Response(
          JSON.stringify({ message: 'All fields are required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const ChatDosenPA= await prisma.pesanchatdosenpa.create({
        data : {
          chat_pribadi_id, pesan, waktu_kirim
        }
    });

    const existingRecord = await prisma.chatpribadi.findUnique({
      where: { id:chat_pribadi_id },
    });
    
    if (!existingRecord) {
      throw new Error('Record not found');
    }
    
    const ChatPribadi = await prisma.chatpribadi.update({ where: { id: chat_pribadi_id }, data: { pesan_terakhir: pesan, waktu_pesan_terakhir: waktu_kirim, is_pesan_terakhir_read: false, pengirim_pesan_terakhir: "Dosen PA" } })
    return new Response(JSON.stringify(ChatDosenPA), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
    
    
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Something went wrong', error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
