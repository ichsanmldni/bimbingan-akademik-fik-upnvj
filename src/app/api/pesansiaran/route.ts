// /app/api/datadosen/route.ts
import prisma from '../../../lib/prisma';

export async function GET(req: Request): Promise<Response> {
    try {
        // Fetching data from the database
        const pesanSiaran = await prisma.pesansiaran.findMany({
            include: {
                dosen_pa: true,
            },
        });

        // Returning data as JSON
        return new Response(JSON.stringify(pesanSiaran), {
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

export async function PATCH(req: Request): Promise<Response> {
    try {
        const body: any = await req.json();
        const { id, pesan_terakhir, waktu_pesan_terakhir } = body;

        // Validate required fields
        if (!id || !pesan_terakhir || !waktu_pesan_terakhir) {
            return new Response(
                JSON.stringify({ message: 'Invalid data' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const existingRecord = await prisma.pesansiaran.findUnique({
            where: { id },
        });

        if (!existingRecord) {
            return new Response(
                JSON.stringify({ message: 'Record not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const pesanSiaran = await prisma.pesansiaran.update({
            where: { id },
            data: { pesan_terakhir, waktu_pesan_terakhir },
        });

        return new Response(JSON.stringify(pesanSiaran), {
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