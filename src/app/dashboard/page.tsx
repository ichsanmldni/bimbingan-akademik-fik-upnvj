"use client";

import Logo from "@/components/ui/LogoUPNVJ";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import NavbarUser from "@/components/ui/NavbarUser";
import { jwtDecode } from "jwt-decode";
import DashboardDosenPA from "@/components/features/dashboard/DashboardDosenPA";
import DashboardMahasiswa from "@/components/features/dashboard/DashboardMahasiswa";
import DashboardKaprodi from "@/components/features/dashboard/DashboardKaprodi";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedSubMenu } from "@/components/store/selectedSubMenuSlice";
import { RootState } from "@/components/store/store";
import { useRouter, useSearchParams } from "next/navigation";

const Dashboard = () => {
  const [dataUser, setDataUser] = useState<any>(null);
  const [dataDosenPA, setDataDosenPA] = useState([]);
  const [dataKaprodi, setDataKaprodi] = useState([]);
  const [dataMahasiswa, setDataMahasiswa] = useState([]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

  const [roleUser, setRoleUser] = useState<string>("");
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedSubMenuDashboard = useSelector(
    (state: RootState) => state.selectedSubMenu.value
  );

  const getDataDosenPA = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/datadosenpa`);

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
      const response = await axios.get(`${API_BASE_URL}/api/datakaprodi`);

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
      const response = await axios.get(`${API_BASE_URL}/api/datamahasiswa`);

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
    const submenu = searchParams.get("submenu");
    if (submenu) {
      setTimeout(() => {
        dispatch(setSelectedSubMenu(submenu));
      }, 500);
      const timer = setTimeout(() => {
        router.replace("/dashboard"); // Ganti '/your-page' dengan path halaman Anda tanpa query params
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [dispatch, searchParams, dataUser, dataDosenPA, dataKaprodi]);

  useEffect(() => {
    getDataDosenPA();
    getDataKaprodi();
    getDataMahasiswa();
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
    if (dataUser) {
      if (dataUser.role === "Mahasiswa") {
        setRoleUser("Mahasiswa");
        dispatch(setSelectedSubMenu("Profile Mahasiswa"));
      } else if (dataUser.role === "Dosen PA") {
        setRoleUser("Dosen PA");
        dispatch(setSelectedSubMenu("Profile Dosen PA"));
      } else if (dataUser.role === "Kaprodi") {
        setRoleUser("Kaprodi");
        dispatch(setSelectedSubMenu("Profile Kaprodi"));
      } else {
        dispatch(setSelectedSubMenu(""));
      }
    }
  }, [dataUser, dataDosenPA, dataKaprodi]);

  return (
    <div>
      <NavbarUser
        roleUser={roleUser}
        dataUser={
          roleUser === "Mahasiswa"
            ? dataMahasiswa.find((data: any) => data.nim === dataUser?.nim) ||
              {}
            : roleUser === "Dosen PA"
              ? dataDosenPA.find((data: any) => data.nip === dataUser?.nip) ||
                {}
              : roleUser === "Kaprodi"
                ? dataKaprodi.find((data: any) => data.nip === dataUser?.nip) ||
                  {}
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
                onClick={() =>
                  dispatch(setSelectedSubMenu("Profile Mahasiswa"))
                }
              >
                Profile Mahasiswa
              </button>
              <button
                className={`${selectedSubMenuDashboard === "Jadwal Kosong Dosen PA Role Mahasiswa" && "bg-orange-400 text-white font-medium"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={() =>
                  dispatch(
                    setSelectedSubMenu("Jadwal Kosong Dosen PA Role Mahasiswa")
                  )
                }
              >
                Jadwal Kosong Dosen PA
              </button>
              <button
                className={`${selectedSubMenuDashboard === "Absensi Bimbingan" && "bg-orange-400 text-white font-medium"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={() =>
                  dispatch(setSelectedSubMenu("Absensi Bimbingan"))
                }
              >
                Absensi Bimbingan
              </button>
              <button
                className={`${selectedSubMenuDashboard === "Riwayat Pengajuan Bimbingan" && "bg-orange-400 text-white font-medium"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={() =>
                  dispatch(setSelectedSubMenu("Riwayat Pengajuan Bimbingan"))
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
                onClick={() => dispatch(setSelectedSubMenu("Profile Dosen PA"))}
              >
                Profile Dosen PA
              </button>
              <button
                className={`${selectedSubMenuDashboard === "Jadwal Kosong Dosen Role Dosen PA" && "bg-orange-400 text-white font-medium"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={() =>
                  dispatch(
                    setSelectedSubMenu("Jadwal Kosong Dosen Role Dosen PA")
                  )
                }
              >
                Jadwal Kosong Dosen
              </button>
              <button
                className={`${selectedSubMenuDashboard === "Pengesahan Absensi Bimbingan" && "bg-orange-400 text-white font-medium"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={() =>
                  dispatch(setSelectedSubMenu("Pengesahan Absensi Bimbingan"))
                }
              >
                Pengesahan Absensi Bimbingan
              </button>
              <button
                className={`${selectedSubMenuDashboard === "Pengajuan Bimbingan Akademik Mahasiswa" && "bg-orange-400 text-white font-medium"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={() =>
                  dispatch(
                    setSelectedSubMenu("Pengajuan Bimbingan Akademik Mahasiswa")
                  )
                }
              >
                Pengajuan Bimbingan Akademik Mahasiswa
              </button>
              <button
                className={`${selectedSubMenuDashboard === "Riwayat Laporan Bimbingan Role Dosen PA" && "bg-orange-400 text-white font-medium"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={() =>
                  dispatch(
                    setSelectedSubMenu(
                      "Riwayat Laporan Bimbingan Role Dosen PA"
                    )
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
                onClick={() => dispatch(setSelectedSubMenu("Profile Kaprodi"))}
              >
                Profile Kaprodi
              </button>
              <button
                className={`${selectedSubMenuDashboard === "Statistik Bimbingan Akademik" && "bg-orange-400 text-white font-medium"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={() =>
                  dispatch(setSelectedSubMenu("Statistik Bimbingan Akademik"))
                }
              >
                Statistik Bimbingan Akademik
              </button>
              <button
                className={`${selectedSubMenuDashboard === "Data Dosen PA" && "bg-orange-400 text-white font-medium"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={() => dispatch(setSelectedSubMenu("Data Dosen PA"))}
              >
                Data Dosen PA
              </button>
              <button
                className={`${selectedSubMenuDashboard === "Riwayat Laporan Bimbingan Role Kaprodi" && "bg-orange-400 text-white font-medium"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={() =>
                  dispatch(
                    setSelectedSubMenu("Riwayat Laporan Bimbingan Role Kaprodi")
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
              Bimbingan Akademik Mahasiswa FIK
            </h1>
          </div>
          <div className="flex items-end gap-5">
            <Link href="/informasi-akademik" className="text-[14px]">
              Informasi Akademik
            </Link>
          </div>
        </div>
        <p className="text-center my-8 text-[16px]">
          Hak cipta &copy; 2024 Bimbingan Akademik Mahasiswa FIK UPNVJ
        </p>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dashboard />
    </Suspense>
  );
}
