"use client";

import InputField from "@/components/ui/InputField";
import Logo from "@/components/ui/LogoUPNVJ";
import SelectField from "@/components/ui/SelectField";
import NavbarUser from "@/components/ui/NavbarUser";
import Link from "next/link";
import { useState } from "react";
import ImagePlus from "../../assets/images/image-plus.png";
import Image from "next/image";

export default function Home() {
  const [tanggalBimbingan, setTanggalBimbingan] = useState("");
  const [jumlahMahasiswa, setJumlahMahasiswa] = useState("");
  const [selectedJenisBimbingan, setSelectedJenisBimbingan] = useState("");
  const [selectedSistemBimbingan, setSelectedSistemBimbingan] = useState("");
  const [kendala, setKendala] = useState("");
  const [solusi, setSolusi] = useState("");
  const [kesimpulan, setKesimpulan] = useState("");
  const [dokumentasi, setDokumentasi] = useState("");

  return (
    <div>
      <NavbarUser />

      <div className="pt-[100px]">
        <div className="mt-4 mb-10 mx-[130px] border rounded-lg">
          <h1 className="font-semibold text-[30px] text-center pt-4">
            Laporan Bimbingan Konseling Mahasiswa
          </h1>
          <form className="flex flex-col gap-4 p-8">
            <InputField
              type="date"
              placeholder="Tanggal Bimbingan"
              onChange={(e) => setTanggalBimbingan(e.target.value)}
              value={tanggalBimbingan}
              className="px-3 py-2 text-[15px] border rounded-lg"
            />
            <InputField
              type="text"
              placeholder="Jumlah Mahasiswa"
              onChange={(e) => setJumlahMahasiswa(e.target.value)}
              value={jumlahMahasiswa}
              className="px-3 py-2 text-[15px] border rounded-lg"
            />
            <SelectField
              options={[
                { value: "Jenis Bimbingan A", label: "Jenis Bimbingan A" },
                { value: "Jenis Bimbingan B", label: "Jenis Bimbingan B" },
                { value: "Jenis Bimbingan C", label: "Jenis Bimbingan C" },
              ]}
              onChange={(e) => setSelectedJenisBimbingan(e.target.value)}
              value={selectedJenisBimbingan}
              placeholder="Pilih Jenis Bimbingan"
              className={`px-3 py-2 text-[15px] border rounded-lg appearance-none w-full`}
            />
            <SelectField
              options={[
                { value: "Sistem Bimbingan A", label: "Sistem Bimbingan A" },
                { value: "Sistem Bimbingan B", label: "Sistem Bimbingan B" },
                { value: "Sistem Bimbingan C", label: "Sistem Bimbingan C" },
              ]}
              onChange={(e) => setSelectedSistemBimbingan(e.target.value)}
              value={selectedSistemBimbingan}
              placeholder="Pilih Sistem Bimbingan"
              className={`px-3 py-2 text-[15px] border rounded-lg appearance-none w-full`}
            />
            <InputField
              type="text"
              placeholder="Kendala Mahasiswa"
              onChange={(e) => setKendala(e.target.value)}
              value={kendala}
              className="px-3 py-2 text-[15px] border rounded-lg"
            />
            <InputField
              type="text"
              placeholder="Solusi Yang Ditawarkan"
              onChange={(e) => setSolusi(e.target.value)}
              value={solusi}
              className="px-3 py-2 text-[15px] border rounded-lg"
            />
            <InputField
              type="text"
              placeholder="Kesimpulan"
              onChange={(e) => setKesimpulan(e.target.value)}
              value={kesimpulan}
              className="px-3 py-2 text-[15px] border rounded-lg"
            />
            <div className="flex flex-col gap-2 px-3 py-2 text-[15px] border rounded-lg">
              <label className="text-neutral-400">Dokumentasi</label>
              <label className="cursor-pointer flex flex-col items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setDokumentasi(e.target.value)}
                  className="hidden"
                />
                <Image src={ImagePlus} alt="imagePlus" />
              </label>
            </div>
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
