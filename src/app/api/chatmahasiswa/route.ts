// /app/api/datadosen/route.js
import prisma from '../../../lib/prisma';

export async function GET(req) {
  try {
    // Mengambil data dosen dari database
    const chatMahasiswa = await prisma.pesanChatMahasiswa.findMany(
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

    console.log(body)


      const { chat_pribadi_id, mahasiswa_id, dosen_pa_id, pesan, waktu_kirim} = body;

      
      if(!chat_pribadi_id){
        const ChatPribadi = await prisma.chatPribadi.create({
          data : {
              mahasiswa_id, dosen_pa_id, waktu_pesan_terakhir: waktu_kirim, is_pesan_terakhir_read : false, pesan_terakhir: pesan, pengirim_pesan_terakhir: "Mahasiswa"
          }
      });
      console.log(ChatPribadi)

      const ChatMahasiswa = await prisma.pesanChatMahasiswa.create({
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

      const ChatMahasiswa = await prisma.pesanChatMahasiswa.create({
        data : {
          chat_pribadi_id, pesan, waktu_kirim
        }
    });

    const existingRecord = await prisma.chatPribadi.findUnique({
      where: { id:chat_pribadi_id },
    });
    
    if (!existingRecord) {
      throw new Error('Record not found');
    }
    
    const ChatPribadi = await prisma.chatPribadi.update({ where: { id: chat_pribadi_id }, data: { pesan_terakhir: pesan, waktu_pesan_terakhir: waktu_kirim, is_pesan_terakhir_read: false, pengirim_pesan_terakhir: "Mahasiswa" } })
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

// export async function PATCH(req) {
//   try {
//     const body = await req.json();

//     const {id, jenis_bimbingan} = body;
    
//     if (!id || !jenis_bimbingan) {
//       return new Response(
//         JSON.stringify({ message: 'Invalid data' }),
//         { status: 400, headers: { 'Content-Type': 'application/json' } }
//       );
//     }

//     console.log(id, jenis_bimbingan)

//     const existingRecord = await prisma.masterJenisBimbingan.findUnique({
//       where: { id },
//     });
    
//     if (!existingRecord) {
//       throw new Error('Record not found');
//     }
    
//     const JenisBimbingan = await prisma.masterJenisBimbingan.update({ where: { id }, data: { jenis_bimbingan } })

//     return new Response(JSON.stringify(JenisBimbingan), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
    
    
//   } catch (error) {
//     return new Response(
//       JSON.stringify({ message: 'Something went wrong', error: error.message }),
//       { status: 500, headers: { 'Content-Type': 'application/json' } }
//     );
//   }
// }

// export async function DELETE(req) {
//   try {
//     const body = await req.json();
//     const { id } = body;

//     if (!id) {
//       return new Response(
//         JSON.stringify({ message: 'Invalid ID' }),
//         { status: 400, headers: { 'Content-Type': 'application/json' } }
//       );
//     }

//     const existingRecord = await prisma.masterJenisBimbingan.findUnique({
//       where: { id },
//     });

//     if (!existingRecord) {
//       return new Response(
//         JSON.stringify({ message: 'Record not found' }),
//         { status: 404, headers: { 'Content-Type': 'application/json' } }
//       );
//     }

//     await prisma.masterJenisBimbingan.delete({
//       where: { id },
//     });

//     return new Response(
//       JSON.stringify({ message: 'Record deleted successfully' }),
//       { status: 200, headers: { 'Content-Type': 'application/json' } }
//     );
//   } catch (error) {
//     return new Response(
//       JSON.stringify({ message: 'Something went wrong', error: error.message }),
//       { status: 500, headers: { 'Content-Type': 'application/json' } }
//     );
//   }
// }
