"use client";

import Link from "next/link";
import Logo from "./LogoUPNVJ";
import { useState } from "react";
import { usePathname } from "next/navigation";
import ProfileImage from "./ProfileImage";
import NotificationModal from "./NotificationModal";
import ProfileModal from "./ProfileModal";

interface NavbarAdminProps {
  activeNavbar: string;
  setActiveNavbar: (navbar: string) => void;
}

const NavbarAdmin: React.FC<NavbarAdminProps> = ({
  activeNavbar,
  setActiveNavbar,
}) => {
  const [roleUser, setRoleUser] = useState("Dosen");
  const [isModalNotificationOpen, setIsModalNotificationOpen] = useState(false);
  const [isModalProfileOpen, setIsModalProfileOpen] = useState(false);

  return (
    <div className="w-[20%] p-5 border h-[1000px]">
      <div className="flex gap-2 items-center ">
        <Logo className="size-[56px]" />
        <a href="/" className="font-bold">
          Bimbingan Konseling Mahasiswa FIK
        </a>
      </div>
      <div className="flex flex-col py-6 gap-1">
        <button
          onClick={() => setActiveNavbar("Dashboard")}
          className={`text-start px-3 py-2 rounded-xl text-[14px] ${activeNavbar === "Dashboard" ? "bg-orange-500" : ""}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveNavbar("Manage Parameter")}
          className={`text-start px-3 py-2 rounded-xl text-[14px] ${activeNavbar === "Manage Parameter" ? "bg-orange-500" : ""}`}
        >
          Manage Parameter
        </button>
        <button
          onClick={() => setActiveNavbar("Manage Laporan Bimbingan")}
          className={`text-start px-3 py-2 rounded-xl text-[14px] ${activeNavbar === "Manage Laporan Bimbingan" ? "bg-orange-500" : ""}`}
        >
          Manage Laporan Bimbingan
        </button>
        <button
          onClick={() => setActiveNavbar("Manage Jadwal Dosen")}
          className={`text-start px-3 py-2 rounded-xl text-[14px] ${activeNavbar === "Manage Jadwal Dosen" ? "bg-orange-500" : ""}`}
        >
          Manage Jadwal Dosen
        </button>
        <button
          onClick={() => setActiveNavbar("Manage User")}
          className={`text-start px-3 py-2 rounded-xl text-[14px] ${activeNavbar === "Manage User" ? "bg-orange-500" : ""}`}
        >
          Manage User
        </button>
        <button
          onClick={() => setActiveNavbar("Manage Informasi Akademik")}
          className={`text-start px-3 py-2 rounded-xl text-[14px] ${activeNavbar === "Manage Informasi Akademik" ? "bg-orange-500" : ""}`}
        >
          Manage Informasi Akademik
        </button>
      </div>
    </div>
  );
};

export default NavbarAdmin;
