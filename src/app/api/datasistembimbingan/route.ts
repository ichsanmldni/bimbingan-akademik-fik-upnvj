// /app/api/datadosen/route.ts
import prisma from '../../../lib/prisma';

interface SistemBimbinganRequestBody {
  id?: number; // Optional for POST, required for PATCH and DELETE
  sistem_bimbingan?: string; // Optional for PATCH
  order?: number; // Optional for POST
}

export async function GET(req: Request): Promise<Response> {
  try {
    // Fetching data from the database
    const sistemBimbingan = await prisma.mastersistembimbingan.findMany();

    // Returning data as JSON
    return new Response(JSON.stringify(sistemBimbingan), {
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
    const body: SistemBimbinganRequestBody = await req.json();
    const { sistem_bimbingan, order } = body;

    // Validate required fields
    if (!sistem_bimbingan || order === undefined) {
      return new Response(
        JSON.stringify({ message: 'All fields are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const newSistemBimbingan = await prisma.mastersistembimbingan.create({
      data: {
        sistem_bimbingan,
        order,
      },
    });

    return new Response(JSON.stringify(newSistemBimbingan), {
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
    const body: SistemBimbinganRequestBody = await req.json();
    const { id, sistem_bimbingan } = body;

    // Validate required fields
    if (!id || !sistem_bimbingan) {
      return new Response(
        JSON.stringify({ message: 'Invalid data' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const existingRecord = await prisma.mastersistembimbingan.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return new Response(
        JSON.stringify({ message: 'Record not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const updatedSistemBimbingan = await prisma.mastersistembimbingan.update({
      where: { id },
      data: { sistem_bimbingan },
    });

    return new Response(JSON.stringify(updatedSistemBimbingan), {
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
    const body: SistemBimbinganRequestBody = await req.json();
    const { id } = body;

    // Validate required fields
    if (!id) {
      return new Response(
        JSON.stringify({ message: 'Invalid ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const existingRecord = await prisma.mastersistembimbingan.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return new Response(
        JSON.stringify({ message: 'Record not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await prisma.mastersistembimbingan.delete({
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
