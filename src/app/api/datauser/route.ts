import prisma from '../../../lib/prisma';

export async function GET() {
  try {
    // Mengambil data mahasiswa
    const Mahasiswa = await prisma.mahasiswa.findMany();

    // Mengambil data dosen PA
    const DosenPA = await prisma.dosen.findMany({
      where: {
        id: {
          in: (await prisma.dosenpa.findMany({ select: { dosen_id: true } })).map(
            (pa) => pa.dosen_id
          ),
        },
      },
    });

    // Mengambil data Kaprodi
    const Kaprodi = await prisma.dosen.findMany({
      where: {
        id: {
          in: (await prisma.kaprodi.findMany({ select: { dosen_id: true } })).map(
            (kaprodi) => kaprodi.dosen_id
          ),
        },
      },
    });

    // Menambahkan role 'dosen_pa' dan 'kaprodi' pada data dosen yang relevan
    const DosenPARole = DosenPA.map((dosen) => ({
      ...dosen,
      role: 'dosen_pa',
    }));

    const KaprodiRole = Kaprodi.map((dosen) => ({
      ...dosen,
      role: 'kaprodi',
    }));

    // Menggabungkan data mahasiswa dan dosen
    const User = [
      ...Mahasiswa.map((mhs) => ({ ...mhs, role: 'mahasiswa' })),
      ...DosenPARole,
      ...KaprodiRole,
    ];

    // Mengembalikan data sebagai JSON
    return new Response(JSON.stringify(User), {
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
