// /app/api/datadosen/route.js
import prisma from '../../../../lib/prisma';

import bcrypt from 'bcrypt';

export async function POST(req) {
    try {
      // Mendapatkan body dari request
      const body = await req.json();

      if(body.role==="Mahasiswa"){
        const { nama_lengkap, email, password, nim, jurusan, peminatan, no_whatsapp, nama_dosen_PA, profile_image} = body;

        if (!nama_lengkap || !email || !password || !nim || !jurusan || !peminatan || !no_whatsapp || !nama_dosen_PA) {
          return new Response(
            JSON.stringify({ message: 'All fields are required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }

        const dosenpa = await prisma.dosenPA.findFirst({
          where: {
            dosen: {
              nama_lengkap: nama_dosen_PA,
            },
          },
          include: {
            dosen: true,
          },
        });

        const hashedPassword = await bcrypt.hash(password, 10);
        const mahasiswa = await prisma.mahasiswa.create({
          data : {
            nama_lengkap,
            dosen_pa_id: dosenpa?.id,
            email,
            password: hashedPassword,
            nim,
            no_whatsapp,
            jurusan,
            peminatan,
            profile_image
          }
      });
      return new Response(JSON.stringify(mahasiswa), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
      } else if(body.role==="Dosen"){
        const { nama_lengkap, email, password, nip, profile_image, no_whatsapp } = body;
        if (!nama_lengkap || !email || !password || !nip || !no_whatsapp) {
          return new Response(
            JSON.stringify({ message: 'All fields are required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const dosen = await prisma.dosen.create({
          data : {
            nama_lengkap,
            email,
            password: hashedPassword,
            nip,
            no_whatsapp,
            profile_image
          }
      });
      return new Response(JSON.stringify(dosen), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
      }
      
    } catch (error) {
      return new Response(
        JSON.stringify({ message: 'Something went wrong', error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
