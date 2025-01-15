// /app/api/datadosen/route.ts
import prisma from '../../../lib/prisma';

interface SubBabRequestBody {
    id?: number; // Optional for POST, required for PATCH and DELETE
    nama?: string; // Optional for PATCH
    isi?: string; // Optional for PATCH
    order?: number; // Optional for POST
}

export async function GET(req: Request): Promise<Response> {
    try {

        const subBab = await prisma.mastersubbabinformasiakademik.findMany({
            include: {
                bab_informasi_akademik: true,
            },
        });

        return new Response(JSON.stringify(subBab), {
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