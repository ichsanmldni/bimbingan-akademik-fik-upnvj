"use client";

import InputField from "@/components/ui/InputField";
import Logo from "@/components/ui/LogoUPNVJ";
import SelectField from "@/components/ui/SelectField";
import NavbarUser from "@/components/ui/NavbarUser";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import NavbarMahasiswa from "@/components/ui/NavbarMahasiswa";
import NavbarDosenPA from "@/components/ui/NavbarDosenPA";
import NavbarKaprodi from "@/components/ui/NavbarKaprodi";

export default function Home() {
  const [namaLengkap, setNamaLengkap] = useState("");
  const [nim, setNim] = useState("");
  const [email, setEmail] = useState("");
  const [noWa, setNoWa] = useState("");
  const [roleUser, setRoleUser] = useState("");
  const [dataDosenPA, setDataDosenPA] = useState([]);
  const [dataKaprodi, setDataKaprodi] = useState([]);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [selectedHari, setSelectedHari] = useState("");
  const [selectedJam, setSelectedJam] = useState("");
  const [dataUser, setDataUser] = useState({});
  const [dataJadwalDosenPa, setDataJadwalDosenPa] = useState([]);
  const [selectedJenisBimbingan, setSelectedJenisBimbingan] = useState("");
  const [dataJenisBimbingan, setDataJenisBimbingan] = useState([]);
  const [optionsJenisBimbingan, setOptionsJenisBimbingan] = useState([]);
  const [selectedSistemBimbingan, setSelectedSistemBimbingan] = useState("");
  const [dataSistemBimbingan, setDataSistemBimbingan] = useState([]);
  const [optionsSistemBimbingan, setOptionsSistemBimbingan] = useState([]);
  const [userDosenPa, setuserDosenPa] = useState({});
  const [dataMahasiswaUser, setDataMahasiswaUser] = useState({});
  const [dataMahasiswa, setDataMahasiswa] = useState([]);
  const [dataDosen, setDataDosen] = useState([]);

  const getDataJadwalDosenPaByDosenPa = async () => {
    try {
      const dataDosenPa = await axios.get(
        `http://localhost:3000/api/datadosenpa`
      );

      const dosenPa = dataDosenPa.data.find(
        (data) => data.dosen.nama_lengkap === userDosenPa.dosen.nama_lengkap
      );

      if (!dosenPa) {
        throw new Error("Jurusan tidak ditemukan");
      }

      const dosenpaid = dosenPa.id;

      const response = await axios.get(
        `http://localhost:3000/api/datajadwaldosenpa/${dosenpaid}`
      );

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      setDataJadwalDosenPa(data);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataDosenPaByMahasiswa = async () => {
    try {
      const dataDosenPa = await axios.get(
        `http://localhost:3000/api/datadosenpa`
      );

      const dosenPa = dataDosenPa.data.find(
        (data) => data.id === dataMahasiswaUser.dosen_pa_id
      );

      if (!dosenPa) {
        console.error("Dosen PA tidak ditemukan");
        return; // Hentikan eksekusi jika dosen PA tidak ditemukan
      }

      setuserDosenPa(dosenPa);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataMahasiswaByUser = async () => {
    try {
      const dataMahasiswa = await axios.get(
        `http://localhost:3000/api/datamahasiswa`
      );

      const mahasiswa = dataMahasiswa.data.find(
        (data) => data.id === dataUser.id
      );

      if (!mahasiswa) {
        throw new Error("Mahasiswa tidak ditemukan");
      }

      setDataMahasiswaUser(mahasiswa);
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

  const addPengajuanBimbingan = async (newData) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/pengajuanbimbingan",
        newData
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleAddPengajuanBimbingan = async (e) => {
    e.preventDefault();

    const formattedDate = format(selectedDateTime, "dd MMMM yyyy", {
      locale: id,
    });

    try {
      let pengajuanBimbinganValue = {
        nama_lengkap: namaLengkap,
        nim,
        email,
        no_whatsapp: noWa,
        jadwal_bimbingan: `${selectedHari}, ${formattedDate} ${selectedJam}`,
        jenis_bimbingan: selectedJenisBimbingan,
        sistem_bimbingan: selectedSistemBimbingan,
        mahasiswa_id: dataUser.id,
        status: "Menunggu Konfirmasi",
        dosen_pa_id: userDosenPa.id,
      };

      const result = await addPengajuanBimbingan(pengajuanBimbinganValue);
      console.log(result);
      setNamaLengkap("");
      setNim("");
      setEmail("");
      setNoWa("");
      setSelectedDateTime(null);
      setSelectedHari("");
      setSelectedJam("");
      setSelectedJenisBimbingan("");
      setSelectedSistemBimbingan("");

      setTimeout(() => {
        setNamaLengkap(dataMahasiswaUser.nama_lengkap);
        setNim(dataMahasiswaUser.nim);
        setEmail(dataMahasiswaUser.email);
        setNoWa(dataMahasiswaUser.no_whatsapp);
      }, 1000);
    } catch (error) {
      console.error("Registration error:", error.message);
    }
  };

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

  const getDataDosen = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/datadosen");

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      setDataDosen(data);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataMahasiswa = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/datamahasiswa"
      );

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      setDataMahasiswa(data);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

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
    if (dataMahasiswaUser && dataMahasiswaUser.id) {
      setNamaLengkap(dataMahasiswaUser.nama_lengkap);
      setNim(dataMahasiswaUser.nim);
      setEmail(dataMahasiswaUser.email);
      setNoWa(dataMahasiswaUser.no_whatsapp);
      getDataDosenPaByMahasiswa();
    }
  }, [dataMahasiswaUser]);

  useEffect(() => {
    if (dataUser && dataUser.id) {
      getDataMahasiswaByUser();
    }
  }, [dataUser]);

  useEffect(() => {
    if (userDosenPa && userDosenPa.dosen && userDosenPa.dosen.nama_lengkap) {
      getDataJadwalDosenPaByDosenPa();
    }
  }, [userDosenPa]);

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
    getDataJenisBimbingan();
    getDataSistemBimbingan();
    getDataDosenPA();
    getDataKaprodi();
    getDataDosen();
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

  const getDayName = (date) => {
    return format(date, "EEEE", { locale: id });
  };

  return (
    <div>
      <NavbarUser
        roleUser={roleUser}
        dataUser={
          roleUser === "Mahasiswa"
            ? dataMahasiswa.find((data) => data.id === dataUser.id)
            : roleUser === "Dosen PA"
              ? dataDosen.find((data) => data.id === dataUser.id)
              : roleUser === "Kaprodi"
                ? dataDosen.find((data) => data.id === dataUser.id)
                : ""
        }
      />
      <div className="pt-[100px]">
        <div className="mt-4 mb-10 mx-[130px] border rounded-lg">
          <h1 className="font-semibold text-[30px] text-center pt-4">
            Pengajuan Bimbingan Konseling Mahasiswa
          </h1>
          <form className="flex flex-col gap-4 p-8">
            <InputField
              type="text"
              placeholder="Nama Lengkap"
              onChange={(e) => setNamaLengkap(e.target.value)}
              value={namaLengkap}
              className="px-3 py-2 text-[15px] border rounded-lg focus:outline-none"
            />
            <InputField
              type="text"
              placeholder="NIM"
              onChange={(e) => setNim(e.target.value)}
              value={nim}
              className="px-3 py-2 text-[15px] border rounded-lg focus:outline-none"
            />
            <InputField
              type="text"
              placeholder="E-mail"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="px-3 py-2 text-[15px] border rounded-lg focus:outline-none"
            />
            <InputField
              type="text"
              placeholder="No Whatsapp"
              onChange={(e) => setNoWa(e.target.value)}
              value={noWa}
              className="px-3 py-2 text-[15px] border rounded-lg focus:outline-none"
            />
            <div className="flex flex-col">
              <DatePicker
                selected={selectedDateTime}
                onChange={(date) => {
                  setSelectedDateTime(date);
                  setSelectedHari(getDayName(date));
                }}
                popperContainer={({ children }) => (
                  <div className="relative z-10">{children}</div>
                )}
                dateFormat="EEEE, dd MMMM yyyy"
                placeholderText="Pilih Jadwal Bimbingan"
                className="px-3 py-2 caret-transparent border cursor-pointer rounded-lg w-full focus:outline-none appearance-none text-[15px]"
                minDate={new Date()}
                locale={id}
              />
              <div
                className={`flex flex-col mt-3 ml-3 ${selectedHari === "" && "hidden"}`}
              >
                {dataJadwalDosenPa.filter(
                  (jadwal) => jadwal.hari === selectedHari
                ).length > 0 ? (
                  <p className="text-[15px] mb-2">Pilih Jam :</p>
                ) : dataJadwalDosenPa.filter(
                    (jadwal) => jadwal.hari === selectedHari
                  ).length === 0 ? (
                  <p className="text-[15px] text-red-500 font-medium">
                    Jadwal tidak tersedia, pilih hari lain
                  </p>
                ) : (
                  ""
                )}
                <div className={`flex gap-4`}>
                  {dataJadwalDosenPa
                    .filter((jadwal) => jadwal.hari === selectedHari)
                    .map((jadwal) => (
                      <div
                        key={jadwal.id}
                        className={`p-2 border rounded-lg cursor-pointer ${
                          selectedJam ===
                          `${jadwal.jam_mulai}-${jadwal.jam_selesai}`
                            ? "bg-orange-500 text-white"
                            : ""
                        }`}
                        onClick={() => {
                          setSelectedJam(
                            `${jadwal.jam_mulai}-${jadwal.jam_selesai}`
                          );
                        }}
                      >
                        <p className="text-[15px]">{`${jadwal.jam_mulai}-${jadwal.jam_selesai}`}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <SelectField
              options={optionsJenisBimbingan}
              onChange={(e) => setSelectedJenisBimbingan(e.target.value)}
              value={selectedJenisBimbingan}
              placeholder="Pilih Jenis Bimbingan"
              className={`px-3 py-2 text-[15px] border rounded-lg appearance-none w-full focus:outline-none`}
            />
            <SelectField
              options={optionsSistemBimbingan}
              onChange={(e) => setSelectedSistemBimbingan(e.target.value)}
              value={selectedSistemBimbingan}
              placeholder="Pilih Sistem Bimbingan"
              className={`px-3 py-2 text-[15px] border rounded-lg appearance-none w-full focus:outline-none`}
            />
            <button
              onClick={handleAddPengajuanBimbingan}
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-[6px] font-medium"
            >
              Ajukan
            </button>
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
