"use client";

import Link from "next/link";
import Logo from "./LogoUPNVJ";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ProfileImage from "./ProfileImage";
import NotificationModal from "./NotificationModal";
import ProfileModal from "./ProfileModal";
import { MessageSquareText, School } from "lucide-react";
import axios from "axios";
import Image from "next/image";
import notificationIcon from "../../assets/images/bell.png";
import { Home, BookOpen, FileText, FilePlus, Bell, User } from "lucide-react";
import LogoBimafik from "./LogoBimafik";
import { useDispatch } from "react-redux";
import { fetchNotifikasi } from "@/lib/features/notificationSlice";
import { fetchPesanPribadi } from "@/lib/features/pesanPribadiSlice";
import {
  fetchPesanSiaran,
  fetchStatusPesanSiaran,
} from "@/lib/features/pesanSiaranSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { useSelector } from "react-redux";

const SkeletonNavbar = () => {
  return (
    <div className="fixed z-[999] flex justify-between md:justify-start w-full bg-white border py-5 px-[24px] md:px-[52px] animate-pulse">
      <div className="hidden md:flex md:w-[35%] items-center gap-5">
        <div className="bg-gray-300 rounded w-10 h-10"></div>
        <div className="bg-gray-300 rounded w-48 h-6"></div>
      </div>
      <div className="hidden md:flex items-center w-[45%] gap-6">
        {/* Beberapa skeleton link */}
        <div className="bg-gray-300 rounded w-20 h-5"></div>
        <div className="bg-gray-300 rounded w-28 h-5"></div>
        <div className="bg-gray-300 rounded w-32 h-5"></div>
        <div className="bg-gray-300 rounded w-32 h-5"></div>
      </div>
      <div className="flex gap-10 justify-end md:w-[20%] items-center">
        <div className="bg-gray-300 rounded w-6 h-6"></div>
        <div className="bg-gray-300 rounded w-6 h-6"></div>
        <div className="bg-gray-300 rounded w-6 h-6"></div>
      </div>
    </div>
  );
};

