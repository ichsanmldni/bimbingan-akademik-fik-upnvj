// /app/api/datadosen/route.js
import prisma from '../../../lib/prisma';

export async function GET(req) {
  try {
    // Mengambil data dosen dari database
    const Kaprodi = await prisma.kaprodi.findMany({
      include: {
        dosen: true,
        kaprodi_jurusan: true
      },
    });
    
    // Mengembalikan data dosen sebagai JSON
    return new Response(JSON.stringify(Kaprodi), {
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
