"use client";

import InputField from "@/components/ui/InputField";
import Logo from "@/components/ui/LogoUPNVJ";
import NotificationLogo from "@/components/ui/NotificationLogo";
import ProfileImage from "@/components/ui/ProfileImage";
import SelectField from "@/components/ui/SelectField";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [namaLengkap, setNamaLengkap] = useState("");
  const [nim, setNim] = useState("");
  const [email, setEmail] = useState("");
  const [noWa, setNoWa] = useState("");

  const [selectedJadwal, setSelectedJadwal] = useState("");
  const [selectedJenis, setSelectedJenis] = useState("");
  const [selectedSistem, setSelectedSistem] = useState("");

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
          <Link className="text-orange-500 font-bold" href="/pengajuan">
            Pengajuan
          </Link>
          <Link href="/artikel">Artikel</Link>
        </div>
        <div className="flex gap-8 items-center">
          <NotificationLogo />
          <ProfileImage />
        </div>
      </div>

      <div className="pt-[100px]">
        <div className="mt-4 mb-10 mx-[130px] border rounded-lg">
          <h1 className="font-semibold text-[30px] text-center pt-4">
            Pengajuan Bimbingan Konseling Mahasiswa
          </h1>
          <form className="flex flex-col gap-4 p-8">
            <InputField
              type="text"
              placeholder="Nama Lengkap"
              onChange={(e) => setNamaLengkap(e.target.value)}
              value={namaLengkap}
            />
            <InputField
              type="text"
              placeholder="NIM"
              onChange={(e) => setNim(e.target.value)}
              value={nim}
            />
            <InputField
              type="text"
              placeholder="E-mail"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <InputField
              type="text"
              placeholder="No Whatsapp"
              onChange={(e) => setNoWa(e.target.value)}
              value={noWa}
            />
            <SelectField
              options={[
                { value: "Jurusan A", label: "Jurusan A" },
                { value: "Jurusan B", label: "Jurusan B" },
                { value: "Jurusan C", label: "Jurusan C" },
              ]}
              onChange={(e) => setSelectedJadwal(e.target.value)}
              value={selectedJadwal}
              placeholder="Pilih Jadwal Bimbingan"
            />
            <SelectField
              options={[
                { value: "Jurusan A", label: "Jurusan A" },
                { value: "Jurusan B", label: "Jurusan B" },
                { value: "Jurusan C", label: "Jurusan C" },
              ]}
              onChange={(e) => setSelectedJenis(e.target.value)}
              value={selectedJenis}
              placeholder="Pilih Jenis Bimbingan"
            />
            <SelectField
              options={[
                { value: "Jurusan A", label: "Jurusan A" },
                { value: "Jurusan B", label: "Jurusan B" },
                { value: "Jurusan C", label: "Jurusan C" },
              ]}
              onChange={(e) => setSelectedSistem(e.target.value)}
              value={selectedSistem}
              placeholder="Pilih Sistem Bimbingan"
            />
            <button className="bg-orange-500 rounded-lg py-[6px] font-medium">
              Ajukan
            </button>
          </form>
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
