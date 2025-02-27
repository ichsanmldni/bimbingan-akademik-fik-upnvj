// /app/api/datadosen/route.ts
import prisma from '../../../lib/prisma';


export async function GET(req: Request): Promise<Response> {
    try {
        // Fetching data from the database
        const notifikasiDosenPA = await prisma.notifikasidosenpa.findMany();

        // Returning data as JSON
        return new Response(JSON.stringify(notifikasiDosenPA), {
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

        const existingRecord = await prisma.notifikasidosenpa.findUnique({
            where: { id },
        });

        if (!existingRecord) {
            return new Response(
                JSON.stringify({ message: 'Record not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const updatedNotifikasiDosenPA = await prisma.notifikasidosenpa.update({
            where: { id },
            data: { read: true },
        });

        const responsePayload = {
            status: "success",
            message: "Notifikasi telah terbaca!",
            data: updatedNotifikasiDosenPA,
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