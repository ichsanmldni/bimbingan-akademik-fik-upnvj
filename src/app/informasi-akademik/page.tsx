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

export default function Home() {
  const [openMenu, setOpenMenu] = useState("");
  const [roleUser, setRoleUser] = useState("");
  const [dataUser, setDataUser] = useState<any>(null);
  const [dataBab, setDataBab] = useState([]);
  const [dataSubBab, setDataSubBab] = useState([]);
  const [dataDosenPA, setDataDosenPA] = useState([]);
  const [dataKaprodi, setDataKaprodi] = useState([]);
  const [dataMahasiswa, setDataMahasiswa] = useState([]);
  const [selectedSubBabData, setSelectedSubBabData] = useState<any>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

  const toggleMenu = (menuName: string) => {
    setOpenMenu(openMenu === menuName ? "" : menuName);
  };

  const getDataBab = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/databab`);

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const sortedDataBab = response.data.sort(
        (a: any, b: any) => a.order - b.order
      );
      setDataBab(sortedDataBab);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataSubBabByBab = async (selectedBab: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/databab`);

      const bab = response.data.find((data: any) => data.nama === selectedBab);

      if (!bab) {
        throw new Error("Bab tidak ditemukan");
      }

      const babid = bab.id;

      const subBabResponse = await axios.get(
        `${API_BASE_URL}/api/datasubbab/${babid}`
      );

      if (subBabResponse.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const sortedDataSubBab = subBabResponse.data.sort(
        (a: any, b: any) => a.order - b.order
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
      const response = await axios.get(`${API_BASE_URL}/api/databab`);

      const bab = response.data.find((data: any) => data.nama === selectedBab);

      if (!bab) {
        throw new Error("Bab tidak ditemukan");
      }

      const babid = bab.id;

      const subBabResponse = await axios.get(
        `${API_BASE_URL}/api/datasubbab/${babid}`
      );
      const subbab = subBabResponse.data.find(
        (data: any) => data.nama === selectedSubBab
      );

      setSelectedSubBabData(subbab || null);
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
    getDataDosenPA();
    getDataKaprodi();
    getDataMahasiswa();
    getDataBab();
    const cookies = document.cookie.split("; ");
    const authTokenCookie = cookies.find((row) => row.startsWith("authToken="));

    if (authTokenCookie) {
      const token = authTokenCookie.split("=")[1];
      try {
        const decodedToken: any = jwtDecode(token);
        setDataUser(decodedToken);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (dataUser?.role === "Mahasiswa") {
      setRoleUser("Mahasiswa");
    } else if (dataUser?.role === "Dosen PA") {
      setRoleUser("Dosen PA");
    } else if (dataUser?.role === "Kaprodi") {
      setRoleUser("Kaprodi");
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
      <div className="flex w-full overflow-y-auto min-h-screen pt-[80px]">
        <div className="flex flex-col w-[40%] md:w-[25%] border md:ml-32 gap-6 pt-10 pb-6 px-8">
          <h1 className="md:text-[18px] font-semibold">Informasi Akademik</h1>
          <div className="flex flex-col gap-4">
            {dataBab.map((data: any) => {
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
                      {dataSubBab.map((data: any) => (
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
        <div className="md:w-[75%] w-[70%] h-[500px] py-10 px-4 md:px-[100px]">
          <h1 className="font-bold text-[18px]">{selectedSubBabData?.nama}</h1>
          <p className="mt-5 leading-[26px] overflow-y-auto text-justify">
            {selectedSubBabData?.isi}
          </p>
        </div>
      </div>

      <div className="hidden md:block border">
        <div className="flex justify-between mx-32 py-8 border-black border-b">
          <div className="flex gap-5 w-2/5 items-center">
            <Logo className="size-[100px] min-w-[100px]" />
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
}
