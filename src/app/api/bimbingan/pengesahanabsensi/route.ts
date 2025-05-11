// /app/api/datadosen/route.ts
import fs from "fs/promises";
import path from "path";
import prisma from "../../../../lib/prisma";
import { sendPushNotification } from "@/lib/sendPushNotification";

export async function PATCH(req: Request): Promise<Response> {
  try {
    const body: any = await req.json();
    const { id, status_pengesahan_kehadiran } = body;

    if (!id || !status_pengesahan_kehadiran) {
      return new Response(JSON.stringify({ message: "Invalid data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const existingRecord = await prisma.bimbingan.findUnique({
      where: { id },
      include: {
        pengajuan_bimbingan: true,
      },
    });

    if (!existingRecord) {
      return new Response(JSON.stringify({ message: "Record not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
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

      await sendPushNotification({
        role: "mahasiswa",
        userId: existingRecord.pengajuan_bimbingan.mahasiswa_id,
        title: "Absensi Disetujui",
        body: `Absensi bimbinganmu telah dinyatakan sah!`,
        url: "/dashboard?submenu=Absensi%20Bimbingan", // atau rute detail pengajuan
      });
    } else if (status_pengesahan_kehadiran === "Tidak Sah") {
      const notifikasiMahasiswa = {
        mahasiswa_id: existingRecord.pengajuan_bimbingan.mahasiswa_id,
        isi: "Absensi bimbinganmu dinyatakan tidak sah!",
        read: false,
        waktu: new Date(),
      };

      await prisma.notifikasimahasiswa.create({ data: notifikasiMahasiswa });

      await sendPushNotification({
        role: "mahasiswa",
        userId: existingRecord.pengajuan_bimbingan.mahasiswa_id,
        title: "Absensi Ditolak",
        body: `Absensi bimbinganmu dinyatakan tidak sah!`,
        url: "/dashboard?submenu=Absensi%20Bimbingan", // atau rute detail pengajuan
      });
    }

    const responsePayload = {
      status: "success",
      message: "Konfirmasi pengesahan absensi bimbingan telah berhasil!",
      data: bimbingan,
    };

    return new Response(JSON.stringify(responsePayload), {
      status: 200,
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
