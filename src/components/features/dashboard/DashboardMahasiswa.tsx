"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import upIcon from "../../../assets/images/upIcon.png";
import downIcon from "../../../assets/images/downIcon.png";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectField";
import ProfileImage from "@/components/ui/ProfileImage";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

interface DashboardMahasiswaProps {
  selectedSubMenuDashboard: string;
  dataUser: object;
}

const schedule = {
  Senin: ["07.00 - 08.00", "13.00 - 15.00"],
  Selasa: ["09.00 - 11.00", "15.00 - 17.00"],
  Rabu: ["09.00 - 11.00", "15.00 - 17.00"],
  Kamis: ["09.00 - 11.00", "15.00 - 17.00"],
  Jumat: ["09.00 - 11.00", "15.00 - 17.00"],
};

const DashboardMahasiswa: React.FC<DashboardMahasiswaProps> = ({
  selectedSubMenuDashboard,
  dataUser,
}) => {
  const [namaLengkapMahasiswa, setNamaLengkapMahasiswa] = useState("");
  const [emailMahasiswa, setEmailMahasiswa] = useState("");
  const [nim, setNim] = useState("");
  const [noTelpMahasiswa, setNoTelpMahasiswa] = useState("");
  const [selectedJurusan, setSelectedJurusan] = useState("");
  const [selectedPeminatan, setSelectedPeminatan] = useState("");
  const [selectedDosenPA, setSelectedDosenPA] = useState("");
  const [dataJurusan, setDataJurusan] = useState([]);
  const [dataPeminatan, setDataPeminatan] = useState([]);
  const [dataDosenPA, setDataDosenPA] = useState([]);
  const [optionsJurusan, setOptionsJurusan] = useState([]);
  const [optionsPeminatan, setOptionsPeminatan] = useState([]);
  const [optionsDosenPA, setOptionsDosenPA] = useState([]);
  const [dataPengajuanBimbingan, setDataPengajuanBimbingan] = useState([]);

  function getDate(jadwal) {
    if (!jadwal) return "";
    const parts = jadwal.split(" ");
    return `${parts[0]} ${parts[1]} ${parts[2]} ${parts[3]}`;
  }

  function getTime(jadwal) {
    if (!jadwal) return "";
    const waktu = jadwal.split(" ").slice(-1)[0];
    return waktu;
  }

  const [userProfile, setUserProfile] = useState({
    nama_lengkap: "",
    email: "",
    nim: "",
    no_whatsapp: "",
    jurusan: "",
    peminatan: "",
    dosen_pa: "",
  });
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [dataJadwalDosenPA, setDataJadwalDosenPA] = useState([]);

  const getDataMahasiswaById = async () => {
    try {
      const dataMahasiswa = await axios.get(
        "http://localhost:3000/api/datamahasiswa"
      );

      const dataDosenPA = await axios.get(
        "http://localhost:3000/api/datadosenpa"
      );

      const mahasiswa = dataMahasiswa.data.find(
        (data) => data.id == dataUser.id
      );

      const dosenpa = dataDosenPA.data.find(
        (data) => data.id === mahasiswa.dosen_pa_id
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
      const dataDosenPa = await axios.get(
        `http://localhost:3000/api/datadosenpa`
      );

      const dosenPa = dataDosenPa.data.find(
        (data) => data.dosen.nama_lengkap === userProfile.dosen_pa
      );

      if (!dosenPa) {
        throw new Error("Dosen PA tidak ditemukan");
      }

      const dosenpaid = dosenPa.id;

      const response = await axios.get(
        `http://localhost:3000/api/datajadwaldosenpa/${dosenpaid}`
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
      const response = await axios.get("http://localhost:3000/api/datajurusan");

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      const sortedDataJurusan = data.sort((a, b) => a.order - b.order);
      setDataJurusan(sortedDataJurusan);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataPeminatanByJurusan = async (selectedJurusan) => {
    try {
      const dataJurusan = await axios.get(
        "http://localhost:3000/api/datajurusan"
      );

      const jurusan = dataJurusan.data.find(
        (data) => data.jurusan === selectedJurusan
      );

      if (!jurusan) {
        throw new Error("Jurusan tidak ditemukan");
      }

      const jurusanid = jurusan.id;

      const response = await axios.get(
        `http://localhost:3000/api/datapeminatan/${jurusanid}`
      );

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      const sortedDataPeminatan = data.sort((a, b) => a.order - b.order);
      setDataPeminatan(sortedDataPeminatan);
    } catch (error) {
      console.error("Error:", error);
      throw error;
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

  const getDataPengajuanBimbinganByNamaLengkapMahasiswa = async () => {
    try {
      const dataPengajuanBimbingan = await axios.get(
        `http://localhost:3000/api/pengajuanbimbingan`
      );

      const pengajuanBimbingan = dataPengajuanBimbingan.data.filter(
        (data) => data.nama_lengkap === userProfile.nama_lengkap
      );

      setDataPengajuanBimbingan(pengajuanBimbingan);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const patchMahasiswa = async (updatedData) => {
    try {
      const response = await axios.patch(
        "http://localhost:3000/api/datamahasiswa",
        updatedData
      );
      console.log("Mahasiswa updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  };

  const handleEditMahasiswa = async (id) => {
    try {
      let jurusanValue = {
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
      };

      const result = await patchMahasiswa(jurusanValue);
      getDataMahasiswaById();
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
    }
  }, [dataUser]);

  useEffect(() => {
    if (userProfile && userProfile.nama_lengkap !== "") {
      getDataJadwalDosenPaByDosenPa();
      getDataPengajuanBimbinganByNamaLengkapMahasiswa();
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

  const [openDay, setOpenDay] = useState(null);

  const toggleDay = (day) => {
    setOpenDay(openDay === day ? null : day);
  };

  return (
    <>
      {selectedSubMenuDashboard === "Profile Mahasiswa" && (
        <div className="w-[75%] pl-[30px] pr-[128px] mb-[200px] py-[30px]">
          <div className="border px-[70px] py-[30px] rounded-lg">
            <div className="flex gap-10">
              <ProfileImage className="size-[200px] rounded-full" />
              <div className="flex flex-col justify-center text-[13px] gap-4">
                <button className="bg-orange-500 w-[30%] px-4 py-2 text-white rounded-md">
                  Pilih Foto
                </button>
                <div>
                  <p>Besar file: maksimal 10mb</p>
                  <p>Ekstensi file yang diperbolehkan: .JPG .JPEG .PNG</p>
                </div>
              </div>
            </div>
            <form className="flex flex-col mt-8 gap-4">
              <InputField
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
                type="text"
                placeholder={emailMahasiswa === "" ? "Email" : emailMahasiswa}
                onChange={(e) => {
                  setEmailMahasiswa(e.target.value);
                }}
                value={emailMahasiswa}
                className="px-3 py-2 text-[15px] border rounded-lg"
              />
              <InputField
                type="text"
                placeholder={nim === "" ? "NIM" : nim}
                onChange={(e) => {
                  setNim(e.target.value);
                }}
                value={nim}
                className="px-3 py-2 text-[15px] border rounded-lg"
              />
              <InputField
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
                className={`text-white bg-orange-500 text-[14px] py-2 font-medium rounded-lg ${!isDataChanged && "hidden"}`}
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
              {dataPengajuanBimbingan.map((data) => (
                <div className="flex flex-col border rounded-lg p-6 gap-4">
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
                      className={`${data.status === "Diterima" ? "bg-green-500" : data.status === "Reschedule" ? "bg-red-500" : ""} p-3 self-center rounded-lg`}
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
