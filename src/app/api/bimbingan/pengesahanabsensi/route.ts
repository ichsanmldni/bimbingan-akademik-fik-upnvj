// /app/api/datadosen/route.ts
import fs from 'fs/promises';
import path from 'path';
import prisma from '../../../../lib/prisma';

export async function PATCH(req: Request): Promise<Response> {
    try {
        const body: any = await req.json();
        const { id, status_pengesahan_kehadiran } = body;
        console.log(body)


        if (!id || !status_pengesahan_kehadiran) {
            return new Response(
                JSON.stringify({ message: 'Invalid data' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const existingRecord = await prisma.bimbingan.findUnique({
            where: { id },
            include: {
                pengajuan_bimbingan: true
            }
        });

        if (!existingRecord) {
            return new Response(
                JSON.stringify({ message: 'Record not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const bimbingan = await prisma.bimbingan.update({
            where: { id },
            data: { status_pengesahan_kehadiran },
        });

        if (status_pengesahan_kehadiran === "Sah") {
            const notifikasiMahasiswa = {
                mahasiswa_id: existingRecord.pengajuan_bimbingan.mahasiswa_id,
                isi: "Absensi bimbinganmu telah dinyatakan sah!",
                read: false,
                waktu: new Date(),
            };

            await prisma.notifikasimahasiswa.create({ data: notifikasiMahasiswa });
        } else if (status_pengesahan_kehadiran === "Tidak Sah") {
            const notifikasiMahasiswa = {
                mahasiswa_id: existingRecord.pengajuan_bimbingan.mahasiswa_id,
                isi: "Absensi bimbinganmu dinyatakan tidak sah!",
                read: false,
                waktu: new Date(),
            };

            await prisma.notifikasimahasiswa.create({ data: notifikasiMahasiswa });
        }


        return new Response(JSON.stringify(bimbingan), {
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
