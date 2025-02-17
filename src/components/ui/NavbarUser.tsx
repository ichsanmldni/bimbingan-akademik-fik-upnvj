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

const NavbarUser: React.FC<any> = ({ roleUser, dataUser }) => {
  const [isModalNotificationOpen, setIsModalNotificationOpen] = useState(false);
  const [isModalProfileOpen, setIsModalProfileOpen] = useState(false);
  const [isModalNotificationMobileOpen, setIsModalNotificationMobileOpen] =
    useState(false);
  const [isModalProfileMobileOpen, setIsModalProfileMobileOpen] =
    useState(false);
  const [dataNotifikasi, setDataNotifikasi] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isUnreadMahasiswaMessages, setIsUnreadMahasiswaMessages] =
    useState(false);
  const [isUnreadDosenPAMessages, setIsUnreadDosenPAMessages] = useState(false);
  const [isChatPribadiMahasiswaUnread, setIsChatPribadiMahasiswaUnread] =
    useState(false);
  const [isPesanSiaranDosenPAUnread, setIsPesanSiaranDosenPAUnread] =
    useState(false);
  const [isChatPribadiDosenPAUnread, setIsChatPribadiDosenPAUnread] =
    useState(false);
  const [dataPesanSiaran, setDataPesanSiaran] = useState([]);

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
  const closeProfileMobileModal = () => {
    setIsModalProfileMobileOpen(false);
  };

  const closeNotificationMobileModal = () => {
    setIsModalNotificationMobileOpen(false);
  };

  const isActive = (path: string) => pathname === path;

  const getIsChatPribadiDosenPAReadByUserId = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/chatpribadi`);

      const dataChatPribadi = response.data;

      const chatPribadiUser = dataChatPribadi.find(
        (data) => data.mahasiswa_id === dataUser.id
      );

      const isMahasiswaRead = chatPribadiUser.is_mahasiswa_pesan_terakhir_read;

      setIsChatPribadiDosenPAUnread(!isMahasiswaRead);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getIsChatPribadiMahasiswaReadByUserId = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/chatpribadi`);

      const dataChatPribadi = response.data;

      const chatPribadiUser = dataChatPribadi.filter(
        (data) => data.dosen_pa_id === dataUser.id
      );

      const isDosenPAReadAll = chatPribadiUser.every(
        (data) => data.is_dosenpa_pesan_terakhir_read === true
      );

      setIsChatPribadiMahasiswaUnread(!isDosenPAReadAll);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataPesanSiaran = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/pesansiaran`);

      const dataPesanSiaran = response.data;

      setDataPesanSiaran(dataPesanSiaran);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };
  const getIsPesanSiaranReadByUserId = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/statuspembacaanpesansiaran`
      );

      const dataStatusPembacaanPesanSiaran = response.data;

      const pesanSiaranUser = dataPesanSiaran.find(
        (data) => data.dosen_pa_id === dataUser.dosen_pa_id
      );

      const dataStatusPembacaanPesanSiaranUser = dataStatusPembacaanPesanSiaran
        .filter((data) => data.pesan_siaran_id === pesanSiaranUser.id)
        .find((data) => data.mahasiswa_id === dataUser.id);

      const isPesanSiaranUserRead = dataStatusPembacaanPesanSiaranUser.is_read;

      setIsPesanSiaranDosenPAUnread(!isPesanSiaranUserRead);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

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
      setDataNotifikasi(notifikasiUser);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  useEffect(() => {
    const count = dataNotifikasi?.filter((data) => data.read === false).length;
    setNotificationCount(count);
  }, [dataNotifikasi]);

  useEffect(() => {
    if (dataUser && dataUser.id) {
      if (roleUser === "Dosen PA") {
        getDataNotifikasiByUserId();
        getIsChatPribadiMahasiswaReadByUserId();
      } else if (roleUser === "Mahasiswa") {
        getDataNotifikasiByUserId();
        getIsChatPribadiDosenPAReadByUserId();
        getIsPesanSiaranReadByUserId();
      } else if (roleUser === "Kaprodi") {
        getDataNotifikasiByUserId();
      }
    }
  }, [dataUser]);

  useEffect(() => {
    if (roleUser === "Mahasiswa") {
      if (isPesanSiaranDosenPAUnread || isChatPribadiDosenPAUnread) {
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

  useEffect(() => {
    if (roleUser === "Mahasiswa") {
      getDataPesanSiaran();
    }
  }, []);

  return (
    <>
      {/* Navbar atas untuk layar medium ke atas */}
      <div
        className={`fixed z-[999] flex justify-between md:justify-start w-full bg-white border py-5 px-[24px] md:px-[72px] ${roleUser === "Dosen PA" && "md:px-[40px]"} md:flex`}
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
          className={`hidden md:flex items-center pl-8 w-[45%] ${roleUser === "Dosen PA" && "md:w-[50%]"} ${roleUser === "Kaprodi" ? "gap-12 pl-[132px]" : "gap-6"} md:flex`}
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
              isActive("/pengajuan-bimbingan")
                ? "font-bold text-orange-500"
                : ""
            } ${roleUser !== "Mahasiswa" && "hidden"}`}
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
            <Image
              src={notificationIcon}
              alt="Notification Icon"
              className="w-6 h-6 cursor-pointer"
              width={24}
              height={24}
            />
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
            className={`fixed inset-0 flex items-start ${roleUser === "Dosen PA" ? "mt-[70px] mr-[112px]" : "mt-[70px] mr-[180px]"} justify-end z-50`}
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
            className="fixed inset-0 flex items-end mb-[90px] mr-3 justify-end z-50"
            onClose={closeNotificationMobileModal}
            refreshData={getDataNotifikasiByUserId}
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
