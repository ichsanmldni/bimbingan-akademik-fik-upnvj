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
import NavbarMahasiswa from "@/components/ui/NavbarMahasiswa";
import NavbarDosenPA from "@/components/ui/NavbarDosenPA";
import NavbarKaprodi from "@/components/ui/NavbarKaprodi";

export default function Home() {
  const [dataUser, setDataUser] = useState({});
  const [dataDosenPA, setDataDosenPA] = useState([]);
  const [dataKaprodi, setDataKaprodi] = useState([]);

  const [selectedSubMenuDashboard, setSelectedSubMenuDashboard] = useState("");
  const [roleUser, setRoleUser] = useState("");

  const getDataDosenPA = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/datadosenpa");

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      setDataDosenPA(data);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataKaprodi = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/datakaprodi");

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      setDataKaprodi(data);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  useEffect(() => {
    getDataDosenPA();
    getDataKaprodi();
    const cookies = document.cookie.split("; ");
    const authTokenCookie = cookies.find((row) => row.startsWith("authToken="));

    if (authTokenCookie) {
      const token = authTokenCookie.split("=")[1];
      try {
        const decodedToken = jwtDecode(token);
        setDataUser(decodedToken);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  useEffect(() => {
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
  }, [dataUser, dataDosenPA, dataKaprodi]);

  return (
    <div>
      <NavbarUser roleUser={roleUser} />
      <div className="flex w-full pt-[80px]">
        <div className="flex flex-col w-[25%] border ml-32 gap-6 pt-8 pb-6 px-8">
          <h1 className="text-[18px] font-semibold">Dashboard {roleUser}</h1>
          {roleUser === "Mahasiswa" && (
            <div className="flex flex-col gap-1">
              <button
                className={`${selectedSubMenuDashboard === "Profile Mahasiswa" && "bg-orange-400 text-white font-medium"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={(e) => {
                  setSelectedSubMenuDashboard("Profile Mahasiswa");
                }}
              >
                Profile Mahasiswa
              </button>
              <button
                className={`${selectedSubMenuDashboard === "Jadwal Kosong Dosen PA Role Mahasiswa" && "bg-orange-400 text-white font-medium"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={(e) => {
                  setSelectedSubMenuDashboard(
                    "Jadwal Kosong Dosen PA Role Mahasiswa"
                  );
                }}
              >
                Jadwal Kosong Dosen PA
              </button>
              <button
                className={`${selectedSubMenuDashboard === "Riwayat Pengajuan Konseling" && "bg-orange-400 text-white font-medium"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={(e) => {
                  setSelectedSubMenuDashboard("Riwayat Pengajuan Konseling");
                }}
              >
                Riwayat Pengajuan Konseling
              </button>
            </div>
          )}
          {roleUser === "Dosen PA" && (
            <div className="flex flex-col gap-1">
              <button
                className={`${selectedSubMenuDashboard === "Profile Dosen PA" && "bg-orange-400 text-white font-medium"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={(e) => {
                  setSelectedSubMenuDashboard("Profile Dosen PA");
                }}
              >
                Profile Dosen PA
              </button>
              <button
                className={`${selectedSubMenuDashboard === "Jadwal Kosong Dosen Role Dosen PA" && "bg-orange-400 text-white font-medium"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={(e) => {
                  setSelectedSubMenuDashboard(
                    "Jadwal Kosong Dosen Role Dosen PA"
                  );
                }}
              >
                Jadwal Kosong Dosen
              </button>
              <button
                className={`${selectedSubMenuDashboard === "Pengajuan Bimbingan Konseling Mahasiswa" && "bg-orange-400 text-white font-medium"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={(e) => {
                  setSelectedSubMenuDashboard(
                    "Pengajuan Bimbingan Konseling Mahasiswa"
                  );
                }}
              >
                Pengajuan Bimbingan Konseling Mahasiswa
              </button>
              <button
                className={`${selectedSubMenuDashboard === "Riwayat Laporan Bimbingan Role Dosen PA" && "bg-orange-400 text-white font-medium"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={(e) => {
                  setSelectedSubMenuDashboard(
                    "Riwayat Laporan Bimbingan Role Dosen PA"
                  );
                }}
              >
                Riwayat Laporan Bimbingan
              </button>
            </div>
          )}
          {roleUser === "Kaprodi" && (
            <div className="flex flex-col gap-1">
              <button
                className={`${selectedSubMenuDashboard === "Profile Kaprodi" && "bg-orange-400 text-white font-medium"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={(e) => {
                  setSelectedSubMenuDashboard("Profile Kaprodi");
                }}
              >
                Profile Kaprodi
              </button>
              <button
                className={`${selectedSubMenuDashboard === "Statistik Bimbingan Konseling" && "bg-orange-400 text-white font-medium"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={(e) => {
                  setSelectedSubMenuDashboard("Statistik Bimbingan Konseling");
                }}
              >
                Statistik Bimbingan Konseling
              </button>
              <button
                className={`${selectedSubMenuDashboard === "Data Dosen PA" && "bg-orange-400 text-white font-medium"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={(e) => {
                  setSelectedSubMenuDashboard("Data Dosen PA");
                }}
              >
                Data Dosen PA
              </button>
              <button
                className={`${selectedSubMenuDashboard === "Riwayat Laporan Bimbingan Role Kaprodi" && "bg-orange-400 text-white font-medium"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={(e) => {
                  setSelectedSubMenuDashboard(
                    "Riwayat Laporan Bimbingan Role Kaprodi"
                  );
                }}
              >
                Riwayat Laporan Bimbingan
              </button>
            </div>
          )}
        </div>
        <DashboardDosenPA
          selectedSubMenuDashboard={selectedSubMenuDashboard}
          dataUser={dataUser}
        />
        <DashboardMahasiswa
          selectedSubMenuDashboard={selectedSubMenuDashboard}
          dataUser={dataUser}
        />
        <DashboardKaprodi
          selectedSubMenuDashboard={selectedSubMenuDashboard}
          dataUser={dataUser}
        />
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
