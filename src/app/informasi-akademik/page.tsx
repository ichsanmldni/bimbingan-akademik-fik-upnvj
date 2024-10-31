"use client";

import Logo from "@/components/ui/LogoUPNVJ";
import NotificationLogo from "@/components/ui/NotificationLogo";
import ProfileImage from "@/components/ui/ProfileImage";
import Link from "next/link";
import Image from "next/image";
import searchIcon from "../../assets/images/search.png";
import dropdownIcon from "../../assets/images/dropdown.png";
import { useState } from "react";
import NotificationModal from "@/components/ui/NotificationModal";

export default function Home() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNotificationClick = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const toggleMenu = (menuName: string) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
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
          <Link
            href="/informasi-akademik"
            className="text-orange-500 font-bold"
          >
            Informasi Akademik
          </Link>
          <Link href="/pengajuan">Pengajuan</Link>
          <Link href="/artikel">Artikel</Link>
        </div>
        <div className="flex gap-8 items-center">
          <NotificationLogo onClick={handleNotificationClick} />
          <ProfileImage />
        </div>
        {isModalOpen && <NotificationModal onClose={closeModal} />}
      </div>
      <div className="flex w-full pt-[80px]">
        <div className="flex flex-col w-[25%] border ml-32 gap-6 pt-10 pb-6 px-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-[18px] font-semibold">Informasi Akademik</h1>
            <div className="relative flex gap-2 rounded-lg p-2 bg-[#F8FAFC]">
              <input
                type="text"
                placeholder="Cari"
                className="pl-8 pr-2 w-full outline-none bg-transparent"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Image
                  src={searchIcon}
                  alt="Search Icon"
                  width={20}
                  height={20}
                />
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleMenu("menu1")}
            >
              <h1 className="font-semibold text-[14px]">
                Profil Fakultas Ilmu Komputer Universitas Pembangunan Nasional
                Veteran Jakarta
              </h1>
              <Image
                src={dropdownIcon}
                alt="Dropdown Icon"
                width={20}
                height={20}
              />
            </div>
            {openMenu === "menu1" && (
              <div className="mt-2 text-[14px] text-gray-700">
                <p className="mt-2">Sejarah</p>
                <p className="mt-2">Visi dan Misi</p>
                <p className="mt-2">Struktur Organisasi</p>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleMenu("menu2")}
            >
              <h1 className="font-semibold text-[14px]">
                Penyelenggaraan Pendidikan, Peraturan Akademik Dan Kemahasiswaan
              </h1>
              <Image
                src={dropdownIcon}
                alt="Dropdown Icon"
                width={20}
                height={20}
              />
            </div>

            {openMenu === "menu2" && (
              <div className="mt-2 text-[14px] text-gray-700">
                <p className="mt-2">Peraturan Akademik</p>
                <p className="mt-2">Beasiswa</p>
                <p className="mt-2">Layanan Kemahasiswaan</p>
              </div>
            )}
          </div>
        </div>
        <div className="w-[75%] py-10 px-[100px]">
          <h1 className="font-bold text-[18px]">
            SEJARAH SINGKAT FAKULTAS ILMU KOMPUTER
          </h1>
          <p className="mt-5 leading-[26px] text-justify">
            Sejarah Fakultas Ilmu Komputer UPN “Veteran” Jakarta tidak dapat
            dipisahkan dari sejarah UPN “Veteran” Jakarta itu sendiri. Sebelum
            menjadi institusi pendidikan tinggi yang berdiri sendiri, UPN
            “Veteran” Jakarta memiliki rangkaian perjalanan sejarah yang cukup
            panjang yaitu berdasarkan Akte Notaris R. Kardiman Nomor: 14 tanggal
            7 Januari 1963, Lembaga Pembinaan Kader Pembangunan (LPKP)
            mendirikan 3 (tiga) akademi, yaitu: 1) Akademi Bank; 2) Akademi
            Tekstil; dan 3) Akademi Tata Laksana Pelayaran Niaga “Yos Sudarso”.
            Pada tahun 1967, ketiga akademi tersebut diintegrasikan kedalam PTPN
            Veteran dengan nama PTPN Veteran Cabang Jakarta melalui Surat
            Keputusan Menteri Urusan Veteran dan Demobilisasi RI Nomor :
            09/Kpts/Menved/1967, tanggal 21 Pebruari 1967. Kemudian berdasarkan
            Surat Keputusan Menhankam/Pangab Nomor: Skep/1555/1977 tanggal 30
            November 1977 PTPN “Veteran” Jakarta berubah nama menjadi
            Universitas Pembangunan Nasional (UPN) “Veteran” Cabang Jakarta.
            Pada tahun 1980, UPN “Veteran” Cabang Jakarta menambah program
            pendidikannya, yaitu Pendidikan Ahli Teknik Informatika dan Komputer
            (PATIK) dengan jenjang pendidikan Diploma 3. Program Pendidikan Ahli
            Teknik Informatika dan Komputer UPN “Veteran” Cabang Jakarta
            merupakan salah satu program pendidikan yang banyak diminati oleh
            masyarakat, karena saat itu program pendidikan teknik informatika
            dan komputer masih sangat langka di wilayah Jakarta dan sekitarnya.
            Seiring perjalanan waktu, pada tahun 1993, UPN “Veteran” Cabang
            Jakarta menjadi perguruan tinggi yang mandiri berdasarkan Keputusan
            Menhankam Nomor: Kep/03/II/1993 tanggal 27 Februari 1993 terdiri
            dari 3 (tiga) Fakultas yang menyelenggarakan Program Pendidikan S-1
            dan D-III dengan status “Kedinasan”. Pada tanggal 1 Mei 1995,
            berdasarkan Surat Keputusan Rektor UPN “Veteran” Jakarta Nomor:
            Skep/031/V/1995 tentang Perubahan Fakultas Teknik menjadi tiga
            fakultas, yaitu: 1) Fakultas Teknologi Industri; 2) Fakultas Ilmu
            Komputer; dan 3) Fakultas Teknologi Kelautan yang diikuti dengan
            terbitnya Keputusan Mendikbud Nomor Kep./017.018.019/D/0/1995
            tentang perubahan UPN “Veteran” Jakarta yang semula perguruan tinggi
            dengan status “Kedinasan” berubah menjadi perguruan tinggi swasta
            dengan status “DISAMAKAN” untuk seluruh jenjang pendidikan Diploma
            3, dan status “TERDAFTAR” untuk seluruh jenjang pendidikan Strata 1.
            Berdasarkan instruksi Menteri Pertahanan dan Keamanan Nomor:
            Inst/01/II/1996 tanggal 6 Februari 1996 tentang Pelaksanaan
            Pelimpahan Wewenang dan Tanggung Jawab Pembinaan UPN “Veteran”
            Jakarta ke Yayasan Kejuangan Panglima Besar Sudirman (YKPBS), maka
            UPN “Veteran” Jakarta yang semula pembinaannya di bawah Departemen
            Pertahanan dan Keamanan dialihkan di bawah YKPBS. Setelah ± 12 tahun
            lamanya dibina oleh YKPBS, pada tahun 2008 pengelolaan UPN “Veteran”
            Jakarta dialihkan ke Yayasan Kesejahteraan Pendidikan dan Perumahan
            (YKPP) berdasarkan Keputusan Menteri Hukum dan HAM R.I. Nomor:
            AHU-103.AH.01.05 tahun 2008 tanggal 17 Januari 2008. Pada tanggal 6
            Oktober 2014, berdasarkan Peraturan Presiden Nomor 120 tahun 2014
            tentang Pendirian UPN “Veteran” Jakarta, maka UPN “Veteran” Jakarta
            berubah dari Perguruan Tinggi Swasta (PTS) menjadi Perguruan Tinggi
            Negeri (PTN) di bawah pembinaan Kementerian Riset, Teknologi, dan
            Pendidikan Tinggi.
          </p>
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
