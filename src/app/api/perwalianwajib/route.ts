import prisma from '../../../lib/prisma';
import { format } from 'date-fns';

export async function POST(req: Request) {
    try {
        const body: any = await req.json();
        console.log(body)

        const { dosen_pa_id, waktu_kirim, tahun_ajaran, semester, jenis_bimbingan, sistem_bimbingan, jadwal_bimbingan, pesan_siaran } = body;

        if (!tahun_ajaran || !jenis_bimbingan || !tahun_ajaran || !semester || !sistem_bimbingan || !jadwal_bimbingan || !pesan_siaran) {
            return new Response(
                JSON.stringify({ message: 'Semua kolom harus diisi!' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const mahasiswa = await prisma.mahasiswa.findMany({
            where: { dosen_pa_id },
        });

        const pesansiaran = await prisma.pesansiaran.findFirst({
            where: { dosen_pa_id }
        })

        if (!mahasiswa) {
            throw new Error('Anda belum memiliki mahasiswa bimbingan satupun di sistem!');
        }

        if (!pesansiaran) {
            const pesanSiaran = await prisma.pesansiaran.create({
                data: {
                    dosen_pa_id,
                    waktu_pesan_terakhir: waktu_kirim,
                    pesan_terakhir: pesan_siaran,
                },
            });
            mahasiswa.map(async data =>
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
                    pesan: pesan_siaran,
                    waktu_kirim,
                },
            });
        }
        else if (pesansiaran) {
            const pesanChatSiaran = await prisma.pesanchatsiaran.create({
                data: {
                    pesan_siaran_id: pesansiaran.id,
                    pesan: pesan_siaran,
                    waktu_kirim,
                },
            });

            // Check if the chat record exists
            const existingRecord = await prisma.pesansiaran.findUnique({
                where: { id: pesansiaran.id },
            });

            // Update the existing chat record

            const pesanSiaran = await prisma.pesansiaran.update({
                where: { id: pesansiaran.id },
                data: {
                    pesan_terakhir: pesan_siaran,
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

        }

        const dosenpa = await prisma.dosenpa.findFirst({
            where: { id: dosen_pa_id },
        });

        let pengajuanbimbingan = []
        mahasiswa.map(async mhs => {
            const pengajuan = await prisma.pengajuanbimbingan.create({
                data: {
                    nama_lengkap: mhs.nama,
                    nim: mhs.nim,
                    email: mhs.email,
                    no_whatsapp: mhs.hp,
                    jadwal_bimbingan,
                    jurusan: mhs.jurusan,
                    jenis_bimbingan,
                    sistem_bimbingan,
                    status: "Diterima",
                    dosen_pa_id,
                    mahasiswa_id: mhs.id,
                    tahun_ajaran,
                    semester,
                    keterangan: pesan_siaran,
                    periode_pengajuan: jenis_bimbingan === "Perwalian (Sebelum Isi KRS Baru)" ? "Setelah UAS - Sebelum Isi KRS Baru" : jenis_bimbingan === "Perwalian (Setelah UTS)" ? "Setelah Isi KRS Baru - Sebelum UTS" : jenis_bimbingan === "Perwalian (Setelah UAS)" ? "Setelah UAS - Sebelum Isi KRS baru" : ""
                },
            });
            await prisma.bimbingan.create({
                data: {
                    pengajuan_bimbingan_id: pengajuan.id
                }
            })
            pengajuanbimbingan = [...pengajuanbimbingan, pengajuan];
            const notifikasiMahasiswa: any = {
                mahasiswa_id: mhs.id,
                isi: `Jadwal bimbingan ${jenis_bimbingan} dari Dosen Pembimbing Akademik Anda (${dosenpa.nama}) baru saja diatur!. Klik di sini untuk melihat detailnya.`,
                read: false,
                waktu: new Date(),
            }
            await prisma.notifikasimahasiswa.create({ data: notifikasiMahasiswa });
        })


        const responsePayload = {
            status: "success",
            message: "Atur perwalian wajib Anda telah berhasil!",
            data: pengajuanbimbingan,
        };

        return new Response(JSON.stringify(responsePayload), {
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
