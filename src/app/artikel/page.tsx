"use client";

import Logo from "@/components/ui/LogoUPNVJ";
import NotificationLogo from "@/components/ui/NotificationLogo";
import ProfileImage from "@/components/ui/ProfileImage";
import landingPageImage from "../../assets/images/landing-page.png";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const cards = Array(9).fill(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNotificationClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div>
      <div className="fixed w-full bg-white border flex justify-between py-5 px-[128px] z-20">
        <div className="flex items-center gap-5">
          <Logo className="size-[40px]" />
          <a href="/" className="font-semibold">
            Bimbingan Konseling Mahasiswa FIK
          </a>
        </div>
        <div className="flex items-center gap-6">
          <a href="/">Beranda</a>
          <Link href="/informasi-akademik">Informasi Akademik</Link>
          <Link href="/pengajuan">Pengajuan</Link>
          <Link className="text-orange-500 font-bold" href="/artikel">
            Artikel
          </Link>
        </div>
        <div className="flex gap-8 items-center">
          <NotificationLogo onClick={handleNotificationClick} />
          <ProfileImage />
        </div>
      </div>

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
            <Link href="/pengajuan" className="text-[14px]">
              Pengajuan
            </Link>
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
