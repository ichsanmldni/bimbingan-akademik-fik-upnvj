// /app/api/datadosen/route.ts
import prisma from '../../../lib/prisma';

export async function GET(): Promise<Response> {
  try {
    const jadwalDosenPA = await prisma.jadwaldosenpa.findMany({
      include: {
        dosen_pa: true,
      },
    });

    return new Response(JSON.stringify(jadwalDosenPA), {
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
