// /app/api/datadosen/route.ts
import prisma from '../../../../lib/prisma';

interface SubBabRequestBody {
  id?: number; // Optional for POST, required for PATCH and DELETE
  nama?: string; // Optional for PATCH
  isi?: string; // Optional for PATCH
  order?: number; // Optional for POST
}

export async function GET(req: Request): Promise<Response> {
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

    const subBab = await prisma.mastersubbabinformasiakademik.findMany({
      where: {
        bab_informasi_akademik_id: parseInt(babid),
      },
      include: {
        bab_informasi_akademik: true,
      },
    });

    return new Response(JSON.stringify(subBab), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Something went wrong', error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/');
    const babid = pathSegments[pathSegments.indexOf('datasubbab') + 1];
    const body: SubBabRequestBody = await req.json();

    const { nama, order, isi } = body;

    if (!nama || order === undefined || !isi) {
      return new Response(
        JSON.stringify({ message: 'All fields are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const subBab = await prisma.mastersubbabinformasiakademik.create({
      data: {
        nama,
        order,
        bab_informasi_akademik_id: parseInt(babid),
        isi,
      },
    });

    return new Response(JSON.stringify(subBab), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Something went wrong', error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function PATCH(req: Request): Promise<Response> {
  try {
    const body: SubBabRequestBody = await req.json();
    const { id, nama, isi } = body;

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
      return new Response(
        JSON.stringify({ message: 'Record not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const subBab = await prisma.mastersubbabinformasiakademik.update({
      where: { id },
      data: { nama, isi },
    });

    return new Response(JSON.stringify(subBab), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Something went wrong', error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE(req: Request): Promise<Response> {
  try {
    const body: SubBabRequestBody = await req.json();
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
      JSON.stringify({ message: 'Something went wrong', error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