const NavbarUser: React.FC<any> = ({ roleUser, dataUser }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isModalNotificationOpen, setIsModalNotificationOpen] = useState(false);
  const [isModalProfileOpen, setIsModalProfileOpen] = useState(false);
  const [isModalNotificationMobileOpen, setIsModalNotificationMobileOpen] =
    useState(false);
  const [isModalProfileMobileOpen, setIsModalProfileMobileOpen] =
    useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isUnreadMahasiswaMessages, setIsUnreadMahasiswaMessages] =
    useState(false);
  const [isUnreadDosenPAMessages, setIsUnreadDosenPAMessages] = useState(false);
  const dataNotifikasi = useSelector(
    (state: RootState) => state.notifikasi?.data
  );
  const dataPesanSiaran = useSelector(
    (state: RootState) => state.pesanSiaran?.data
  );
  const dataPesanPribadi = useSelector(
    (state: RootState) => state.pesanPribadi?.data
  );

  const isPesanSiaranDosenPAUnread = useSelector(
    (state: RootState) => state.pesanSiaran?.isPesanSiaranDosenPAUnread
  );
  const isChatPribadiMahasiswaUnread = useSelector(
    (state: RootState) => state.pesanPribadi?.isPesanPribadiMahasiswaUnread
  );
  const isChatPribadiDosenPAUnread = useSelector(
    (state: RootState) => state.pesanPribadi?.isPesanPribadiDosenPAUnread
  );

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

  const pathname = usePathname();
  const userId: number = dataUser?.id;
  const dosenPaId: number = dataUser?.dosen_pa_id;

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
  const closeProfileMobileModal = () => {
    setIsModalProfileMobileOpen(false);
  };

  const closeNotificationMobileModal = () => {
    setIsModalNotificationMobileOpen(false);
  };

  const isActive = (path: string) => pathname === path;

  const isLoading =
    !roleUser ||
    !dataUser ||
    notificationCount === undefined ||
    notificationCount === null;

  useEffect(() => {
    if (roleUser && dataUser?.id) {
      dispatch(fetchNotifikasi({ roleUser, userId }));
    }
    if (["Mahasiswa", "Dosen PA"].includes(roleUser) && dataUser?.id) {
      dispatch(fetchPesanPribadi({ userId, roleUser }));
    }
    if (
      ["Mahasiswa"].includes(roleUser) &&
      dataUser?.id &&
      dataUser?.dosen_pa_id
    ) {
      dispatch(fetchPesanSiaran()).then(() => {
        dispatch(
          fetchStatusPesanSiaran({
            userId: dataUser.id,
            dosenPaId: dataUser.dosen_pa_id,
          })
        );
      });
    }
  }, [dispatch, roleUser, dataUser?.id]);

  useEffect(() => {
    const count = dataNotifikasi?.filter((data) => data.read === false).length;

    setNotificationCount(count);
  }, [dataNotifikasi]);

  useEffect(() => {
    if (roleUser === "Mahasiswa") {
      if (isPesanSiaranDosenPAUnread) {
        setIsUnreadDosenPAMessages(true);
      }
    } else if (roleUser === "Dosen PA") {
      if (isChatPribadiMahasiswaUnread) {
        setIsUnreadMahasiswaMessages(true);
      }
    }
  }, [
    isPesanSiaranDosenPAUnread,
    isChatPribadiMahasiswaUnread,
    isChatPribadiDosenPAUnread,
  ]);

  if (isLoading) return <SkeletonNavbar />;

  return (
    <>
      {/* Navbar atas untuk layar medium ke atas */}
      <div
        className={`fixed z-[999] flex justify-between md:justify-start w-full bg-white border py-5 px-[24px] md:px-[52px] ${roleUser === "Dosen PA" && "md:px-[40px]"} md:flex`}
      >
        <LogoBimafik className="md:hidden size-[40px]" />
        <div
          className={`hidden md:flex ${roleUser === "Dosen PA" && "md:w-[30%]"} md:w-[35%] items-center gap-5`}
        >
          <Logo className="size-[40px]" />
          <a href="/" className="font-semibold">
            Bimbingan Akademik Mahasiswa FIK
          </a>
        </div>
        <div
          className={`hidden md:flex items-center pl-8 ${
            roleUser !== "Mahasiswa" ||
            (roleUser === "Mahasiswa" && !dataUser?.status_lulus)
              ? ""
              : "gap-[40px]"
          } w-[45%] ${roleUser === "Dosen PA" && "md:w-[60%]"} ${roleUser === "Kaprodi" ? "gap-12 pl-[132px]" : "gap-6"} md:flex`}
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
            className={`
    ${isActive("/pengajuan-bimbingan") ? "font-bold text-orange-500" : ""}
    ${
      roleUser !== "Mahasiswa" ||
      (roleUser === "Mahasiswa" && dataUser?.status_lulus)
        ? "hidden"
        : ""
    }
  `}
          >
            Pengajuan Bimbingan
          </Link>

          <Link
            href="/perwalian-wajib"
            className={`${
              isActive("/perwalian-wajib") ? "font-bold text-orange-500" : ""
            } ${roleUser !== "Dosen PA" && "hidden"}`}
          >
            Perwalian Wajib
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
        <div className="flex gap-10 justify-end md:w-[20%] items-center md:flex">
          {roleUser !== "Kaprodi" && (
            <Link href="/chatpribadi" className="relative">
              <MessageSquareText className="hover:text-[#FB923C] cursor-pointer" />
              {/* Titik merah untuk menandakan chat belum dibalas */}
              {roleUser === "Mahasiswa" && isUnreadDosenPAMessages && (
                <span className="absolute top-[-5px] right-[-5px] bg-red-600 rounded-full w-2.5 h-2.5" />
              )}
              {roleUser === "Dosen PA" && isUnreadMahasiswaMessages && (
                <span className="absolute top-[-5px] right-[-5px] bg-red-600 rounded-full w-2.5 h-2.5" />
              )}
            </Link>
          )}
          <div
            className="relative inline-block cursor-pointer hidden md:block"
            onClick={() => setIsModalNotificationOpen((prev) => !prev)}
          >
            <Bell className="hover:text-[#FB923C] cursor-pointer" />
            {notificationCount > 0 && (
              <span className="absolute top-[-5px] right-[-5px] bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </div>
          {dataUser?.profile_image ? (
            <img
              src={`../${dataUser.profile_image}`}
              alt="Profile"
              className="hidden rounded-full size-8 cursor-pointer md:block"
              onClick={handleProfileClick}
            />
          ) : (
            <ProfileImage
              className="hidden md:block size-8 cursor-pointer"
              onClick={handleProfileClick}
            />
          )}
        </div>
        {isModalNotificationOpen && (
          <NotificationModal
            dataNotifikasi={dataNotifikasi}
            className={`fixed inset-0 flex items-start ${roleUser === "Dosen PA" ? "mt-[70px] mr-[112px]" : "mt-[70px] mr-[110px]"} justify-end z-50`}
            onClose={closeNotificationModal}
            onRead={() => dispatch(fetchNotifikasi({ roleUser, userId }))}
            dataUser={dataUser}
            roleUser={roleUser}
          />
        )}
        {isModalProfileOpen && (
          <ProfileModal
            className="fixed inset-0 flex items-start mt-[70px] mr-[50px] justify-end z-50"
            onClose={closeProfileModal}
          />
        )}
      </div>
      <div className="fixed z-[999] bottom-0 left-0 w-full bg-white border-t flex py-3 md:hidden">
        <div className="flex items-center justify-around w-full">
          <a
            href="/"
            className={`flex flex-col ${roleUser === "Mahasiswa" ? "w-1/5" : roleUser === "Dosen PA" ? "w-1/6" : roleUser === "Kaprodi" ? "w-1/4" : ""} items-center ${isActive("/") ? "text-orange-500" : ""}`}
          >
            <Home className="size-6" />
            <span className="text-xs">Beranda</span>
          </a>
          <Link
            href="/informasi-akademik"
            className={`flex flex-col ${roleUser === "Mahasiswa" ? "w-1/5" : roleUser === "Dosen PA" ? "w-1/6" : roleUser === "Kaprodi" ? "w-1/4" : ""} items-center ${isActive("/informasi-akademik") ? "text-orange-500" : ""}`}
          >
            <BookOpen className="size-6" />
            <span className="text-xs">Informasi</span>
          </Link>
          {roleUser === "Mahasiswa" && (
            <Link
              href="/pengajuan-bimbingan"
              className={`flex flex-col ${roleUser === "Mahasiswa" ? "w-1/5" : roleUser === "Dosen PA" ? "w-1/6" : roleUser === "Kaprodi" ? "w-1/4" : ""} items-center ${isActive("/pengajuan-bimbingan") ? "text-orange-500" : ""}`}
            >
              <FilePlus className="size-6" />
              <span className="text-xs">Pengajuan</span>
            </Link>
          )}
          {roleUser === "Dosen PA" && (
            <Link
              href="/laporan-bimbingan"
              className={`flex flex-col ${roleUser === "Mahasiswa" ? "w-1/5" : roleUser === "Dosen PA" ? "w-1/6" : roleUser === "Kaprodi" ? "w-1/4" : ""} items-center ${isActive("/laporan-bimbingan") ? "text-orange-500" : ""}`}
            >
              <FileText className="size-6" />
              <span className="text-xs">Laporan</span>
            </Link>
          )}
          {roleUser === "Dosen PA" && (
            <Link
              href="/perwalian-wajib"
              className={`flex flex-col ${roleUser === "Mahasiswa" ? "w-1/5" : roleUser === "Dosen PA" ? "w-1/6" : roleUser === "Kaprodi" ? "w-1/4" : ""} items-center ${isActive("/perwalian-wajib") ? "text-orange-500" : ""}`}
            >
              <School className="size-6" />
              <span className="text-xs">Perwalian</span>
            </Link>
          )}
          <div
            className={`relative flex flex-col items-center ${roleUser === "Mahasiswa" ? "w-1/5" : roleUser === "Dosen PA" ? "w-1/6" : roleUser === "Kaprodi" ? "w-1/4" : ""}`}
            onClick={() => setIsModalNotificationMobileOpen((prev) => !prev)}
          >
            <Bell className="size-6" />
            {notificationCount > 0 && (
              <span className="absolute bg-red-600 top-[-5px] left-[45px] text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
            <span className="text-xs">Notifikasi</span>
          </div>
          <div
            className={`flex flex-col items-center ${roleUser === "Mahasiswa" ? "w-1/5" : roleUser === "Dosen PA" ? "w-1/6" : roleUser === "Kaprodi" ? "w-1/4" : ""}`}
            onClick={() => setIsModalProfileMobileOpen((prev) => !prev)}
          >
            {dataUser?.profile_image ? (
              <img
                src={`../${dataUser.profile_image}`}
                alt="Profile"
                className="rounded-full size-6"
                width={24}
                height={24}
              />
            ) : (
              <User className="size-6" />
            )}
            <span className="text-xs">Profil</span>
          </div>
        </div>
        {isModalNotificationMobileOpen && (
          <NotificationModal
            dataNotifikasi={dataNotifikasi}
            onRead={() => dispatch(fetchNotifikasi({ roleUser, userId }))}
            className="fixed inset-0 flex items-end mb-[90px] mr-3 justify-end z-50"
            onClose={closeNotificationMobileModal}
            dataUser={dataUser}
            roleUser={roleUser}
          />
        )}
        {isModalProfileMobileOpen && (
          <ProfileModal
            className="fixed inset-0 flex items-end mb-[90px] mr-3 justify-end z-50"
            onClose={closeProfileMobileModal}
          />
        )}
      </div>
    </>
  );
};

export default NavbarUser;
