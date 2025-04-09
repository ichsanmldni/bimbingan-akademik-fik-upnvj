// /app/api/datadosen/route.ts
import prisma from "../../../../lib/prisma";

interface UpdateItem {
  id: number;
  order: number;
}

export async function PATCH(req: Request): Promise<Response> {
  try {
    const body: UpdateItem[] = await req.json(); // Expecting an array of UpdateItem
    const dataArray = Object.values(body);
    const transaction = await prisma.$transaction(
      dataArray.map((item) =>
        prisma.dosentetapfik.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    return new Response(JSON.stringify(transaction), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Something went wrong",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
