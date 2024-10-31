import Logo from "@/components/ui/LogoUPNVJ";
import NotificationLogo from "@/components/ui/NotificationLogo";
import ProfileImage from "@/components/ui/ProfileImage";
import Link from "next/link";
import Image from "next/image";
import searchIcon from "../../assets/images/search.png";
import dropdownIcon from "../../assets/images/dropdown.png";

export default function Home() {
  return (
    <div className="">
      <div className="fixed w-full bg-white border flex justify-between py-5 px-[128px]">
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
          <NotificationLogo />
          <ProfileImage />
        </div>
      </div>
      <div className="flex mx-32 w-1/5 pt-[100px]">
        <div className="border flex flex-col gap-5">
          <h1 className="text-[18px] font-semibold">Informasi Akademik</h1>
          <div className="flex gap-2">
            <Image src={searchIcon} alt="Search Icon" />
            <p>Cari</p>
          </div>
          <div className="flex items-center">
            <h1 className="font-semibold text-[14px]">
              Profil Fakultas Ilmu Komputer Universitas Pembangunan Nasional
              Veteran Jakarta
            </h1>
            <Image src={dropdownIcon} className="size-2" alt="Dropdown Icon" />
          </div>
          <div className="flex items-center">
            <h1 className="font-semibold text-[14px]">
              Penyelenggaraan Pendidikan, Peraturan Akademik Dan Kemahasiswaan
            </h1>
            <Image src={dropdownIcon} className="size-2" alt="Dropdown Icon" />
          </div>
        </div>
        <div></div>
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
      <Link href="/login">Ke Login</Link>
    </div>
  );
}
