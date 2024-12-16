// /app/api/datadosen/route.js
import prisma from '../../../lib/prisma';

export async function GET(req) {
  try {
    // Mengambil data dosen dari database
    const LaporanBimbingan = await prisma.laporanbimbingan.findMany({
      include: {
        dosen_pa: true
      }
    }
    );
    
    // Mengembalikan data dosen sebagai JSON
    return new Response(JSON.stringify(LaporanBimbingan), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // Menangani kesalahan
    return new Response(
      JSON.stringify({ message: 'Something went wrong', error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    console.log(body)

      const { nama_mahasiswa, waktu_bimbingan, kaprodi_id, status, kendala_mahasiswa, solusi, kesimpulan, dokumentasi, jenis_bimbingan, sistem_bimbingan, dosen_pa_id, bimbingan_id, nama_dosen_pa} = body;

      if (!bimbingan_id || !nama_mahasiswa || !waktu_bimbingan || !kaprodi_id || !kendala_mahasiswa || !solusi || !kesimpulan || !jenis_bimbingan || !status || !sistem_bimbingan || !dosen_pa_id || !nama_dosen_pa) {
        return new Response(
          JSON.stringify({ message: 'All fields are required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }


      const LaporanBimbingan = await prisma.laporanbimbingan.create({
        data : {
          nama_mahasiswa, jumlah_mahasiswa: bimbingan_id.split(",").map(id => id.trim()).length, waktu_bimbingan, status, kaprodi_id, kendala_mahasiswa, solusi, kesimpulan, dokumentasi: dokumentasi || null, jenis_bimbingan, sistem_bimbingan, dosen_pa_id, nama_dosen_pa
        }
    });
    const bimbinganIds = bimbingan_id.split(",").map(id => id.trim()); // Mengubah string menjadi array dan membersihkan spasi

    const updateBimbinganPromises = bimbinganIds.map(async (id) => {
      return prisma.bimbingan.update({
        where: { id: Number(id) }, // Mengonversi id menjadi angka
        data: { laporan_bimbingan_id: LaporanBimbingan.id },
      });
    });
    
    // Menunggu semua promise selesai
    await Promise.all(updateBimbinganPromises);

    return new Response(
      JSON.stringify({
        message: 'Laporan bimbingan berhasil dibuat dan bimbingan diperbarui',
        LaporanBimbingan,
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
    
    
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Something went wrong', error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function PATCH(req) {
  try {
    const body = await req.json();

    const {id, feedback_kaprodi, status} = body;
    
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
    
    const LaporanBimbingan = await prisma.laporanbimbingan.update({ where: { id }, data: { feedback_kaprodi, status } })

    return new Response(JSON.stringify(LaporanBimbingan), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    
    
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Something went wrong', error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
