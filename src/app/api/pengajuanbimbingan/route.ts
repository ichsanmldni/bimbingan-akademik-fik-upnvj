import prisma from "../../../lib/prisma";
import { format } from "date-fns";
import { sendPushNotification } from "@/lib/sendPushNotification";

export async function GET(req: Request): Promise<Response> {
  try {
    // Mengambil data pengajuan bimbingan dari database
    const pengajuanBimbingan = await prisma.pengajuanbimbingan.findMany();

    // Mengembalikan data pengajuan bimbingan sebagai JSON
    return new Response(JSON.stringify(pengajuanBimbingan), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Menangani kesalahan
    return new Response(
      JSON.stringify({
        message: "Something went wrong",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body: any = await req.json();

    const {
      nama_lengkap,
      periode_pengajuan,
      nim,
      email,
      ipk,
      no_whatsapp,
      jurusan,
      jadwal_bimbingan,
      jenis_bimbingan,
      topik_bimbingan,
      sistem_bimbingan,
      status,
      dosen_pa_id,
      mahasiswa_id,
      permasalahan,
      semester,
      tahun_ajaran,
    } = body;
    if (!dosen_pa_id) {
      return new Response(
        JSON.stringify({
          message: "Pilih Dosen PA terlebih dahulu di dashboard profile!",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (!ipk) {
      return new Response(
        JSON.stringify({
          message: "Input IPK terlebih dahulu di dashboard profile!",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (jenis_bimbingan === "Pribadi") {
      if (
        !nama_lengkap ||
        !nim ||
        !periode_pengajuan ||
        !email ||
        !no_whatsapp ||
        !jurusan ||
        !jadwal_bimbingan ||
        !jenis_bimbingan ||
        !sistem_bimbingan ||
        !status ||
        !dosen_pa_id ||
        !mahasiswa_id ||
        !permasalahan ||
        !topik_bimbingan ||
        !tahun_ajaran ||
        !semester
      ) {
        return new Response(
          JSON.stringify({ message: "Semua kolom harus diisi!" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { nim },
    });

    if (!mahasiswa) {
      throw new Error("Invalid Data");
    }

    let pengajuanBimbingan;
    if (mahasiswa && mahasiswa.id) {
      pengajuanBimbingan = await prisma.pengajuanbimbingan.create({
        data: {
          nama_lengkap,
          nim,
          email,
          no_whatsapp,
          jadwal_bimbingan,
          jurusan,
          jenis_bimbingan,
          topik_bimbingan,
          sistem_bimbingan,
          periode_pengajuan,
          status,
          dosen_pa_id,
          mahasiswa_id: mahasiswa.id,
          permasalahan,
          tahun_ajaran,
          semester,
        },
      });
    }

    const notifikasiDosenPA: any = {
      dosen_pa_id,
      isi: `Ada pengajuan bimbingan baru dari ${nama_lengkap}. Klik di sini untuk melihat detailnya.`,
      read: false,
      waktu: new Date(),
    };

    await prisma.notifikasidosenpa.create({ data: notifikasiDosenPA });

    await sendPushNotification({
      role: "dosen pa",
      userId: dosen_pa_id,
      title: "Pengajuan Bimbingan Baru",
      body: `Ada pengajuan bimbingan dari ${nama_lengkap}.`,
      url: "/dashboard?submenu=Pengajuan%20Bimbingan%20Akademik%20Mahasiswa", // atau rute detail pengajuan
    });

    const responsePayload = {
      status: "success",
      message: "Pengajuan bimbingan Anda telah berhasil!",
      data: pengajuanBimbingan,
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

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      jadwal_bimbingan_reschedule,
      keterangan_reschedule,
      status_reschedule,
      status,
      keterangan,
      mahasiswa_id,
    } = body;

    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { id: mahasiswa_id },
    });

    const dosen_pa_id = mahasiswa?.dosen_pa_id;

    const nama_lengkap = mahasiswa?.nama;

    if (!id || !status) {
      return new Response(JSON.stringify({ message: "Invalid data!" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (status === "Diterima") {
      if (!keterangan) {
        return new Response(
          JSON.stringify({ message: "Input keterangan terlebih dahulu!" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    } else if (status === "Reschedule") {
      if (!keterangan_reschedule) {
        return new Response(
          JSON.stringify({
            message: "Input keterangan schedule terlebih dahulu!",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      } else if (!jadwal_bimbingan_reschedule) {
        return new Response(
          JSON.stringify({ message: "Input jadwal schedule terlebih dahulu!" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    const existingRecord = await prisma.pengajuanbimbingan.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      throw new Error("Record not found");
    }

    if (status === "Reschedule") {
    } else if (status === "Diterima") {
      const notifikasiMahasiswa: any = {
        mahasiswa_id,
        isi: "Pengajuan bimbinganmu berhasil diterima!",
        read: false,
        waktu: new Date(),
      };

      await prisma.notifikasimahasiswa.create({ data: notifikasiMahasiswa });

      await sendPushNotification({
        role: "mahasiswa",
        userId: mahasiswa_id,
        title: "Bimbingan Siap Dimulai!",
        body: `Pengajuan bimbinganmu berhasil diterima!`,
        url: "/dashboard?submenu=Riwayat%20Pengajuan%20Bimbingan", // atau rute detail pengajuan
      });
    }

    let pengajuanBimbingan;
    if (status === "Diterima") {
      pengajuanBimbingan = await prisma.pengajuanbimbingan.update({
        where: { id },
        data: { status, keterangan },
      });
    } else if (status === "Reschedule") {
      pengajuanBimbingan = await prisma.pengajuanbimbingan.update({
        where: { id },
        data: {
          status,
          jadwal_bimbingan_reschedule,
          keterangan_reschedule,
          status_reschedule,
        },
      });
    }

    if (status === "Diterima") {
      const responsePayload = {
        status: "success",
        message: "Pengajuan bimbingan telah berhasil diterima!",
        data: pengajuanBimbingan,
      };
      return new Response(JSON.stringify(responsePayload), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else if (status === "Reschedule") {
      if (status_reschedule === "Belum dikonfirmasi") {
        const notifikasiMahasiswa: any = {
          mahasiswa_id,
          isi: "Pengajuan bimbinganmu direschedule!",
          read: false,
          waktu: new Date(),
        };

        await prisma.notifikasimahasiswa.create({ data: notifikasiMahasiswa });

        await sendPushNotification({
          role: "mahasiswa",
          userId: mahasiswa_id,
          title: "Perubahan Jadwal Bimbingan",
          body: `Pengajuan bimbinganmu direschedule!`,
          url: "/dashboard?submenu=Riwayat%20Pengajuan%20Bimbingan", // atau rute detail pengajuan
        });

        const responsePayload = {
          status: "success",
          message: "Pengajuan bimbingan telah berhasil direschedule!",
          data: pengajuanBimbingan,
        };
        return new Response(JSON.stringify(responsePayload), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } else if (status_reschedule === "Bisa") {
        const notifikasiDosenPA: any = {
          dosen_pa_id,
          isi: `Mahasiswa bimbingan Anda ${nama_lengkap} telah menyatakan bisa pada jadwal reschedule bimbingan yang diberikan!. Klik di sini untuk melihat detailnya.`,
          read: false,
          waktu: new Date(),
        };

        await prisma.notifikasidosenpa.create({ data: notifikasiDosenPA });

        await sendPushNotification({
          role: "dosen pa",
          userId: dosen_pa_id,
          title: "Ketersediaan Jadwal Reschedule Bimbingan Oleh Mahasiswa",
          body: `Mahasiswa bimbingan Anda ${nama_lengkap} telah menyatakan bisa pada jadwal reschedule bimbingan yang diberikan!. Klik di sini untuk melihat detailnya.`,
          url: "/dashboard?submenu=Pengajuan%20Bimbingan%20Akademik%20Mahasiswa", // atau rute detail pengajuan
        });

        const responsePayload = {
          status: "success",
          message:
            "Kehadiran untuk reschedule bimbingan telah berhasil dicatat!",
          data: pengajuanBimbingan,
        };
        return new Response(JSON.stringify(responsePayload), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } else if (status_reschedule === "Tidak bisa") {
        const notifikasiDosenPA: any = {
          dosen_pa_id,
          isi: `Mahasiswa bimbingan Anda ${nama_lengkap} telah menyatakan tidak bisa pada jadwal reschedule bimbingan yang diberikan!. Klik di sini untuk melihat detailnya.`,
          read: false,
          waktu: new Date(),
        };

        await prisma.notifikasidosenpa.create({ data: notifikasiDosenPA });

        await sendPushNotification({
          role: "dosen pa",
          userId: dosen_pa_id,
          title: "Ketidaksediaan Jadwal Reschedule Bimbingan Oleh Mahasiswa",
          body: `Mahasiswa bimbingan Anda ${nama_lengkap} telah menyatakan tidak bisa pada jadwal reschedule bimbingan yang diberikan!. Klik di sini untuk melihat detailnya.`,
          url: "/dashboard?submenu=Pengajuan%20Bimbingan%20Akademik%20Mahasiswa", // atau rute detail pengajuan
        });

        const responsePayload = {
          status: "success",
          message:
            "Ketidakhadiran untuk reschedule bimbingan telah berhasil dicatat!",
          data: pengajuanBimbingan,
        };
        return new Response(JSON.stringify(responsePayload), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    }
  } catch (error) {
    console.log(error.message);
    return new Response(
      JSON.stringify({
        message: "Something went wrong",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
