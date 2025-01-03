// /app/api/datadosen/route.ts
import prisma from '../../../../lib/prisma';

interface UpdateTahunAjaran {
  id: number; // Assuming this is a string; change to number if needed
  order: number; // Assuming order is a number; change type if needed
  tahun_ajaran: string
}

export async function PATCH(req: Request): Promise<Response> {
  try {
    const body: UpdateTahunAjaran[] = await req.json();
    const dataArray = Object.values(body);
    const transaction = await prisma.$transaction(
      dataArray.map((item) =>
        prisma.mastertahunajaran.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    return new Response(JSON.stringify(transaction), {
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
