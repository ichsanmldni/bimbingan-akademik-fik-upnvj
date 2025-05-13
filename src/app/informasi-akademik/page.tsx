"use client";

import Logo from "@/components/ui/LogoUPNVJ";
import NavbarUser from "@/components/ui/NavbarUser";
import Link from "next/link";
import Image from "next/image";
import searchIcon from "../../assets/images/search.png";
import dropdownIcon from "../../assets/images/dropdown.png";
import dropupIcon from "../../assets/images/upIcon.png";
import { useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { env } from "process";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import {
  fetchDataBab,
  fetchDataBabByNama,
  fetchDataSubBabByBab,
  fetchDataSubBabByNama,
} from "@/lib/features/babSlice";

export default function Home() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

  const dispatch = useDispatch<AppDispatch>();
  const [openMenu, setOpenMenu] = useState("");

  const roleUser =
    useSelector((state: RootState) => state.auth?.roleUser) || "";
  const dataUser = useSelector((state: RootState) => state.auth?.dataUser);
  const statusAuthUser = useSelector((state: RootState) => state.auth?.status);

  // Data states
  const dataMahasiswa = useSelector(
    (state: RootState) => state.mahasiswa?.data
  );
  const dataDosenPA = useSelector((state: RootState) => state.dosenPA?.data);
  const dataKaprodi = useSelector((state: RootState) => state.kaprodi?.data);
  const dataBab = useSelector((state: RootState) => state.bab?.dataBab);
  const dataSubBab = useSelector((state: RootState) => state.bab?.dataSubBab);
  const selectedSubBabData = useSelector(
    (state: RootState) => state.bab?.selectedSubBab
  );
  const selectedBabData = useSelector(
    (state: RootState) => state.bab?.selectedBab
  );

  // Status states
  const statusDataMahasiswa = useSelector(
    (state: RootState) => state.mahasiswa?.status
  );
  const statusDataDosenPA = useSelector(
    (state: RootState) => state.dosenPA?.status
  );
  const statusDataKaprodi = useSelector(
    (state: RootState) => state.kaprodi?.status
  );
  const statusDataUser = useSelector((state: RootState) => state.user?.status);

  const toggleMenu = (menuName: string) => {
    setOpenMenu(openMenu === menuName ? "" : menuName);
  };

  const handleSelectBab = (babName) => {
    dispatch(fetchDataSubBabByBab(babName));
    dispatch(
      fetchDataBabByNama({
        selectedBab: babName,
      })
    );
  };

  const handleSelectSubBab = (babName, subBabName) => {
    dispatch(
      fetchDataSubBabByNama({
        selectedBab: babName,
        selectedSubBab: subBabName,
      })
    );
  };

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
    dispatch(fetchDataBab());
  }, [dispatch]);

  useEffect(() => {
    if (selectedBabData) {
      setOpenMenu(selectedBabData.nama);
      dispatch(fetchDataSubBabByBab(selectedBabData.nama));
    }
  }, [dispatch, selectedBabData]);

  // useEffect(() => {
  //   if (dataBab && dataBab.length > 0) {
  //     setOpenMenu(dataBab[0].nama);
  //     getDataSubBabByBab(dataBab[0].nama);
  //   }
  // }, [dataBab]);

  // useEffect(() => {
  //   if (dataSubBab && dataSubBab.length > 0) {
  //     setSelectedSubBabData(dataSubBab[0]);
  //   }
  // }, [dataSubBab]);

  // useEffect(() => {
  //   getDataBab();
  // }, []);

  return (
    <div>
      <NavbarUser roleUser={roleUser} dataUser={userData} />
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
                      handleSelectBab(data.nama);
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
                            handleSelectSubBab(openMenu, data.nama)
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
            {(() => {
              try {
                const isi = JSON.parse(selectedSubBabData?.isi);

                // Kalau hasil parsing array -> render per paragraph
                if (Array.isArray(isi)) {
                  return isi
                    .filter((item) =>
                      item.children.some((child) => child.text.trim() !== "")
                    )
                    .map((item, index) => (
                      <p key={index} className="mb-2">
                        {item.children.map((child, childIndex) => (
                          <span key={childIndex}>{child.text}</span>
                        ))}
                      </p>
                    ));
                }

                // Kalau hasil parsing bukan array (aneh), fallback tampilkan
                return <p>{selectedSubBabData?.isi}</p>;
              } catch (error) {
                // Kalau gagal parsing (memang string biasa), langsung tampilkan
                return <p>{selectedSubBabData?.isi}</p>;
              }
            })()}
          </p>
        </div>
      </div>

      <div className="hidden md:block border">
        <p className="text-center my-8 text-[16px]">
          Hak cipta &copy; 2025 Bimbingan Akademik Mahasiswa FIK UPNVJ
        </p>
      </div>
    </div>
  );
}
