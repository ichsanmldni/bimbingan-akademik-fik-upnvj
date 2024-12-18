// /app/api/datadosen/route.js
import prisma from '../../../lib/prisma';

export async function GET(req) {
  try {
    // Mengambil data dosen dari database
    const chatMahasiswa = await prisma.pesanchatmahasiswa.findMany(
    );
    
    // Mengembalikan data dosen sebagai JSON
    return new Response(JSON.stringify(chatMahasiswa), {
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

      const { chat_pribadi_id, mahasiswa_id, dosen_pa_id, pesan, waktu_kirim} = body;

      
      if(!chat_pribadi_id){
        const ChatPribadi = await prisma.chatpribadi.create({
          data : {
              mahasiswa_id, dosen_pa_id, waktu_pesan_terakhir: waktu_kirim, is_pesan_terakhir_read : false, pesan_terakhir: pesan, pengirim_pesan_terakhir: "Mahasiswa"
          }
      });

      const ChatMahasiswa = await prisma.pesanchatmahasiswa.create({
        data : {
          chat_pribadi_id: ChatPribadi.id, pesan, waktu_kirim
        }
    });

    return new Response(JSON.stringify(ChatMahasiswa), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });

      }

      if (!pesan || !waktu_kirim) {
        return new Response(
          JSON.stringify({ message: 'All fields are required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const ChatMahasiswa = await prisma.pesanchatmahasiswa.create({
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
    
    const ChatPribadi = await prisma.chatpribadi.update({ where: { id: chat_pribadi_id }, data: { pesan_terakhir: pesan, waktu_pesan_terakhir: waktu_kirim, is_pesan_terakhir_read: false, pengirim_pesan_terakhir: "Mahasiswa" } })
    return new Response(JSON.stringify(ChatMahasiswa), {
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
