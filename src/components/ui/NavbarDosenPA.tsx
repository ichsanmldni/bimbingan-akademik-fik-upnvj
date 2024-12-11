"use client";

import Link from "next/link";
import Logo from "./LogoUPNVJ";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ProfileImage from "./ProfileImage";
import NotificationModal from "./NotificationModal";
import ProfileModal from "./ProfileModal";
import NotificationButton from "./NotificationButton";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

interface NavbarDosenPAProps {}
const NavbarDosenPA: React.FC<NavbarDosenPAProps> = () => {
  const [isModalNotificationOpen, setIsModalNotificationOpen] = useState(false);
  const [isModalProfileOpen, setIsModalProfileOpen] = useState(false);
  const pathname = usePathname();

  const handleNotificationClick = () => {
    setIsModalProfileOpen(false);
    setIsModalNotificationOpen(true);
  };

  const closeNotificationModal = () => {
    setIsModalNotificationOpen(false);
  };

  const handleProfileClick = () => {
    setIsModalNotificationOpen(false);
    setIsModalProfileOpen(true);
  };

  const closeProfileModal = () => {
    setIsModalProfileOpen(false);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed z-[999] w-full bg-white border flex justify-between py-5 px-[128px]">
      <div className="flex items-center gap-5">
        <Logo className="size-[40px]" />
        <a href="/" className="font-semibold">
          Bimbingan Konseling Mahasiswa FIK
        </a>
      </div>
      <div className="flex items-center gap-6">
        <a
          href="/"
          className={`${isActive("/") ? "font-bold text-orange-500" : ""}`}
        >
          Beranda
        </a>
        <Link
          href="/informasi-akademik"
          className={`${
            isActive("/informasi-akademik") ? "font-bold text-orange-500" : ""
          }`}
        >
          Informasi Akademik
        </Link>
        <Link
          href="/laporan-bimbingan"
          className={`${
            isActive("/laporan-bimbingan") ? "font-bold text-orange-500" : ""
          }`}
        >
          Laporan Bimbingan
        </Link>
        <Link
          href="/artikel"
          className={`${
            isActive("/artikel") ? "font-bold text-orange-500" : ""
          }`}
        >
          Artikel
        </Link>
      </div>
      <div className="flex gap-8 items-center">
        <NotificationButton
          onClick={handleNotificationClick}
          className="w-6 h-6 cursor-pointer"
        />
        <ProfileImage onClick={handleProfileClick} />
      </div>
      {isModalNotificationOpen && (
        <NotificationModal
          className="fixed inset-0 flex items-start mt-[70px] mr-[180px] justify-end z-50"
          onClose={closeNotificationModal}
        />
      )}
      {isModalProfileOpen && (
        <ProfileModal
          className="fixed inset-0 flex items-start mt-[70px] mr-[130px] justify-end z-50"
          onClose={closeProfileModal}
        />
      )}
    </div>
  );
};

export default NavbarDosenPA;
