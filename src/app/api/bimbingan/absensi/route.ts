// /app/api/datadosen/route.ts
import fs from "fs/promises";
import path from "path";
import prisma from "../../../../lib/prisma";
import { sendPushNotification } from "@/lib/sendPushNotification";

export async function PATCH(req: Request): Promise<Response> {
  try {
    const body: any = await req.json();
    const { id, dokumentasi_kehadiran, ttd_kehadiran, solusi, ipk } = body;

    if (!id) {
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
      return new Response(
        JSON.stringify({ message: "Tidak ada data bimbingan yang ditemukan!" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const jenis = existingRecord.pengajuan_bimbingan.jenis_bimbingan;

    // Validasi
    if (jenis === "Pribadi") {
      if (!dokumentasi_kehadiran && !ttd_kehadiran && !solusi) {
        return new Response(
          JSON.stringify({ message: "Wajib input semua kolom!" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      if (!solusi) {
        return new Response(
          JSON.stringify({
            message: "Wajib input solusi yang diberikan selama bimbingan!",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      if (!dokumentasi_kehadiran) {
        return new Response(
          JSON.stringify({ message: "Wajib input dokumentasi kehadiran!" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      if (!ttd_kehadiran) {
        return new Response(
          JSON.stringify({ message: "Wajib input tanda tangan kehadiran!" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    } else if (jenis.startsWith("Perwalian")) {
      if (!ipk) {
        return new Response(
          JSON.stringify({
            message:
              "Sebelum mengisi absensi, input IPK Anda terlebih dahulu pada Profile Mahasiswa di Dashboard",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      if (!dokumentasi_kehadiran) {
        return new Response(
          JSON.stringify({ message: "Wajib input dokumentasi kehadiran!" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      if (!ttd_kehadiran) {
        return new Response(
          JSON.stringify({ message: "Wajib input tanda tangan kehadiran!" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Simpan base64 langsung ke DB
    let updatedData: any = {
      dokumentasi_kehadiran,
      ttd_kehadiran,
      status_kehadiran_mahasiswa: "Hadir",
      status_pengesahan_kehadiran: "Belum Sah",
    };

    if (solusi) updatedData.solusi = solusi;

    const bimbingan = await prisma.bimbingan.update({
      where: { id },
      data: updatedData,
    });

    const notifikasiDosenPA = {
      dosen_pa_id: existingRecord.pengajuan_bimbingan.dosen_pa_id,
      isi: `Ada absensi bimbingan baru dari ${existingRecord.pengajuan_bimbingan.nama_lengkap}. Klik untuk mengonfirmasi pengesahan absensi bimbingan.`,
      read: false,
      waktu: new Date(),
    };

    await prisma.notifikasidosenpa.create({ data: notifikasiDosenPA });

    await sendPushNotification({
      role: "dosen pa",
      userId: existingRecord.pengajuan_bimbingan.dosen_pa_id,
      title: "Absensi Bimbingan Baru",
      body: `Ada absensi bimbingan baru dari ${existingRecord.pengajuan_bimbingan.nama_lengkap}. Klik untuk mengonfirmasi pengesahan absensi bimbingan.`,
      url: "/dashboard?submenu=Pengesahan%20Absensi%20Bimbingan", // atau rute detail pengajuan
    });

    const responsePayload = {
      status: "success",
      message: "Absensi bimbingan berhasil dicatat!",
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
