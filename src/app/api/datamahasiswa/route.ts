import fs from 'fs/promises';
import path from 'path';
import prisma from '../../../lib/prisma';

export async function GET(req) {
  try {
    // Mengambil data dosen dari database
    const Mahasiswa = await prisma.mahasiswa.findMany();
    
    // Mengembalikan data dosen sebagai JSON
    return new Response(JSON.stringify(Mahasiswa), {
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

export async function PATCH(req) {
  try {
    const body = await req.json();

    const {
      id,
      nama_lengkap,
      email,
      nim,
      no_whatsapp,
      jurusan,
      peminatan,
      dosen_pa_id,
      profile_image,
    } = body;

    // Validasi input
    if (!id || !nama_lengkap || !email || !nim || !no_whatsapp || !jurusan || !peminatan || !dosen_pa_id) {
      return new Response(
        JSON.stringify({ message: 'Invalid data' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Cek jika record ada di database
    const existingRecord = await prisma.mahasiswa.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      throw new Error('Record not found');
    }

    // Buat direktori jika belum ada
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profile_pictures');
    await fs.mkdir(uploadDir, { recursive: true }); // Membuat folder secara rekursif

    // Simpan gambar jika ada
    let savedImagePath = existingRecord.profile_image; // Gunakan gambar lama jika tidak diupdate
    if (profile_image) {
      const base64Data = profile_image.replace(/^data:image\/\w+;base64,/, '');
      const imageBuffer = Buffer.from(base64Data, 'base64');

      const filename = `profile_${id}_${Date.now()}.jpg`;
      savedImagePath = path.join('uploads', 'profile_pictures', filename); // Path relatif

      if (existingRecord.profile_image) {
        const oldImagePath = path.join(process.cwd(), 'public', existingRecord.profile_image);
        try {
          await fs.unlink(oldImagePath); // Menghapus gambar lama
        } catch (err) {
          console.error('Failed to delete old image:', err);
        }
      }

      await fs.writeFile(path.join(process.cwd(), 'public', savedImagePath), imageBuffer); // Simpan gambar di folder public
    }

    // Update data di database
    const Mahasiswa = await prisma.mahasiswa.update({
      where: { id },
      data: {
        nama_lengkap,
        email,
        nim,
        no_whatsapp,
        jurusan,
        peminatan,
        dosen_pa_id,
        profile_image: savedImagePath, // Simpan path relatif di DB
      },
    });

    return new Response(JSON.stringify(Mahasiswa), {
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


