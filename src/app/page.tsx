"use client";

import Logo from "@/components/ui/LogoUPNVJ";
import NavbarUser from "@/components/ui/NavbarUser";
import NavbarAdmin from "@/components/ui/NavbarAdmin";
import AdminPage from "@/components/features/home/admin/AdminPage";
import landingPageImage from "../assets/images/landing-page.png";
import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import chatbotIcon from "../assets/images/chatbot.png";
import { useDispatch, useSelector } from "react-redux";
import { fetchMahasiswa } from "../lib/features/mahasiswaSlice";
import { fetchDosenPA } from "../lib/features/dosenPASlice";
import { fetchKaprodi } from "../lib/features/kaprodiSlice";
import { fetchUser } from "../lib/features/userSlice";
import { fetchAuthUser } from "../lib/features/authSlice";
import { RootState, AppDispatch } from "../lib/store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const [activeNavbar, setActiveNavbar] = useState<string>("Manage Parameter");
  const [isNavigating, setIsNavigating] = useState(false);

  // Auth state
  const roleUser = useSelector((state: RootState) => state.auth.roleUser) || "";
  const dataUser = useSelector((state: RootState) => state.auth.dataUser);
  const statusAuthUser = useSelector((state: RootState) => state.auth.status);

  // Data states
  const dataMahasiswa = useSelector((state: RootState) => state.mahasiswa.data);
  const dataDosenPA = useSelector((state: RootState) => state.dosenPA.data);
  const dataKaprodi = useSelector((state: RootState) => state.kaprodi.data);

  // Status states
  const statusDataMahasiswa = useSelector(
    (state: RootState) => state.mahasiswa.status
  );
  const statusDataDosenPA = useSelector(
    (state: RootState) => state.dosenPA.status
  );
  const statusDataKaprodi = useSelector(
    (state: RootState) => state.kaprodi.status
  );
  const statusDataUser = useSelector((state: RootState) => state.user.status);
  // First, ensure authentication is complete
  useEffect(() => {
    dispatch(fetchAuthUser());
  }, []);

  // Handle navigation animation
  useEffect(() => {
    if (isNavigating) {
      const timer = setTimeout(() => setIsNavigating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isNavigating]);

  useEffect(() => {
    if (statusAuthUser === "succeeded") {
      // Only fetch data relevant to the user's role
      if (
        roleUser === "Mahasiswa" &&
        statusDataMahasiswa !== "succeeded" &&
        statusDataMahasiswa !== "loading"
      ) {
        dispatch(fetchMahasiswa());
        dispatch(fetchDosenPA());
        dispatch(fetchKaprodi());
      }
      if (
        (roleUser === "Dosen PA" || roleUser === "Admin") &&
        statusDataDosenPA !== "succeeded" &&
        statusDataDosenPA !== "loading"
      ) {
        dispatch(fetchMahasiswa());
        dispatch(fetchDosenPA());
        dispatch(fetchKaprodi());
      }
      if (
        (roleUser === "Kaprodi" || roleUser === "Admin") &&
        statusDataKaprodi !== "succeeded" &&
        statusDataKaprodi !== "loading"
      ) {
        dispatch(fetchMahasiswa());
        dispatch(fetchDosenPA());
        dispatch(fetchKaprodi());
      }
      if (
        roleUser === "Admin" &&
        statusDataUser !== "succeeded" &&
        statusDataUser !== "loading"
      ) {
        dispatch(fetchUser());
      }
    }
  }, [
    roleUser,
    statusAuthUser,
    statusDataMahasiswa,
    statusDataDosenPA,
    statusDataKaprodi,
    statusDataUser,
    dispatch,
  ]);

  // Get user data based on role
  const userData = useMemo(() => {
    if (!dataUser) return null;

    if (roleUser === "Mahasiswa" && statusDataMahasiswa === "succeeded") {
      return dataMahasiswa.find((data) => data.nim === dataUser?.nim) || null;
    }
    if (roleUser === "Dosen PA" && statusDataDosenPA === "succeeded") {
      return dataDosenPA.find((data) => data.email === dataUser?.email) || null;
    }
    if (roleUser === "Kaprodi" && statusDataKaprodi === "succeeded") {
      return dataKaprodi.find((data) => data.email === dataUser?.email) || null;
    }
    return null;
  }, [
    roleUser,
    dataUser,
    dataMahasiswa,
    dataDosenPA,
    dataKaprodi,
    statusDataMahasiswa,
    statusDataDosenPA,
    statusDataKaprodi,
  ]);

  useEffect(() => {
    dispatch(fetchMahasiswa());
    dispatch(fetchDosenPA());
    dispatch(fetchKaprodi());
  }, []);

  useEffect(() => {
    const requestPermission = async () => {
      const permission = await Notification.requestPermission();
    };
    requestPermission();
  }, []);

  return (
    <div>
      {["Mahasiswa", "Dosen PA", "Kaprodi"].includes(roleUser) && (
        <div>
          <NavbarUser roleUser={roleUser} dataUser={userData} />
          <div className="bg-slate-100 h-screen">
            <div className="flex flex-col md:flex-row h-full justify-center md:items-center gap-[80px] mx-[28px] md:mx-[128px]">
              {roleUser === "Mahasiswa" && !userData?.status_lulus && (
                <div className="flex flex-col gap-5 md:w-2/5">
                  <h1 className="font-[800] text-[24px] md:text-[40px]">
                    Ajukan bimbingan akademik sekarang dan raih sukses akademik!
                  </h1>
                  <Link
                    href="/pengajuan-bimbingan"
                    className="bg-orange-500 hover:bg-orange-600 md:w-1/3 rounded-lg py-2.5 text-white text-[14px] font-[500] text-center"
                  >
                    Ajukan Bimbingan
                  </Link>
                </div>
              )}
              {roleUser === "Mahasiswa" && userData?.status_lulus && (
                <div className="flex flex-col gap-5 md:w-2/5">
                  <h1 className="font-[800] text-[24px] md:text-[40px]">
                    Akses Riwayat Bimbingan Anda!
                  </h1>
                  <p className="text-[16px] leading-relaxed">
                    Layanan pengajuan bimbingan tidak tersedia untuk alumni.
                    Namun, Anda tetap dapat melihat riwayat bimbingan akademik
                    selama masa studi.
                  </p>
                  <Link
                    href="/dashboard?submenu=Riwayat%20Pengajuan%20Bimbingan"
                    className="bg-orange-500 hover:bg-orange-600 md:w-1/2 rounded-lg py-2.5 text-white text-[14px] font-[500] text-center"
                  >
                    Lihat Riwayat Bimbingan
                  </Link>
                </div>
              )}

              {roleUser === "Dosen PA" && (
                <div className="flex flex-col gap-5">
                  <h1 className="font-[800] text-[24px] md:text-[40px]">
                    Laporkan Hasil Bimbingan untuk Membantu Mahasiswa Lebih
                    Baik!
                  </h1>
                  <p>
                    Pastikan bimbingan Anda terdokumentasi dengan baik untuk
                    membantu mahasiswa berkembang.
                  </p>
                  <Link
                    className="bg-orange-500 hover:bg-orange-600 md:w-[35%] rounded-lg py-2.5 text-white text-[14px] font-[500] text-center"
                    href="/laporan-bimbingan"
                  >
                    Laporkan Bimbingan
                  </Link>
                </div>
              )}
              {roleUser === "Kaprodi" && (
                <div className="flex flex-col gap-5 w-full md:w-2/5">
                  <h1 className="font-[800] text-[24px] md:text-[40px]">
                    Pantau dan Evaluasi Laporan Bimbingan!
                  </h1>
                  <p>
                    Lihat laporan bimbingan untuk memahami permasalahan
                    mahasiswa dan ambil langkah preventif demi keberhasilan
                    akademik yang berkelanjutan.
                  </p>
                  <Link
                    className="bg-orange-500 hover:bg-orange-600 w-1/3 rounded-lg py-2.5 text-white text-[14px] font-[500] text-center"
                    href="/dashboard?submenu=Riwayat%20Laporan%20Bimbingan%20Role%20Kaprodi"
                  >
                    Tinjau Laporan
                  </Link>
                </div>
              )}
              <Image
                className={`${roleUser === "Dosen PA" ? "md:w-[46%]" : "md:w-1/2"}`}
                src={landingPageImage}
                alt="Bimbingan"
              />
            </div>
          </div>
          {roleUser === "Mahasiswa" && (
            <Link
              href="/chatbot"
              className="fixed top-[120px] right-4 md:top-[100px] md:right-8 bg-orange-500 p-4 rounded-full shadow-lg animate-pulse-size"
              aria-label="Akses Chatbot"
            >
              <Image alt="chatbot-icon" className="size-8" src={chatbotIcon} />
            </Link>
          )}

          <div className="hidden md:block border">
            <p className="text-center my-4 text-[16px]">
              Hak cipta &copy; 2025 Bimbingan Akademik Mahasiswa FIK UPNVJ
            </p>
          </div>
        </div>
      )}

      {roleUser === "Admin" && (
        <div className="flex h-screen">
          <NavbarAdmin
            activeNavbar={activeNavbar}
            setActiveNavbar={setActiveNavbar}
          />
          <AdminPage activeNavbar={activeNavbar} />
        </div>
      )}
    </div>
  );
}
