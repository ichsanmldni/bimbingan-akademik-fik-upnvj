import prisma from '../../../lib/prisma';

interface RiwayatPesanChatbot {
    id?: number; // Optional for POST, required for GET
    sesi_chatbot_mahasiswa_id: number;
    role: string; // Assuming role is a string, adjust if necessary
    pesan: string;
    waktu_kirim: Date; // Adjust type according to your schema
}

export async function GET(req: Request): Promise<Response> {
    try {
        const dataStatusMahasiswa = await prisma.datastatusmahasiswa.findMany();

        return new Response(JSON.stringify(dataStatusMahasiswa), {
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

export async function POST(req: Request): Promise<Response> {
    try {
        const body: any = await req.json();

        const { laporan_bimbingan_id, nama, nim, status } = body;

        if (!laporan_bimbingan_id || !nama || !nim || !status) {
            return new Response(
                JSON.stringify({ message: 'All fields are required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const dataStatusMahasiswa = await prisma.datastatusmahasiswa.create({
            data: {
                laporan_bimbingan_id, nama, nim, status
            },
        });

        return new Response(JSON.stringify(dataStatusMahasiswa), {
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
