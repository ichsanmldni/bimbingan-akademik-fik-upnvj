// /app/api/datadosen/route.ts
import prisma from '../../../../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from 'process';
import { serialize } from 'cookie';
import axios, { Axios } from 'axios';
import FormData from 'form-data';

function convertTimeToSeconds(timeString: string): number {
  const match = timeString.match(/(\d+)(h|m|s)/);

  if (!match) {
    throw new Error('Invalid time format. Please use a format like "2h", "30m", or "15s".');
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case 'h':
      return value * 3600;
    case 'm':
      return value * 60;
    case 's':
      return value;
    default:
      throw new Error('Invalid time unit. Use "h", "m", or "s".');
  }
}

const SECRET_KEY = env.JWT_SECRET as string;
const JWT_EXPIRED = env.JWT_EXPIRED as string;

if (!JWT_EXPIRED) {
  throw new Error('JWT_EXPIRED environment variable is not set.');
}

const EXPIRED_TIME = convertTimeToSeconds(JWT_EXPIRED);

export async function POST(req: Request): Promise<Response> {
  try {
    const body: any = await req.json();

    const { nim, nip, email, password, role } = body;

    if (!role || !password || (role === "Mahasiswa" && !nim) || (role === "Dosen PA" && !nip) || (role === "Kaprodi" && !nip)) {
      return new Response(
        JSON.stringify({ message: 'Role, NIM/NIP, dan Password tidak boleh kosong!' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (!role || !password || (role === "Admin" && !email)) {
      return new Response(
        JSON.stringify({ message: 'Email tidak boleh kosong!' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let user: any | null;

    if (role === 'Mahasiswa') {
      const authHeader = {
        BASIC_AUTH_USERNAME: env.BASIC_AUTH_USERNAME,
        BASIC_AUTH_PASSWORD: env.BASIC_AUTH_PASSWORD
      };

      const API_KEY_NAME = env.API_KEY_NAME;
      const API_KEY_SECRET = env.API_KEY_SECRET;

      const authString = `${authHeader.BASIC_AUTH_USERNAME}:${authHeader.BASIC_AUTH_PASSWORD}`;
      const base64AuthString = Buffer.from(authString).toString('base64');

      const headers = {
        'Authorization': `Basic ${base64AuthString}`,
        'API-KEY-NAME': API_KEY_NAME,
        'API-KEY-SECRET': API_KEY_SECRET,
        // No need to set 'Content-Type' here; axios will handle it for FormData  
      };

      const url = 'https://api.upnvj.ac.id/data/auth_mahasiswa';

      // Create a FormData object  
      const formData = new FormData();
      formData.append('username', nim); // Ensure nim is defined  
      formData.append('password', password); // Ensure password is defined 

      const formHeaders = formData.getHeaders();
      const combinedHeaders = { ...headers, ...formHeaders };

      try {
        const response = await axios.post(url, formData, { headers: combinedHeaders });
        if (response.data.data.nim) {
          user = response.data.data;
          const mahasiswa = await prisma.mahasiswa.findUnique({
            where: { nim: user.nim },
          });

          if (!mahasiswa) {
            try {
              const newMahasiswa = await prisma.mahasiswa.create({
                data: {
                  profile_image: null,
                  nama: user?.nama,
                  email: user?.email,
                  nim: user?.nim,
                  hp: user?.hp,
                  jurusan: user?.nama_program_studi,
                  peminatan: null,
                  dosen_pa_id: null,
                  ipk: null
                },
              });
            } catch (prismaError) {
              console.error('Prisma error:', prismaError);
              // Simpan pesan kesalahan Prisma ke dalam variabel  
              const prismaErrorMessage = (prismaError as Error).message || 'Gagal membuat mahasiswa!';
              return new Response(JSON.stringify({ message: prismaErrorMessage }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
              });
            }
          }

          const token = jwt.sign(
            {
              nim: user.nim,
              nama: user.nama,
              angkatan: user.angkatan,
              status: user.status,
              nama_program_studi: user.nama_program_studi,
              email: user.email,
              hp: user.hp,
              role,
            },
            SECRET_KEY,
            { expiresIn: EXPIRED_TIME }
          );

          const cookie = serialize('authToken', token, {
            secure: process.env.NODE_ENV === 'production',
            maxAge: parseInt(EXPIRED_TIME.toString()),
            path: '/',
          });

          return new Response(
            JSON.stringify({ message: 'Login berhasil!', user }),
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
                'Set-Cookie': cookie,
              },
            }
          );
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          return new Response(JSON.stringify({ message: error.response?.data.message || 'Login gagal!' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        } else {
          console.error('General error:', error);
          return new Response(JSON.stringify({ message: (error as Error).message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }
    }
    else if (role === 'Dosen PA') {
      user = await prisma.dosenpa.findUnique({ where: { nip } });

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return new Response(
          JSON.stringify({ message: 'Password salah!' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (!user) {
        return new Response(
          JSON.stringify({ message: 'Masukkan NIP dengan benar!' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const token = jwt.sign(
        {
          role,
          email: user.email,
          hp: user.hp,
          nama: user.nama,
          nip: user.nip,
        },
        SECRET_KEY,
        { expiresIn: EXPIRED_TIME }
      );

      const cookie = serialize('authToken', token, {
        secure: process.env.NODE_ENV === 'production',
        maxAge: parseInt(EXPIRED_TIME.toString()),
        path: '/',
      });

      return new Response(
        JSON.stringify({ message: 'Login berhasil!', user }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': cookie,
          },
        }
      );
    } else if (role === 'Kaprodi') {
      user = await prisma.kaprodi.findUnique({ where: { nip } });

      if (!user) {
        return new Response(
          JSON.stringify({ message: 'Masukkan NIP dengan benar!' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Memeriksa kecocokan password  
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return new Response(
          JSON.stringify({ message: 'Password salah!' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (user.kaprodi_jurusan === null) {
        const authHeader = {
          BASIC_AUTH_USERNAME: env.BASIC_AUTH_USERNAME,
          BASIC_AUTH_PASSWORD: env.BASIC_AUTH_PASSWORD
        };

        const API_KEY_NAME = env.API_KEY_NAME;
        const API_KEY_SECRET = env.API_KEY_SECRET;

        const authString = `${authHeader.BASIC_AUTH_USERNAME}:${authHeader.BASIC_AUTH_PASSWORD}`;
        const base64AuthString = Buffer.from(authString).toString('base64');

        const headers = {
          'Authorization': `Basic ${base64AuthString}`,
          'API-KEY-NAME': API_KEY_NAME,
          'API-KEY-SECRET': API_KEY_SECRET,
        };

        const url = 'https://api.upnvj.ac.id/data/ref_program_studi';

        const formData = new FormData();

        const formHeaders = formData.getHeaders();
        const combinedHeaders = { ...headers, ...formHeaders };

        const response = await axios.post(url, formData, { headers: combinedHeaders });

        const filteredJurusan = response.data.data.filter((data: any) => data.nama_fakultas === 'Fakultas Ilmu Komputer');
        const matchingJurusan = filteredJurusan.find((data: any) => data.nidn_dosen_ketua_prodi === user.nip);
        const namaJurusan = matchingJurusan.nama_program_studi;

        await prisma.kaprodi.update({
          where: { nip: user.nip },
          data: { kaprodi_jurusan: namaJurusan },
        });

        try {
          const token = jwt.sign(
            {
              role: 'Kaprodi',
              email: user.email,
              hp: user.hp,
              nama: user.nama,
              nip: user.nip,
              kaprodi_jurusan: namaJurusan,
            },
            SECRET_KEY,
            { expiresIn: EXPIRED_TIME }
          );

          // Membuat cookie untuk token  
          const cookie = serialize('authToken', token, {
            secure: process.env.NODE_ENV === 'production',
            maxAge: parseInt(EXPIRED_TIME.toString()),
            path: '/',
          });

          return new Response(
            JSON.stringify({ message: 'Login berhasil!' }),
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
                'Set-Cookie': cookie,
              },
            }
          );
        } catch (error) {
          console.error('Error fetching data from UPNVJ API:', error);
          return new Response(
            JSON.stringify({ message: 'Gagal mengambil data dari API UPNVJ' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }

      try {
        const token = jwt.sign(
          {
            role: 'Kaprodi',
            email: user.email,
            hp: user.hp,
            nama: user.nama,
            nip: user.nip,
            kaprodi_jurusan: user.kaprodi_jurusan,
          },
          SECRET_KEY,
          { expiresIn: EXPIRED_TIME }
        );

        // Membuat cookie untuk token  
        const cookie = serialize('authToken', token, {
          secure: process.env.NODE_ENV === 'production',
          maxAge: parseInt(EXPIRED_TIME.toString()),
          path: '/',
        });

        return new Response(
          JSON.stringify({ message: 'Login berhasil!' }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Set-Cookie': cookie,
            },
          }
        );
      } catch (error) {
        console.error('Error fetching data from UPNVJ API:', error);
        return new Response(
          JSON.stringify({ message: 'Gagal mengambil data dari API UPNVJ' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    } else if (role === 'Admin') {
      user = await prisma.admin.findUnique({ where: { email } });
      if (!user) {
        return new Response(
          JSON.stringify({ message: 'Masukkan Email dengan benar!' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return new Response(
          JSON.stringify({ message: 'Password salah!' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const token = jwt.sign(
        {
          role,
          email: user.email,
          username: user.nickname
        },
        SECRET_KEY,
        { expiresIn: EXPIRED_TIME }
      );

      const cookie = serialize('authToken', token, {
        secure: process.env.NODE_ENV === 'production',
        maxAge: parseInt(EXPIRED_TIME.toString()),
        path: '/',
      });

      return new Response(
        JSON.stringify({ message: 'Login berhasil!', user }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': cookie,
          },
        }
      );
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
