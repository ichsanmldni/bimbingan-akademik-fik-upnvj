// /app/api/datadosen/route.js
import prisma from '../../../../lib/prisma';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/');
    const jurusanid = pathSegments[pathSegments.indexOf('datapeminatan') + 1];

    if (!jurusanid) {
      return new Response(
        JSON.stringify({ message: 'Jurusan ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const peminatan = await prisma.masterPeminatan.findMany({
      where: {
        jurusan_id: parseInt(jurusanid),
      },
      include: {
        jurusan: true,
      },
    });
    
    return new Response(JSON.stringify(peminatan), {
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
