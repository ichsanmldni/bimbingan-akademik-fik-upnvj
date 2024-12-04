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

const NavbarUser: React.FC = () => {
  const [roleUser, setRoleUser] = useState("");
  const [isModalNotificationOpen, setIsModalNotificationOpen] = useState(false);
  const [isModalProfileOpen, setIsModalProfileOpen] = useState(false);
  const pathname = usePathname();

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
    <div>
      <div className="fixed w-full bg-white border flex justify-between py-5 px-[128px]">
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
          {roleUser === "Mahasiswa" && (
            <Link
              href="/pengajuan-bimbingan"
              className={`${
                isActive("/pengajuan-bimbingan")
                  ? "font-bold text-orange-500"
                  : ""
              }`}
            >
              Pengajuan
            </Link>
          )}
          {roleUser === "Dosen" && (
            <Link
              href="/laporan-bimbingan"
              className={`${
                isActive("/laporan-bimbingan")
                  ? "font-bold text-orange-500"
                  : ""
              }`}
            >
              Laporan Bimbingan
            </Link>
          )}
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
          <NotificationModal onClose={closeNotificationModal} />
        )}
        {isModalProfileOpen && <ProfileModal onClose={closeProfileModal} />}
      </div>
    </div>
  );
};

export default NavbarUser;
