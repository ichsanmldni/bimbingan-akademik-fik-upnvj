import fs from 'fs/promises';
import path from 'path';
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

      const { nama_mahasiswa, waktu_bimbingan, kaprodi_id, status, kendala_mahasiswa, solusi, kesimpulan, dokumentasi, jenis_bimbingan, sistem_bimbingan, dosen_pa_id, bimbingan_id, nama_dosen_pa} = body;

      if (!bimbingan_id || !nama_mahasiswa || !waktu_bimbingan || !kaprodi_id || !kendala_mahasiswa || !solusi || !kesimpulan || !jenis_bimbingan || !status || !sistem_bimbingan || !dosen_pa_id || !nama_dosen_pa) {
        return new Response(
          JSON.stringify({ message: 'All fields are required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Buat direktori jika belum ada
          const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'dokumentasi_laporan');
          await fs.mkdir(uploadDir, { recursive: true }); // Membuat folder secara rekursif
          
          let savedImagePaths = [];
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
                savedImagePaths.push(relativePath);
              } catch (error) {
                console.error("Error menyimpan gambar: ", error.message);
              }
            }
          }
          const savedImagePathsString = savedImagePaths.join(", ");

          const NotifikasiKaprodi = await prisma.notifikasikaprodi.create({
            data : {
              kaprodi_id, isi: "Laporan bimbingan baru diterima!", read: false, waktu: new Date()
            }
        });
          
        
        const NotifikasiDosenPA = await prisma.notifikasidosenpa.create({
            data : {
              dosen_pa_id, isi: "Berhasil membuat laporan bimbingan!", read: false, waktu: new Date()
            }
        });


      const LaporanBimbingan = await prisma.laporanbimbingan.create({
        data : {
          nama_mahasiswa, jumlah_mahasiswa: bimbingan_id.split(",").map(id => id.trim()).length, waktu_bimbingan, status, kaprodi_id, kendala_mahasiswa, solusi, kesimpulan, dokumentasi: savedImagePathsString || null, jenis_bimbingan, sistem_bimbingan, dosen_pa_id, nama_dosen_pa
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

    const {id, feedback_kaprodi, status, kaprodi_id, dosen_pa_id} = body;
    
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

    const NotifikasiKaprodi = await prisma.notifikasikaprodi.create({
      data : {
        kaprodi_id, isi: "Berhasil memberikan feedback laporan bimbingan!", read: false, waktu: new Date()
      }
  });
    
  
  const NotifikasiDosenPA = await prisma.notifikasidosenpa.create({
      data : {
        dosen_pa_id, isi: "Feedback laporan bimbingan sudah diterima!", read: false, waktu: new Date()
      }
  });
    
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
