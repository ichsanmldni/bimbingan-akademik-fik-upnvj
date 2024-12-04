"use client";

import Logo from "@/components/ui/LogoUPNVJ";
import NavbarUser from "@/components/ui/NavbarUser";
import NavbarAdmin from "@/components/ui/NavbarAdmin";
import DashboardAdmin from "@/components/features/home/admin/DashboardAdmin";
import landingPageImage from "../assets/images/landing-page.png";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function Home() {
  const cards = Array(9).fill(null);

  const [roleUser, setRoleUser] = useState("");
  const [activeNavbar, setActiveNavbar] = useState("Dashboard");

  const router = useRouter();

  const handleMore = () => {
    router.push("/artikel");
  };

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const authTokenCookie = cookies.find((row) => row.startsWith("authToken="));

    if (authTokenCookie) {
      const token = authTokenCookie.split("=")[1];
      try {
        const decodedToken = jwtDecode(token);
        setRoleUser(decodedToken.role);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);
  return (
    <div>
      {["Dosen", "Mahasiswa", "Kaprodi"].includes(roleUser) && (
        <div>
          <NavbarUser />
          <div className="bg-slate-100 h-screen">
            <div className="flex h-full items-center gap-[80px] mx-[128px]">
              <div className="flex flex-col gap-5 w-2/5">
                <h1 className="font-[800] text-[40px]">
                  Ajukan bimbingan konseling sekarang dan raih sukses akademik!
                </h1>
                <Link
                  className="bg-orange-500 text-[14px] font-[500] w-1/3 rounded-lg py-2.5 text-center"
                  href="/pengajuan-bimbingan"
                >
                  Ajukan Bimbingan
                </Link>
              </div>
              <Image className="w-1/2" src={landingPageImage} alt="Konseling" />
            </div>
          </div>
          <div className="text-center border-b">
            <h1 className="text-[30px] font-semibold mt-16">
              Rekomendasi artikel
            </h1>
            <p className="mt-4">
              Temukan artikel populer terkait yang membantu Anda memahami topik
              akademik lebih dalam dan mendukung pencapaian studi Anda.
            </p>
            <div className="mt-10 text-start grid grid-cols-3 mx-32 gap-12">
              {cards.map((_, index) => (
                <div key={index} className="border rounded-lg">
                  <Image src={landingPageImage} alt="contoh" />
                  <div className="flex flex-col gap-2 bg-slate-50 p-4">
                    <h1 className="font-semibold text-[24px]">Judul</h1>
                    <p className="text-[16px]">Tanggal</p>
                    <p className="text-[16px]">Content</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={handleMore}
              className="bg-orange-500 px-4 py-2 mt-8 mb-12 rounded-lg font-medium"
            >
              Lebih Banyak
            </button>
          </div>
          <div className="">
            <div className="flex justify-between mx-32 py-8 border-black border-b">
              <div className="flex gap-5 w-2/5 items-center">
                <Logo className="size-[100px]" />
                <h1 className="text-start font-semibold text-[30px]">
                  Bimbingan Konseling Mahasiswa FIK
                </h1>
              </div>
              <div className="flex items-end gap-5">
                <Link href="/informasi-akademik" className="text-[14px]">
                  Informasi Akademik
                </Link>
                <Link href="/artikel" className="text-[14px]">
                  Artikel
                </Link>
              </div>
            </div>
            <p className="text-center my-8 text-[16px]">
              Hak cipta &copy; 2024 Bimbingan Konseling Mahasiswa FIK UPNVJ
            </p>
          </div>
          <a href="/login">Ke Login</a>
        </div>
      )}
      {roleUser === "Admin" && (
        <div className="flex h-screen">
          <NavbarAdmin
            activeNavbar={activeNavbar}
            setActiveNavbar={setActiveNavbar}
          />
          <DashboardAdmin activeNavbar={activeNavbar} />
        </div>
      )}
    </div>
  );
}
