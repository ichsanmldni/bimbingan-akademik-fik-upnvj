// /app/api/datadosen/route.js
import prisma from '../../../lib/prisma';

export async function GET(req) {
  try {
    // Mengambil data dosen dari database
    const PengajuanBimbingan = await prisma.pengajuanBimbingan.findMany(
    );
    
    // Mengembalikan data dosen sebagai JSON
    return new Response(JSON.stringify(PengajuanBimbingan), {
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
  
        const { nama_lengkap, nim, email, no_whatsapp, jadwal_bimbingan, jenis_bimbingan, sistem_bimbingan, status, dosen_pa_id} = body;
  
        if (!nama_lengkap || !nim || !email || !no_whatsapp || !jadwal_bimbingan || !jenis_bimbingan || !sistem_bimbingan || !status || !dosen_pa_id) {
          return new Response(
            JSON.stringify({ message: 'All fields are required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
  
        console.log(nama_lengkap, nim, email, no_whatsapp, jadwal_bimbingan, jenis_bimbingan, sistem_bimbingan, status, dosen_pa_id)
        const PengajuanBimbingan = await prisma.pengajuanBimbingan.create({
          data : {
            nama_lengkap, nim, email, no_whatsapp, jadwal_bimbingan, jenis_bimbingan, sistem_bimbingan, status, dosen_pa_id
          }
      });
      return new Response(JSON.stringify(PengajuanBimbingan), {
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

  export async function PATCH(req) {
    try {
      const body = await req.json();
  
      const {id, status, keterangan} = body;
      
      if (!id || !status || !keterangan) {
        return new Response(
          JSON.stringify({ message: 'Invalid data' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
  
      const existingRecord = await prisma.pengajuanBimbingan.findUnique({
        where: { id },
      });
      
      if (!existingRecord) {
        throw new Error('Record not found');
      }
      
      const PengajuanBimbingan = await prisma.pengajuanBimbingan.update({ where: { id }, data: { status, keterangan } })
  
      return new Response(JSON.stringify(PengajuanBimbingan), {
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