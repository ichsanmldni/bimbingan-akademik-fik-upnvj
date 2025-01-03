// /app/api/datadosen/route.ts
import prisma from '../../../../../lib/prisma';

interface UpdatePeminatan {
  id: number; // Assuming this is a string; change to number if needed
  order: number; // Assuming order is a number; change type if needed
}

export async function PATCH(req: Request): Promise<Response> {
  try {
    const body: UpdatePeminatan[] = await req.json(); // Expecting an array of UpdatePeminatan
    const dataArray = Object.values(body);
    const transaction = await prisma.$transaction(
      dataArray.map((item) =>
        prisma.masterpeminatan.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    return new Response(JSON.stringify(transaction), {
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
