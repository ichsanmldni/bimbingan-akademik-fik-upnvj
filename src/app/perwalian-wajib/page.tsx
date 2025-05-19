"use client";

import InputField from "@/components/ui/InputField";
import Logo from "@/components/ui/LogoUPNVJ";
import SelectField from "@/components/ui/SelectField";
import NavbarUser from "@/components/ui/NavbarUser";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { env } from "process";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { useDispatch } from "react-redux";
import { fetchMahasiswa } from "@/lib/features/mahasiswaSlice";
import { fetchDosenPA } from "@/lib/features/dosenPASlice";
import { fetchKaprodi } from "@/lib/features/kaprodiSlice";

export const selectIsLoadingGlobal = ({
  dataUser,
  dataDosenPA,
  dataKaprodi,
  dataJenisBimbingan,
  dataTopikBimbinganPribadi,
  dataSistemBimbingan,
  optionsTahunAjaran,
  dataTahunAjaran,
}: {
  dataUser: any;
  dataDosenPA: any[];
  dataKaprodi: any[];
  dataJenisBimbingan: any[];
  dataTopikBimbinganPribadi: any[];
  dataSistemBimbingan: any[];
  optionsTahunAjaran: any[];
  dataTahunAjaran: any[];
}) => {
  const checks = {
    dataUser: !!dataUser,
    dataDosenPA: dataDosenPA.length > 0,
    dataKaprodi: dataKaprodi.length > 0,
    dataJenisBimbingan: dataJenisBimbingan.length > 0,
    dataTopikBimbinganPribadi: dataTopikBimbinganPribadi.length > 0,
    dataSistemBimbingan: dataSistemBimbingan.length > 0,
    optionsTahunAjaran: optionsTahunAjaran.length > 0,
    dataTahunAjaran: dataTahunAjaran.length > 0,
  };

  console.log("Cek data loading:", checks);

  return Object.values(checks).some((value) => !value);
};

