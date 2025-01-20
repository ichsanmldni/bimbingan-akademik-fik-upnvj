// /app/api/datadosen/route.ts
import prisma from '../../../lib/prisma';

export async function GET(req: Request): Promise<Response> {
    try {
        // Fetching data from the database
        const bab = await prisma.mastercustomcontextchatbot.findMany();

        // Returning data as JSON
        return new Response(JSON.stringify(bab), {
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

export async function POST(req: Request): Promise<Response> {
    try {
        const body = await req.json();
        const { judul, isi, order } = body;

        // Validate required fields
        if (!judul || !isi || order === undefined) {
            return new Response(
                JSON.stringify({ message: 'All fields are required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const bab = await prisma.mastercustomcontextchatbot.create({
            data: {
                judul,
                isi,
                order,
            },
        });

        return new Response(JSON.stringify(bab), {
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

export async function PATCH(req: Request): Promise<Response> {
    try {
        const body = await req.json();
        const { id, judul, isi } = body;

        // Validate required fields
        if (!id || !judul || !isi) {
            return new Response(
                JSON.stringify({ message: 'Invalid data' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const existingRecord = await prisma.mastercustomcontextchatbot.findUnique({
            where: { id },
        });

        if (!existingRecord) {
            return new Response(
                JSON.stringify({ message: 'Record not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const bab = await prisma.mastercustomcontextchatbot.update({
            where: { id },
            data: { judul, isi },
        });

        return new Response(JSON.stringify(bab), {
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

export async function DELETE(req: Request): Promise<Response> {
    try {
        const body = await req.json();
        const { id } = body;

        // Validate required fields
        if (!id) {
            return new Response(
                JSON.stringify({ message: 'Invalid ID' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const existingRecord = await prisma.mastercustomcontextchatbot.findUnique({
            where: { id },
        });

        if (!existingRecord) {
            return new Response(
                JSON.stringify({ message: 'Record not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        await prisma.mastercustomcontextchatbot.delete({
            where: { id },
        });

        return new Response(
            JSON.stringify({ message: 'Record deleted successfully' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: 'Something went wrong', error: error instanceof Error ? error.message : 'Unknown error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
