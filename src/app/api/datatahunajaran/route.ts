// /app/api/datadosen/route.ts
import prisma from '../../../lib/prisma';

interface TahunAjaranRequestBody {
  id?: number; // Optional for POST, required for PATCH and DELETE
  tahun_ajaran?: string; // Optional for PATCH
  order?: number; // Optional for POST
}

export async function GET(req: Request): Promise<Response> {
  try {
    // Fetching data from the database
    const tahunAjaran = await prisma.mastertahunajaran.findMany();

    // Returning data as JSON
    return new Response(JSON.stringify(tahunAjaran), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // Handling errors
    return new Response(
      JSON.stringify({ message: 'Something went wrong', error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body: TahunAjaranRequestBody = await req.json();
    const { tahun_ajaran, order } = body;

    // Validate required fields
    if (!tahun_ajaran || order === undefined) {
      return new Response(
        JSON.stringify({ message: 'All fields are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const newTahunAjaran = await prisma.mastertahunajaran.create({
      data: {
        tahun_ajaran,
        order,
      },
    });

    return new Response(JSON.stringify(newTahunAjaran), {
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
    const body: TahunAjaranRequestBody = await req.json();
    const { id, tahun_ajaran } = body;

    // Validate required fields
    if (!id || !tahun_ajaran) {
      return new Response(
        JSON.stringify({ message: 'Invalid data' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const existingRecord = await prisma.mastertahunajaran.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return new Response(
        JSON.stringify({ message: 'Record not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const updatedTahunAjaran = await prisma.mastertahunajaran.update({
      where: { id },
      data: { tahun_ajaran },
    });

    return new Response(JSON.stringify(updatedTahunAjaran), {
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
    const body: TahunAjaranRequestBody = await req.json();
    const { id } = body;

    // Validate required fields
    if (!id) {
      return new Response(
        JSON.stringify({ message: 'Invalid ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const existingRecord = await prisma.mastertahunajaran.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return new Response(
        JSON.stringify({ message: 'Record not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await prisma.mastertahunajaran.delete({
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
