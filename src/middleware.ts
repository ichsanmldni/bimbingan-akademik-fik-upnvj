import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/','/artikel','/laporan-bimbingan','/pengajuan-bimbingan','/dashboard', '/informasi-akademik'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('authToken')?.value;

  if (pathname === "/admin") {
    if (token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/',"/admin",'/dashboard/:path*', '/informasi-akademik/:path*','/artikel/:path*','/laporan-bimbingan/:path*','/pengajuan-bimbingan/:path*'], // Sesuaikan dengan rute Anda
};
