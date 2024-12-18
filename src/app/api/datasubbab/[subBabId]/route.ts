// /app/api/datadosen/route.js
import prisma from '../../../../lib/prisma';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/');
    const babid = pathSegments[pathSegments.indexOf('datasubbab') + 1];

    if (!babid) {
      return new Response(
        JSON.stringify({ message: 'Bab ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const SubBab = await prisma.mastersubbabinformasiakademik.findMany({
      where: {
        bab_informasi_akademik_id: parseInt(babid),
      },
      include: {
        bab_informasi_akademik: true,
      },
    });
    
    return new Response(JSON.stringify(SubBab), {
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
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/');
    const babid = pathSegments[pathSegments.indexOf('datasubbab') + 1];
    const body = await req.json();

    console.log(body)

      const { nama, order, isi} = body;

      if (!nama || !order || !isi) {
        return new Response(
          JSON.stringify({ message: 'All fields are required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const SubBab = await prisma.mastersubbabinformasiakademik.create({
        data : {
          nama, order, bab_informasi_akademik_id:parseInt(babid), isi
        }
    });
    return new Response(JSON.stringify(SubBab), {
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

    const {id, nama, isi} = body;
    
    if (!id || !nama || !isi) {
      return new Response(
        JSON.stringify({ message: 'Invalid data' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const existingRecord = await prisma.mastersubbabinformasiakademik.findUnique({
      where: { id },
    });
    
    if (!existingRecord) {
      throw new Error('Record not found');
    }
    
    const SubBab = await prisma.mastersubbabinformasiakademik.update({ where: { id }, data: { nama, isi } })

    return new Response(JSON.stringify(SubBab), {
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

    const existingRecord = await prisma.mastersubbabinformasiakademik.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return new Response(
        JSON.stringify({ message: 'Record not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await prisma.mastersubbabinformasiakademik.delete({
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
