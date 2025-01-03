// /app/api/datadosen/route.ts
import prisma from '../../../lib/prisma';

export async function GET(req: Request): Promise<Response> {
  try {
    // Fetching data from the database
    const dosenPa = await prisma.dosenpa.findMany({
      include: {
        dosen: true,
      },
    });

    // Returning data as JSON
    return new Response(JSON.stringify(dosenPa), {
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
