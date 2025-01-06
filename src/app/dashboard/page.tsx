"use client";

import Logo from "@/components/ui/LogoUPNVJ";
import Link from "next/link";
import { useEffect, useState } from "react";
import NavbarUser from "@/components/ui/NavbarUser";
import { jwtDecode } from "jwt-decode";
import DashboardDosenPA from "@/components/features/dashboard/DashboardDosenPA";
import DashboardMahasiswa from "@/components/features/dashboard/DashboardMahasiswa";
import DashboardKaprodi from "@/components/features/dashboard/DashboardKaprodi";
import axios from "axios";
import { env } from "process";

interface User {
  id: number;
  role: string;
}

interface Dosen {
  id: number;
  // Add other dosen properties as needed
}

interface DosenPA {
  dosen_id: number;
  // Add other Dosen PA properties as needed
}

interface Kaprodi {
  dosen_id: number;
  // Add other Kaprodi properties as needed
}

interface Mahasiswa {
  id: number;
  // Add other mahasiswa properties as needed
}

export default function Home() {
  const [dataUser, setDataUser] = useState<any>(null);
  const [dataDosen, setDataDosen] = useState<Dosen[]>([]);
  const [dataDosenPA, setDataDosenPA] = useState<DosenPA[]>([]);
  const [dataKaprodi, setDataKaprodi] = useState<Kaprodi[]>([]);
  const [dataMahasiswa, setDataMahasiswa] = useState<Mahasiswa[]>([]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

  const [selectedSubMenuDashboard, setSelectedSubMenuDashboard] =
    useState<string>("");
  const [roleUser, setRoleUser] = useState<string>("");

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
    getDataDosen();
    getDataDosenPA();
    getDataKaprodi();
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
        setSelectedSubMenuDashboard("Profile Mahasiswa");
      } else if (dataUser.role === "Dosen") {
        const isDosenPA = dataDosenPA.find(
          (data) => data.dosen_id === dataUser.id
        );
        const isKaprodi = dataKaprodi.find(
          (data) => data.dosen_id === dataUser.id
        );
        if (isDosenPA) {
          setRoleUser("Dosen PA");
          setSelectedSubMenuDashboard("Profile Dosen PA");
        } else if (isKaprodi) {
          setRoleUser("Kaprodi");
          setSelectedSubMenuDashboard("Profile Kaprodi");
        }
      } else {
        setSelectedSubMenuDashboard("");
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
      <div className="flex w-full pt-[80px]">
        <div className="flex flex-col w-[25%] border ml-32 gap-6 pt-8 pb-6 px-8">
          <h1 className="text-[18px] font-semibold">Dashboard {roleUser}</h1>
          {roleUser === "Mahasiswa" && (
            <div className="flex flex-col gap-1">
              <button
                className={`${selectedSubMenuDashboard === "Profile Mahasiswa" && "bg-orange-400 text-white font-medium"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={() => setSelectedSubMenuDashboard("Profile Mahasiswa")}
              >
                Profile Mahasiswa
              </button>
              <button
                className={`${selectedSubMenuDashboard === "Jadwal Kosong Dosen PA Role Mahasiswa" && "bg-orange-400 text-white font-medium"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={() =>
                  setSelectedSubMenuDashboard(
                    "Jadwal Kosong Dosen PA Role Mahasiswa"
                  )
                }
              >
                Jadwal Kosong Dosen PA
              </button>
              <button
                className={`${selectedSubMenuDashboard === "Absensi Bimbingan" && "bg-orange-400 text-white font-medium"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={() => setSelectedSubMenuDashboard("Absensi Bimbingan")}
              >
                Absensi Bimbingan
              </button>
              <button
                className={`${selectedSubMenuDashboard === "Riwayat Pengajuan Bimbingan" && "bg-orange-400 text-white font-medium"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={() =>
                  setSelectedSubMenuDashboard("Riwayat Pengajuan Bimbingan")
                }
              >
                Riwayat Pengajuan Bimbingan
              </button>
            </div>
          )}
          {roleUser === "Dosen PA" && (
            <div className="flex flex-col gap-1">
              <button
                className={`${selectedSubMenuDashboard === "Profile Dosen PA" && "bg-orange-400 text-white font-medium"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={() => setSelectedSubMenuDashboard("Profile Dosen PA")}
              >
                Profile Dosen PA
              </button>
              <button
                className={`${selectedSubMenuDashboard === "Jadwal Kosong Dosen Role Dosen PA" && "bg-orange-400 text-white font-medium"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={() =>
                  setSelectedSubMenuDashboard(
                    "Jadwal Kosong Dosen Role Dosen PA"
                  )
                }
              >
                Jadwal Kosong Dosen
              </button>
              <button
                className={`${selectedSubMenuDashboard === "Pengesahan Absensi Bimbingan" && "bg-orange-400 text-white font-medium"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={() =>
                  setSelectedSubMenuDashboard("Pengesahan Absensi Bimbingan")
                }
              >
                Pengesahan Absensi Bimbingan
              </button>
              <button
                className={`${selectedSubMenuDashboard === "Pengajuan Bimbingan Konseling Mahasiswa" && "bg-orange-400 text-white font-medium"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={() =>
                  setSelectedSubMenuDashboard(
                    "Pengajuan Bimbingan Konseling Mahasiswa"
                  )
                }
              >
                Pengajuan Bimbingan Konseling Mahasiswa
              </button>
              <button
                className={`${selectedSubMenuDashboard === "Riwayat Laporan Bimbingan Role Dosen PA" && "bg-orange-400 text-white font-medium"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={() =>
                  setSelectedSubMenuDashboard(
                    "Riwayat Laporan Bimbingan Role Dosen PA"
                  )
                }
              >
                Riwayat Laporan Bimbingan
              </button>
            </div>
          )}
          {roleUser === "Kaprodi" && (
            <div className="flex flex-col gap-1">
              <button
                className={`${selectedSubMenuDashboard === "Profile Kaprodi" && "bg-orange-400 text-white font-medium"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={() => setSelectedSubMenuDashboard("Profile Kaprodi")}
              >
                Profile Kaprodi
              </button>
              <button
                className={`${selectedSubMenuDashboard === "Statistik Bimbingan Konseling" && "bg-orange-400 text-white font-medium"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={() =>
                  setSelectedSubMenuDashboard("Statistik Bimbingan Konseling")
                }
              >
                Statistik Bimbingan Konseling
              </button>
              <button
                className={`${selectedSubMenuDashboard === "Data Dosen PA" && "bg-orange-400 text-white font-medium"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={() => setSelectedSubMenuDashboard("Data Dosen PA")}
              >
                Data Dosen PA
              </button>
              <button
                className={`${selectedSubMenuDashboard === "Riwayat Laporan Bimbingan Role Kaprodi" && "bg-orange-400 text-white font-medium"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={() =>
                  setSelectedSubMenuDashboard(
                    "Riwayat Laporan Bimbingan Role Kaprodi"
                  )
                }
              >
                Riwayat Laporan Bimbingan
              </button>
            </div>
          )}
        </div>
        {roleUser === "Mahasiswa" && (
          <DashboardMahasiswa
            selectedSubMenuDashboard={selectedSubMenuDashboard}
            dataUser={dataUser || {}}
          />
        )}
        {roleUser === "Dosen PA" && (
          <DashboardDosenPA
            selectedSubMenuDashboard={selectedSubMenuDashboard}
            dataUser={dataUser || {}}
          />
        )}
        {roleUser === "Kaprodi" && (
          <DashboardKaprodi
            selectedSubMenuDashboard={selectedSubMenuDashboard}
            dataUser={dataUser || {}}
          />
        )}
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
