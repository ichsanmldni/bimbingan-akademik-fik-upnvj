// /app/api/datadosen/route.js
import prisma from '../../../lib/prisma';

export async function GET(req) {
  try {
    // Mengambil data dosen dari database
    const PengajuanBimbingan = await prisma.pengajuanbimbingan.findMany(
    );
    
    // Mengembalikan data dosen sebagai JSON
    return new Response(JSON.stringify(PengajuanBimbingan), {
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
  
        const { nama_lengkap, nim, email, no_whatsapp, jadwal_bimbingan, jenis_bimbingan, sistem_bimbingan, status, dosen_pa_id, mahasiswa_id} = body;
  
        if (!nama_lengkap || !nim || !email || !no_whatsapp || !jadwal_bimbingan || !jenis_bimbingan || !sistem_bimbingan || !status || !dosen_pa_id || !mahasiswa_id) {
          return new Response(
            JSON.stringify({ message: 'All fields are required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
  
        const PengajuanBimbingan = await prisma.pengajuanbimbingan.create({
          data : {
            nama_lengkap, nim, email, no_whatsapp, jadwal_bimbingan, jenis_bimbingan, sistem_bimbingan, status, dosen_pa_id, mahasiswa_id
          }
      });
        
      const NotifikasiMahasiswa = await prisma.notifikasimahasiswa.create({
          data : {
            mahasiswa_id, isi: "Pengajuan bimbinganmu berhasil!", read: false, waktu: new Date()
          }
      });
      
      const NotifikasiDosenPA = await prisma.notifikasidosenpa.create({
          data : {
            dosen_pa_id, isi: "Ada pengajuan bimbingan baru!", read: false, waktu: new Date()
          }
      });
      return new Response(JSON.stringify(PengajuanBimbingan), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
      
      
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
  
      const {id, status, keterangan, mahasiswa_id, dosen_pa_id} = body;
      
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

      if(status==="Reschedule"){
        const NotifikasiMahasiswa = await prisma.notifikasimahasiswa.create({
          data : {
            mahasiswa_id, isi: "Pengajuan bimbinganmu direschedule!", read: false, waktu: new Date()
          }
      });

      const NotifikasiDosenPA = await prisma.notifikasidosenpa.create({
        data : {
          dosen_pa_id, isi: "Berhasil reschedule pengajuan bimbingan!", read: false, waktu: new Date()
        }
    });
      } else if(status === "Diterima"){
        const NotifikasiMahasiswa = await prisma.notifikasimahasiswa.create({
          data : {
            mahasiswa_id, isi: "Pengajuan bimbinganmu berhasil diterima!", read: false, waktu: new Date()
          }
      });
        
      
      const NotifikasiDosenPA = await prisma.notifikasidosenpa.create({
          data : {
            dosen_pa_id, isi: "Berhasil menerima pengajuan bimbingan!", read: false, waktu: new Date()
          }
      });
      }
    
      
      const PengajuanBimbingan = await prisma.pengajuanbimbingan.update({ where: { id }, data: { status, keterangan } })
  
      return new Response(JSON.stringify(PengajuanBimbingan), {
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