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
import { AppDispatch, RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { fetchMahasiswa } from "@/lib/features/mahasiswaSlice";
import { fetchDosenPA } from "@/lib/features/dosenPASlice";
import { fetchKaprodi } from "@/lib/features/kaprodiSlice";
import AlumniRestrictionModal from "@/components/ui/AlumniRestrictionModal";
import { useRouter } from "next/navigation";

export const selectIsLoadingGlobal = ({
  dataMahasiswaUser,
  userDosenPa,
  dataJenisBimbingan,
  dataTopikBimbinganPribadi,
  dataSistemBimbingan,
  optionsTahunAjaran,
  dataTahunAjaran,
  dataJadwalDosenPa,
}: {
  dataMahasiswaUser: any;
  userDosenPa: any;
  dataJenisBimbingan: any[];
  dataTopikBimbinganPribadi: any[];
  dataSistemBimbingan: any[];
  optionsTahunAjaran: { value: string; label: string }[];
  dataTahunAjaran: any[];
  dataJadwalDosenPa: any[];
}) => {
  const checks = {
    dataMahasiswaUser: !!dataMahasiswaUser,
    userDosenPa: !!userDosenPa,
    dataJenisBimbingan: dataJenisBimbingan.length > 0,
    dataTopikBimbinganPribadi: dataTopikBimbinganPribadi.length > 0,
    dataSistemBimbingan: dataSistemBimbingan.length > 0,
    optionsTahunAjaran: optionsTahunAjaran.length > 0,
    dataTahunAjaran: dataTahunAjaran.length > 0,
    dataJadwalDosenPa: dataJadwalDosenPa.length > 0,
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
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [selectedHari, setSelectedHari] = useState<string>("");
  const [selectedJam, setSelectedJam] = useState<string>("");
  const [dataJadwalDosenPa, setDataJadwalDosenPa] = useState<any>([]);
  const [selectedTopikBimbinganPribadi, setSelectedTopikBimbinganPribadi] =
    useState<string>("");
  const [dataJenisBimbingan, setDataJenisBimbingan] = useState<any>([]);
  const [dataTopikBimbinganPribadi, setDataTopikBimbinganPribadi] =
    useState<any>([]);
  const [optionsTahunAjaran, setOptionsTahunAjaran] = useState<
    { value: string; label: string }[]
  >([]);
  const [optionsSemester, setOptionsSemester] = useState<
    { value: string; label: string }[]
  >([
    {
      value: "Ganjil",
      label: "Ganjil",
    },
    {
      value: "Genap",
      label: "Genap",
    },
  ]);
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
  const [dataTahunAjaran, setDataTahunAjaran] = useState([]);
  const [selectedTahunAjaran, setSelectedTahunAjaran] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedPeriodePengajuan, setSelectedPeriodePengajuan] = useState("");
  const [optionsPeriodePengajuan, setoptionsPeriodePengajuan] = useState([
    {
      value: "Sebelum Perwalian KRS",
      label: "Sebelum Perwalian KRS",
    },
    {
      value: "Setelah Perwalian KRS - Sebelum Perwalian UTS",
      label: "Setelah Perwalian KRS - Sebelum Perwalian UTS",
    },
    {
      value: "Setelah Perwalian UTS - Sebelum Perwalian UAS",
      label: "Setelah Perwalian UTS - Sebelum Perwalian UAS",
    },
  ]);
  const [isOpenModalAlumni, setIsOpenModalAlumni] = useState(true);
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

  const getDataJadwalDosenPaByDosenPa = async () => {
    try {
      const dosenPa = dataDosenPA.find(
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
      const dosenPa = dataDosenPA.find(
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
      const mahasiswa = dataMahasiswa.find((data) => data.nim === dataUser.nim);

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

  const addPengajuanBimbingan = async (newData: any) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/pengajuanbimbingan`,
        newData
      );
      return {
        success: true,
        message: response.data.message || "Pengajuan berhasil!",
        data: response.data,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Terjadi kesalahan. Silakan coba lagi.";
      throw new Error(errorMessage);
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
        jenis_bimbingan: "Pribadi",
        tahun_ajaran: selectedTahunAjaran,
        semester: selectedSemester,
        topik_bimbingan: selectedTopikBimbinganPribadi,
        sistem_bimbingan: selectedSistemBimbingan,
        permasalahan,
        mahasiswa_id: dataUser.nim,
        status: "Menunggu Konfirmasi",
        dosen_pa_id: userDosenPa?.id,
        ipk: dataMahasiswaUser.ipk,
        periode_pengajuan: selectedPeriodePengajuan,
      };

      const result = await addPengajuanBimbingan(pengajuanBimbinganValue);

      // const notificationResponse = await axios.post("/api/sendmessage", {
      //   to: "085810676264",
      //   body: `Yth. ${dataDosenPA[0].nama},\nAnda memiliki pengajuan bimbingan baru dari mahasiswa (${namaLengkap}) pada ${formattedDate} ${selectedJam}. Mohon untuk memeriksa dan memproses pengajuan tersebut melalui tautan berikut:\nhttps://bimbingan-konseling-fikupnvj.vercel.app/\nTerima kasih atas perhatian Anda.`,
      // });

      // if (!notificationResponse.data.success) {
      //   throw new Error("Gagal mengirim notifikasi");
      // }

      toast.success(
        <div className="flex items-center">
          <span>{result.message || "Pengajuan bimbingan berhasil!"}</span>
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
      setNamaLengkap("");
      setNim("");
      setEmail("");
      setNoWa("");
      setIpk("");
      setSelectedTahunAjaran("");
      setSelectedSemester("");
      setSelectedPeriodePengajuan("");
      setSelectedTopikBimbinganPribadi("");
      setPermasalahan("");
      setJurusan("");
      setSelectedDateTime(null);
      setSelectedHari("");
      setSelectedJam("");
      setSelectedSistemBimbingan("");

      setTimeout(() => {
        if (dataMahasiswaUser) {
          setNamaLengkap(dataMahasiswaUser.nama);
          setNim(dataMahasiswaUser.nim);
          setEmail(dataMahasiswaUser.email);
          setNoWa(dataMahasiswaUser.hp);
          setJurusan(dataMahasiswaUser.jurusan);
          setIpk(dataMahasiswaUser.ipk);
        }
      }, 1000);
    } catch (error) {
      toast.error(
        <div className="flex items-center">
          <span>{error.message || "Pengajuan gagal. Silahkan coba lagi!"}</span>
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
    dispatch(fetchMahasiswa());
    dispatch(fetchDosenPA());
    dispatch(fetchKaprodi());
  }, []);

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

  useEffect(() => {
    setPermasalahan("");
  }, [selectedIsPermasalahan]);

  useEffect(() => {
    setPermasalahan("");
  }, [selectedTopikBimbinganPribadi]);

  const getDayName = (date: Date) => {
    return format(date, "EEEE", { locale: id });
  };

  const closeModalAlumni = () => {
    setIsOpenModalAlumni(false);
    const targetUrl = `/`;
    window.location.href = targetUrl;
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

  const isLoading = selectIsLoadingGlobal({
    dataMahasiswaUser,
    userDosenPa,
    dataJenisBimbingan,
    dataTopikBimbinganPribadi,
    dataSistemBimbingan,
    optionsTahunAjaran,
    dataTahunAjaran,
    dataJadwalDosenPa,
  });

  return (
    <>
      {isLoading && <Spinner />}
      <div>
        <NavbarUser roleUser={roleUser} dataUser={userData} />
        <div className="pt-[100px]">
          <div className="mt-4 mb-10 mx-4 md:mx-[130px] border rounded-lg">
            <h1 className="font-semibold text-[30px] text-center pt-4">
              Pengajuan Bimbingan Akademik Mahasiswa
            </h1>
            <form
              className="flex flex-col gap-4 p-8"
              onSubmit={handleAddPengajuanBimbingan}
            >
              <InputField
                disabled
                type="text"
                placeholder="Nama Lengkap"
                onChange={(e) => setNamaLengkap(e.target.value)}
                value={namaLengkap}
                className="px-3 py-2 text-[15px] border rounded-lg focus:outline-none"
              />
              <InputField
                disabled
                type="text"
                placeholder="NIM"
                onChange={(e) => setNim(e.target.value)}
                value={nim}
                className="px-3 py-2 text-[15px] border rounded-lg focus:outline-none"
              />
              <InputField
                disabled
                type="text"
                placeholder="E-mail"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="px-3 py-2 text-[15px] border rounded-lg focus:outline-none"
              />
              <InputField
                disabled
                type="text"
                placeholder="No Whatsapp"
                onChange={(e) => setNoWa(e.target.value)}
                value={noWa}
                className="px-3 py-2 text-[15px] border rounded-lg focus:outline-none"
              />
              <InputField
                disabled
                type="text"
                placeholder="Jurusan"
                onChange={(e) => setJurusan(e.target.value)}
                value={jurusan}
                className="px-3 py-2 text-[15px] border rounded-lg focus:outline-none"
              />
              <InputField
                disabled
                type="text"
                placeholder="IPK"
                onChange={(e) => setIpk(e.target.value)}
                value={ipk}
                className="px-3 py-2 text-[15px] border rounded-lg focus:outline-none"
              />
              <SelectField
                options={optionsTahunAjaran}
                onChange={(e) => setSelectedTahunAjaran(e.target.value)}
                value={selectedTahunAjaran}
                placeholder="Pilih Tahun Ajaran"
                className={`px-3 py-2 text-[15px] border cursor-pointer rounded-lg appearance-none w-full focus:outline-none`}
              />
              <SelectField
                options={optionsSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                value={selectedSemester}
                placeholder="Pilih Semester"
                className={`px-3 py-2 text-[15px] border cursor-pointer rounded-lg appearance-none w-full focus:outline-none`}
              />
              <SelectField
                options={optionsPeriodePengajuan}
                onChange={(e) => setSelectedPeriodePengajuan(e.target.value)}
                value={selectedPeriodePengajuan}
                placeholder="Pilih Periode Pengajuan"
                className={`px-3 py-2 text-[15px] border cursor-pointer rounded-lg appearance-none w-full focus:outline-none`}
              />
              <div className="flex flex-col">
                <DatePicker
                  selected={selectedDateTime}
                  onChange={(date: any) => {
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
                      .filter((data) => data.hari === selectedHari)
                      .sort((a, b) => {
                        // Mengonversi jam_mulai ke format yang bisa dibandingkan
                        const jamMulaiA = a.jam_mulai.split(":").map(Number);
                        const jamMulaiB = b.jam_mulai.split(":").map(Number);

                        // Menghitung total menit untuk perbandingan
                        const totalMenitA = jamMulaiA[0] * 60 + jamMulaiA[1];
                        const totalMenitB = jamMulaiB[0] * 60 + jamMulaiB[1];

                        return totalMenitA - totalMenitB; // Mengurutkan dari yang terkecil
                      })
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
                options={optionsSistemBimbingan}
                onChange={(e) => setSelectedSistemBimbingan(e.target.value)}
                value={selectedSistemBimbingan}
                placeholder="Pilih Sistem Bimbingan"
                className={`px-3 py-2 text-[15px] cursor-pointer border rounded-lg appearance-none w-full focus:outline-none`}
              />
              <SelectField
                options={optionsTopikBimbinganPribadi}
                onChange={(e) =>
                  setSelectedTopikBimbinganPribadi(e.target.value)
                }
                value={selectedTopikBimbinganPribadi}
                placeholder="Pilih Topik Bimbingan"
                className={`px-3 py-2 text-[15px] border cursor-pointer rounded-lg appearance-none w-full focus:outline-none`}
              />
              <textarea
                placeholder={
                  permasalahan === "" ? "Permasalahan" : permasalahan
                }
                onChange={(e) => {
                  setPermasalahan(e.target.value);
                }}
                value={permasalahan}
                className="border focus:outline-none rounded-lg px-3 py-2 w-full h-24" // Anda bisa menyesuaikan lebar dan tinggi sesuai kebutuhan
              />
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-[6px] font-medium"
              >
                Ajukan
              </button>
            </form>
            <ToastContainer />
          </div>
        </div>
        {userData?.status_lulus && (
          <AlumniRestrictionModal
            onClose={closeModalAlumni}
            isOpen={isOpenModalAlumni}
          />
        )}

        <div className="border hidden md:block">
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
            Hak cipta &copy; 2025 Bimbingan Akademik Mahasiswa FIK UPNVJ
          </p>
        </div>
      </div>
    </>
  );
}
