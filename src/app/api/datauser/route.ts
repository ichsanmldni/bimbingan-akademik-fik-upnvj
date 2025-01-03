// /app/api/datadosen/route.ts
import prisma from '../../../lib/prisma';

interface Mahasiswa {
  id: number; // Adjust type according to your schema
  dosen_pa_id: number | null;
  nama_lengkap: string; // Adjust type according to your schema
  nim: string;
  email: string;
  no_whatsapp: string;
  password: string;
  peminatan: string;
  jurusan: string;
  profile_image: string | null;
  // Add other fields as necessary
}

interface Dosen {
  id: number; // Assuming this is a number; adjust if needed
  nama_lengkap: string; // Change this to match your data structure
  email: string; // Add other fields as necessary
  no_whatsapp: string; // Add other fields as necessary
  password: string; // If you want to include this, otherwise remove it
  nip: string; // Add other fields as necessary
  profile_image: string | null; // Adjust type according to your schema
  role: string
}

interface User {
  id: number; // Adjust type according to your schema
  email: string; // Adjust type according to your schema
  password: string; // If you want to include this, otherwise remove it
  nama_lengkap: string; // Change this to match your data structure
  profile_image: string | null; // Adjust type according to your schema
  no_whatsapp: string; // Adjust type according to your schema
  role: string; // Keep role as is
}

export async function GET(): Promise<Response> {
  try {
    // Fetching data mahasiswa
    const mahasiswa: Mahasiswa[] = await prisma.mahasiswa.findMany();

    // Fetching data dosen PA
    const dosenPAIds = (await prisma.dosenpa.findMany({ select: { dosen_id: true } }))
      .map((pa) => pa.dosen_id)
      .filter((id): id is number => id !== null);

    const dosenPA = await prisma.dosen.findMany({
      where: {
        id: {
          in: dosenPAIds,
        },
      },
    });

    // Fetching data Kaprodi
    const kaprodiIds = (await prisma.kaprodi.findMany({ select: { dosen_id: true } }))
      .map((kaprodi) => kaprodi.dosen_id)
      .filter((id): id is number => id !== null);

    const kaprodi = await prisma.dosen.findMany({
      where: {
        id: {
          in: kaprodiIds, // Now this is guaranteed to be number[]
        },
      },
    });

    // Adding role 'dosen_pa' and 'kaprodi' to relevant dosen data
    const dosenPARole: Dosen[] = dosenPA.map((dosen) => ({
      ...dosen,
      role: 'dosen_pa',
    }));

    const kaprodiRole: Dosen[] = kaprodi.map((dosen) => ({
      ...dosen,
      role: 'kaprodi',
    }));

    // Merging mahasiswa and dosen data
    const user: User[] = [
      ...mahasiswa.map((mhs) => ({ ...mhs, role: 'mahasiswa' })),
      ...dosenPARole,
      ...kaprodiRole,
    ];

    // Returning data as JSON
    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // Handling errors
    return new Response(
      JSON.stringify({ message: 'Something went wrong', error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
