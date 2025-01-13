// /app/api/datadosen/route.ts
import axios from 'axios';
import prisma from '../../../lib/prisma';
import FormData from 'form-data';

interface JurusanRequestBody {
  id?: number; // Optional for POST, required for PATCH and DELETE
  jurusan?: string; // Optional for PATCH
  order?: number; // Optional for POST
}

export async function POST(req: Request): Promise<Response> {
  try {
    const username = process.env.BASIC_AUTH_USERNAME;
    const password = process.env.BASIC_AUTH_PASSWORD;
    const basicAuth = Buffer.from(`${username}:${password}`).toString('base64');

    // API Key from environment variables  
    const apiKeyName = process.env.API_KEY_NAME;
    const apiKeySecret = process.env.API_KEY_SECRET;

    const formData = new FormData

    // Fetch data from external API  
    const response = await axios.post('https://api.upnvj.ac.id/data/ref_program_studi', formData, {
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'API_KEY_NAME': apiKeyName,
        'API_KEY_SECRET': apiKeySecret,
      }
    });

    const dataJurusan = response.data;
    const dataJurusanFIK = dataJurusan.data.filter((data: any) => data.nama_fakultas === "Fakultas Ilmu Komputer")

    return new Response(JSON.stringify(dataJurusanFIK), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Something went wrong', error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
