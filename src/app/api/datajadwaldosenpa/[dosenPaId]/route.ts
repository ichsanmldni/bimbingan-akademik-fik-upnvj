// /app/api/datadosen/route.ts
import prisma from '../../../../lib/prisma';

interface JadwalDosenPARequestBody {
  dosen_pa_id: number;
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
}

interface DeleteRequestBody {
  id: number;
}

export async function GET(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/');
    const dosenPaId = pathSegments[pathSegments.indexOf('datajadwaldosenpa') + 1];

    if (!dosenPaId) {
      return new Response(
        JSON.stringify({ message: 'Dosen PA ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const jadwalDosenPA = await prisma.jadwaldosenpa.findMany({
      where: {
        dosen_pa_id: parseInt(dosenPaId),
      },
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

export async function POST(req: Request): Promise<Response> {
  try {
    const body: JadwalDosenPARequestBody = await req.json();
    const { dosen_pa_id, hari, jam_mulai, jam_selesai } = body;

    if (!dosen_pa_id || !hari || !jam_mulai || !jam_selesai) {
      return new Response(
        JSON.stringify({ message: 'Semua kolom wajib diisi!' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const jadwalDosenPA = await prisma.jadwaldosenpa.create({
      data: {
        dosen_pa_id,
        hari,
        jam_mulai,
        jam_selesai,
      },
    });

    const responsePayload = {
      status: "success",
      message: "Berhasil menambah jadwal kosong!",
      data: jadwalDosenPA,
    };

    return new Response(JSON.stringify(responsePayload), {
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

export async function DELETE(req: Request): Promise<Response> {
  try {
    const body: DeleteRequestBody = await req.json();
    const { id } = body;

    if (!id) {
      return new Response(
        JSON.stringify({ message: 'Invalid ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const existingRecord = await prisma.jadwaldosenpa.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return new Response(
        JSON.stringify({ message: 'Record not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await prisma.jadwaldosenpa.delete({
      where: { id },
    });

    const responsePayload = {
      status: "success",
      message: "Jadwal kosong berhasil dihapus!",
    };
    return new Response(
      JSON.stringify(responsePayload),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Something went wrong', error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
