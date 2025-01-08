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
import { env } from "process";

interface User {
  id: number;
  role: string;
  [key: string]: any; // Allow additional properties
}

interface DosenPA {
  id: number;
  dosen: {
    nama_lengkap: string;
  };
  dosen_id: number;
}

interface Mahasiswa {
  id: number;
  nama_lengkap: string;
  nim: string;
  email: string;
  no_whatsapp: string;
  jurusan: string;
  dosen_pa_id: number;
}

interface JadwalDosenPA {
  id: number;
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
}

interface JenisBimbingan {
  id: number;
  jenis_bimbingan: string;
  order: number;
}

interface TopikBimbinganPribadi {
  id: number;
  topik_bimbingan: string;
  order: number;
}

interface SistemBimbingan {
  id: number;
  sistem_bimbingan: string;
  order: number;
}

export default function Home() {
  const [namaLengkap, setNamaLengkap] = useState<string>("");
  const [nim, setNim] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [noWa, setNoWa] = useState<string>("");
  const [jurusan, setJurusan] = useState<string>("");
  const [roleUser, setRoleUser] = useState<string>("");
  const [dataDosenPA, setDataDosenPA] = useState<DosenPA[]>([]);
  const [dataKaprodi, setDataKaprodi] = useState<any[]>([]); // Adjust type as needed
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [selectedHari, setSelectedHari] = useState<string>("");
  const [selectedJam, setSelectedJam] = useState<string>("");
  const [dataUser, setDataUser] = useState<User>({} as User);
  const [dataJadwalDosenPa, setDataJadwalDosenPa] = useState<JadwalDosenPA[]>(
    []
  );
  const [selectedJenisBimbingan, setSelectedJenisBimbingan] =
    useState<string>("");
  const [selectedTopikBimbinganPribadi, setSelectedTopikBimbinganPribadi] =
    useState<string>("");
  const [dataJenisBimbingan, setDataJenisBimbingan] = useState<
    JenisBimbingan[]
  >([]);
  const [dataTopikBimbinganPribadi, setDataTopikBimbinganPribadi] = useState<
    TopikBimbinganPribadi[]
  >([]);
  const [optionsJenisBimbingan, setOptionsJenisBimbingan] = useState<
    { value: string; label: string }[]
  >([]);
  const [optionsTopikBimbinganPribadi, setOptionsTopikBimbinganPribadi] =
    useState<{ value: string; label: string }[]>([]);
  const [selectedSistemBimbingan, setSelectedSistemBimbingan] =
    useState<string>("");
  const [dataSistemBimbingan, setDataSistemBimbingan] = useState<
    SistemBimbingan[]
  >([]);
  const [optionsSistemBimbingan, setOptionsSistemBimbingan] = useState<
    { value: string; label: string }[]
  >([]);
  const [userDosenPa, setuserDosenPa] = useState<DosenPA | null>(null);
  const [dataMahasiswaUser, setDataMahasiswaUser] = useState<Mahasiswa | null>(
    null
  );
  const [dataMahasiswa, setDataMahasiswa] = useState<Mahasiswa[]>([]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

  const getDataJadwalDosenPaByDosenPa = async () => {
    try {
      const dataDosenPa = await axios.get<DosenPA[]>(
        `${API_BASE_URL}/api/datadosenpa`
      );

      const dosenPa = dataDosenPa.data.find(
        (data) => data.nama === userDosenPa?.nama
      );

      if (!dosenPa) {
        throw new Error("Jurusan tidak ditemukan");
      }

      const dosenpaid = dosenPa.id;

      const response = await axios.get<JadwalDosenPA[]>(
        `${API_BASE_URL}/api/datajadwaldosenpa/${dosenpaid}`
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
      const dataDosenPa = await axios.get<DosenPA[]>(
        `${API_BASE_URL}/api/datadosenpa`
      );

      const dosenPa = dataDosenPa.data.find(
        (data) => data.id === dataMahasiswaUser?.dosen_pa_id
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
      const dataMahasiswa = await axios.get<Mahasiswa[]>(
        `${API_BASE_URL}/api/datamahasiswa`
      );

      console.log(dataMahasiswa, dataUser);

      const mahasiswa = dataMahasiswa.data.find(
        (data) => data.nim === dataUser.nim
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

  console.log(dataMahasiswaUser);

  const getDataJenisBimbingan = async () => {
    try {
      const response = await axios.get<JenisBimbingan[]>(
        `${API_BASE_URL}/api/datajenisbimbingan`
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
  const getDataTopikBimbinganPribadi = async () => {
    try {
      const response = await axios.get<TopikBimbinganPribadi[]>(
        `${API_BASE_URL}/api/datatopikbimbinganpribadi`
      );

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      const sortedDataTopikBimbinganPribadi = data.sort(
        (a, b) => a.order - b.order
      );
      setDataTopikBimbinganPribadi(sortedDataTopikBimbinganPribadi);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataSistemBimbingan = async () => {
    try {
      const response = await axios.get<SistemBimbingan[]>(
        `${API_BASE_URL}/api/datasistembimbingan`
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

  const addPengajuanBimbingan = async (newData: any) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/pengajuanbimbingan`,
        newData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleAddPengajuanBimbingan = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const formattedDate = format(selectedDateTime as Date, "dd MMMM yyyy", {
      locale: id,
    });

    try {
      let pengajuanBimbinganValue = {
        nama_lengkap: namaLengkap,
        nim,
        email,
        no_whatsapp: noWa,
        jurusan,
        jadwal_bimbingan: `${selectedHari}, ${formattedDate} ${selectedJam}`,
        jenis_bimbingan: selectedJenisBimbingan,
        topik_bimbingan:
          selectedTopikBimbinganPribadi === ""
            ? null
            : selectedTopikBimbinganPribadi,
        sistem_bimbingan: selectedSistemBimbingan,
        mahasiswa_id: dataUser.nim,
        status: "Menunggu Konfirmasi",
        dosen_pa_id: userDosenPa?.id,
      };

      const result = await addPengajuanBimbingan(pengajuanBimbinganValue);
      console.log(result);
      setNamaLengkap("");
      setNim("");
      setEmail("");
      setNoWa("");
      setJurusan("");
      setSelectedDateTime(null);
      setSelectedHari("");
      setSelectedJam("");
      setSelectedJenisBimbingan("");
      setSelectedSistemBimbingan("");

      setTimeout(() => {
        if (dataMahasiswaUser) {
          setNamaLengkap(dataMahasiswaUser.nama);
          setNim(dataMahasiswaUser.nim);
          setEmail(dataMahasiswaUser.email);
          setNoWa(dataMahasiswaUser.hp);
          setJurusan(dataMahasiswaUser.jurusan);
        }
      }, 1000);
    } catch (error) {
      console.error("Registration error:", (error as Error).message);
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

      const data = await response.data;
      setDataDosenPA(data);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataKaprodi = async () => {
    try {
      const response = await axios.get<any[]>(
        `${API_BASE_URL}/api/datakaprodi`
      );

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

  const getDataMahasiswa = async () => {
    try {
      const response = await axios.get<Mahasiswa[]>(
        `${API_BASE_URL}/api/datamahasiswa`
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
    setSelectedTopikBimbinganPribadi("");
  }, [selectedJenisBimbingan]);

  useEffect(() => {
    if (dataUser.role === "Mahasiswa") {
      setRoleUser("Mahasiswa");
    } else if (dataUser.role === "Dosen PA") {
      setRoleUser("Dosen PA");
    } else if (dataUser.role === "Kaprodi") {
      setRoleUser("Kaprodi");
    }
  }, [dataUser, dataDosenPA, dataKaprodi]);

  useEffect(() => {
    if (dataMahasiswaUser && dataMahasiswaUser.id) {
      setNamaLengkap(dataMahasiswaUser.nama);
      setNim(dataMahasiswaUser.nim);
      setEmail(dataMahasiswaUser.email);
      setNoWa(dataMahasiswaUser.hp);
      setJurusan(dataMahasiswaUser.jurusan);
      getDataDosenPaByMahasiswa();
    }
  }, [dataMahasiswaUser]);

  useEffect(() => {
    if (dataUser && dataUser.nim) {
      getDataMahasiswaByUser();
    }
  }, [dataUser]);

  useEffect(() => {
    if (userDosenPa && userDosenPa.nama) {
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
    if (dataTopikBimbinganPribadi.length > 0) {
      const formattedOptions = dataTopikBimbinganPribadi.map((data) => {
        return {
          value: data.topik_bimbingan,
          label: data.topik_bimbingan,
        };
      });

      setOptionsTopikBimbinganPribadi(formattedOptions);
    }
  }, [dataTopikBimbinganPribadi]);

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
    getDataTopikBimbinganPribadi();
    getDataSistemBimbingan();
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

  const getDayName = (date: Date) => {
    return format(date, "EEEE", { locale: id });
  };
  console.log(dataUser);
  return (
    <div>
      <NavbarUser
        roleUser={roleUser}
        dataUser={
          roleUser === "Mahasiswa"
            ? dataMahasiswa.find((data) => data.nim === dataUser.nim)
            : roleUser === "Dosen PA"
              ? dataDosenPA.find((data) => data.nip === dataUser.nip)
              : roleUser === "Kaprodi"
                ? dataKaprodi.find((data) => data.nip === dataUser.nip)
                : undefined
        }
      />
      <div className="pt-[100px]">
        <div className="mt-4 mb-10 mx-[130px] border rounded-lg">
          <h1 className="font-semibold text-[30px] text-center pt-4">
            Pengajuan Bimbingan Akademik Mahasiswa
          </h1>
          <form
            className="flex flex-col gap-4 p-8"
            onSubmit={handleAddPengajuanBimbingan}
          >
            <InputField
              disabled={false}
              type="text"
              placeholder="Nama Lengkap"
              onChange={(e) => setNamaLengkap(e.target.value)}
              value={namaLengkap}
              className="px-3 py-2 text-[15px] border rounded-lg focus:outline-none"
            />
            <InputField
              disabled={false}
              type="text"
              placeholder="NIM"
              onChange={(e) => setNim(e.target.value)}
              value={nim}
              className="px-3 py-2 text-[15px] border rounded-lg focus:outline-none"
            />
            <InputField
              disabled={false}
              type="text"
              placeholder="E-mail"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="px-3 py-2 text-[15px] border rounded-lg focus:outline-none"
            />
            <InputField
              disabled={false}
              type="text"
              placeholder="No Whatsapp"
              onChange={(e) => setNoWa(e.target.value)}
              value={noWa}
              className="px-3 py-2 text-[15px] border rounded-lg focus:outline-none"
            />
            <InputField
              disabled={false}
              type="text"
              placeholder="Jurusan"
              onChange={(e) => setJurusan(e.target.value)}
              value={jurusan}
              className="px-3 py-2 text-[15px] border rounded-lg focus:outline-none"
            />
            <div className="flex flex-col">
              <DatePicker
                selected={selectedDateTime}
                onChange={(date) => {
                  setSelectedDateTime(date);
                  if (date) {
                    setSelectedHari(getDayName(date));
                  }
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
            {selectedJenisBimbingan === "Pribadi" && (
              <SelectField
                options={optionsTopikBimbinganPribadi}
                onChange={(e) =>
                  setSelectedTopikBimbinganPribadi(e.target.value)
                }
                value={selectedTopikBimbinganPribadi}
                placeholder="Pilih Topik Bimbingan"
                className={`px-3 py-2 text-[15px] border rounded-lg appearance-none w-full focus:outline-none`}
              />
            )}
            <SelectField
              options={optionsSistemBimbingan}
              onChange={(e) => setSelectedSistemBimbingan(e.target.value)}
              value={selectedSistemBimbingan}
              placeholder="Pilih Sistem Bimbingan"
              className={`px-3 py-2 text-[15px] border rounded-lg appearance-none w-full focus:outline-none`}
            />
            <button
              type="submit"
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
