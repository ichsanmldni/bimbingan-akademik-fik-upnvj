import prisma from '../../../../lib/prisma';

export async function PATCH(req) {
    try {
      const body = await req.json();

      const data = Object.values(body);

      console.log(data)

      const transaction = await prisma.$transaction(
        data.map((item) =>
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
        JSON.stringify({ message: 'Something went wrong', error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
