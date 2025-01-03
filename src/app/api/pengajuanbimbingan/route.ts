import prisma from '../../../lib/prisma';

interface PengajuanBimbingan {
  id?: number; // Optional for POST, required for PATCH
  nama_lengkap: string;
  nim: string;
  email: string;
  no_whatsapp: string;
  jadwal_bimbingan: string; // Adjust type according to your schema
  jenis_bimbingan: string;
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

    const { nama_lengkap, nim, email, no_whatsapp, jadwal_bimbingan, jenis_bimbingan, sistem_bimbingan, status, dosen_pa_id, mahasiswa_id } = body;

    if (!nama_lengkap || !nim || !email || !no_whatsapp || !jadwal_bimbingan || !jenis_bimbingan || !sistem_bimbingan || !status || !dosen_pa_id || !mahasiswa_id) {
      return new Response(
        JSON.stringify({ message: 'All fields are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const pengajuanBimbingan = await prisma.pengajuanbimbingan.create({
      data: {
        nama_lengkap,
        nim,
        email,
        no_whatsapp,
        jadwal_bimbingan,
        jenis_bimbingan,
        sistem_bimbingan,
        status,
        dosen_pa_id,
        mahasiswa_id,
      },
    });

    const notifikasiMahasiswa: NotifikasiMahasiswa = {
      mahasiswa_id,
      isi: "Pengajuan bimbinganmu berhasil!",
      read: false,
      waktu: new Date(),
    };

    await prisma.notifikasimahasiswa.create({ data: notifikasiMahasiswa });

    const notifikasiDosenPA: NotifikasiDosenPA = {
      dosen_pa_id,
      isi: "Ada pengajuan bimbingan baru!",
      read: false,
      waktu: new Date(),
    };

    await prisma.notifikasidosenpa.create({ data: notifikasiDosenPA });

    return new Response(JSON.stringify(pengajuanBimbingan), {
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

    if (!id || !status || !keterangan) {
      return new Response(
        JSON.stringify({ message: 'Invalid data' }),
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

      const notifikasiDosenPA: NotifikasiDosenPA = {
        dosen_pa_id,
        isi: "Berhasil reschedule pengajuan bimbingan!",
        read: false,
        waktu: new Date(),
      };

      await prisma.notifikasidosenpa.create({ data: notifikasiDosenPA });
    } else if (status === "Diterima") {
      const notifikasiMahasiswa: NotifikasiMahasiswa = {
        mahasiswa_id,
        isi: "Pengajuan bimbinganmu berhasil diterima!",
        read: false,
        waktu: new Date(),
      };

      await prisma.notifikasimahasiswa.create({ data: notifikasiMahasiswa });

      const notifikasiDosenPA: NotifikasiDosenPA = {
        dosen_pa_id,
        isi: "Berhasil menerima pengajuan bimbingan!",
        read: false,
        waktu: new Date(),
      };

      await prisma.notifikasidosenpa.create({ data: notifikasiDosenPA });
    }

    const pengajuanBimbingan = await prisma.pengajuanbimbingan.update({
      where: { id },
      data: { status, keterangan },
    });

    return new Response(JSON.stringify(pengajuanBimbingan), {
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
