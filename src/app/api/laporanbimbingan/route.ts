import fs from 'fs/promises';
import path from 'path';
import prisma from '../../../lib/prisma';

interface NotifikasiKaprodi {
  kaprodi_id: number;
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
    // Mengambil data laporan bimbingan dari database
    const laporanBimbingan = await prisma.laporanbimbingan.findMany({
      include: {
        dosen_pa: true,
      },
    });

    // Mengembalikan data laporan bimbingan sebagai JSON
    return new Response(JSON.stringify(laporanBimbingan), {
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
    const body: any = await req.json();
    console.log(body)
    const {
      kaprodi_id,
      status,
      dosen_pa_id,
      nama_dosen_pa,
      jenis_bimbingan,
      topik_bimbingan,
      bimbingan_id,
      kendala_mahasiswa,
      solusi,
      tahun_ajaran,
      semester,
      pendahuluan,
      jumlah_ipk_a,
      jumlah_ipk_b,
      jumlah_ipk_c,
      jumlah_ipk_d,
      jumlah_ipk_e,
      jumlah_beasiswa_bbm,
      jumlah_beasiswa_pegadaian,
      jumlah_beasiswa_supersemar,
      jumlah_beasiswa_ppa,
      jumlah_beasiswa_ykl,
      jumlah_beasiswa_dll,
      prestasi_ilmiah_mahasiswa,
      prestasi_porseni_mahasiswa,
      data_status_mahasiswa,
      kesimpulan,
      dokumentasi,
      tanda_tangan_dosen_pa,
      nama_kaprodi,
      jadwal_bimbingan
    } = body;

    if (!kaprodi_id || !nama_kaprodi || !status || !dosen_pa_id || !nama_dosen_pa || !jenis_bimbingan || !bimbingan_id || !tahun_ajaran || !semester || !jadwal_bimbingan) {
      return new Response(
        JSON.stringify({ message: 'All fields are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Buat direktori jika belum ada
    const uploadDokumentasiDir = path.join(process.cwd(), 'public', 'uploads', 'dokumentasi_laporan');
    await fs.mkdir(uploadDokumentasiDir, { recursive: true }); // Membuat folder secara rekursif

    const uploadTtdDir = path.join(process.cwd(), 'public', 'uploads', 'ttd_dosen_pa_laporan');
    await fs.mkdir(uploadTtdDir, { recursive: true }); // Membuat folder secara rekursif

    let savedDokumentasiImagePaths: string[] = [];
    if (dokumentasi) {
      const base64Strings = dokumentasi.split(", ").map((str) => str.trim());
      for (const base64Data of base64Strings) {
        try {
          const match = base64Data.match(/^data:image\/(\w+);base64,/);
          if (!match) throw new Error("Format base64 gambar tidak valid");

          const extension = match[1]; // Ekstensi gambar (png, jpeg, dll)
          const imageBuffer = Buffer.from(base64Data.replace(/^data:image\/\w+;base64,/, ''), 'base64');

          // Buat nama file unik
          const filename = `dokumentasi_${Date.now()}_${Math.random().toString(36).substring(2, 5)}.${extension}`;
          const relativePath = path.join('uploads', 'dokumentasi_laporan', filename);

          // Simpan file ke folder public
          await fs.writeFile(path.join(process.cwd(), 'public', relativePath), imageBuffer);

          // Tambahkan path ke array hasil
          savedDokumentasiImagePaths.push(relativePath);
        } catch (error) {
          console.error("Error menyimpan gambar: ", error instanceof Error ? error.message : 'Unknown error');
        }
      }
    }
    const savedDokumentasiImagePathsString = savedDokumentasiImagePaths.join(", ");

    let savedTtdImagePaths: string[] = [];
    if (tanda_tangan_dosen_pa) {
      const base64Strings = tanda_tangan_dosen_pa.split(", ").map((str) => str.trim());
      for (const base64Data of base64Strings) {
        try {
          const match = base64Data.match(/^data:image\/(\w+);base64,/);
          if (!match) throw new Error("Format base64 gambar tidak valid");

          const extension = match[1]; // Ekstensi gambar (png, jpeg, dll)
          const imageBuffer = Buffer.from(base64Data.replace(/^data:image\/\w+;base64,/, ''), 'base64');

          // Buat nama file unik
          const filename = `ttd_dosen_pa_${Date.now()}_${Math.random().toString(36).substring(2, 5)}.${extension}`;
          const relativePath = path.join('uploads', 'ttd_dosen_pa_laporan', filename);

          // Simpan file ke folder public
          await fs.writeFile(path.join(process.cwd(), 'public', relativePath), imageBuffer);

          // Tambahkan path ke array hasil
          savedTtdImagePaths.push(relativePath);
        } catch (error) {
          console.error("Error menyimpan gambar: ", error instanceof Error ? error.message : 'Unknown error');
        }
      }
    }
    const savedTtdImagePathsString = savedTtdImagePaths.join(", ");

    const notifikasiKaprodi: NotifikasiKaprodi = {
      kaprodi_id,
      isi: "Laporan bimbingan baru diterima!",
      read: false,
      waktu: new Date(),
    };

    await prisma.notifikasikaprodi.create({ data: notifikasiKaprodi });

    const notifikasiDosenPA: NotifikasiDosenPA = {
      dosen_pa_id,
      isi: "Berhasil membuat laporan bimbingan!",
      read: false,
      waktu: new Date(),
    };

    await prisma.notifikasidosenpa.create({ data: notifikasiDosenPA });

    const laporanBimbingan = await prisma.laporanbimbingan.create({
      data: {
        jumlah_mahasiswa: parseInt(bimbingan_id.split(",").map(id => id.trim()).length),
        status,
        nama_kaprodi,
        kaprodi_id,
        dosen_pa_id,
        nama_dosen_pa,
        jenis_bimbingan,
        topik_bimbingan: topik_bimbingan || null,
        kendala_mahasiswa: kendala_mahasiswa || null,
        solusi: solusi || null,
        tahun_ajaran,
        semester,
        pendahuluan: pendahuluan || null,
        jumlah_ipk_a: jumlah_ipk_a ?? null,
        jumlah_ipk_b: jumlah_ipk_b ?? null,
        jumlah_ipk_c: jumlah_ipk_c ?? null,
        jumlah_ipk_d: jumlah_ipk_d ?? null,
        jumlah_ipk_e: jumlah_ipk_e ?? null,
        jumlah_beasiswa_bbm: jumlah_beasiswa_bbm ?? null,
        jumlah_beasiswa_pegadaian: jumlah_beasiswa_pegadaian ?? null,
        jumlah_beasiswa_supersemar: jumlah_beasiswa_supersemar ?? null,
        jumlah_beasiswa_ppa: jumlah_beasiswa_ppa ?? null,
        jumlah_beasiswa_ykl: jumlah_beasiswa_ykl ?? null,
        jumlah_beasiswa_dll: jumlah_beasiswa_dll ?? null,
        kesimpulan: kesimpulan || null,
        dokumentasi: savedDokumentasiImagePathsString,
        tanda_tangan_dosen_pa: savedTtdImagePathsString,
        jadwal_bimbingan
      },
    });

    prestasi_ilmiah_mahasiswa?.map(async (data) =>
      await prisma.prestasiilmiahmahasiswa.create({
        data: {
          laporan_bimbingan_id: laporanBimbingan.id,
          bidang_prestasi: data.bidang_prestasi,
          lampiran: data.file.name,
          nama: data.nama,
          nim: data.nim,
          tingkat_prestasi: data.tingkat_prestasi
        }
      })
    )

    prestasi_porseni_mahasiswa?.map(async (data) =>
      await prisma.prestasiporsenimahasiswa.create({
        data: {
          laporan_bimbingan_id: laporanBimbingan.id,
          jenis_kegiatan: data.jenis_kegiatan,
          lampiran: data.file.name,
          nama: data.nama,
          nim: data.nim,
          tingkat_prestasi: data.tingkat_prestasi
        }
      })
    )

    data_status_mahasiswa?.map(async (data) =>
      await prisma.datastatusmahasiswa.create({
        data: {
          laporan_bimbingan_id: laporanBimbingan.id,
          nama: data.nama,
          nim: data.nim,
          status: data.status
        }
      })
    )



    const bimbinganIds = bimbingan_id.split(",").map(id => id.trim()); // Mengubah string menjadi array dan membersihkan spasi

    const updateBimbinganPromises = bimbinganIds.map(async (id) => {
      return prisma.bimbingan.update({
        where: { id: Number(id) }, // Mengonversi id menjadi angka
        data: { laporan_bimbingan_id: laporanBimbingan.id },
      });
    });

    // Menunggu semua promise selesai
    await Promise.all(updateBimbinganPromises);

    return new Response(
      JSON.stringify({
        message: 'Laporan bimbingan berhasil dibuat dan bimbingan diperbarui',
        laporanBimbingan,
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );

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

    const { id, feedback_kaprodi, status, kaprodi_id, dosen_pa_id } = body;

    if (!id || !feedback_kaprodi || !status) {
      return new Response(
        JSON.stringify({ message: 'Invalid data' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const existingRecord = await prisma.laporanbimbingan.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      throw new Error('Record not found');
    }

    const notifikasiKaprodi: NotifikasiKaprodi = {
      kaprodi_id,
      isi: "Berhasil memberikan feedback laporan bimbingan!",
      read: false,
      waktu: new Date(),
    };

    await prisma.notifikasikaprodi.create({ data: notifikasiKaprodi });

    const notifikasiDosenPA: NotifikasiDosenPA = {
      dosen_pa_id,
      isi: "Feedback laporan bimbingan sudah diterima!",
      read: false,
      waktu: new Date(),
    };

    await prisma.notifikasidosenpa.create({ data: notifikasiDosenPA });

    const laporanBimbingan = await prisma.laporanbimbingan.update({
      where: { id },
      data: { feedback_kaprodi, status },
    });

    return new Response(JSON.stringify(laporanBimbingan), {
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
