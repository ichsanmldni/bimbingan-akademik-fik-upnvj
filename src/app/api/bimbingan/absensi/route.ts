// /app/api/datadosen/route.ts
import fs from 'fs/promises';
import path from 'path';
import prisma from '../../../../lib/prisma';

export async function PATCH(req: Request): Promise<Response> {
    try {
        const body: any = await req.json();
        const { id, dokumentasi_kehadiran, ttd_kehadiran, solusi, ipk } = body;

        if (!id) {
            return new Response(
                JSON.stringify({ message: 'Invalid data' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const existingRecord = await prisma.bimbingan.findUnique({
            where: { id },
            include: {
                pengajuan_bimbingan: true,
            }
        }
        );

        if (!existingRecord) {
            return new Response(
                JSON.stringify({ message: 'Tidak ada data bimbingan yang ditemukan!' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        if (existingRecord?.pengajuan_bimbingan.jenis_bimbingan === "Pribadi") {
            if (!dokumentasi_kehadiran && !ttd_kehadiran && !solusi) {
                return new Response(
                    JSON.stringify({ message: 'Wajib input semua kolom!' }),
                    { status: 400, headers: { 'Content-Type': 'application/json' } }
                );
            }
            if (!solusi) {
                return new Response(
                    JSON.stringify({ message: 'Wajib input solusi yang diberikan selama bimbingan!' }),
                    { status: 400, headers: { 'Content-Type': 'application/json' } }
                );
            }
            if (!dokumentasi_kehadiran && !ttd_kehadiran) {
                return new Response(
                    JSON.stringify({ message: 'Wajib input tanda tangan dan dokumentasi kehadiran!' }),
                    { status: 400, headers: { 'Content-Type': 'application/json' } }
                );
            }
            if (!dokumentasi_kehadiran) {
                return new Response(
                    JSON.stringify({ message: 'Wajib input dokumentasi kehadiran!' }),
                    { status: 400, headers: { 'Content-Type': 'application/json' } }
                );
            }

            if (!ttd_kehadiran) {
                return new Response(
                    JSON.stringify({ message: 'Wajib input tanda tangan kehadiran!' }),
                    { status: 400, headers: { 'Content-Type': 'application/json' } }
                );
            }
        } else if (existingRecord?.pengajuan_bimbingan.jenis_bimbingan.startsWith("Perwalian")) {
            if (!ipk) {
                return new Response(
                    JSON.stringify({ message: 'Sebelum mengisi absensi, input IPK Anda terlebih dahulu pada Profile Mahasiswa di Dashboard' }),
                    { status: 400, headers: { 'Content-Type': 'application/json' } }
                );
            }
            if (!dokumentasi_kehadiran && !ttd_kehadiran) {
                return new Response(
                    JSON.stringify({ message: 'Wajib input tanda tangan dan dokumentasi kehadiran!' }),
                    { status: 400, headers: { 'Content-Type': 'application/json' } }
                );
            }

            if (!dokumentasi_kehadiran) {
                return new Response(
                    JSON.stringify({ message: 'Wajib input dokumentasi kehadiran!' }),
                    { status: 400, headers: { 'Content-Type': 'application/json' } }
                );
            }

            if (!ttd_kehadiran) {
                return new Response(
                    JSON.stringify({ message: 'Wajib input tanda tangan kehadiran!' }),
                    { status: 400, headers: { 'Content-Type': 'application/json' } }
                );
            }
        }

        const ttdUploadDir = path.join(process.cwd(), 'public', 'uploads', 'ttd_mahasiswa');
        await fs.mkdir(ttdUploadDir, { recursive: true }); // Membuat folder secara rekursif

        const dokumentasiUploadDir = path.join(process.cwd(), 'public', 'uploads', 'dokumentasi_kehadiran_mahasiswa');
        await fs.mkdir(dokumentasiUploadDir, { recursive: true }); // Membuat folder secara rekursif

        let savedImageTtdPaths = "";
        if (ttd_kehadiran) {
            const base64Strings = ttd_kehadiran.split(", ").map((str: any) => str.trim());
            for (const base64Data of base64Strings) {
                try {
                    const match = base64Data.match(/^data:image\/(\w+);base64,/);
                    if (!match) throw new Error("Format base64 gambar tidak valid");

                    const extension = match[1]; // Ekstensi gambar (png, jpeg, dll)
                    const imageBuffer = Buffer.from(base64Data.replace(/^data:image\/\w+;base64,/, ''), 'base64');

                    // Buat nama file unik
                    const filename = `ttd_${Date.now()}_${Math.random().toString(36).substring(2, 5)}.${extension}`;
                    const relativePath = path.join('uploads', 'ttd_mahasiswa', filename);

                    // Simpan file ke folder public
                    await fs.writeFile(path.join(process.cwd(), 'public', relativePath), imageBuffer);

                    // Tambahkan path ke array hasil
                    savedImageTtdPaths = relativePath;
                } catch (error) {
                    console.error("Error menyimpan dokumentasi kehadiran: ", error instanceof Error ? error.message : 'Unknown error');
                }
            }
        }

        let savedImageDokumentasiPaths = "";
        if (dokumentasi_kehadiran) {
            const base64Strings = dokumentasi_kehadiran.split(", ").map((str: any) => str.trim());
            for (const base64Data of base64Strings) {
                try {
                    const match = base64Data.match(/^data:image\/(\w+);base64,/);
                    if (!match) throw new Error("Format base64 gambar tidak valid");

                    const extension = match[1]; // Ekstensi gambar (png, jpeg, dll)
                    const imageBuffer = Buffer.from(base64Data.replace(/^data:image\/\w+;base64,/, ''), 'base64');

                    // Buat nama file unik
                    const filename = `dokumentasi_${Date.now()}_${Math.random().toString(36).substring(2, 5)}.${extension}`;
                    const relativePath = path.join('uploads', 'dokumentasi_kehadiran_mahasiswa', filename);

                    // Simpan file ke folder public
                    await fs.writeFile(path.join(process.cwd(), 'public', relativePath), imageBuffer);

                    // Tambahkan path ke array hasil
                    savedImageDokumentasiPaths = relativePath;
                } catch (error) {
                    console.error("Error menyimpan tanda tangan kehadiran: ", error instanceof Error ? error.message : 'Unknown error');
                }
            }
        }
        let bimbingan;
        if (existingRecord.permasalahan) {
            bimbingan = await prisma.bimbingan.update({
                where: { id },
                data: { dokumentasi_kehadiran: savedImageDokumentasiPaths, status_pengesahan_kehadiran: "Belum Sah", status_kehadiran_mahasiswa: "Hadir", ttd_kehadiran: savedImageTtdPaths, solusi },
            });
        } else {
            bimbingan = await prisma.bimbingan.update({
                where: { id },
                data: { dokumentasi_kehadiran: savedImageDokumentasiPaths, status_pengesahan_kehadiran: "Belum Sah", status_kehadiran_mahasiswa: "Hadir", ttd_kehadiran: savedImageTtdPaths, },
            });
        }

        const notifikasiDosenPA = {
            dosen_pa_id: existingRecord.pengajuan_bimbingan.dosen_pa_id,
            isi: `Ada absensi bimbingan baru dari ${existingRecord.pengajuan_bimbingan.nama_lengkap}. Klik untuk mengonfirmasi pengesahan absensi bimbingan.`,
            read: false,
            waktu: new Date(),
        };

        await prisma.notifikasidosenpa.create({ data: notifikasiDosenPA });

        const responsePayload = {
            status: "success",
            message: "Absensi bimbingan berhasil dicatat!",
            data: bimbingan,
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
