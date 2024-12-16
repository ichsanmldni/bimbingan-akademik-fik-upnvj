// /app/api/datadosen/route.js
import prisma from '../../../lib/prisma';

export async function GET(req) {
  try {
    const PesanBot = await prisma.pesanbot.findMany(
    );

    return new Response(JSON.stringify(PesanBot), {
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

      const { sesi_chatbot_mahasiswa_id, pesan, waktu_kirim} = body;

      if (!sesi_chatbot_mahasiswa_id || !pesan || !waktu_kirim) {
        return new Response(
          JSON.stringify({ message: 'All fields are required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      console.log(body)

      const PesanBot= await prisma.pesanbot.create({
        data : {
          sesi_chatbot_mahasiswa_id, pesan, waktu_kirim
        }
    });

    const RiwayatPesanChatbot= await prisma.riwayatpesanchatbot.create({
      data : {
        sesi_chatbot_mahasiswa_id, pesan, role: "assistant" , waktu_kirim
      }
  });
    return new Response(JSON.stringify(PesanBot), {
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
