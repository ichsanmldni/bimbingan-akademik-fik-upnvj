// /app/api/datadosen/route.js
import prisma from '../../../../lib/prisma';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from 'process';
import { serialize } from 'cookie';

function convertTimeToSeconds(timeString) {
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
const SECRET_KEY = env.JWT_SECRET;
const EXPIRED_TIME = convertTimeToSeconds(env.JWT_EXPIRED);

export async function POST(req) {
    try {
      const body = await req.json();

      const { nim, nip, email, password, role } = body;

      if (!role || !password || (role === "Mahasiswa" && !nim) || (role === "Dosen" && !nip)) {
        return new Response(
          JSON.stringify({ message: 'Role, password, and the required identifier (nim/nip) are required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      if (!role || !password || (role === "Admin" && !email)) {
        return new Response(
          JSON.stringify({ message: 'the required identifier (email) and password are required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      let user;

      if (role === 'Mahasiswa') {
        user = await prisma.mahasiswa.findFirst({ where: { nim } });
      } else if (role === 'Dosen') {
        user = await prisma.dosen.findFirst({ where: { nip } });
      } else if (role === 'Admin') {
        user = await prisma.admin.findFirst({ where: { email } });
      }

      if (!user) {
        return new Response(
          JSON.stringify({ message: 'User not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return new Response(
          JSON.stringify({ message: 'Invalid credentials' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const token = jwt.sign(
        {
          id: user.id,
          role,
          ...(role === "Mahasiswa" ? { nim: user.nim } : { nip: user.nip }),
          
        },
        SECRET_KEY,
        { expiresIn: EXPIRED_TIME }
      );

      const cookie = serialize('authToken', token, {
        secure: process.env.NODE_ENV === 'production',
        maxAge: parseInt(EXPIRED_TIME),
        path: '/',
      });
  
      return new Response(
        JSON.stringify({ message: 'Login successful', user }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': cookie,
          },
        }
      );
  
    } catch (error) {
      return new Response(
        JSON.stringify({ message: 'Something went wrong', error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
