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

interface User {
  id: number;
  role: string;
  // Add other properties based on your user data structure
}

interface Dosen {
  id: number;
  // Add other properties based on your dosen data structure
}

interface Mahasiswa {
  id: number;
  // Add other properties based on your mahasiswa data structure
}

interface Kaprodi {
  id: number;
  // Add other properties based on your kaprodi data structure
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

export default function Home() {
  const cards = Array(9).fill(null);

  const [roleUser, setRoleUser] = useState<string>("");
  const [activeNavbar, setActiveNavbar] = useState<string>("Dashboard");
  const [dataDosenPA, setDataDosenPA] = useState<Dosen[]>([]);
  const [dataKaprodi, setDataKaprodi] = useState<Kaprodi[]>([]);
  const [dataDosen, setDataDosen] = useState<Dosen[]>([]);
  const [dataMahasiswa, setDataMahasiswa] = useState<Mahasiswa[]>([]);
  const [dataUser, setDataUser] = useState<User | null>(null);

  const getDataDosen = async () => {
    try {
      const response = await axios.get<Dosen[]>(
        `${API_BASE_URL}/api/datadosen`
      );

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      setDataDosen(response.data);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataMahasiswa = async () => {
    try {
      const response = await axios.get<Mahasiswa[]>(
        `${API_BASE_URL}/api/datamahasiswa`
      );

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
      const response = await axios.get<Dosen[]>(
        `${API_BASE_URL}/api/datadosenpa`
      );

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
      const response = await axios.get<Kaprodi[]>(
        `${API_BASE_URL}/api/datakaprodi`
      );

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
        const decodedToken = jwtDecode<User>(token);
        setDataUser(decodedToken);

        if (decodedToken.role === "Mahasiswa") {
          setRoleUser("Mahasiswa");
        } else if (
          decodedToken.role === "Dosen" &&
          dataDosenPA.find((data) => data.dosen_id === decodedToken.id)
        ) {
          setRoleUser("Dosen PA");
        } else if (
          decodedToken.role === "Dosen" &&
          dataKaprodi.find((data) => data.dosen_id === decodedToken.id)
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
    getDataDosen();
    getDataMahasiswa();
  }, []);
  console.log(dataKaprodi);
  console.log(roleUser);
  console.log(dataUser);

  return (
    <div>
      {["Mahasiswa", "Dosen PA", "Kaprodi"].includes(roleUser) && (
        <div>
          <NavbarUser
            roleUser={roleUser}
            dataUser={
              roleUser === "Mahasiswa"
                ? dataMahasiswa.find((data) => data.id === dataUser?.id)
                : roleUser === "Dosen PA"
                  ? dataDosen.find((data) => data.id === dataUser?.id)
                  : roleUser === "Kaprodi"
                    ? dataDosen.find((data) => data.id === dataUser?.id)
                    : null
            }
          />
          <div className="bg-slate-100 h-screen">
            <div className="flex h-full items-center gap-[80px] mx-[128px]">
              {roleUser === "Mahasiswa" && (
                <div className="flex flex-col gap-5 w-2/5">
                  <h1 className="font-[800] text-[40px]">
                    Ajukan bimbingan konseling sekarang dan raih sukses
                    akademik!
                  </h1>
                  <Link
                    className="bg-orange-500 hover:bg-orange-600 w-1/3 rounded-lg py-2.5 text-white text-[14px] font-[500] text-center"
                    href="/pengajuan-bimbingan"
                  >
                    Ajukan Bimbingan
                  </Link>
                </div>
              )}
              {roleUser === "Dosen PA" && (
                <div className="flex flex-col gap-5">
                  <h1 className="font-[800] text-[40px]">
                    Laporkan Hasil Bimbingan untuk Membantu Mahasiswa Lebih
                    Baik!
                  </h1>
                  <p>
                    Pastikan bimbingan Anda terdokumentasi dengan baik untuk
                    membantu mahasiswa berkembang.
                  </p>
                  <Link
                    className="bg-orange-500 hover:bg-orange-600 w-[35%] rounded-lg py-2.5 text-white text-[14px] font-[500] text-center"
                    href="/laporan-bimbingan"
                  >
                    Laporkan Bimbingan
                  </Link>
                </div>
              )}
              {roleUser === "Kaprodi" && (
                <div className="flex flex-col gap-5 w-2/5">
                  <h1 className="font-[800] text-[40px]">
                    Pantau dan Evaluasi Laporan Bimbingan!
                  </h1>
                  <p>
                    Lihat laporan bimbingan untuk memahami permasalahan
                    mahasiswa dan ambil langkah preventif demi keberhasilan
                    akademik yang berkelanjutan.
                  </p>
                  <Link
                    className="bg-orange-500 hover:bg-orange-600 w-1/3 rounded-lg py-2.5 text-white text-[14px] font-[500] text-center"
                    href="/pengajuan-bimbingan"
                  >
                    Tinjau Laporan
                  </Link>
                </div>
              )}
              <Image
                className={`${roleUser === "Dosen PA" ? "w-[46%]" : "w-1/2"}`}
                src={landingPageImage}
                alt="Konseling"
              />
            </div>
          </div>
          {roleUser === "Mahasiswa" && (
            <Link
              href="/chatbot"
              className="fixed bottom-8 right-8 bg-orange-500 p-4 rounded-full hover:bg-orange-600 shadow-lg"
              aria-label="Akses Chatbot"
            >
              <Image alt="chatbot-icon" className="size-8" src={chatbotIcon} />
            </Link>
          )}
          <div className="text-center border-b">
            <h1 className="text-[30px] font-semibold mt-16">
              Rekomendasi artikel
            </h1>
            <p className="mt-4">
              Temukan artikel populer terkait yang membantu Anda memahami topik
              akademik lebih dalam dan mendukung pencapaian studi Anda.
            </p>
            <div className="mt-10 text-start grid grid-cols-3 mx-32 gap-12">
              {cards.map((_, index) => (
                <div key={index} className="border rounded-lg">
                  <Image src={landingPageImage} alt="contoh" />
                  <div className="flex flex-col gap-2 bg-slate-50 p-4">
                    <h1 className="font-semibold text-[24px]">Judul</h1>
                    <p className="text-[16px]">Tanggal</p>
                    <p className="text-[16px]">Content</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="my-12">
              <Link
                className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg font-medium text-white"
                href="/artikel"
              >
                Lihat Artikel Lainnya
              </Link>
            </div>
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
