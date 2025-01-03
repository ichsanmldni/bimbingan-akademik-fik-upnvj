"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import upIcon from "../../../assets/images/upIcon.png";
import downIcon from "../../../assets/images/downIcon.png";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectField";
import ProfileImage from "@/components/ui/ProfileImage";
import axios from "axios";
import { env } from "process";

interface DashboardMahasiswaProps {
  selectedSubMenuDashboard: string;
  dataUser: Record<string, any>; // Adjust type as needed
}

interface Jurusan {
  id: string;
  jurusan: string;
  order: number;
}

interface Peminatan {
  id: string;
  peminatan: string;
  order: number;
}

interface DosenPA {
  id: string;
  dosen: {
    nama_lengkap: string;
  };
}

interface PengajuanBimbingan {
  id: string;
  mahasiswa_id: string;
  nama_lengkap: string;
  jenis_bimbingan: string;
  sistem_bimbingan: string;
  keterangan: string;
  jadwal_bimbingan: string;
  status: string;
}

const schedule = {
  Senin: [],
  Selasa: [],
  Rabu: [],
  Kamis: [],
  Jumat: [],
};

const DashboardMahasiswa: React.FC<DashboardMahasiswaProps> = ({
  selectedSubMenuDashboard,
  dataUser,
}) => {
  const [namaLengkapMahasiswa, setNamaLengkapMahasiswa] = useState<string>("");
  const [emailMahasiswa, setEmailMahasiswa] = useState<string>("");
  const [nim, setNim] = useState<string>("");
  const [noTelpMahasiswa, setNoTelpMahasiswa] = useState<string>("");
  const [selectedJurusan, setSelectedJurusan] = useState<string>("");
  const [selectedPeminatan, setSelectedPeminatan] = useState<string>("");
  const [selectedDosenPA, setSelectedDosenPA] = useState<string>("");
  const [dataJurusan, setDataJurusan] = useState<Jurusan[]>([]);
  const [dataPeminatan, setDataPeminatan] = useState<Peminatan[]>([]);
  const [dataDosenPA, setDataDosenPA] = useState<DosenPA[]>([]);
  const [optionsJurusan, setOptionsJurusan] = useState<
    { value: string; label: string }[]
  >([]);
  const [optionsPeminatan, setOptionsPeminatan] = useState<
    { value: string; label: string }[]
  >([]);
  const [optionsDosenPA, setOptionsDosenPA] = useState<
    { value: string; label: string }[]
  >([]);
  const [dataPengajuanBimbingan, setDataPengajuanBimbingan] = useState<
    PengajuanBimbingan[]
  >([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dataMahasiswa, setDataMahasiswa] = useState<Record<string, any>>({});
  const [userProfile, setUserProfile] = useState<{
    nama_lengkap: string;
    email: string;
    nim: string;
    no_whatsapp: string;
    jurusan: string;
    peminatan: string;
    dosen_pa: string;
  }>({
    nama_lengkap: "",
    email: "",
    nim: "",
    no_whatsapp: "",
    jurusan: "",
    peminatan: "",
    dosen_pa: "",
  });
  const [isDataChanged, setIsDataChanged] = useState<boolean>(false);
  const [dataJadwalDosenPA, setDataJadwalDosenPA] = useState<any[]>([]); // Adjust type as needed

  const API_BASE_URL = env.API_BASE_URL as string;

  function getDate(jadwal: string) {
    if (!jadwal) return "";
    const parts = jadwal.split(" ");
    return `${parts[0]} ${parts[1]} ${parts[2]} ${parts[3]}`;
  }

  function getTime(jadwal: string) {
    if (!jadwal) return "";
    const waktu = jadwal.split(" ").slice(-1)[0];
    return waktu;
  }

  const [openDay, setOpenDay] = useState<string | null>(null);

  const toggleDay = (day: string) => {
    setOpenDay(openDay === day ? null : day);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // Validasi ukuran file (maksimal 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("Ukuran file melebihi 10MB");
        return;
      }

      // Validasi jenis file
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        alert(
          "Format file tidak diperbolehkan. Gunakan .JPG, .JPEG, atau .PNG"
        );
        return;
      }

      // Menampilkan preview gambar
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getDataMahasiswaById = async () => {
    try {
      const dataMahasiswa = await axios.get(
        `${API_BASE_URL}/api/datamahasiswa`
      );
      const dataDosenPA = await axios.get(`${API_BASE_URL}/api/datadosenpa`);

      const mahasiswa = dataMahasiswa.data.find(
        (data: any) => data.id === dataUser.id
      );
      const dosenpa = dataDosenPA.data.find(
        (data: any) => data.id === mahasiswa.dosen_pa_id
      );

      if (!dosenpa) {
        console.error("Dosen PA tidak ditemukan");
        return;
      }

      if (!mahasiswa) {
        console.error("Mahasiswa tidak ditemukan");
        return;
      }

      setUserProfile({
        nama_lengkap: mahasiswa.nama_lengkap,
        email: mahasiswa.email,
        nim: mahasiswa.nim,
        no_whatsapp: mahasiswa.no_whatsapp,
        jurusan: mahasiswa.jurusan,
        peminatan: mahasiswa.peminatan,
        dosen_pa: dosenpa.dosen.nama_lengkap,
      });

      setDataMahasiswa(mahasiswa);

      setNamaLengkapMahasiswa(mahasiswa.nama_lengkap);
      setEmailMahasiswa(mahasiswa.email);
      setNim(mahasiswa.nim);
      setNoTelpMahasiswa(mahasiswa.no_whatsapp);
      setSelectedJurusan(mahasiswa.jurusan);
      setSelectedPeminatan(mahasiswa.peminatan);
      setSelectedDosenPA(dosenpa.dosen.nama_lengkap);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataJadwalDosenPaByDosenPa = async () => {
    try {
      const dataDosenPa = await axios.get(`${API_BASE_URL}/api/datadosenpa`);

      const dosenPa = dataDosenPa.data.find(
        (data: any) => data.dosen.nama_lengkap === userProfile.dosen_pa
      );

      if (!dosenPa) {
        throw new Error("Dosen PA tidak ditemukan");
      }

      const dosenpaid = dosenPa.id;

      const response = await axios.get(
        `${API_BASE_URL}/api/datajadwaldosenpa/${dosenpaid}`
      );

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      setDataJadwalDosenPA(data);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataJurusan = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/datajurusan`);

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      const sortedDataJurusan = data.sort(
        (a: any, b: any) => a.order - b.order
      );
      setDataJurusan(sortedDataJurusan);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataPeminatanByJurusan = async (selectedJurusan: string) => {
    try {
      const dataJurusan = await axios.get(`${API_BASE_URL}/api/datajurusan`);

      const jurusan = dataJurusan.data.find(
        (data: any) => data.jurusan === selectedJurusan
      );

      if (!jurusan) {
        throw new Error("Jurusan tidak ditemukan");
      }

      const jurusanid = jurusan.id;

      const response = await axios.get(
        `${API_BASE_URL}/api/datapeminatan/${jurusanid}`
      );

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      const sortedDataPeminatan = data.sort(
        (a: any, b: any) => a.order - b.order
      );
      setDataPeminatan(sortedDataPeminatan);
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

      const data = await response.data;
      setDataDosenPA(data);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataPengajuanBimbinganByIDMahasiswa = async () => {
    try {
      const dataPengajuanBimbingan = await axios.get(
        `${API_BASE_URL}/api/pengajuanbimbingan`
      );

      const pengajuanBimbingan = dataPengajuanBimbingan.data.filter(
        (data: any) => data.mahasiswa_id === dataUser.id
      );

      setDataPengajuanBimbingan(pengajuanBimbingan);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const patchMahasiswa = async (updatedData: any) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/datamahasiswa`,
        updatedData
      );
      console.log("Mahasiswa updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  };

  const handleEditMahasiswa = async (id: string) => {
    try {
      let mahasiswaValue = {
        id,
        nama_lengkap: namaLengkapMahasiswa,
        email: emailMahasiswa,
        nim: nim,
        no_whatsapp: noTelpMahasiswa,
        jurusan: selectedJurusan,
        peminatan: selectedPeminatan,
        dosen_pa_id: dataDosenPA.find(
          (data) => data.dosen.nama_lengkap === selectedDosenPA
        )?.id,
        profile_image: !imagePreview ? null : imagePreview,
      };

      const result = await patchMahasiswa(mahasiswaValue);
      getDataMahasiswaById();
      setImagePreview(null);
      console.log("Response from backend:", result);
    } catch (error) {
      console.error("Failed to save the updated order.");
    }
  };

  useEffect(() => {
    if (dataJurusan.length > 0) {
      const formattedOptions = dataJurusan.map((data) => {
        return {
          value: data.jurusan,
          label: data.jurusan,
        };
      });

      setOptionsJurusan(formattedOptions);
    }
  }, [dataJurusan]);

  useEffect(() => {
    const formattedOptions = dataPeminatan.map((data) => {
      return {
        value: data.peminatan,
        label: data.peminatan,
      };
    });

    setOptionsPeminatan(formattedOptions);
  }, [dataPeminatan]);

  useEffect(() => {
    if (dataDosenPA.length > 0) {
      const formattedOptions = dataDosenPA.map((data) => {
        return {
          value: data.dosen.nama_lengkap,
          label: data.dosen.nama_lengkap,
        };
      });

      setOptionsDosenPA(formattedOptions);
    }
  }, [dataDosenPA]);

  useEffect(() => {
    if (selectedJurusan !== "") {
      if (selectedJurusan === userProfile.jurusan) {
        setSelectedPeminatan(userProfile.peminatan);
      }
      if (selectedJurusan !== userProfile.jurusan) {
        setSelectedPeminatan("");
      }
      getDataPeminatanByJurusan(selectedJurusan);
    }
  }, [selectedJurusan]);

  useEffect(() => {
    if (dataUser && dataUser.id) {
      getDataMahasiswaById();
      getDataPengajuanBimbinganByIDMahasiswa();
    }
  }, [dataUser]);

  useEffect(() => {
    if (userProfile && userProfile.nama_lengkap !== "") {
      getDataJadwalDosenPaByDosenPa();
    }
  }, [userProfile]);

  useEffect(() => {
    if (userProfile && userProfile.nama_lengkap !== "") {
      const isDataChanged =
        userProfile.nama_lengkap !== namaLengkapMahasiswa ||
        userProfile.email !== emailMahasiswa ||
        userProfile.nim !== nim ||
        userProfile.no_whatsapp !== noTelpMahasiswa ||
        userProfile.dosen_pa !== selectedDosenPA ||
        userProfile.jurusan !== selectedJurusan ||
        userProfile.peminatan !== selectedPeminatan;
      setIsDataChanged(isDataChanged);
    }
  }, [
    userProfile,
    namaLengkapMahasiswa,
    emailMahasiswa,
    nim,
    noTelpMahasiswa,
    selectedDosenPA,
    selectedJurusan,
    selectedPeminatan,
  ]);

  useEffect(() => {
    getDataJurusan();
    getDataDosenPA();
  }, []);

  useEffect(() => {
    setImagePreview(null);
    getDataMahasiswaById();
  }, [selectedSubMenuDashboard]);

  return (
    <>
      {selectedSubMenuDashboard === "Profile Mahasiswa" && (
        <div className="w-[75%] pl-[30px] pr-[128px] mb-[200px] py-[30px]">
          <div className="border px-[70px] py-[30px] rounded-lg">
            <div className="flex gap-10">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="size-[200px] rounded-full object-cover"
                />
              ) : dataMahasiswa.profile_image ? (
                <img
                  src={dataMahasiswa.profile_image}
                  alt="Profile"
                  className="size-[200px] rounded-full object-cover"
                />
              ) : (
                <ProfileImage
                  onClick={() => {}}
                  className="size-[200px] rounded-full"
                />
              )}
              <div className="flex flex-col justify-center text-[13px] gap-4">
                {/* Input file yang tersembunyi */}
                <input
                  type="file"
                  id="fileInput"
                  accept="image/jpeg, image/jpg, image/png"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="fileInput"
                  className="bg-orange-500 hover:bg-orange-600 w-[30%] px-4 py-2 text-white rounded-md text-center cursor-pointer"
                >
                  Pilih Foto
                </label>
                <div>
                  <p>Besar file: maksimal 10MB</p>
                  <p>Ekstensi file yang diperbolehkan: .JPG .JPEG .PNG</p>
                </div>
              </div>
            </div>

            <form className="flex flex-col mt-8 gap-4">
              <InputField
                disabled={false}
                type="text"
                placeholder={
                  namaLengkapMahasiswa === ""
                    ? "Nama Lengkap"
                    : namaLengkapMahasiswa
                }
                onChange={(e) => {
                  setNamaLengkapMahasiswa(e.target.value);
                }}
                value={namaLengkapMahasiswa}
                className="px-3 py-2 text-[15px] border rounded-lg"
              />
              <InputField
                disabled={false}
                type="text"
                placeholder={emailMahasiswa === "" ? "Email" : emailMahasiswa}
                onChange={(e) => {
                  setEmailMahasiswa(e.target.value);
                }}
                value={emailMahasiswa}
                className="px-3 py-2 text-[15px] border rounded-lg"
              />
              <InputField
                disabled={false}
                type="text"
                placeholder={nim === "" ? "NIM" : nim}
                onChange={(e) => {
                  setNim(e.target.value);
                }}
                value={nim}
                className="px-3 py-2 text-[15px] border rounded-lg"
              />
              <InputField
                disabled={false}
                type="text"
                placeholder={
                  noTelpMahasiswa === "" ? "No Telp" : noTelpMahasiswa
                }
                onChange={(e) => {
                  setNoTelpMahasiswa(e.target.value);
                }}
                value={noTelpMahasiswa}
                className="px-3 py-2 text-[15px] border rounded-lg"
              />
              <SelectField
                options={optionsJurusan}
                onChange={(e) => setSelectedJurusan(e.target.value)}
                value={selectedJurusan}
                placeholder="Pilih Jurusan"
                className={`px-3 py-2 text-[15px] border rounded-lg appearance-none w-full`}
              />
              <SelectField
                options={optionsPeminatan}
                onChange={(e) => setSelectedPeminatan(e.target.value)}
                value={selectedPeminatan}
                placeholder="Pilih Peminatan"
                className={`px-3 py-2 text-[15px] border rounded-lg appearance-none w-full`}
              />
              <SelectField
                options={optionsDosenPA}
                onChange={(e) => setSelectedDosenPA(e.target.value)}
                value={selectedDosenPA}
                placeholder="Pilih Dosen PA"
                className={`px-3 py-2 text-[15px] border rounded-lg appearance-none w-full`}
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleEditMahasiswa(dataUser.id);
                }}
                className={`text-white bg-orange-500 text-[14px] py-2 font-medium rounded-lg  ${
                  !isDataChanged && !imagePreview ? "hidden" : ""
                }`}
              >
                Simpan
              </button>
            </form>
          </div>
        </div>
      )}
      {selectedSubMenuDashboard === "Jadwal Kosong Dosen PA Role Mahasiswa" && (
        <div className="w-[75%] pl-[30px] pr-[128px] mb-[200px] py-[30px]">
          <div className=" flex flex-col gap-6 border px-[25px] pt-[15px] pb-[30px] rounded-lg">
            <h1 className="font-semibold text-[24px]">
              Jadwal Kosong Dosen Pembimbing Akademik
            </h1>
            <div className="flex flex-col gap-4">
              {Object.keys(schedule).map((day) => {
                const filteredJadwal = dataJadwalDosenPA.filter(
                  (data) => data.hari === day
                );
                return (
                  <div key={day}>
                    <button
                      className="w-full text-left px-4 py-2 border border-gray-300 rounded-lg flex justify-between items-center"
                      onClick={() => toggleDay(day)}
                    >
                      <span className="text-[14px]">{day}</span>
                      <span>
                        {openDay === day ? (
                          <Image src={upIcon} alt="upIcon" />
                        ) : (
                          <Image src={downIcon} alt="downIcon" />
                        )}
                      </span>
                    </button>
                    {openDay === day && (
                      <div className="flex px-4 pt-4">
                        {filteredJadwal.length > 0 ? (
                          filteredJadwal.map((data, index) => (
                            <div
                              key={index}
                              className="inline-flex items-center"
                            >
                              <span className="text-[14px]">{`${data.jam_mulai}-${data.jam_selesai}`}</span>
                              {index <
                                dataJadwalDosenPA.filter(
                                  (data) => data.hari === day
                                ).length -
                                  1 && (
                                <span className="mx-2 text-gray-600">|</span>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-red-500 text-[14px]">
                            Tidak ada jadwal kosong di hari ini
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {selectedSubMenuDashboard === "Riwayat Pengajuan Konseling" && (
        <div className="w-[75%] pl-[30px] pr-[128px] mb-[200px] py-[30px]">
          <div className=" flex flex-col gap-6 border px-[30px] pt-[15px] pb-[30px] rounded-lg">
            <h1 className="font-semibold text-[24px]">
              Riwayat Pengajuan Bimbingan Konseling
            </h1>

            <div className="flex flex-col gap-4">
              {dataPengajuanBimbingan
                .slice()
                .reverse()
                .map((data) => (
                  <div
                    key={data.id}
                    className="flex flex-col border rounded-lg p-6 gap-4"
                  >
                    <div className="flex justify-between text-neutral-600">
                      <p>{getDate(data.jadwal_bimbingan)}</p>
                      <p>{getTime(data.jadwal_bimbingan)}</p>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{data.nama_lengkap}</p>
                        <p>{data.jenis_bimbingan}</p>
                        <p className="font-medium">{data.sistem_bimbingan}</p>
                      </div>
                      <div
                        className={`${data.status === "Diterima" ? "bg-green-500" : data.status === "Reschedule" ? "bg-red-500" : data.status === "Menunggu Konfirmasi" ? "bg-gray-400" : ""} p-3 self-center rounded-lg`}
                      >
                        <p className="text-white text-center">{data.status}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[14px]">{data.keterangan}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardMahasiswa;
