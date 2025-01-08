// /app/api/datadosen/route.ts
import prisma from '../../../../lib/prisma';

interface PeminatanRequestBody {
  id?: number; // Optional for POST, required for PATCH and DELETE
  peminatan?: string; // Optional for PATCH
  order?: number; // Optional for POST
}

export async function GET(req: Request): Promise<Response> {
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

    const peminatan = await prisma.masterpeminatan.findMany({
      where: {
        jurusan_id: parseInt(jurusanid),
      }
    });

    return new Response(JSON.stringify(peminatan), {
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
    const jurusanid = pathSegments[pathSegments.indexOf('datapeminatan') + 1];
    const body: PeminatanRequestBody = await req.json();

    const { peminatan, order } = body;

    if (!peminatan || order === undefined) {
      return new Response(
        JSON.stringify({ message: 'All fields are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const newPeminatan = await prisma.masterpeminatan.create({
      data: {
        peminatan,
        order,
        jurusan_id: parseInt(jurusanid),
      },
    });

    return new Response(JSON.stringify(newPeminatan), {
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
    const body: PeminatanRequestBody = await req.json();
    const { id, peminatan } = body;

    if (!id || !peminatan) {
      return new Response(
        JSON.stringify({ message: 'Invalid data' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const existingRecord = await prisma.masterpeminatan.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return new Response(
        JSON.stringify({ message: 'Record not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const updatedPeminatan = await prisma.masterpeminatan.update({
      where: { id },
      data: { peminatan },
    });

    return new Response(JSON.stringify(updatedPeminatan), {
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
    const body: PeminatanRequestBody = await req.json();
    const { id } = body;

    if (!id) {
      return new Response(
        JSON.stringify({ message: 'Invalid ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const existingRecord = await prisma.masterpeminatan.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return new Response(
        JSON.stringify({ message: 'Record not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await prisma.masterpeminatan.delete({
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
