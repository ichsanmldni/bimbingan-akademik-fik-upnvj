import fs from 'fs/promises';
import path from 'path';
import prisma from '../../../lib/prisma';

export async function GET(req) {
  try {
    // Mengambil data dosen dari database
    const Dosen = await prisma.dosen.findMany();
    
    // Mengembalikan data dosen sebagai JSON
    return new Response(JSON.stringify(Dosen), {
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

    const {id, nama_lengkap, email, nip, no_whatsapp, profile_image} = body;
    
    if (!id || !nama_lengkap || !email || !nip || !no_whatsapp) {
      return new Response(
        JSON.stringify({ message: 'Invalid data' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const existingRecord = await prisma.dosen.findUnique({
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
    
    const Dosen = await prisma.dosen.update({ where: { id }, data: { nama_lengkap, email, nip, no_whatsapp, profile_image: savedImagePath } })

    return new Response(JSON.stringify(Dosen), {
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
