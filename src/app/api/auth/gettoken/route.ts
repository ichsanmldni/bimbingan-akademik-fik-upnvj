// /app/api/datadosen/route.ts
import prisma from '../../../../lib/prisma';
import bcrypt from 'bcrypt';

interface PasswordRequestBody {
  password: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    // Get the body from the request
    const body: PasswordRequestBody = await req.json();

    const { password } = body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    return new Response(JSON.stringify(hashedPassword), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Something went wrong', error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
