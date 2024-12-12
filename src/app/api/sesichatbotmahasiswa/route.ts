// /app/api/datadosen/route.js
import prisma from '../../../lib/prisma';

export async function GET(req) {
  try {
    // Mengambil data dosen dari database
    const SesiChatbotMahasiswa = await prisma.sesiChatbotMahasiswa.findMany(
        {
            include: {
                mahasiswa: true,
            }
        }
    );
    
    // Mengembalikan data dosen sebagai JSON
    return new Response(JSON.stringify(SesiChatbotMahasiswa), {
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

      const { mahasiswa_id, waktu_mulai} = body;

      if (!mahasiswa_id || !waktu_mulai) {
        return new Response(
          JSON.stringify({ message: 'All fields are required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const SesiChatbotMahasiswa = await prisma.sesiChatbotMahasiswa.create({
        data : {
            mahasiswa_id, waktu_mulai
        }
    });
    return new Response(JSON.stringify(SesiChatbotMahasiswa), {
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

//     const {id, pesan_terakhir, waktu_pesan_terakhir, pengirim_pesan_terakhir} = body;
    
//     if (!id || !pesan_terakhir || !waktu_pesan_terakhir || !pengirim_pesan_terakhir) {
      
//       return new Response(
//         JSON.stringify({ message: 'Invalid data' }),
//         { status: 400, headers: { 'Content-Type': 'application/json' } }
//       );
//     }


//     const existingRecord = await prisma.chatPribadi.findUnique({
//       where: { id },
//     });
    
//     if (!existingRecord) {
//       throw new Error('Record not found');
//     }
    
//     const ChatPribadi = await prisma.chatPribadi.update({ where: { id }, data: { pesan_terakhir, waktu_pesan_terakhir, pengirim_pesan_terakhir } })

//     return new Response(JSON.stringify(ChatPribadi), {
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
