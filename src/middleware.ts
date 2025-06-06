import { jwtDecode } from "jwt-decode";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define the structure of the decoded JWT token
interface DecodedToken {
  role: string;
  // Add other properties based on your JWT structure
}

const protectedRoutes = [
  "/",
  "/laporan-bimbingan",
  "/pengajuan-bimbingan",
  "/dashboard",
  "/informasi-akademik",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("authBMFK")?.value;

  // Menambahkan header CORS
  const response = NextResponse.next();
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");

  // Menangani permintaan OPTIONS
  if (request.method === "OPTIONS") {
    return response;
  }

  if (pathname === "/admin") {
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (
    protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  ) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (token) {
    const decodedToken = jwtDecode<DecodedToken>(token);
    const userRole = decodedToken.role;

    if (pathname.startsWith("/chatbot") && userRole !== "Mahasiswa") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/",
    "/chatbot",
    "/chatpribadi",
    "/admin",
    "/dashboard/:path*",
    "/perwalian-wajib/:path*",
    "/informasi-akademik/:path*",
    "/laporan-bimbingan/:path*",
    "/pengajuan-bimbingan/:path*",
  ],
};
