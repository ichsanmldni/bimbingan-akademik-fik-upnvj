import prisma from '../../../lib/prisma';

export async function GET(req: Request): Promise<Response> {
    try {
        const prestasiPorseniMahasiswa = await prisma.prestasiporsenimahasiswa.findMany();

        return new Response(JSON.stringify(prestasiPorseniMahasiswa), {
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

        const { laporan_bimbingan_id, jenis_kegiatan, lampiran, nama, nim, tingkat_prestasi } = body;

        if (!laporan_bimbingan_id || !jenis_kegiatan || !lampiran || !nama || !nim || !tingkat_prestasi) {
            return new Response(
                JSON.stringify({ message: 'All fields are required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const prestasiPorseniMahasiswa = await prisma.prestasiporsenimahasiswa.create({
            data: {
                laporan_bimbingan_id, jenis_kegiatan, lampiran, nama, nim, tingkat_prestasi
            },
        });

        return new Response(JSON.stringify(prestasiPorseniMahasiswa), {
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
