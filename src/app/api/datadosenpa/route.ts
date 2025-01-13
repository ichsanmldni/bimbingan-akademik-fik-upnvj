// /app/api/datadosen/route.ts
import fs from 'fs/promises';
import path from 'path';
import prisma from '../../../lib/prisma';

interface DosenRequestBody {
  id: number;
  nama_lengkap: string;
  email: string;
  nip: string;
  no_whatsapp: string;
  profile_image?: string;
}

export async function GET(req: Request): Promise<Response> {
  try {
    // Fetching data from the database
    const dosen = await prisma.dosenpa.findMany();

    // Returning data as JSON
    return new Response(JSON.stringify(dosen), {
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

export async function PATCH(req: Request): Promise<Response> {
  try {
    const body: any = await req.json();
    console.log(body)
    const { nama, email, nip, hp, profile_image } = body;

    // Validate required fields
    if (!nama || !email || !nip || !hp) {
      return new Response(
        JSON.stringify({ message: 'Invalid data' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const existingRecord = await prisma.dosenpa.findUnique({
      where: { nip },
    });

    if (!existingRecord) {
      return new Response(
        JSON.stringify({ message: 'Record not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profile_pictures');
    await fs.mkdir(uploadDir, { recursive: true }); // Create folder recursively

    // Save image if provided
    let savedImagePath = existingRecord.profile_image; // Use old image if not updated
    if (profile_image) {
      const base64Data = profile_image.replace(/^data:image\/\w+;base64,/, '');
      const imageBuffer = Buffer.from(base64Data, 'base64');

      const filename = `profile_${nip}_${Date.now()}.jpg`;
      savedImagePath = path.join('uploads', 'profile_pictures', filename); // Relative path

      if (existingRecord.profile_image) {
        const oldImagePath = path.join(process.cwd(), 'public', existingRecord.profile_image);
        try {
          await fs.unlink(oldImagePath); // Delete old image
        } catch (err) {
          console.error('Failed to delete old image:', err);
        }
      }

      await fs.writeFile(path.join(process.cwd(), 'public', savedImagePath), imageBuffer); // Save image in public folder
    }

    const dosen = await prisma.dosenpa.update({
      where: { nip },
      data: { nama, email, nip, hp, profile_image: savedImagePath },
    });

    return new Response(JSON.stringify(dosen), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Something went wrong', error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}