"use client";

import InputField from "@/components/ui/InputField";
import Logo from "@/components/ui/LogoUPNVJ";
import SelectField from "@/components/ui/SelectField";
import NavbarUser from "@/components/ui/NavbarUser";
import Link from "next/link";
import { useEffect, useState } from "react";
import ImagePlus from "../../assets/images/image-plus.png";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import NavbarMahasiswa from "@/components/ui/NavbarMahasiswa";
import NavbarDosenPA from "@/components/ui/NavbarDosenPA";
import NavbarKaprodi from "@/components/ui/NavbarKaprodi";

export default function Home() {
  const [namaMahasiswa, setNamaMahasiswa] = useState("");
  const [selectedJenisBimbingan, setSelectedJenisBimbingan] = useState("");
  const [selectedSistemBimbingan, setSelectedSistemBimbingan] = useState("");
  const [selectedKaprodi, setSelectedKaprodi] = useState("");
  const [dataJenisBimbingan, setDataJenisBimbingan] = useState([]);
  const [dataSistemBimbingan, setDataSistemBimbingan] = useState([]);
  const [selectedHari, setSelectedHari] = useState("");
  const [selectedDateTime, setSelectedDateTime] = useState("");
  const [kendala, setKendala] = useState("");
  const [solusi, setSolusi] = useState("");
  const [kesimpulan, setKesimpulan] = useState("");
  const [dokumentasi, setDokumentasi] = useState("");
  const [roleUser, setRoleUser] = useState("");
  const [dataUser, setDataUser] = useState({});
  const [dataDosenPA, setDataDosenPA] = useState([]);
  const [dataKaprodi, setDataKaprodi] = useState([]);
  const [optionsJenisBimbingan, setOptionsJenisBimbingan] = useState([]);
  const [optionsSistemBimbingan, setOptionsSistemBimbingan] = useState([]);
  const [optionsKaprodi, setOptionsKaprodi] = useState([]);
  const [dataSelectedKaprodi, setDataSelectedKaprodi] = useState({});
  const [dataBimbingan, setDataBimbingan] = useState([]);
  const [userProfile, setUserProfile] = useState({});
  const [selectedBimbingan, setSelectedBimbingan] = useState({});

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

  const getDataJenisBimbingan = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/datajenisbimbingan"
      );

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      const sortedDataJenisBimbingan = data.sort((a, b) => a.order - b.order);
      setDataJenisBimbingan(sortedDataJenisBimbingan);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataSistemBimbingan = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/datasistembimbingan"
      );

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      const sortedDataSistemBimbingan = data.sort((a, b) => a.order - b.order);
      setDataSistemBimbingan(sortedDataSistemBimbingan);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const addLaporanBimbingan = async (newData) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/laporanbimbingan",
        newData
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleAddLaporanBimbingan = async (e) => {
    e.preventDefault();

    try {
      let laporanBimbinganValue = {
        nama_mahasiswa: selectedBimbingan.pengajuan_bimbingan.nama_lengkap,
        waktu_bimbingan: selectedBimbingan.pengajuan_bimbingan.jadwal_bimbingan,
        kaprodi_id: dataSelectedKaprodi.id,
        kendala_mahasiswa: kendala,
        solusi,
        kesimpulan,
        dokumentasi: dokumentasi !== "" ? dokumentasi : null,
        status: "Menunggu Feedback Kaprodi",
        dosen_pa_id: dataDosenPA.find((data) => data.dosen.id === dataUser.id)
          ?.id,
        jenis_bimbingan: selectedBimbingan.pengajuan_bimbingan.jenis_bimbingan,
        sistem_bimbingan:
          selectedBimbingan.pengajuan_bimbingan.sistem_bimbingan,
        bimbingan_id: selectedBimbingan.id,
      };

      const result = await addLaporanBimbingan(laporanBimbinganValue);
      console.log(result);
      setSelectedBimbingan({});
      setSolusi("");
      setKesimpulan("");
      setKendala("");
      setSelectedKaprodi("");
      setDokumentasi("");
      getDataBimbinganByDosenPaId();
    } catch (error) {
      console.error("Registration error:", error.message);
    }
  };

  const getDataDosenById = async () => {
    try {
      const dataDosen = await axios.get("http://localhost:3000/api/datadosen");

      const dosen = dataDosen.data.find((data) => data.id == dataUser.id);

      if (!dosen) {
        console.error("Dosen tidak ditemukan");
        return;
      }

      setUserProfile({
        nama_lengkap: dosen.nama_lengkap,
        email: dosen.email,
        nip: dosen.nip,
        no_whatsapp: dosen.no_whatsapp,
      });
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataBimbinganByDosenPaId = async () => {
    try {
      const dataDosenPa = await axios.get(
        `http://localhost:3000/api/datadosenpa`
      );

      const dosenPa = dataDosenPa.data.find(
        (data) => data.dosen.nama_lengkap === userProfile.nama_lengkap
      );

      if (!dosenPa) {
        throw new Error("Dosen PA tidak ditemukan");
      }

      const dosenpaid = dosenPa.id;

      const dataBimbingan = await axios.get(
        `http://localhost:3000/api/bimbingan`
      );

      const bimbingan = dataBimbingan.data.filter(
        (data) => data.pengajuan_bimbingan.dosen_pa_id === dosenpaid
      );

      setDataBimbingan(bimbingan);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  useEffect(() => {
    getDataJenisBimbingan();
    getDataSistemBimbingan();
    getDataDosenPA();
    getDataKaprodi();
    const cookies = document.cookie.split("; ");
    const authTokenCookie = cookies.find((row) => row.startsWith("authToken="));

    if (authTokenCookie) {
      const token = authTokenCookie.split("=")[1];
      try {
        const decodedToken = jwtDecode(token);
        console.log(decodedToken);
        setDataUser(decodedToken);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (dataJenisBimbingan.length > 0) {
      const formattedOptions = dataJenisBimbingan.map((data) => {
        return {
          value: data.jenis_bimbingan,
          label: data.jenis_bimbingan,
        };
      });

      setOptionsJenisBimbingan(formattedOptions);
    }
  }, [dataJenisBimbingan]);

  useEffect(() => {
    if (dataSistemBimbingan.length > 0) {
      const formattedOptions = dataSistemBimbingan.map((data) => {
        return {
          value: data.sistem_bimbingan,
          label: data.sistem_bimbingan,
        };
      });

      setOptionsSistemBimbingan(formattedOptions);
    }
  }, [dataSistemBimbingan]);

  useEffect(() => {
    if (dataKaprodi.length > 0) {
      const formattedOptions = dataKaprodi.map((data) => {
        return {
          value: data.dosen.nama_lengkap,
          label: `${data.dosen.nama_lengkap} (Kaprodi ${data.kaprodi_jurusan.jurusan})`,
        };
      });

      setOptionsKaprodi(formattedOptions);
    }
  }, [dataKaprodi]);

  useEffect(() => {
    if (dataUser && dataUser.id) {
      getDataDosenById();
    }
  }, [dataUser]);

  useEffect(() => {
    if (dataKaprodi.length > 0) {
      const data = dataKaprodi.find(
        (data) => data.dosen.nama_lengkap === selectedKaprodi
      );
      setDataSelectedKaprodi(data);
    }
  }, [selectedKaprodi]);

  useEffect(() => {
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
  }, [dataUser, dataDosenPA, dataKaprodi]);

  useEffect(() => {
    if (userProfile && userProfile.nama_lengkap !== "") {
      getDataBimbinganByDosenPaId();
    }
  }, [userProfile]);

  console.log(dataBimbingan);

  return (
    <div>
      <NavbarUser roleUser={roleUser} />
      <div className="pt-[100px]">
        <div className="mt-4 mb-[400px] mx-[130px] border rounded-lg">
          <h1 className="font-semibold text-[30px] text-center pt-8">
            Laporan Bimbingan Konseling Mahasiswa
          </h1>
          <form className="flex flex-col gap-4 p-8">
            {dataBimbingan.filter((data) => data.laporan_bimbingan_id === null)
              .length === 0 ? (
              <p className="col-span-3 text-center text-gray-500">
                Tidak ada bimbingan yang belum dibuat laporannya.
              </p>
            ) : (
              <div>
                <p className="pl-2">Pilih Bimbingan :</p>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  {dataBimbingan
                    .filter((data) => data.laporan_bimbingan_id === null)
                    .map((data) => (
                      <div
                        className={`border rounded-lg flex flex-col gap-1 text-[15px] p-4 cursor-pointer ${selectedBimbingan.id === data.id ? "bg-orange-500 text-white font-medium" : ""}`}
                        onClick={() => setSelectedBimbingan(data)}
                        key={data.id}
                      >
                        <p>{data.pengajuan_bimbingan.nama_lengkap}</p>
                        <p>{data.pengajuan_bimbingan.jadwal_bimbingan}</p>
                        <p>{data.pengajuan_bimbingan.jenis_bimbingan}</p>
                        <p>{data.pengajuan_bimbingan.sistem_bimbingan}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}
            {selectedBimbingan.id ? (
              <div className="flex flex-col gap-4">
                <InputField
                  type="text"
                  placeholder="Kendala Mahasiswa"
                  onChange={(e) => setKendala(e.target.value)}
                  value={kendala}
                  className="px-3 py-2 text-[15px] border rounded-lg"
                />
                <InputField
                  type="text"
                  placeholder="Solusi Yang Ditawarkan"
                  onChange={(e) => setSolusi(e.target.value)}
                  value={solusi}
                  className="px-3 py-2 text-[15px] border rounded-lg"
                />
                <InputField
                  type="text"
                  placeholder="Kesimpulan"
                  onChange={(e) => setKesimpulan(e.target.value)}
                  value={kesimpulan}
                  className="px-3 py-2 text-[15px] border rounded-lg"
                />
                <SelectField
                  options={optionsKaprodi}
                  onChange={(e) => setSelectedKaprodi(e.target.value)}
                  value={selectedKaprodi}
                  placeholder="Pilih Kaprodi"
                  className={`px-3 py-2 text-[15px] border rounded-lg appearance-none w-full`}
                />
                <div className="flex flex-col gap-2 h-[300px] px-3 py-2 text-[15px] border rounded-lg">
                  <label className="text-neutral-400">Dokumentasi</label>
                  <label className="cursor-pointer w-full h-full flex justify-center items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setDokumentasi(e.target.value)}
                      className="hidden"
                    />
                    <div className="w-full h-full flex justify-center items-center">
                      <Image src={ImagePlus} alt="imagePlus" />
                    </div>
                  </label>
                </div>
                <button
                  onClick={(e) => handleAddLaporanBimbingan(e)}
                  className="bg-orange-500 hover:bg-orange-600 rounded-lg py-[6px] text-white font-medium"
                >
                  Buat Laporan
                </button>
              </div>
            ) : (
              ""
            )}
          </form>
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
