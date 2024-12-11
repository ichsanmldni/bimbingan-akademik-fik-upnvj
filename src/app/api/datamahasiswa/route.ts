// /app/api/datadosen/route.js
import prisma from '../../../lib/prisma';

export async function GET(req) {
  try {
    // Mengambil data dosen dari database
    const Mahasiswa = await prisma.mahasiswa.findMany();
    
    // Mengembalikan data dosen sebagai JSON
    return new Response(JSON.stringify(Mahasiswa), {
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

    const {id, nama_lengkap, email, nim, no_whatsapp, jurusan, peminatan, dosen_pa_id} = body;
    
    if (!id || !nama_lengkap || !email || !nim || !no_whatsapp || !jurusan || !peminatan || !dosen_pa_id) {
      return new Response(
        JSON.stringify({ message: 'Invalid data' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const existingRecord = await prisma.mahasiswa.findUnique({
      where: { id },
    });
    
    if (!existingRecord) {
      throw new Error('Record not found');
    }
    
    const Mahasiswa = await prisma.mahasiswa.update({ where: { id }, data: { nama_lengkap, email, nim, no_whatsapp, jurusan, peminatan, dosen_pa_id } })

    return new Response(JSON.stringify(Mahasiswa), {
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
