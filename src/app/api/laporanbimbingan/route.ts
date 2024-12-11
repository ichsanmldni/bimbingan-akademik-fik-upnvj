// /app/api/datadosen/route.js
import prisma from '../../../lib/prisma';

export async function GET(req) {
  try {
    // Mengambil data dosen dari database
    const LaporanBimbingan = await prisma.laporanBimbingan.findMany(
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

      const { nama_mahasiswa, waktu_bimbingan, kaprodi_id, status, kendala_mahasiswa, solusi, kesimpulan, dokumentasi, jenis_bimbingan, sistem_bimbingan, dosen_pa_id, bimbingan_id} = body;

      if (!bimbingan_id || !nama_mahasiswa || !waktu_bimbingan || !kaprodi_id || !kendala_mahasiswa || !solusi || !kesimpulan || !jenis_bimbingan || !status || !sistem_bimbingan || !dosen_pa_id) {
        return new Response(
          JSON.stringify({ message: 'All fields are required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }


      const LaporanBimbingan = await prisma.laporanBimbingan.create({
        data : {
          nama_mahasiswa, waktu_bimbingan, status, kaprodi_id, kendala_mahasiswa, solusi, kesimpulan, dokumentasi: dokumentasi || null, jenis_bimbingan, sistem_bimbingan, dosen_pa_id
        }
    });

    const UpdateBimbingan = await prisma.bimbingan.update({
      where: { id: bimbingan_id },
      data: { laporan_bimbingan_id: LaporanBimbingan.id },
    });

    return new Response(
      JSON.stringify({
        message: 'Laporan bimbingan berhasil dibuat dan bimbingan diperbarui',
        LaporanBimbingan,
        UpdateBimbingan,
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
