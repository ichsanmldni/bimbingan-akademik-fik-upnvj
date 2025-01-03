"use client";

import Logo from "@/components/ui/LogoUPNVJ";
import NavbarUser from "@/components/ui/NavbarUser";
import landingPageImage from "../../assets/images/landing-page.png";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { env } from "process";

interface User {
  id: number;
  role: string;
  // Add other user properties as needed
}

interface DosenPA {
  dosen_id: number;
  // Add other Dosen PA properties as needed
}

interface Kaprodi {
  dosen_id: number;
  // Add other Kaprodi properties as needed
}

interface Dosen {
  id: number;
  // Add other Dosen properties as needed
}

interface Mahasiswa {
  id: number;
  // Add other Mahasiswa properties as needed
}

export default function Home() {
  const cards = Array(9).fill(null);
  const [roleUser, setRoleUser] = useState<string>("");
  const [dataUser, setDataUser] = useState<User | null>(null);
  const [dataDosenPA, setDataDosenPA] = useState<DosenPA[]>([]);
  const [dataKaprodi, setDataKaprodi] = useState<Kaprodi[]>([]);
  const [dataDosen, setDataDosen] = useState<Dosen[]>([]);
  const [dataMahasiswa, setDataMahasiswa] = useState<Mahasiswa[]>([]);
  const router = useRouter();

  const API_BASE_URL = env.API_BASE_URL as string;

  const handleDetailArticle = () => {
    router.push("/artikel/123");
  };

  const getDataDosenPA = async () => {
    try {
      const response = await axios.get<DosenPA[]>(
        `${API_BASE_URL}/api/datadosenpa`
      );

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = response.data;
      setDataDosenPA(data);
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

      const data = response.data;
      setDataKaprodi(data);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataDosen = async () => {
    try {
      const response = await axios.get<Dosen[]>(
        `${API_BASE_URL}/api/datadosen`
      );

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = response.data;
      setDataDosen(data);
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

      const data = response.data;
      setDataMahasiswa(data);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  useEffect(() => {
    getDataDosenPA();
    getDataKaprodi();
    getDataDosen();
    getDataMahasiswa();
    const cookies = document.cookie.split("; ");
    const authTokenCookie = cookies.find((row) => row.startsWith("authToken="));

    if (authTokenCookie) {
      const token = authTokenCookie.split("=")[1];
      try {
        const decodedToken = jwtDecode<User>(token);
        setDataUser(decodedToken);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (dataUser) {
      if (dataUser.role === "Mahasiswa") {
        setRoleUser("Mahasiswa");
      } else if (dataUser.role === "Dosen") {
        const isDosenPA = dataDosenPA.find(
          (data) => data.dosen_id === dataUser.id
        );
        const isKaprodi = dataKaprodi.find(
          (data) => data.dosen_id === dataUser.id
        );
        if (isDosenPA) {
          setRoleUser("Dosen PA");
        } else if (isKaprodi) {
          setRoleUser("Kaprodi");
        }
      }
    }
  }, [dataUser, dataDosenPA, dataKaprodi]);

  return (
    <div>
      <NavbarUser
        roleUser={roleUser}
        dataUser={
          roleUser === "Mahasiswa"
            ? dataMahasiswa.find((data) => data.id === dataUser?.id) || {}
            : roleUser === "Dosen PA"
              ? dataDosen.find((data) => data.id === dataUser?.id) || {}
              : roleUser === "Kaprodi"
                ? dataDosen.find((data) => data.id === dataUser?.id) || {}
                : {}
        }
      />
      <div className="py-[100px] ">
        <h1 className="text-[36px] font-semibold text-center">
          Rekomendasi Berita
        </h1>
        <p className="text-center mt-4 m-auto w-1/2 text-[#525252]">
          Temukan artikel populer terkait yang membantu Anda memahami topik
          akademik lebih dalam dan mendukung pencapaian studi Anda.
        </p>

        <div className="mt-10 text-start grid grid-cols-3 mx-32 gap-12">
          {cards.map((_, index) => (
            <div
              key={index}
              className="border rounded-lg cursor-pointer"
              onClick={handleDetailArticle}
            >
              <Image src={landingPageImage} alt="contoh" />
              <div className="flex flex-col gap-2 bg-slate-50 p-4">
                <h1 className="font-semibold text-[24px]">Judul</h1>
                <p className="text-[16px]">Tanggal</p>
                <p className="text-[16px]">Content</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border">
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
  );
}
