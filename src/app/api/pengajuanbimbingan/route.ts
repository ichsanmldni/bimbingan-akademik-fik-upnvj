import prisma from '../../../lib/prisma';
import { format } from 'date-fns';

interface PengajuanBimbingan {
  id?: number; // Optional for POST, required for PATCH
  nama_lengkap: string;
  nim: string;
  email: string;
  no_whatsapp: string;
  jurusan: string;
  jadwal_bimbingan: string; // Adjust type according to your schema
  jenis_bimbingan: string;
  topik_bimbingan: string;
  sistem_bimbingan: string;
  status: string;
  dosen_pa_id: number;
  mahasiswa_id: number;
  keterangan?: string; // Optional for PATCH
}

interface NotifikasiMahasiswa {
  mahasiswa_id: number;
  isi: string;
  read: boolean;
  waktu: Date;
}

interface NotifikasiDosenPA {
  dosen_pa_id: number;
  isi: string;
  read: boolean;
  waktu: Date;
}

export async function GET(req: Request): Promise<Response> {
  try {
    // Mengambil data pengajuan bimbingan dari database
    const pengajuanBimbingan = await prisma.pengajuanbimbingan.findMany();

    // Mengembalikan data pengajuan bimbingan sebagai JSON
    return new Response(JSON.stringify(pengajuanBimbingan), {
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
    const body: PengajuanBimbingan = await req.json();

    const { nama_lengkap, nim, email, no_whatsapp, jurusan, jadwal_bimbingan, jenis_bimbingan, topik_bimbingan, sistem_bimbingan, status, dosen_pa_id, mahasiswa_id, permasalahan, is_selected_permasalahan } = body;

    if (!nama_lengkap || !nim || !email || !no_whatsapp || !jurusan || !jadwal_bimbingan || !jenis_bimbingan || !sistem_bimbingan || !status || !dosen_pa_id || !mahasiswa_id) {
      return new Response(
        JSON.stringify({ message: 'Semua kolom harus diisi!' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (jenis_bimbingan === "Pribadi") {
      if (!nama_lengkap || !nim || !email || !no_whatsapp || !jurusan || !jadwal_bimbingan || !jenis_bimbingan || !sistem_bimbingan || !status || !dosen_pa_id || !mahasiswa_id || !permasalahan || !topik_bimbingan) {
        return new Response(
          JSON.stringify({ message: 'Semua kolom harus diisi!' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    if (jenis_bimbingan === "Perwalian") {
      if (!nama_lengkap || !nim || !email || !no_whatsapp || !jurusan || !jadwal_bimbingan || !jenis_bimbingan || !sistem_bimbingan || !status || !dosen_pa_id || !mahasiswa_id || !is_selected_permasalahan) {
        return new Response(
          JSON.stringify({ message: 'Semua kolom harus diisi!' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { nim },
    });

    const pengajuanBimbingan = await prisma.pengajuanbimbingan.create({
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
        status,
        dosen_pa_id,
        mahasiswa_id: mahasiswa.id,
        permasalahan
      },
    });

    const notifikasiDosenPA: NotifikasiDosenPA = {
      dosen_pa_id,
      isi: `Ada pengajuan bimbingan baru dari ${nama_lengkap}. Klik di sini untuk melihat detailnya.`,
      read: false,
      waktu: new Date(),
    };

    await prisma.notifikasidosenpa.create({ data: notifikasiDosenPA });

    const responsePayload = {
      status: "success",
      message: "Pengajuan bimbingan Anda telah berhasil!",
      data: pengajuanBimbingan,
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

export async function PATCH(req: Request): Promise<Response> {
  try {
    const body = await req.json();

    const { id, status, keterangan, mahasiswa_id, dosen_pa_id } = body;

    if (!id || !status) {
      return new Response(
        JSON.stringify({ message: 'Invalid data!' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (!keterangan) {
      return new Response(
        JSON.stringify({ message: 'Input keterangan terlebih dahulu!' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const existingRecord = await prisma.pengajuanbimbingan.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      throw new Error('Record not found');
    }

    if (status === "Reschedule") {
      const notifikasiMahasiswa: NotifikasiMahasiswa = {
        mahasiswa_id,
        isi: "Pengajuan bimbinganmu direschedule!",
        read: false,
        waktu: new Date(),
      };

      await prisma.notifikasimahasiswa.create({ data: notifikasiMahasiswa });
    } else if (status === "Diterima") {
      const notifikasiMahasiswa: NotifikasiMahasiswa = {
        mahasiswa_id,
        isi: "Pengajuan bimbinganmu berhasil diterima!",
        read: false,
        waktu: new Date(),
      };

      await prisma.notifikasimahasiswa.create({ data: notifikasiMahasiswa });
    }

    const pengajuanBimbingan = await prisma.pengajuanbimbingan.update({
      where: { id },
      data: { status, keterangan },
    });

    if (status === "Diterima") {
      const responsePayload = {
        status: "success",
        message: "Pengajuan bimbingan telah berhasil diterima!",
        data: pengajuanBimbingan,
      };
      return new Response(JSON.stringify(responsePayload), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else if (status === "Reschedule") {
      const responsePayload = {
        status: "success",
        message: "Pengajuan bimbingan telah berhasil direschedule!",
        data: pengajuanBimbingan,
      };
      return new Response(JSON.stringify(responsePayload), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Something went wrong', error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
