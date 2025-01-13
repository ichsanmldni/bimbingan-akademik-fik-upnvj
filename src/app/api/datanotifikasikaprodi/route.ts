// /app/api/datadosen/route.ts
import prisma from '../../../lib/prisma';


export async function GET(req: Request): Promise<Response> {
    try {
        // Fetching data from the database
        const notifikasiKaprodi = await prisma.notifikasikaprodi.findMany();

        // Returning data as JSON
        return new Response(JSON.stringify(notifikasiKaprodi), {
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

export async function PATCH(req: any): Promise<any> {
    try {
        const body: any = await req.json();
        const { id, read } = body;

        if (!id || read === true) {
            return new Response(
                JSON.stringify({ message: 'Invalid data' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const existingRecord = await prisma.notifikasikaprodi.findUnique({
            where: { id },
        });

        if (!existingRecord) {
            return new Response(
                JSON.stringify({ message: 'Record not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const updatedNotifikasiKaprodi = await prisma.notifikasikaprodi.update({
            where: { id },
            data: { read: true },
        });

        const responsePayload = {
            status: "success",
            message: "Notifikasi telah terbaca!",
            data: updatedNotifikasiKaprodi,
        };

        return new Response(JSON.stringify(responsePayload), {
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