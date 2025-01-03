// /app/api/datadosen/route.ts
import prisma from '../../../lib/prisma';

interface BimbinganRequestBody {
  pengajuan_bimbingan_id?: number;
  id?: number;
  laporan_bimbingan_id?: number;
}

export async function GET(req: Request): Promise<Response> {
  try {
    // Fetching data from the database
    const bimbingan = await prisma.bimbingan.findMany({
      include: {
        pengajuan_bimbingan: true,
      },
    });

    // Returning data as JSON
    return new Response(JSON.stringify(bimbingan), {
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
    const body: BimbinganRequestBody = await req.json();
    const { pengajuan_bimbingan_id } = body;

    if (!pengajuan_bimbingan_id) {
      return new Response(
        JSON.stringify({ message: 'All fields are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const bimbingan = await prisma.bimbingan.create({
      data: {
        pengajuan_bimbingan_id,
      },
    });

    return new Response(JSON.stringify(bimbingan), {
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
    const body: BimbinganRequestBody = await req.json();
    const { id, laporan_bimbingan_id } = body;

    if (!id || !laporan_bimbingan_id) {
      return new Response(
        JSON.stringify({ message: 'Invalid data' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const existingRecord = await prisma.bimbingan.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return new Response(
        JSON.stringify({ message: 'Record not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const bimbingan = await prisma.bimbingan.update({
      where: { id },
      data: { laporan_bimbingan_id },
    });

    return new Response(JSON.stringify(bimbingan), {
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
