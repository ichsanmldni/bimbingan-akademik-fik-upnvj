// /app/api/datadosen/route.js
import prisma from '../../../lib/prisma';

export async function GET(req) {
  try {
    // Mengambil data dosen dari database
    const Bimbingan = await prisma.bimbingan.findMany({
      include: {
        pengajuan_bimbingan: true,
      },
    }
    );
    
    // Mengembalikan data dosen sebagai JSON
    return new Response(JSON.stringify(Bimbingan), {
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
  
        const { pengajuan_bimbingan_id} = body;
  
        if (!pengajuan_bimbingan_id) {
          return new Response(
            JSON.stringify({ message: 'All fields are required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
  
        const Bimbingan = await prisma.bimbingan.create({
          data : {
            pengajuan_bimbingan_id
          }
      });
      return new Response(JSON.stringify(Bimbingan), {
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
  
      const {id, laporan_bimbingan_id} = body;
      
      if (!id || !laporan_bimbingan_id) {
        return new Response(
          JSON.stringify({ message: 'Invalid data' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
  
      const existingRecord = await prisma.bimbingan.findUnique({
        where: { id },
      });
      
      if (!existingRecord) {
        throw new Error('Record not found');
      }
      
      const Bimbingan = await prisma.bimbingan.update({ where: { id }, data: { laporan_bimbingan_id } })
  
      return new Response(JSON.stringify(Bimbingan), {
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