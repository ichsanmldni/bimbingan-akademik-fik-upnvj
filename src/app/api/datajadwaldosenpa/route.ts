// /app/api/datadosen/route.js
import prisma from '../../../lib/prisma';

export async function GET() {
  try {
    const JadwalDosenPA = await prisma.jadwaldosenpa.findMany({
      include: {
        dosen_pa: true,
      },
    });
    
    return new Response(JSON.stringify(JadwalDosenPA), {
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