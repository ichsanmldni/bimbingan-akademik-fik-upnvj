"use client";

import Logo from "@/components/ui/LogoUPNVJ";
import NavbarUser from "@/components/ui/NavbarUser";
import NavbarAdmin from "@/components/ui/NavbarAdmin";
import AdminPage from "@/components/features/home/admin/AdminPage";
import landingPageImage from "../assets/images/landing-page.png";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import chatbotIcon from "../assets/images/chatbot.png";
import { Provider, useDispatch } from "react-redux";
import store from "@/components/store/store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

export default function Home() {
  const cards = Array(9).fill(null);

  const [roleUser, setRoleUser] = useState<any>("");
  const [activeNavbar, setActiveNavbar] = useState<any>("Dashboard");
  const [dataDosenPA, setDataDosenPA] = useState<any>([]);
  const [dataKaprodi, setDataKaprodi] = useState<any>([]);
  const [dataMahasiswa, setDataMahasiswa] = useState<any>([]);
  const [dataUser, setDataUser] = useState<any>(null);
  const [isNavigating, setIsNavigating] = useState<any>(false);

  useEffect(() => {
    if (isNavigating) {
      // Reset isNavigating after a short delay
      const timer = setTimeout(() => {
        setIsNavigating(false);
      }, 1000); // Delay for 1 second

      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [isNavigating]);

  const getDataMahasiswa = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/datamahasiswa`);

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      setDataMahasiswa(response.data);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataDosenPA = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/datadosenpa`);

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      setDataDosenPA(response.data);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataKaprodi = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/datakaprodi`);

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      setDataKaprodi(response.data);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const authTokenCookie = cookies.find((row) => row.startsWith("authToken="));

    if (authTokenCookie) {
      const token = authTokenCookie.split("=")[1];
      try {
        const decodedToken: any = jwtDecode(token);
        setDataUser(decodedToken);

        if (decodedToken.role === "Mahasiswa") {
          setRoleUser("Mahasiswa");
        } else if (
          decodedToken.role === "Dosen PA" &&
          dataDosenPA.find((data) => data.nip === decodedToken.nip)
        ) {
          setRoleUser("Dosen PA");
        } else if (
          decodedToken.role === "Kaprodi" &&
          dataKaprodi.find((data) => data.nip === decodedToken.nip)
        ) {
          setRoleUser("Kaprodi");
        } else if (decodedToken.role === "Admin") {
          setRoleUser("Admin");
        }
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, [dataDosenPA, dataKaprodi]);

  useEffect(() => {
    getDataDosenPA();
    getDataKaprodi();
    getDataMahasiswa();
  }, []);

  return (
    <Provider store={store}>
      <div>
        {["Mahasiswa", "Dosen PA", "Kaprodi"].includes(roleUser) && (
          <div>
            <NavbarUser
              roleUser={roleUser}
              dataUser={
                roleUser === "Mahasiswa"
                  ? dataMahasiswa.find((data) => data.nim === dataUser?.nim)
                  : roleUser === "Dosen PA"
                    ? dataDosenPA.find((data) => data.nip === dataUser?.nip)
                    : roleUser === "Kaprodi"
                      ? dataKaprodi.find((data) => data.nip === dataUser?.nip)
                      : null
              }
            />
            <div className="bg-slate-100 h-screen">
              <div className="flex flex-col md:flex-row h-full justify-center md:items-center gap-[80px] mx-[28px] md:mx-[128px]">
                {roleUser === "Mahasiswa" && (
                  <div className="flex flex-col gap-5 md:w-2/5">
                    <h1 className="font-[800] text-[24px] md:text-[40px]">
                      Ajukan bimbingan akademik sekarang dan raih sukses
                      akademik!
                    </h1>
                    <Link
                      className="bg-orange-500 hover:bg-orange-600 md:w-1/3 rounded-lg py-2.5 text-white text-[14px] font-[500] text-center"
                      href="/pengajuan-bimbingan"
                    >
                      Ajukan Bimbingan
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
                <Image
                  alt="chatbot-icon"
                  className="size-8"
                  src={chatbotIcon}
                />
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
    </Provider>
  );
}
