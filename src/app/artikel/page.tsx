"use client";

import Logo from "@/components/ui/LogoUPNVJ";
import NavbarUser from "@/components/ui/NavbarUser";
import landingPageImage from "../../assets/images/landing-page.png";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const cards = Array(9).fill(null);
  const router = useRouter();

  const handleDetailArticle = () => {
    router.push("/artikel/123");
  };

  return (
    <div>
      <NavbarUser />

      <div className="py-[100px] ">
        <h1 className="text-[36px] font-semibold text-center">
          Rekomendasi Berita
        </h1>
        <p className="text-center mt-4 m-auto w-1/2 text-[#525252]">
          Temukan artikel populer terkait yang membantu Anda memahami topik
          akademik lebih dalam dan mendukung pencapaian studi Anda.
        </p>

        <div className="mt-10 text-start grid grid-cols-3 mx-32 gap-12">
          {cards.map((_, index) => (
            <div
              key={index}
              className="border rounded-lg"
              onClick={handleDetailArticle}
            >
              <Image src={landingPageImage} alt="contoh" />
              <div className="flex flex-col gap-2 bg-slate-50 p-4">
                <h1 className="font-semibold text-[24px]">Judul</h1>
                <p className="text-[16px]">Tanggal</p>
                <p className="text-[16px]">Content</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border">
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
    </div>
  );
}
