// /app/api/datadosen/route.ts
import prisma from "../../../lib/prisma";

interface DataDosenTetapRequestBody {
  id?: number;
  nama_lengkap: string;
  jurusan: string;
  order?: number;
  email?: string;
  isKaprodi: boolean;
}

export async function GET(req: Request): Promise<Response> {
  try {
    // Fetching data from the database
    const datadosentetap = await prisma.dosentetapfik.findMany();

    // Returning data as JSON
    return new Response(JSON.stringify(datadosentetap), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Handling errors
    return new Response(
      JSON.stringify({
        message: "Something went wrong",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body: DataDosenTetapRequestBody = await req.json();
    const { nama_lengkap, jurusan, order, email } = body;

    // Validate required fields
    if (!nama_lengkap || !jurusan || !email || order === undefined) {
      console.log(body);
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const dosentetapfik = await prisma.dosentetapfik.create({
      data: {
        nama_lengkap,
        jurusan,
        order,
        email,
      },
    });

    return new Response(JSON.stringify(dosentetapfik), {
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

export async function PATCH(req: Request): Promise<Response> {
  try {
    const body: DataDosenTetapRequestBody = await req.json();
    const { id, nama_lengkap, jurusan, email, isKaprodi } = body;

    // Validate required fields
    if (!id || !nama_lengkap || !jurusan) {
      console.log(body);
      return new Response(JSON.stringify({ message: "Invalid data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const existingRecord = await prisma.dosentetapfik.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return new Response(JSON.stringify({ message: "Record not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const dataToUpdate: any = {
      nama_lengkap,
      jurusan,
      email,
    };

    if (typeof isKaprodi !== "undefined") {
      dataToUpdate.isKaprodi = isKaprodi;
    }

    const datadosentetap = await prisma.dosentetapfik.update({
      where: { id },
      data: dataToUpdate,
    });

    return new Response(JSON.stringify(datadosentetap), {
      status: 200,
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

export async function DELETE(req: Request): Promise<Response> {
  try {
    const body: DataDosenTetapRequestBody = await req.json();
    const { id } = body;

    // Validate required fields
    if (!id) {
      return new Response(JSON.stringify({ message: "Invalid ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const existingRecord = await prisma.dosentetapfik.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return new Response(JSON.stringify({ message: "Record not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    await prisma.dosentetapfik.delete({
      where: { id },
    });

    return new Response(
      JSON.stringify({ message: "Record deleted successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
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
