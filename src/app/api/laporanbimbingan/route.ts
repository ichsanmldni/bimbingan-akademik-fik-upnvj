import fs from 'fs/promises';
import path from 'path';
import prisma from '../../../lib/prisma';

export async function GET(req: Request): Promise<Response> {
  try {
    const laporanBimbingan = await prisma.laporanbimbingan.findMany({
      include: {
        dosen_pa: true,
      },
    });

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
      bimbingan_id,
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

    if (jenis_bimbingan === "Perwalian") {
      const jumlahPeserta = parseInt(bimbingan_id.split(",").map((id: any) => id.trim()).length)
      const jumlahKeteranganIPK = jumlah_ipk_a + jumlah_ipk_b + jumlah_ipk_c + jumlah_ipk_d + jumlah_ipk_e
      const jumlahPrestasiBeasiswa = jumlah_beasiswa_bbm + jumlah_beasiswa_pegadaian + jumlah_beasiswa_ppa + jumlah_beasiswa_supersemar + jumlah_beasiswa_ykl + jumlah_beasiswa_dll

      const differenceIPK = jumlahKeteranganIPK - jumlahPeserta;
      const differenceBeasiswa = jumlahPrestasiBeasiswa - jumlahPeserta;

      if (!tahun_ajaran && !semester && !nama_kaprodi && !kaprodi_id && !pendahuluan && !jumlah_ipk_a && !jumlah_ipk_b && !jumlah_ipk_c && !jumlah_ipk_d && !jumlah_ipk_e && !jumlah_beasiswa_bbm && !jumlah_beasiswa_pegadaian && !jumlah_beasiswa_supersemar && !jumlah_beasiswa_ppa && !jumlah_beasiswa_ykl && !jumlah_beasiswa_dll && !prestasi_ilmiah_mahasiswa && !prestasi_porseni_mahasiswa && !kesimpulan && !data_status_mahasiswa && !dokumentasi && !tanda_tangan_dosen_pa) {
        return new Response(
          JSON.stringify({ message: 'Semua kolom harus diisi!' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      } else if (!tahun_ajaran) {
        return new Response(
          JSON.stringify({ message: 'Kolom tahun ajaran harus diisi!' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      } else if (!semester) {
        return new Response(
          JSON.stringify({ message: 'Kolom semester harus diisi!' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      } else if (!nama_kaprodi) {
        return new Response(
          JSON.stringify({ message: 'Kolom kaprodi harus diisi!' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      } else if (!pendahuluan || pendahuluan.length === 0) {
        return new Response(
          JSON.stringify({ message: 'Kolom pendahuluan harus diisi!' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      } else if (jumlahPeserta !== jumlahKeteranganIPK) {
        const message = differenceIPK > 0
          ? `Jumlah keterangan IPK mahasiswa melebihi jumlah peserta bimbingan sebanyak ${differenceIPK} data. Silakan sesuaikan.`
          : `Jumlah keterangan IPK mahasiswa kurang dari jumlah peserta bimbingan sebanyak ${Math.abs(differenceIPK)} data. Harap tambahkan data yang belum lengkap.`;
        return new Response(
          JSON.stringify({ message }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      else if (jumlahPeserta < jumlahPrestasiBeasiswa) {
        const message = `Jumlah mahasiswa yang mendapatkan beasiswa melebihi jumlah peserta bimbingan sebanyak ${differenceBeasiswa} data. Silakan cek ulang!`
        return new Response(
          JSON.stringify({ message }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      else if (jumlah_ipk_a == null || jumlah_ipk_b == null || jumlah_ipk_c == null || jumlah_ipk_d == null || jumlah_ipk_e == null || jumlah_ipk_a === "" || jumlah_ipk_b === "" || jumlah_ipk_c === "" || jumlah_ipk_d === "" || jumlah_ipk_e === "") {
        return new Response(
          JSON.stringify({ message: 'Semua kolom prestasi akademik mahasiswa harus diisi!' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      } else if (jumlah_ipk_a < 0 || jumlah_ipk_b < 0 || jumlah_ipk_c < 0 || jumlah_ipk_d < 0 || jumlah_ipk_e < 0) {
        return new Response(
          JSON.stringify({ message: 'Salah satu kolom prestasi akademik mahasiswa bernilai < 0!' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      } else if (jumlah_beasiswa_bbm == null || jumlah_beasiswa_pegadaian == null || jumlah_beasiswa_supersemar == null || jumlah_beasiswa_ppa == null || jumlah_beasiswa_ykl == null || jumlah_beasiswa_dll == null || jumlah_beasiswa_bbm === "" || jumlah_beasiswa_pegadaian === "" || jumlah_beasiswa_supersemar === "" || jumlah_beasiswa_ppa === "" || jumlah_beasiswa_ykl === "" || jumlah_beasiswa_dll === "") {
        return new Response(
          JSON.stringify({ message: 'Semua kolom prestasi mahasiswa mendapatkan beasiswa harus diisi!' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      } else if (jumlah_beasiswa_bbm < 0 || jumlah_beasiswa_pegadaian < 0 || jumlah_beasiswa_supersemar < 0 || jumlah_beasiswa_ppa < 0 || jumlah_beasiswa_ykl < 0 || jumlah_beasiswa_dll < 0) {
        return new Response(
          JSON.stringify({ message: 'Salah satu kolom prestasi mahasiswa mendapatkan beasiswa bernilai < 0!' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      } else if (!kesimpulan || kesimpulan.length === 0) {
        return new Response(
          JSON.stringify({ message: 'Kolom kesimpulan harus diisi!' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      } else if (!dokumentasi) {
        return new Response(
          JSON.stringify({ message: 'Dokumentasi bimbingan harus diisi!' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      } else if (!tanda_tangan_dosen_pa) {
        return new Response(
          JSON.stringify({ message: 'Wajib menandatangani laporan!' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
    if (jenis_bimbingan === "Pribadi") {

      if (!tahun_ajaran && !semester && !nama_kaprodi && !kaprodi_id && !dokumentasi && !tanda_tangan_dosen_pa) {
        return new Response(
          JSON.stringify({ message: 'Semua kolom harus diisi!' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      } else if (!tahun_ajaran) {
        return new Response(
          JSON.stringify({ message: 'Kolom tahun ajaran harus diisi!' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      } else if (!semester) {
        return new Response(
          JSON.stringify({ message: 'Kolom semester harus diisi!' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      } else if (!nama_kaprodi) {
        return new Response(
          JSON.stringify({ message: 'Kolom kaprodi harus diisi!' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      } else if (!dokumentasi) {
        return new Response(
          JSON.stringify({ message: 'Dokumentasi bimbingan harus diisi!' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      } else if (!tanda_tangan_dosen_pa) {
        return new Response(
          JSON.stringify({ message: 'Wajib menandatangani laporan!' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    let savedTtdImagePaths: string[] = [];
    if (tanda_tangan_dosen_pa) {
      const base64Strings = tanda_tangan_dosen_pa.split(", ").map((str: any) => str.trim());
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

    const notifikasiKaprodi: any = {
      kaprodi_id,
      isi: `Laporan bimbingan baru dari Dosen ${nama_dosen_pa} telah diterima. Mohon segera ditinjau dan berikan feedback Anda!`,
      read: false,
      waktu: new Date(),
    };

    await prisma.notifikasikaprodi.create({ data: notifikasiKaprodi });

    let laporanBimbingan: any
    if (jenis_bimbingan === "Perwalian") {
      laporanBimbingan = await prisma.laporanbimbingan.create({
        data: {
          jumlah_mahasiswa: parseInt(bimbingan_id.split(",").map((id: any) => id.trim()).length),
          status,
          nama_kaprodi,
          kaprodi_id,
          dosen_pa_id,
          nama_dosen_pa,
          jenis_bimbingan,
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
          dokumentasi,
          tanda_tangan_dosen_pa: savedTtdImagePathsString,
          jadwal_bimbingan
        },
      });
      prestasi_ilmiah_mahasiswa?.map(async (data: any) =>
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
      prestasi_porseni_mahasiswa?.map(async (data: any) =>
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
      data_status_mahasiswa?.map(async (data: any) =>
        await prisma.datastatusmahasiswa.create({
          data: {
            laporan_bimbingan_id: laporanBimbingan.id,
            nama: data.nama,
            nim: data.nim,
            status: data.status
          }
        })
      )
    } else if (jenis_bimbingan === "Pribadi") {
      laporanBimbingan = await prisma.laporanbimbingan.create({
        data: {
          jumlah_mahasiswa: parseInt(bimbingan_id.split(",").map((id: any) => id.trim()).length),
          status,
          nama_kaprodi,
          kaprodi_id,
          dosen_pa_id,
          nama_dosen_pa,
          jenis_bimbingan,
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
          dokumentasi,
          tanda_tangan_dosen_pa: savedTtdImagePathsString,
          jadwal_bimbingan
        },
      });
    }



    const bimbinganIds = bimbingan_id.split(",").map((id: any) => id.trim()); // Mengubah string menjadi array dan membersihkan spasi

    const updateBimbinganPromises = bimbinganIds.map(async (id: any) => {
      return prisma.bimbingan.update({
        where: { id: Number(id) }, // Mengonversi id menjadi angka
        data: { laporan_bimbingan_id: laporanBimbingan.id },
      });
    });

    // Menunggu semua promise selesai
    await Promise.all(updateBimbinganPromises);

    const responsePayload = {
      status: "success",
      message: "Laporan bimbingan telah berhasil dibuat!",
      data: laporanBimbingan,
    };

    return new Response(
      JSON.stringify(responsePayload),
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

    if (!id || !status) {
      return new Response(
        JSON.stringify({ message: 'Invalid data' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (!feedback_kaprodi) {
      return new Response(
        JSON.stringify({ message: 'Kolom feedback wajib diisi!' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const existingRecord = await prisma.laporanbimbingan.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      throw new Error('Record not found');
    }

    const notifikasiDosenPA: any = {
      dosen_pa_id,
      isi: `Laporan bimbingan Anda yang dilaksanakan pada ${existingRecord.jadwal_bimbingan} kini telah mendapatkan feedback dari Kaprodi ${existingRecord.nama_kaprodi}. Silakan cek!`,
      read: false,
      waktu: new Date(),
    };

    await prisma.notifikasidosenpa.create({ data: notifikasiDosenPA });

    const laporanBimbingan = await prisma.laporanbimbingan.update({
      where: { id },
      data: { feedback_kaprodi, status },
    });

    const responsePayload = {
      status: "success",
      message: "Feedback Kaprodi pada laporan ini telah berhasil dibuat!",
      data: laporanBimbingan,
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
