import prisma from '../../../lib/prisma';


export async function GET(req: Request): Promise<Response> {
    try {
        // Mengambil data sesi chatbot mahasiswa dari database
        const statusPembacaanPesanSiaran = await prisma.statuspembacaanpesansiaran.findMany({
            include: {
                pesan_siaran: true,
                mahasiswa: true
            },
        });

        // Mengembalikan data sesi chatbot mahasiswa sebagai JSON
        return new Response(JSON.stringify(statusPembacaanPesanSiaran), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        // Menangani kesalahan
        return new Response(
            JSON.stringify({ message: 'Something went wrong', error: error instanceof Error ? error.message : 'Unknown error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

export async function PATCH(req: Request): Promise<Response> {
    try {
        const body: any = await req.json();
        const { mahasiswa_id } = body;

        if (!mahasiswa_id) {
            return new Response(
                JSON.stringify({ message: 'Invalid data' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const existingRecord = await prisma.statuspembacaanpesansiaran.findUnique({
            where: { mahasiswa_id },
        });

        if (!existingRecord) {
            return new Response(
                JSON.stringify({ message: 'Record not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const statusPembacaanPesanSiaran = await prisma.statuspembacaanpesansiaran.update({
            where: { mahasiswa_id },
            data: { is_read: true },
        });

        return new Response(JSON.stringify(statusPembacaanPesanSiaran), {
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
