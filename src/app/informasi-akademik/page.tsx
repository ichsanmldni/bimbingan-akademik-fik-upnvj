"use client";

import Logo from "@/components/ui/LogoUPNVJ";
import NavbarUser from "@/components/ui/NavbarUser";
import Link from "next/link";
import Image from "next/image";
import searchIcon from "../../assets/images/search.png";
import dropdownIcon from "../../assets/images/dropdown.png";
import dropupIcon from "../../assets/images/upIcon.png";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { env } from "process";

interface User {
  id: number;
  role: string;
}

interface Bab {
  id: number;
  nama: string;
  order: number;
}

interface SubBab {
  id: number;
  nama: string;
  isi: string;
  order: number;
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

interface SubBabData {
  id: number;
  nama: string;
  isi: string;
}

export default function Home() {
  const [openMenu, setOpenMenu] = useState<string>("");
  const [roleUser, setRoleUser] = useState<string>("");
  const [dataUser, setDataUser] = useState<User | null>(null);
  const [dataBab, setDataBab] = useState<Bab[]>([]);
  const [dataSubBab, setDataSubBab] = useState<SubBab[]>([]);
  const [dataDosenPA, setDataDosenPA] = useState<DosenPA[]>([]);
  const [dataKaprodi, setDataKaprodi] = useState<Kaprodi[]>([]);
  const [dataDosen, setDataDosen] = useState<Dosen[]>([]);
  const [dataMahasiswa, setDataMahasiswa] = useState<Mahasiswa[]>([]);
  const [selectedSubBabData, setSelectedSubBabData] =
    useState<SubBabData | null>(null);

  const API_BASE_URL = env.API_BASE_URL as string;

  const toggleMenu = (menuName: string) => {
    setOpenMenu(openMenu === menuName ? "" : menuName);
  };

  const getDataBab = async () => {
    try {
      const response = await axios.get<Bab[]>(`${API_BASE_URL}/api/databab`);

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const sortedDataBab = response.data.sort((a, b) => a.order - b.order);
      setDataBab(sortedDataBab);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataSubBabByBab = async (selectedBab: string) => {
    try {
      const response = await axios.get<Bab[]>(`${API_BASE_URL}/api/databab`);

      const bab = response.data.find((data) => data.nama === selectedBab);

      if (!bab) {
        throw new Error("Bab tidak ditemukan");
      }

      const babid = bab.id;

      const subBabResponse = await axios.get<SubBab[]>(
        `${API_BASE_URL}/api/datasubbab/${babid}`
      );

      if (subBabResponse.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const sortedDataSubBab = subBabResponse.data.sort(
        (a, b) => a.order - b.order
      );
      setDataSubBab(sortedDataSubBab);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataSubBabBySubBabNama = async (
    selectedBab: string,
    selectedSubBab: string
  ) => {
    try {
      const response = await axios.get<Bab[]>(`${API_BASE_URL}/api/databab`);

      const bab = response.data.find((data) => data.nama === selectedBab);

      if (!bab) {
        throw new Error("Bab tidak ditemukan");
      }

      const babid = bab.id;

      const subBabResponse = await axios.get<SubBab[]>(
        `${API_BASE_URL}/api/datasubbab/${babid}`
      );
      const subbab = subBabResponse.data.find(
        (data) => data.nama === selectedSubBab
      );

      setSelectedSubBabData(subbab || null);
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
    getDataBab();
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
    if (dataUser?.role === "Mahasiswa") {
      setRoleUser("Mahasiswa");
    } else if (dataUser?.role === "Dosen") {
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
        <div className="flex flex-col w-[25%] border ml-32 gap-6 pt-10 pb-6 px-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-[18px] font-semibold">Informasi Akademik</h1>
            <div className="relative flex gap-2 rounded-lg p-2 bg-[#F8FAFC]">
              <input
                type="text"
                placeholder="Cari"
                className="pl-8 pr-2 w-full outline-none bg-transparent"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Image
                  src={searchIcon}
                  alt="Search Icon"
                  width={20}
                  height={20}
                />
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {dataBab.map((data) => {
              return (
                <div key={data.id}>
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => {
                      toggleMenu(data.nama);
                      getDataSubBabByBab(data.nama);
                    }}
                  >
                    <h1 className="font-semibold text-[14px]">{data.nama}</h1>
                    <div className="">
                      {openMenu === data.nama ? (
                        <Image
                          src={dropupIcon}
                          alt="Dropup Icon"
                          className="size-4 p-1"
                        />
                      ) : (
                        <Image
                          src={dropdownIcon}
                          alt="Dropdown Icon"
                          className="size-4 p-1"
                        />
                      )}
                    </div>
                  </div>
                  {openMenu === data.nama && (
                    <div className="text-[14px] text-gray-700">
                      {dataSubBab.map((data) => (
                        <p
                          key={data.id}
                          onClick={() =>
                            getDataSubBabBySubBabNama(openMenu, data.nama)
                          }
                          className="mt-2 cursor-pointer"
                        >
                          {data.nama}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {/* ini isi */}
        <div className="w-[75%] h-[500px] py-10 px-[100px]">
          <h1 className="font-bold text-[18px]">{selectedSubBabData?.nama}</h1>
          <p className="mt-5 leading-[26px] text-justify">
            {selectedSubBabData?.isi}
          </p>
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