export function Spinner() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-[1000]">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-blue-600 border-b-transparent"></div>
    </div>
  );
}

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const roleUser =
    useSelector((state: RootState) => state.auth?.roleUser) || "";
  const dataUser = useSelector((state: RootState) => state.auth?.dataUser);

  // Data states
  const dataMahasiswa = useSelector(
    (state: RootState) => state.mahasiswa?.data
  );
  const dataDosenPA = useSelector((state: RootState) => state.dosenPA?.data);
  const dataKaprodi = useSelector((state: RootState) => state.kaprodi?.data);

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

  const [namaLengkap, setNamaLengkap] = useState<string>("");
  const [nim, setNim] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [noWa, setNoWa] = useState<string>("");
  const [jurusan, setJurusan] = useState<string>("");
  const [ipk, setIpk] = useState<string>("");
  const [selectedDateTime, setSelectedDateTime] = useState("");
  const [selectedHari, setSelectedHari] = useState<string>("");
  const [selectedJam, setSelectedJam] = useState<string>("");
  const [dataJadwalDosenPa, setDataJadwalDosenPa] = useState<any>([]);
  const [selectedJenisBimbingan, setSelectedJenisBimbingan] =
    useState<string>("");
  const [selectedTopikBimbinganPribadi, setSelectedTopikBimbinganPribadi] =
    useState<string>("");
  const [dataJenisBimbingan, setDataJenisBimbingan] = useState<any>([]);
  const [dataTopikBimbinganPribadi, setDataTopikBimbinganPribadi] =
    useState<any>([]);
  const [optionsJenisBimbingan, setOptionsJenisBimbingan] = useState<
    { value: string; label: string }[]
  >([]);
  const [optionsTopikBimbinganPribadi, setOptionsTopikBimbinganPribadi] =
    useState<{ value: string; label: string }[]>([]);
  const [selectedSistemBimbingan, setSelectedSistemBimbingan] =
    useState<string>("");
  const [dataSistemBimbingan, setDataSistemBimbingan] = useState<any>([]);
  const [optionsSistemBimbingan, setOptionsSistemBimbingan] = useState<
    { value: string; label: string }[]
  >([]);
  const [userDosenPa, setuserDosenPa] = useState<any>(null);
  const [dataMahasiswaUser, setDataMahasiswaUser] = useState<any>(null);
  const [permasalahan, setPermasalahan] = useState("");
  const [selectedIsPermasalahan, setSelectedIsPermasalahan] = useState("");
  const [datePerwalianWajib, setDatePerwalianWajib] = useState("");
  const [startPerwalianWajibTime, setStartPerwalianWajibTime] =
    useState("00:00");
  const [endPerwalianWajibTime, setEndPerwalianWajibTime] = useState("00:00");
  const [optionsTahunAjaran, setOptionsTahunAjaran] = useState<any>([]);
  const [selectedTahunAjaran, setSelectedTahunAjaran] = useState<any>("");
  const [dataTahunAjaran, setDataTahunAjaran] = useState<any>([]);
  const [optionsSemester, setOptionsSemester] = useState<any>([
    { value: "Ganjil", label: "Ganjil" },
    { value: "Genap", label: "Genap" },
  ]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [isiPesanSiaran, setIsiPesanSiaran] = useState("");

  const getDataTahunAJaran = async () => {
    try {
      const response = await axios.post<any>(
        `${API_BASE_URL}/api/datatahunajaran`
      );
      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }
      const data = await response.data.data;

      // Memfilter dan memformat data tahun ajaran
      const tahunAjaran = data.map((item: any) => {
        return `${item.tahun_periode}/${item.tahun_periode + 1}`;
      });

      // Menghilangkan duplikat dengan menggunakan Set
      const uniqueTahunAjaran = [...new Set(tahunAjaran)];

      // Menyimpan data tahun ajaran yang sudah difilter
      setDataTahunAjaran(uniqueTahunAjaran);
    } catch (error) {
      throw error;
    }
  };

  const handleEndTimeChange = (e) => {
    const newEndTime = e.target.value;
    setEndPerwalianWajibTime(newEndTime);
  };

  const handleStartTimeChange = (e) => {
    const newStartTime = e.target.value;
    setStartPerwalianWajibTime(newStartTime);
  };

  const today = new Date().toISOString().split("T")[0];

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setDatePerwalianWajib(selectedDate);
  };

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

  const getDataJadwalDosenPaByDosenPa = async () => {
    try {
      const dataDosenPa = await axios.get<any>(
        `${API_BASE_URL}/api/datadosenpa`
      );

      const dosenPa = dataDosenPa.data.find(
        (data) => data.nama === userDosenPa?.nama
      );

      if (!dosenPa) {
        throw new Error("Jurusan tidak ditemukan");
      }

      const dosenpaid = dosenPa.id;

      const response = await axios.get<any>(
        `${API_BASE_URL}/api/datajadwaldosenpa/${dosenpaid}`
      );

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      setDataJadwalDosenPa(data);
    } catch (error) {
      throw error;
    }
  };

  const getDataDosenPaByMahasiswa = async () => {
    try {
      const dataDosenPa = await axios.get<any>(
        `${API_BASE_URL}/api/datadosenpa`
      );

      const dosenPa = dataDosenPa.data.find(
        (data) => data.id === dataMahasiswaUser?.dosen_pa_id
      );

      if (!dosenPa) {
        return; // Hentikan eksekusi jika dosen PA tidak ditemukan
      }

      setuserDosenPa(dosenPa);
    } catch (error) {
      throw error;
    }
  };

  const getDataMahasiswaByUser = async () => {
    try {
      const dataMahasiswa = await axios.get<any>(
        `${API_BASE_URL}/api/datamahasiswa`
      );

      const mahasiswa = dataMahasiswa.data.find(
        (data) => data.nim === dataUser.nim
      );

      if (!mahasiswa) {
        throw new Error("Mahasiswa tidak ditemukan");
      }

      setDataMahasiswaUser(mahasiswa);
    } catch (error) {
      throw error;
    }
  };

  const getDataJenisBimbingan = async () => {
    try {
      const response = await axios.get<any>(
        `${API_BASE_URL}/api/datajenisbimbingan`
      );

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      const sortedDataJenisBimbingan = data.sort((a, b) => a.order - b.order);
      setDataJenisBimbingan(sortedDataJenisBimbingan);
    } catch (error) {
      throw error;
    }
  };
  const getDataTopikBimbinganPribadi = async () => {
    try {
      const response = await axios.get<any>(
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
      throw error;
    }
  };

  const getDataSistemBimbingan = async () => {
    try {
      const response = await axios.get<any>(
        `${API_BASE_URL}/api/datasistembimbingan`
      );

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      const sortedDataSistemBimbingan = data.sort((a, b) => a.order - b.order);
      setDataSistemBimbingan(sortedDataSistemBimbingan);
    } catch (error) {
      throw error;
    }
  };

  const addPerwalianWajib = async (newData: any) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/perwalianwajib`,
        newData
      );
      return {
        success: true,
        message: response.data.message || "Atur perwalian berhasil!",
        data: response.data,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Terjadi kesalahan. Silakan coba lagi.";
      throw new Error(errorMessage);
    }
  };

  const handleAddPerwalianWajib = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      const dateObject = new Date(datePerwalianWajib);

      // Mendapatkan format tanggal yang diinginkan
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };

      // Mengonversi tanggal ke format yang diinginkan
      const formattedDate = dateObject.toLocaleDateString("id-ID", options);

      let perwalianWajibValue = {
        tahun_ajaran: selectedTahunAjaran,
        semester: selectedSemester,
        jenis_bimbingan: selectedJenisBimbingan,
        sistem_bimbingan: selectedSistemBimbingan,
        jadwal_bimbingan: `${formattedDate} ${startPerwalianWajibTime}-${endPerwalianWajibTime}`,
        pesan_siaran: isiPesanSiaran,
        dosen_pa_id: dataDosenPA[0].id,
        waktu_kirim: new Date().toISOString(),
      };

      const result = await addPerwalianWajib(perwalianWajibValue);

      toast.success(
        <div className="flex items-center">
          <span>{result.message || "Atur perwalian wajib berhasil!"}</span>
        </div>,
        {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );

      setSelectedTahunAjaran("");
      setSelectedSemester("");
      setSelectedJenisBimbingan("");
      setSelectedDateTime(null);
      setIsiPesanSiaran("");
      setDatePerwalianWajib("");
      setStartPerwalianWajibTime("00:00");
      setEndPerwalianWajibTime("00:00");
    } catch (error) {
      toast.error(
        <div className="flex items-center">
          <span>
            {error.message || "Atur perwalian gagal. Silahkan coba lagi!"}
          </span>
        </div>,
        {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    }
  };

  useEffect(() => {
    setSelectedTopikBimbinganPribadi("");
  }, [selectedJenisBimbingan]);
  useEffect(() => {
    if (dataMahasiswaUser && dataMahasiswaUser.id) {
      setNamaLengkap(dataMahasiswaUser.nama);
      setNim(dataMahasiswaUser.nim);
      setEmail(dataMahasiswaUser.email);
      setNoWa(dataMahasiswaUser.hp);
      setJurusan(dataMahasiswaUser.jurusan);
      setIpk(dataMahasiswaUser.ipk);
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
      const filteredData = dataJenisBimbingan.filter((data) => {
        // Pengecualian untuk data yang tidak ingin ditampilkan
        return ["Perwalian KRS", "Perwalian UTS", "Perwalian UAS"].includes(
          data.jenis_bimbingan
        );
      });

      const formattedOptions = filteredData.map((data) => {
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
    getDataTahunAJaran();
    getDataJenisBimbingan();
    getDataTopikBimbinganPribadi();
    getDataSistemBimbingan();
  }, []);

  useEffect(() => {
    setSelectedTopikBimbinganPribadi("");
    setSelectedSistemBimbingan("");
    setSelectedIsPermasalahan("");
    setPermasalahan("");
  }, [selectedJenisBimbingan]);

  useEffect(() => {
    setPermasalahan("");
  }, [selectedIsPermasalahan]);

  useEffect(() => {
    setPermasalahan("");
  }, [selectedTopikBimbinganPribadi]);

  useEffect(() => {
    if (dataTahunAjaran.length > 0) {
      const formattedOptions = dataTahunAjaran.map((data: any) => {
        return {
          value: data,
          label: `${data}`,
        };
      });

      setOptionsTahunAjaran(formattedOptions);
    }
  }, [dataTahunAjaran]);

  const getDayName = (date: Date) => {
    return format(date, "EEEE", { locale: id });
  };

  useEffect(() => {
    dispatch(fetchMahasiswa());
    dispatch(fetchDosenPA());
    dispatch(fetchKaprodi());
  }, []);

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

  const isLoading = selectIsLoadingGlobal({
    dataUser,
    dataDosenPA,
    dataKaprodi,
    dataJenisBimbingan,
    dataTopikBimbinganPribadi,
    dataSistemBimbingan,
    optionsTahunAjaran,
    dataTahunAjaran,
  });

  return (
    <>
      {isLoading && <Spinner />}
      <div>
        <NavbarUser roleUser={roleUser} dataUser={userData} />
        <div className="pt-[100px]">
          <div className="mt-4 mb-10 mx-4 md:mx-[130px] border rounded-lg">
            <h1 className="font-semibold text-[30px] text-center pt-4">
              Perwalian Wajib Dosen Pembimbing Akademik
            </h1>
            <form
              className="flex flex-col gap-4 p-8"
              onSubmit={handleAddPerwalianWajib}
            >
              <SelectField
                options={optionsTahunAjaran}
                onChange={(e: any) => setSelectedTahunAjaran(e.target.value)}
                value={selectedTahunAjaran}
                placeholder="Pilih Tahun Ajaran"
                className={`px-3 py-2 text-[15px] border rounded-lg appearance-none w-full`}
              />
              <SelectField
                options={optionsSemester}
                onChange={(e: any) => setSelectedSemester(e.target.value)}
                value={selectedSemester}
                placeholder="Pilih Semester"
                className={`px-3 py-2 text-[15px] border rounded-lg appearance-none w-full`}
              />
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
              <div className="flex flex-col md:flex-row gap-2 md:gap-4 md:items-center">
                <input
                  type="date"
                  value={datePerwalianWajib}
                  onChange={handleDateChange}
                  min={today}
                  className="mt-2 px-3 py-2 text-[15px] border rounded-lg"
                />
                <div className="flex md:gap-3 items-center">
                  <input
                    type="time"
                    value={startPerwalianWajibTime}
                    onChange={handleStartTimeChange}
                    className="mt-2 px-3 py-2 text-[15px] border rounded-lg"
                  />
                  <p>-</p>
                  <input
                    type="time"
                    value={endPerwalianWajibTime}
                    onChange={handleEndTimeChange}
                    className="mt-2 px-3 py-2 text-[15px] border rounded-lg"
                  />
                </div>
              </div>
              <textarea
                placeholder="Isi Pesan Siaran"
                className="border text-[15px] focus:outline-none rounded-lg px-3 py-2 w-full h-24" // Anda bisa menyesuaikan lebar dan tinggi sesuai kebutuhan
                onChange={(e) => {
                  setIsiPesanSiaran(e.target.value);
                }}
                value={isiPesanSiaran}
              />
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-[6px] font-medium"
              >
                Atur Perwalian
              </button>
            </form>
            <ToastContainer />
          </div>
        </div>

        <div className="border hidden md:block">
          <p className="text-center my-8 text-[16px]">
            Hak cipta &copy; 2025 Bimbingan Akademik Mahasiswa FIK UPNVJ
          </p>
        </div>
      </div>
    </>
  );
}
