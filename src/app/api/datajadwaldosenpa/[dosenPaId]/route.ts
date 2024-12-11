// /app/api/datadosen/route.js
import prisma from '../../../../lib/prisma';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/');
    const dosenPaId = pathSegments[pathSegments.indexOf('datajadwaldosenpa') + 1];

    if (!dosenPaId) {
      return new Response(
        JSON.stringify({ message: 'Dosen PA ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const JadwalDosenPA = await prisma.jadwalDosenPA.findMany({
      where: {
        dosen_pa_id: parseInt(dosenPaId),
      },
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

export async function POST(req) {
  try {
    const body = await req.json();

      const { dosen_pa_id, hari, jam_mulai, jam_selesai} = body;

      if (!dosen_pa_id || !hari || !jam_mulai || !jam_selesai) {
        return new Response(
          JSON.stringify({ message: 'All fields are required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const JadwalDosenPA = await prisma.jadwalDosenPA.create({
        data : {
          dosen_pa_id, hari, jam_mulai, jam_selesai
        }
    });
    return new Response(JSON.stringify(JadwalDosenPA), {
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

export async function DELETE(req) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return new Response(
        JSON.stringify({ message: 'Invalid ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const existingRecord = await prisma.jadwalDosenPA.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return new Response(
        JSON.stringify({ message: 'Record not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await prisma.jadwalDosenPA.delete({
      where: { id },
    });

    return new Response(
      JSON.stringify({ message: 'Record deleted successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Something went wrong', error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
