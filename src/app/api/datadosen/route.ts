// /app/api/datadosen/route.js
import prisma from '../../../lib/prisma';

export async function GET(req) {
  try {
    // Mengambil data dosen dari database
    const Dosen = await prisma.dosen.findMany();
    
    // Mengembalikan data dosen sebagai JSON
    return new Response(JSON.stringify(Dosen), {
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

export async function PATCH(req) {
  try {
    const body = await req.json();
    console.log(body)

    const {id, nama_lengkap, email, nip, no_whatsapp} = body;
    
    if (!id || !nama_lengkap || !email || !nip || !no_whatsapp) {
      return new Response(
        JSON.stringify({ message: 'Invalid data' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const existingRecord = await prisma.dosen.findUnique({
      where: { id },
    });
    
    if (!existingRecord) {
      throw new Error('Record not found');
    }
    
    const Dosen = await prisma.dosen.update({ where: { id }, data: { nama_lengkap, email, nip, no_whatsapp } })

    return new Response(JSON.stringify(Dosen), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    
    
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Something went wrong', error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
