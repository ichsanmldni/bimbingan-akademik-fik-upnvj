// /app/api/datadosen/route.ts
import prisma from '../../../lib/prisma';

export async function GET(req: Request): Promise<Response> {
    try {
        // Fetching data from the database
        const chatPesanSiaran = await prisma.pesanchatsiaran.findMany({
            include: {
                pesan_siaran: true
            }
        });

        // Returning data as JSON
        return new Response(JSON.stringify(chatPesanSiaran), {
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
        const body: any = await req.json();
        const { dosen_pa_id, pesan_siaran_id, pesan, waktu_kirim } = body;


        if (!pesan_siaran_id) {
            const pesanSiaran = await prisma.pesansiaran.create({
                data: {
                    dosen_pa_id,
                    waktu_pesan_terakhir: waktu_kirim,
                    pesan_terakhir: pesan,
                },
            });
            const mahasiswa = await prisma.mahasiswa.findMany();
            const mahasiswaBimbingan = mahasiswa.filter(data => data.dosen_pa_id === dosen_pa_id)
            mahasiswaBimbingan.map(async data =>
                await prisma.statuspembacaanpesansiaran.create({
                    data: {
                        pesan_siaran_id: pesanSiaran.id,
                        mahasiswa_id: data.id,
                        is_read: false,
                    },
                })
            )

            const pesanChatSiaran = await prisma.pesanchatsiaran.create({
                data: {
                    pesan_siaran_id: pesanSiaran.id,
                    pesan,
                    waktu_kirim,
                },
            });

            return new Response(JSON.stringify(pesanChatSiaran), {
                status: 201,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Validate required fields
        if (!pesan_siaran_id || !pesan || !waktu_kirim) {
            return new Response(
                JSON.stringify({ message: 'All fields are required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Create a new chat entry
        const pesanChatSiaran = await prisma.pesanchatsiaran.create({
            data: {
                pesan_siaran_id,
                pesan,
                waktu_kirim,
            },
        });

        // Check if the chat record exists
        const existingRecord = await prisma.pesansiaran.findUnique({
            where: { id: pesan_siaran_id },
        });


        if (!existingRecord) {
            return new Response(
                JSON.stringify({ message: 'Record not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Update the existing chat record

        const pesanSiaran = await prisma.pesansiaran.update({
            where: { id: pesan_siaran_id },
            data: {
                pesan_terakhir: pesan,
                waktu_pesan_terakhir: waktu_kirim,
            },
        });

        await prisma.statuspembacaanpesansiaran.update({
            where: {
                pesan_siaran_id: existingRecord.id,
            },
            data: {
                is_read: false,
            },
        })

        return new Response(JSON.stringify(pesanSiaran), {
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
