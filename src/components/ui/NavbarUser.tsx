"use client";

import Link from "next/link";
import Logo from "./LogoUPNVJ";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ProfileImage from "./ProfileImage";
import NotificationModal from "./NotificationModal";
import ProfileModal from "./ProfileModal";
import NotificationButton from "./NotificationButton";
import { MessageSquareText } from "lucide-react";
import axios from "axios";
import Image from "next/image";

const NavbarUser: React.FC<any> = ({ roleUser, dataUser }) => {
  const [isModalNotificationOpen, setIsModalNotificationOpen] = useState(false);
  const [isModalProfileOpen, setIsModalProfileOpen] = useState(false);
  const [dataNotifikasi, setDataNotifikasi] = useState([]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

  const pathname = usePathname();

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

  const getDataNotifikasiByUserId = async () => {
    try {
      let response;
      if (roleUser === "Mahasiswa") {
        response = await axios.get(
          `${API_BASE_URL}/api/datanotifikasimahasiswa`
        );
      } else if (roleUser === "Dosen PA") {
        response = await axios.get(`${API_BASE_URL}/api/datanotifikasidosenpa`);
      } else if (roleUser === "Kaprodi") {
        response = await axios.get(`${API_BASE_URL}/api/datanotifikasikaprodi`);
      }

      let notifikasiUser;

      if (roleUser === "Mahasiswa") {
        notifikasiUser = response.data.filter(
          (data: any) => data.mahasiswa_id === dataUser.id
        );
      } else if (roleUser === "Dosen PA") {
        notifikasiUser = response.data.filter(
          (data: any) => data.dosen_pa_id === dataUser.id
        );
      } else if (roleUser === "Kaprodi") {
        notifikasiUser = response.data.filter(
          (data: any) => data.kaprodi_id === dataUser.id
        );
      }

      const data = await response.data;
      setDataNotifikasi(data);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (dataUser && dataUser.id) {
      getDataNotifikasiByUserId();
    }
  }, [dataUser]);

  return (
    <div className="fixed z-[999] w-full bg-white border flex py-5 px-[128px]">
      <div className="flex w-[35%] items-center gap-5">
        <Logo className="size-[40px]" />
        <a href="/" className="font-semibold">
          Bimbingan Akademik Mahasiswa FIK
        </a>
      </div>
      <div
        className={`flex items-center pl-8 w-[45%] ${roleUser === "Kaprodi" ? "gap-10" : "gap-6"}`}
      >
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
          href="/pengajuan-bimbingan"
          className={`${
            isActive("/pengajuan-bimbingan") ? "font-bold text-orange-500" : ""
          } ${roleUser !== "Mahasiswa" && "hidden"}`}
        >
          Pengajuan Bimbingan
        </Link>
        <Link
          href="/laporan-bimbingan"
          className={`${
            isActive("/laporan-bimbingan") ? "font-bold text-orange-500" : ""
          } ${roleUser !== "Dosen PA" && "hidden"}`}
        >
          Laporan Bimbingan
        </Link>
      </div>
      <div className="flex gap-10 justify-end w-[20%] items-center">
        {roleUser === "Dosen PA" && (
          <Link href="/chatpribadi">
            <MessageSquareText className="cursor-pointer" />
          </Link>
        )}
        {roleUser === "Mahasiswa" && (
          <Link href="/chatpribadi">
            <MessageSquareText className="cursor-pointer" />
          </Link>
        )}
        <NotificationButton
          onClick={() => setIsModalNotificationOpen((prev) => !prev)}
          dataNotification={dataNotifikasi}
          className="w-6 h-6 cursor-pointer"
        />
        {dataUser?.profile_image ? (
          <img
            src={`../${dataUser.profile_image}`}
            alt="Profile"
            className="rounded-full size-8 cursor-pointer"
            onClick={handleProfileClick}
          />
        ) : (
          <ProfileImage
            className="size-8 cursor-pointer"
            onClick={handleProfileClick}
          />
        )}
      </div>
      {isModalNotificationOpen && (
        <NotificationModal
          dataNotifikasi={dataNotifikasi}
          className="fixed inset-0 flex items-start mt-[70px] mr-[180px] justify-end z-50"
          onClose={closeNotificationModal}
          refreshData={getDataNotifikasiByUserId}
          dataUser={dataUser}
          roleUser={roleUser}
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

export default NavbarUser;
