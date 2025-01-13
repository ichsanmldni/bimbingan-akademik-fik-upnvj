// /app/api/datadosen/route.ts
import prisma from '../../../lib/prisma';


export async function GET(): Promise<Response> {
  try {
    const mahasiswa = await prisma.mahasiswa.findMany();

    const dosenPA = await prisma.dosenpa.findMany();

    const kaprodi = await prisma.kaprodi.findMany();

    const user: any = [
      ...mahasiswa.map((mhs) => ({ ...mhs, role: 'Mahasiswa' })),
      ...dosenPA.map((mhs) => ({ ...mhs, role: 'Dosen PA' })),
      ...kaprodi.map((mhs) => ({ ...mhs, role: 'Kaprodi' })),
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
