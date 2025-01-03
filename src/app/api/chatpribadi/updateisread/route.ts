import prisma from '../../../../lib/prisma';

interface PatchRequestBody {
  id: number;
}

export async function PATCH(req: Request): Promise<Response> {
  try {
    const body: PatchRequestBody = await req.json();
    const { id } = body;

    if (!id) {
      return new Response(
        JSON.stringify({ message: 'Invalid data' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const existingRecord = await prisma.chatpribadi.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return new Response(
        JSON.stringify({ message: 'Record not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const chatPribadi = await prisma.chatpribadi.update({
      where: { id },
      data: { is_pesan_terakhir_read: true },
    });

    return new Response(JSON.stringify(chatPribadi), {
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
