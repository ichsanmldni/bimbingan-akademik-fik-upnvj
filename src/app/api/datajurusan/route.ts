// /app/api/datadosen/route.ts
import prisma from '../../../lib/prisma';

interface JurusanRequestBody {
  id?: number; // Optional for POST, required for PATCH and DELETE
  jurusan?: string; // Optional for PATCH
  order?: number; // Optional for POST
}

export async function GET(req: Request): Promise<Response> {
  try {
    // Fetching data from the database
    const jurusan = await prisma.masterjurusan.findMany();

    // Returning data as JSON
    return new Response(JSON.stringify(jurusan), {
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
    const body: JurusanRequestBody = await req.json();
    const { jurusan, order } = body;

    // Validate required fields
    if (!jurusan || order === undefined) {
      return new Response(
        JSON.stringify({ message: 'All fields are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const newJurusan = await prisma.masterjurusan.create({
      data: {
        jurusan,
        order,
      },
    });

    return new Response(JSON.stringify(newJurusan), {
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
    const body: JurusanRequestBody = await req.json();
    const { id, jurusan } = body;

    // Validate required fields
    if (!id || !jurusan) {
      return new Response(
        JSON.stringify({ message: 'Invalid data' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const existingRecord = await prisma.masterjurusan.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return new Response(
        JSON.stringify({ message: 'Record not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const updatedJurusan = await prisma.masterjurusan.update({
      where: { id },
      data: { jurusan },
    });

    return new Response(JSON.stringify(updatedJurusan), {
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
    const body: JurusanRequestBody = await req.json();
    const { id } = body;

    // Validate required fields
    if (!id) {
      return new Response(
        JSON.stringify({ message: 'Invalid ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const existingRecord = await prisma.masterjurusan.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return new Response(
        JSON.stringify({ message: 'Record not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await prisma.masterjurusan.delete({
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
