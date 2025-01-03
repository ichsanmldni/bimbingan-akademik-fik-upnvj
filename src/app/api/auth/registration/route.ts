// /app/api/datadosen/route.ts
import prisma from '../../../../lib/prisma';
import bcrypt from 'bcrypt';

interface MahasiswaRequestBody {
  role: 'Mahasiswa';
  nama_lengkap: string;
  email: string;
  password: string;
  nim: string;
  jurusan: string;
  peminatan: string;
  no_whatsapp: string;
  nama_dosen_PA: string;
  profile_image?: string;
}

interface DosenRequestBody {
  role: 'Dosen';
  nama_lengkap: string;
  email: string;
  password: string;
  nip: string;
  no_whatsapp: string;
  profile_image?: string;
}

type RequestBody = MahasiswaRequestBody | DosenRequestBody;

export async function POST(req: Request): Promise<Response> {
  try {
    // Get the body from the request
    const body: RequestBody = await req.json();

    if (body.role === "Mahasiswa") {
      const { nama_lengkap, email, password, nim, jurusan, peminatan, no_whatsapp, nama_dosen_PA, profile_image } = body;

      if (!nama_lengkap || !email || !password || !nim || !jurusan || !peminatan || !no_whatsapp || !nama_dosen_PA) {
        return new Response(
          JSON.stringify({ message: 'All fields are required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const dosenpa = await prisma.dosenpa.findFirst({
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
        data: {
          nama_lengkap,
          dosen_pa_id: dosenpa?.id,
          email,
          password: hashedPassword,
          nim,
          no_whatsapp,
          jurusan,
          peminatan,
          profile_image,
        },
      });

      return new Response(JSON.stringify(mahasiswa), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    } else if (body.role === "Dosen") {
      const { nama_lengkap, email, password, nip, profile_image, no_whatsapp } = body;

      if (!nama_lengkap || !email || !password || !nip || !no_whatsapp) {
        return new Response(
          JSON.stringify({ message: 'All fields are required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const dosen = await prisma.dosen.create({
        data: {
          nama_lengkap,
          email,
          password: hashedPassword,
          nip,
          no_whatsapp,
          profile_image,
        },
      });

      return new Response(JSON.stringify(dosen), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(
        JSON.stringify({ message: 'Invalid role' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Something went wrong', error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
