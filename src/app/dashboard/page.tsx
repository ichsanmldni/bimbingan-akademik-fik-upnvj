"use client";

import Logo from "@/components/ui/LogoUPNVJ";
import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import NavbarUser from "@/components/ui/NavbarUser";
import { jwtDecode } from "jwt-decode";
import DashboardDosenPA from "@/components/features/dashboard/DashboardDosenPA";
import DashboardMahasiswa from "@/components/features/dashboard/DashboardMahasiswa";
import DashboardKaprodi from "@/components/features/dashboard/DashboardKaprodi";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedSubMenu } from "@/lib/features/selectedSubMenuSlice";
import { AppDispatch, RootState } from "../../lib/store";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchAuthUser } from "@/lib/features/authSlice";
import { fetchMahasiswa } from "@/lib/features/mahasiswaSlice";
import { fetchDosenPA } from "@/lib/features/dosenPASlice";
import { fetchKaprodi } from "@/lib/features/kaprodiSlice";
import { fetchUser } from "@/lib/features/userSlice";

const Dashboard = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedSubMenuDashboard = useSelector(
    (state: RootState) => state.selectedSubMenu.value
  );

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
    if (dataUser) {
      if (dataUser.role === "Mahasiswa") {
        dispatch(setSelectedSubMenu("Profile Mahasiswa"));
      } else if (dataUser.role === "Dosen PA") {
        dispatch(setSelectedSubMenu("Profile Dosen PA"));
      } else if (dataUser.role === "Kaprodi") {
        dispatch(setSelectedSubMenu("Profile Kaprodi"));
      } else {
        dispatch(setSelectedSubMenu(""));
      }
    }
  }, [dataUser, dataDosenPA, dataKaprodi]);

  useEffect(() => {
    dispatch(fetchMahasiswa());
    dispatch(fetchDosenPA());
    dispatch(fetchKaprodi());
  }, []);

  return (
    <div>
      <NavbarUser
        roleUser={roleUser}
        dataUser={
          roleUser === "Mahasiswa"
            ? dataMahasiswa.find((data: any) => data.nim === dataUser?.nim) ||
              {}
            : roleUser === "Dosen PA"
              ? dataDosenPA.find(
                  (data: any) => data.email === dataUser?.email
                ) || {}
              : roleUser === "Kaprodi"
                ? dataKaprodi.find(
                    (data: any) => data.email === dataUser?.email
                  ) || {}
                : {}
        }
      />
      <div className="md:flex h-screen w-full pt-[80px]">
        <div className="flex flex-col md:w-[25%] rounded-2xl border border-gray-200 bg-white shadow-sm mt-4 md:mt-0 mx-4 md:mx-0 md:ml-24 gap-6 pt-6 pb-6 px-6">
          <h1 className="text-lg font-semibold text-gray-800">
            Dashboard {roleUser}
          </h1>
          {roleUser === "Mahasiswa" && userData?.status_lulus === false && (
            <div className="flex flex-col gap-2">
              <button
                className={`${
                  selectedSubMenuDashboard === "Profile Mahasiswa"
                    ? "bg-orange-500 text-white font-semibold"
                    : "text-gray-700 hover:bg-orange-100"
                } text-left text-sm rounded-xl py-2 px-4 transition-all duration-200`}
                onClick={() =>
                  dispatch(setSelectedSubMenu("Profile Mahasiswa"))
                }
              >
                Profile Mahasiswa
              </button>
              <button
                className={`${
                  selectedSubMenuDashboard ===
                  "Jadwal Kosong Dosen PA Role Mahasiswa"
                    ? "bg-orange-500 text-white font-semibold"
                    : "text-gray-700 hover:bg-orange-100"
                } text-left text-sm rounded-xl py-2 px-4 transition-all duration-200`}
                onClick={() =>
                  dispatch(
                    setSelectedSubMenu("Jadwal Kosong Dosen PA Role Mahasiswa")
                  )
                }
              >
                Jadwal Kosong Dosen PA
              </button>
              <button
                className={`${
                  selectedSubMenuDashboard === "Absensi Bimbingan"
                    ? "bg-orange-500 text-white font-semibold"
                    : "text-gray-700 hover:bg-orange-100"
                } text-left text-sm rounded-xl py-2 px-4 transition-all duration-200`}
                onClick={() =>
                  dispatch(setSelectedSubMenu("Absensi Bimbingan"))
                }
              >
                Absensi Bimbingan
              </button>
              <button
                className={`${
                  selectedSubMenuDashboard === "Riwayat Pengajuan Bimbingan"
                    ? "bg-orange-500 text-white font-semibold"
                    : "text-gray-700 hover:bg-orange-100"
                } text-left text-sm rounded-xl py-2 px-4 transition-all duration-200`}
                onClick={() =>
                  dispatch(setSelectedSubMenu("Riwayat Pengajuan Bimbingan"))
                }
              >
                Riwayat Pengajuan Bimbingan
              </button>
            </div>
          )}
          {roleUser === "Mahasiswa" && userData?.status_lulus === true && (
            <div className="flex flex-col gap-2">
              <button
                className={`${
                  selectedSubMenuDashboard === "Profile Mahasiswa"
                    ? "bg-orange-500 text-white font-semibold"
                    : "text-gray-700 hover:bg-orange-100"
                } text-left text-sm rounded-xl py-2 px-4 transition-all duration-200`}
                onClick={() =>
                  dispatch(setSelectedSubMenu("Profile Mahasiswa"))
                }
              >
                Profile Mahasiswa
              </button>

              <button
                className={`${
                  selectedSubMenuDashboard === "Riwayat Pengajuan Bimbingan"
                    ? "bg-orange-500 text-white font-semibold"
                    : "text-gray-700 hover:bg-orange-100"
                } text-left text-sm rounded-xl py-2 px-4 transition-all duration-200`}
                onClick={() =>
                  dispatch(setSelectedSubMenu("Riwayat Pengajuan Bimbingan"))
                }
              >
                Riwayat Pengajuan Bimbingan
              </button>
            </div>
          )}

          {roleUser === "Dosen PA" && (
            <div className="flex flex-col gap-2">
              <button
                className={`${
                  selectedSubMenuDashboard === "Profile Dosen PA"
                    ? "bg-orange-500 text-white font-semibold"
                    : "text-gray-700 hover:bg-orange-100"
                } text-left text-sm rounded-xl py-2 px-4 transition-all duration-200`}
                onClick={() => dispatch(setSelectedSubMenu("Profile Dosen PA"))}
              >
                Profile Dosen PA
              </button>
              <button
                className={`${
                  selectedSubMenuDashboard ===
                  "Jadwal Kosong Dosen Role Dosen PA"
                    ? "bg-orange-500 text-white font-semibold"
                    : "text-gray-700 hover:bg-orange-100"
                } text-left text-sm rounded-xl py-2 px-4 transition-all duration-200`}
                onClick={() =>
                  dispatch(
                    setSelectedSubMenu("Jadwal Kosong Dosen Role Dosen PA")
                  )
                }
              >
                Jadwal Kosong Dosen
              </button>
              <button
                className={`${
                  selectedSubMenuDashboard === "Pengesahan Absensi Bimbingan"
                    ? "bg-orange-500 text-white font-semibold"
                    : "text-gray-700 hover:bg-orange-100"
                } text-left text-sm rounded-xl py-2 px-4 transition-all duration-200`}
                onClick={() =>
                  dispatch(setSelectedSubMenu("Pengesahan Absensi Bimbingan"))
                }
              >
                Pengesahan Absensi Bimbingan
              </button>
              <button
                className={`${
                  selectedSubMenuDashboard ===
                  "Pengajuan Bimbingan Akademik Mahasiswa"
                    ? "bg-orange-500 text-white font-semibold"
                    : "text-gray-700 hover:bg-orange-100"
                } text-left text-sm rounded-xl py-2 px-4 transition-all duration-200`}
                onClick={() =>
                  dispatch(
                    setSelectedSubMenu("Pengajuan Bimbingan Akademik Mahasiswa")
                  )
                }
              >
                Pengajuan Bimbingan Akademik Mahasiswa
              </button>
              <button
                className={`${
                  selectedSubMenuDashboard ===
                  "Riwayat Laporan Bimbingan Role Dosen PA"
                    ? "bg-orange-500 text-white font-semibold"
                    : "text-gray-700 hover:bg-orange-100"
                } text-left text-sm rounded-xl py-2 px-4 transition-all duration-200`}
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
            <div className="flex flex-col gap-2">
              <button
                className={`${
                  selectedSubMenuDashboard === "Profile Kaprodi"
                    ? "bg-orange-500 text-white font-semibold"
                    : "text-gray-700 hover:bg-orange-100"
                } text-left text-sm rounded-xl py-2 px-4 transition-all duration-200`}
                onClick={() => dispatch(setSelectedSubMenu("Profile Kaprodi"))}
              >
                Profile Kaprodi
              </button>
              <button
                className={`${
                  selectedSubMenuDashboard === "Statistik Bimbingan Akademik"
                    ? "bg-orange-500 text-white font-semibold"
                    : "text-gray-700 hover:bg-orange-100"
                } text-left text-sm rounded-xl py-2 px-4 transition-all duration-200`}
                onClick={() =>
                  dispatch(setSelectedSubMenu("Statistik Bimbingan Akademik"))
                }
              >
                Statistik Bimbingan Akademik
              </button>
              <button
                className={`${
                  selectedSubMenuDashboard === "Data Dosen PA"
                    ? "bg-orange-500 text-white font-semibold"
                    : "text-gray-700 hover:bg-orange-100"
                } text-left text-sm rounded-xl py-2 px-4 transition-all duration-200`}
                onClick={() => dispatch(setSelectedSubMenu("Data Dosen PA"))}
              >
                Data Dosen PA
              </button>
              <button
                className={`${
                  selectedSubMenuDashboard ===
                  "Riwayat Laporan Bimbingan Role Kaprodi"
                    ? "bg-orange-500 text-white font-semibold"
                    : "text-gray-700 hover:bg-orange-100"
                } text-left text-sm rounded-xl py-2 px-4 transition-all duration-200`}
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
            dataUser={userData || {}}
          />
        )}
        {roleUser === "Dosen PA" && (
          <DashboardDosenPA
            selectedSubMenuDashboard={selectedSubMenuDashboard}
            dataUser={userData || {}}
          />
        )}
        {roleUser === "Kaprodi" && (
          <DashboardKaprodi
            selectedSubMenuDashboard={selectedSubMenuDashboard}
            dataUser={userData || {}}
          />
        )}
      </div>

      <div className="border hidden md:block">
        <p className="text-center my-8 text-[16px]">
          Hak cipta &copy; 2025 Bimbingan Akademik Mahasiswa FIK UPNVJ
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
