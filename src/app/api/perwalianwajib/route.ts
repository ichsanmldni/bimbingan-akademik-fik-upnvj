import { sendPushNotification } from "@/lib/sendPushNotification";
import prisma from "../../../lib/prisma";
import { format } from "date-fns";

export async function POST(req: Request) {
  try {
    const body: any = await req.json();

    const {
      dosen_pa_id,
      waktu_kirim,
      tahun_ajaran,
      semester,
      jenis_bimbingan,
      sistem_bimbingan,
      jadwal_bimbingan,
      pesan_siaran,
    } = body;

    if (
      !tahun_ajaran ||
      !jenis_bimbingan ||
      !tahun_ajaran ||
      !semester ||
      !sistem_bimbingan ||
      !jadwal_bimbingan ||
      !pesan_siaran
    ) {
      return new Response(
        JSON.stringify({ message: "Semua kolom wajib diisi!" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const mahasiswa = await prisma.mahasiswa.findMany({
      where: { dosen_pa_id, status_lulus: false },
    });

    const dosenPA = await prisma.dosenpa.findUnique({
      where: { id: dosen_pa_id },
    });

    const pesansiaran = await prisma.pesansiaran.findFirst({
      where: { dosen_pa_id },
    });

    if (!mahasiswa) {
      throw new Error(
        "Anda belum memiliki mahasiswa bimbingan satupun di sistem!"
      );
    }

    if (!pesansiaran) {
      const pesanSiaran = await prisma.pesansiaran.create({
        data: {
          dosen_pa_id,
          waktu_pesan_terakhir: waktu_kirim,
          pesan_terakhir: pesan_siaran,
        },
      });

      const pesanChatSiaran = await prisma.pesanchatsiaran.create({
        data: {
          pesan_siaran_id: pesanSiaran.id,
          pesan: pesan_siaran,
          waktu_kirim,
        },
      });

      mahasiswa.map(async (data) => {
        await prisma.statuspembacaanpesansiaran.create({
          data: {
            pesan_siaran_id: pesanSiaran.id,
            mahasiswa_id: data.id,
            is_read: false,
          },
        });
        await sendPushNotification({
          role: "mahasiswa",
          userId: data.id,
          title: "Anda Memiliki Pesan Siaran Baru",
          body: `${dosenPA.nama} : ${pesan_siaran}`,
          url: "/chatpribadi",
        });
      });
    } else if (pesansiaran) {
      const pesanChatSiaran = await prisma.pesanchatsiaran.create({
        data: {
          pesan_siaran_id: pesansiaran.id,
          pesan: pesan_siaran,
          waktu_kirim,
        },
      });

      // Update the existing chat record

      const pesanSiaran = await prisma.pesansiaran.update({
        where: { id: pesansiaran.id },
        data: {
          pesan_terakhir: pesan_siaran,
          waktu_pesan_terakhir: waktu_kirim,
        },
      });

      const datastatuspembacaan =
        await prisma.statuspembacaanpesansiaran.findMany();

      mahasiswa.map(async (data) => {
        const datastatusmahasiswa = datastatuspembacaan.find(
          (stts) => stts.mahasiswa_id === data.id
        );
        await prisma.statuspembacaanpesansiaran.update({
          where: {
            id: datastatusmahasiswa.id,
          },
          data: {
            is_read: false,
          },
        });
        await sendPushNotification({
          role: "mahasiswa",
          userId: data.id,
          title: "Anda Memiliki Pesan Siaran Baru",
          body: `${dosenPA.nama} : ${pesan_siaran}`,
          url: "/chatpribadi",
        });
      });
    }

    const dosenpa = await prisma.dosenpa.findFirst({
      where: { id: dosen_pa_id },
    });

    let pengajuanbimbingan = [];
    mahasiswa.map(async (mhs) => {
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
          periode_pengajuan:
            jenis_bimbingan === "Perwalian KRS"
              ? "Sebelum Perwalian KRS"
              : jenis_bimbingan === "Perwalian UTS"
                ? "Setelah Perwalian KRS - Sebelum Perwalian UTS"
                : jenis_bimbingan === "Perwalian UAS"
                  ? "Setelah Perwalian UTS - Sebelum Perwalian UAS"
                  : "",
        },
      });
      await prisma.bimbingan.create({
        data: {
          pengajuan_bimbingan_id: pengajuan.id,
        },
      });
      pengajuanbimbingan = [...pengajuanbimbingan, pengajuan];
      const notifikasiMahasiswa: any = {
        mahasiswa_id: mhs.id,
        isi: `Jadwal bimbingan ${jenis_bimbingan} dari Dosen Pembimbing Akademik Anda (${dosenpa.nama}) baru saja diatur!. Klik di sini untuk melihat detailnya.`,
        read: false,
        waktu: new Date(),
      };
      await prisma.notifikasimahasiswa.create({ data: notifikasiMahasiswa });

      await sendPushNotification({
        role: "mahasiswa",
        userId: mhs.id,
        title: "Dosen PA Telah Menjadwalkan Perwalian/Bimbingan",
        body: `Jadwal bimbingan ${jenis_bimbingan} dari Dosen Pembimbing Akademik Anda (${dosenpa.nama}) baru saja diatur!. Klik di sini untuk melihat detailnya.`,
        url: "/dashboard?submenu=Riwayat%20Pengajuan%20Bimbingan", // atau rute detail pengajuan
      });
    });

    const responsePayload = {
      status: "success",
      message: "Atur perwalian wajib Anda telah berhasil!",
      data: pengajuanbimbingan,
    };

    return new Response(JSON.stringify(responsePayload), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Something went wrong",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
