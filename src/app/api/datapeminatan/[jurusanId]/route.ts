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
    const Peminatan = await prisma.masterPeminatan.findMany({
      where: {
        jurusan_id: parseInt(jurusanid),
      },
      include: {
        jurusan: true,
      },
    });
    
    return new Response(JSON.stringify(Peminatan), {
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

      const { peminatan, order} = body;

      if (!peminatan || !order) {
        return new Response(
          JSON.stringify({ message: 'All fields are required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const Peminatan = await prisma.masterPeminatan.create({
        data : {
          peminatan, order
        }
    });
    return new Response(JSON.stringify(Peminatan), {
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

    const {id, peminatan} = body;
    
    if (!id || !peminatan) {
      return new Response(
        JSON.stringify({ message: 'Invalid data' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log(id, peminatan)

    const existingRecord = await prisma.masterPeminatan.findUnique({
      where: { id },
    });
    
    if (!existingRecord) {
      throw new Error('Record not found');
    }
    
    const Peminatan = await prisma.masterPeminatan.update({ where: { id }, data: { peminatan } })

    return new Response(JSON.stringify(Peminatan), {
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

    const existingRecord = await prisma.masterPeminatan.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return new Response(
        JSON.stringify({ message: 'Record not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await prisma.masterPeminatan.delete({
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
