"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import upIcon from "../../../assets/images/upIcon.png";
import upnvjLogo from "../../../assets/images/LOGO-UPNVJ.png";
import backIconOrange from "../../../assets/images/back-icon-orange.png";
import downIcon from "../../../assets/images/downIcon.png";
import addIcon from "../../../assets/images/add-button.png";
import plusIcon from "../../../assets/images/plus.png";
import deleteIcon from "../../../assets/images/trash-icon.png";
import line from "../../../assets/images/line.png";
import InputField from "@/components/ui/InputField";
import ProfileImage from "@/components/ui/ProfileImage";
import axios from "axios";
import TrashButton from "@/components/ui/TrashButton";
import { format } from "date-fns";
import { env } from "process";
import { Dialog, DialogPanel } from "@headlessui/react";
import { EyeIcon } from "@heroicons/react/outline";

interface UserProfile {
  nama_lengkap: string;
  email: string;
  nip: string;
  no_whatsapp: string;
}

interface DataDosenPA {
  id: number;
  dosen_id: number;
  nama_lengkap: string;
  email: string;
  nip: string;
  no_whatsapp: string;
  profile_image?: string;
}

interface DataJadwalDosenPA {
  id: number;
  dosen_pa_id: number;
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
}

interface DataPengajuanBimbingan {
  id: number;
  mahasiswa_id: number;
  dosen_pa_id: number;
  jadwal_bimbingan: string;
  nama_lengkap: string;
  jenis_bimbingan: string;
  sistem_bimbingan: string;
  keterangan: string | null;
  status: string;
}

interface DataLaporanBimbingan {
  id: number;
  waktu_bimbingan: string;
  nama_mahasiswa: string;
  jenis_bimbingan: string;
  sistem_bimbingan: string;
  status: string;
  kendala_mahasiswa: string;
  solusi: string;
  kesimpulan: string;
  dokumentasi: string | null;
  feedback_kaprodi: string | null;
  dosen_pa_id: number;
}

interface DashboardDosenPAProps {
  selectedSubMenuDashboard: string;
  dataUser: { id: number; [key: string]: any };
}

const schedule: Record<string, string[]> = {
  Senin: [],
  Selasa: [],
  Rabu: [],
  Kamis: [],
  Jumat: [],
};

const DashboardDosenPA: React.FC<DashboardDosenPAProps> = ({
  selectedSubMenuDashboard,
  dataUser,
}) => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    nama_lengkap: "",
    email: "",
    nip: "",
    no_whatsapp: "",
  });
  const [dataJadwalDosenPA, setDataJadwalDosenPA] = useState<
    DataJadwalDosenPA[]
  >([]);
  const [dataPengajuanBimbingan, setDataPengajuanBimbingan] = useState<
    DataPengajuanBimbingan[]
  >([]);
  const [dataLaporanBimbingan, setDataLaporanBimbingan] = useState<
    DataLaporanBimbingan[]
  >([]);
  const [namaLengkapDosen, setNamaLengkapDosen] = useState<string>("");
  const [emailDosen, setEmailDosen] = useState<string>("");
  const [nip, setNip] = useState<string>("");
  const [noTelpDosen, setNoTelpDosen] = useState<string>("");
  const [keteranganKonfirmasi, setKeteranganKonfirmasi] = useState<
    Record<number, string>
  >({});
  const [isDetailLaporanDosenClicked, setIsDetailLaporanDosenClicked] =
    useState<boolean>(false);
  const [isDataChanged, setIsDataChanged] = useState<boolean>(false);
  const [isAddJadwal, setIsAddJadwal] = useState<boolean>(false);
  const [dataDosenPA, setDataDosenPA] = useState<DataDosenPA | null>(null);
  const [dataDosen, setDataDosen] = useState<DataDosenPA | null>(null);
  const [dataClickedLaporanBimbingan, setDataClickedLaporanBimbingan] =
    useState<DataLaporanBimbingan | null>(null);
  const [selectedHari, setSelectedHari] = useState<string>("");
  const [jamMulai, setJamMulai] = useState<string>("");
  const [jamSelesai, setJamSelesai] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [openDay, setOpenDay] = useState<string | null>(null);
  const [dataPengesahanBimbingan, setDataPengesahanBimbingan] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const openImageInNewTab = (path: string) => {
    window.open(path, "_blank"); // Membuka URL di tab baru
  };

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

  const toggleDay = (day: string) => {
    setOpenDay(openDay === day ? null : day);
  };

  const getDate = (jadwal: string) => {
    if (!jadwal) return "";
    const parts = jadwal.split(" ");
    return `${parts[0]} ${parts[1]} ${parts[2]} ${parts[3]}`;
  };

  const getTime = (jadwal: string) => {
    if (!jadwal) return "";
    const waktu = jadwal.split(" ").slice(-1)[0];
    return waktu;
  };

  const getDataPengesahanBimbinganByIDDosenPA = async () => {
    try {
      const dataBimbingan = await axios.get(`${API_BASE_URL}/api/bimbingan`);

      const bimbinganUser = dataBimbingan.data.filter(
        (data: any) => data.pengajuan_bimbingan.dosen_pa_id === dataUser.id
      );

      const bimbingan = bimbinganUser.filter(
        (data) => data.status_pengesahan_kehadiran === "Belum Sah"
      );

      setDataPengesahanBimbingan(bimbingan);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const addJadwalDosen = async (newData: DataJadwalDosenPA) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/datajadwaldosenpa/${dataDosenPA?.id}`,
        newData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteJadwalDosen = async (deletedData: DataJadwalDosenPA) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/datajadwaldosenpa/${deletedData.id}`,
        { data: deletedData }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const patchPengajuanBimbingan = async (updatedData: any) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/pengajuanbimbingan`,
        updatedData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  const patchPengesahanKehadiranBimbingan = async (updatedData: any) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/bimbingan/pengesahanabsensi`,
        updatedData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const getDataDosenPAByDosenId = async () => {
    try {
      const dataDosenPA = await axios.get(`${API_BASE_URL}/api/datadosenpa`);
      const dosen = dataDosenPA.data.find(
        (data: DataDosenPA) => data.dosen_id === dataUser.id
      );

      if (!dosen) {
        console.error("Dosen tidak ditemukan");
        return;
      }

      setDataDosenPA(dosen);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataDosenById = async () => {
    try {
      const dataDosen = await axios.get(`${API_BASE_URL}/api/datadosen`);
      const dosen = dataDosen.data.find(
        (data: DataDosenPA) => data.id === dataUser.id
      );

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

      setDataDosen(dosen);
      setNamaLengkapDosen(dosen.nama_lengkap);
      setEmailDosen(dosen.email);
      setNip(dosen.nip);
      setNoTelpDosen(dosen.no_whatsapp);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataJadwalDosenPaByDosenPa = async () => {
    try {
      const dataDosenPa = await axios.get(`${API_BASE_URL}/api/datadosenpa`);
      const dosenPa = dataDosenPa.data.find(
        (data: any) => data.dosen.nama_lengkap === userProfile.nama_lengkap
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

  const getDataPengajuanBimbinganByDosenPaId = async () => {
    try {
      const dataDosenPa = await axios.get(`${API_BASE_URL}/api/datadosenpa`);
      const dosenPa = dataDosenPa.data.find(
        (data: any) => data.dosen.nama_lengkap === userProfile.nama_lengkap
      );

      if (!dosenPa) {
        throw new Error("Dosen PA tidak ditemukan");
      }

      const dosenpaid = dosenPa.id;
      const dataPengajuanBimbingan = await axios.get(
        `${API_BASE_URL}/api/pengajuanbimbingan`
      );

      const pengajuanBimbingan = dataPengajuanBimbingan.data.filter(
        (data: DataPengajuanBimbingan) => data.dosen_pa_id === dosenpaid
      );
      setDataPengajuanBimbingan(pengajuanBimbingan);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataLaporanBimbinganByDosenPaId = async () => {
    try {
      const dataDosenPa = await axios.get(`${API_BASE_URL}/api/datadosenpa`);
      const dosenPa = dataDosenPa.data.find(
        (data: any) => data.dosen.nama_lengkap === userProfile.nama_lengkap
      );

      if (!dosenPa) {
        throw new Error("Dosen PA tidak ditemukan");
      }

      const dosenpaid = dosenPa.id;
      const dataLaporanBimbingan = await axios.get(
        `${API_BASE_URL}/api/laporanbimbingan`
      );

      const laporanBimbingan = dataLaporanBimbingan.data.filter(
        (data: DataLaporanBimbingan) => data.dosen_pa_id === dosenpaid
      );
      setDataLaporanBimbingan(laporanBimbingan);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const patchDosenPA = async (updatedData: DataDosenPA) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/datadosen`,
        updatedData
      );
      console.log("Dosen PA updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  };

  const addBimbingan = async (idPengajuan: number) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/bimbingan`, {
        pengajuan_bimbingan_id: idPengajuan,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
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

  const handleEditDosenPA = async (id: number) => {
    try {
      let dosenPAValue: any = {
        id,
        nama_lengkap: namaLengkapDosen,
        email: emailDosen,
        nip,
        no_whatsapp: noTelpDosen,
        profile_image: imagePreview ? imagePreview : undefined,
      };

      const result = await patchDosenPA(dosenPAValue);
      getDataDosenById();
      setImagePreview(null);
      console.log("Response from backend:", result);
    } catch (error) {
      console.error("Failed to save the updated order.");
    }
  };

  const handleDetailLaporanDosen = (data: DataLaporanBimbingan) => {
    setDataClickedLaporanBimbingan(data);
    setIsDetailLaporanDosenClicked((prev) => !prev);
  };

  const handleAddJadwalDosen = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      let jadwalDosenValue: any = {
        dosen_pa_id: dataDosenPA?.id as number,
        hari: selectedHari,
        jam_mulai: jamMulai,
        jam_selesai: jamSelesai,
      };

      const result = await addJadwalDosen(jadwalDosenValue);
      getDataJadwalDosenPaByDosenPa();
      setJamMulai("");
      setJamSelesai("");
      setIsAddJadwal(false);
      console.log(result);
    } catch (error) {
      console.error("Registration error:", (error as Error).message);
    }
  };

  const handleDeleteJadwalDosen = async (id: number) => {
    try {
      let jadwalDosenValue: any = {
        id,
      };
      const result = await deleteJadwalDosen(jadwalDosenValue);
      getDataJadwalDosenPaByDosenPa();
      console.log(result);
    } catch (error) {
      console.error("Registration error:", (error as Error).message);
    }
  };

  const handleEditPengajuanBimbingan = async (
    id: number,
    mahasiswa_id: number,
    statusPengajuan: string
  ) => {
    try {
      let pengajuanBimbinganValue = {
        id,
        status: statusPengajuan,
        keterangan: keteranganKonfirmasi[id],
        mahasiswa_id,
        dosen_pa_id: dataDosenPA?.id as number,
      };

      const result = await patchPengajuanBimbingan(pengajuanBimbinganValue);
      await addBimbingan(id);
      console.log(result);
      setKeteranganKonfirmasi((prev) => ({ ...prev, [id]: "" }));
      getDataPengajuanBimbinganByDosenPaId();
    } catch (error) {
      console.error("Registration error:", (error as Error).message);
    }
  };

  const handleEditPengesahanKehadiranBimbingan = async (
    id: number,
    status_pengesahan_kehadiran: string
  ) => {
    try {
      let pengesahanKehadiranBimbinganValue = {
        id,
        status_pengesahan_kehadiran,
      };

      const result = await patchPengesahanKehadiranBimbingan(
        pengesahanKehadiranBimbinganValue
      );
      getDataPengesahanBimbinganByIDDosenPA();
    } catch (error) {
      console.error("Registration error:", (error as Error).message);
    }
  };

  useEffect(() => {
    if (dataUser && dataUser.id) {
      getDataDosenById();
      getDataPengesahanBimbinganByIDDosenPA();
      getDataDosenPAByDosenId();
    }
  }, [dataUser]);

  useEffect(() => {
    setImagePreview(null);
    getDataDosenById();
    getDataPengesahanBimbinganByIDDosenPA();
  }, [selectedSubMenuDashboard]);

  useEffect(() => {
    if (
      userProfile &&
      Object.keys(userProfile).length > 0 &&
      userProfile.nama_lengkap
    ) {
      getDataJadwalDosenPaByDosenPa();
    }
  }, [userProfile]);

  useEffect(() => {
    if (userProfile && userProfile.nama_lengkap !== "") {
      getDataPengajuanBimbinganByDosenPaId();
      getDataLaporanBimbinganByDosenPaId();
      const isDataChanged =
        userProfile.nama_lengkap !== namaLengkapDosen ||
        userProfile.email !== emailDosen ||
        userProfile.nip !== nip ||
        userProfile.no_whatsapp !== noTelpDosen;
      setIsDataChanged(isDataChanged);
    }
  }, [userProfile, namaLengkapDosen, emailDosen, nip, noTelpDosen]);

  return (
    <>
      {selectedSubMenuDashboard === "Profile Dosen PA" && (
        <div className="w-[75%] pl-[30px] pr-[128px] py-[30px]">
          <div className="border px-[70px] py-[30px] rounded-lg">
            <div className="flex gap-10">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="size-[200px] rounded-full object-cover"
                />
              ) : dataDosen?.profile_image ? (
                <img
                  src={dataDosen.profile_image}
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
                  namaLengkapDosen === "" ? "Nama Lengkap" : namaLengkapDosen
                }
                onChange={(e) => {
                  setNamaLengkapDosen(e.target.value);
                }}
                value={namaLengkapDosen}
                className="px-3 py-2 text-[15px] border rounded-lg"
              />
              <InputField
                disabled={false}
                type="text"
                placeholder={emailDosen === "" ? "Email" : emailDosen}
                onChange={(e) => {
                  setEmailDosen(e.target.value);
                }}
                value={emailDosen}
                className="px-3 py-2 text-[15px] border rounded-lg"
              />
              <InputField
                disabled={false}
                type="text"
                placeholder={nip === "" ? "NIP" : nip}
                onChange={(e) => {
                  setNip(e.target.value);
                }}
                value={nip}
                className="px-3 py-2 text-[15px] border rounded-lg"
              />
              <InputField
                disabled={false}
                type="text"
                placeholder={noTelpDosen === "" ? "No Telp" : noTelpDosen}
                onChange={(e) => {
                  setNoTelpDosen(e.target.value);
                }}
                value={noTelpDosen}
                className="px-3 py-2 text-[15px] border rounded-lg"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleEditDosenPA(dataUser.id);
                }}
                className={`text-white bg-orange-500 hover:bg-orange-600 text-[14px] py-2 font-medium rounded-lg ${
                  !isDataChanged && !imagePreview ? "hidden" : ""
                }`}
              >
                Simpan
              </button>
            </form>
          </div>
        </div>
      )}
      {selectedSubMenuDashboard === "Jadwal Kosong Dosen Role Dosen PA" && (
        <div className="w-[75%] pl-[30px] pr-[128px] py-[30px]">
          <div className=" flex flex-col gap-6 border px-[25px] pt-[15px] pb-[30px] rounded-lg">
            <h1 className="font-semibold text-[24px]">
              Jadwal Kosong Dosen Pembimbing Akademik
            </h1>
            <div className="flex flex-col gap-4">
              {Object.keys(schedule).map((day) => (
                <div key={day}>
                  <button
                    className="w-full text-left px-4 py-2 border border-gray-300 rounded-lg flex justify-between items-center"
                    onClick={() => {
                      toggleDay(day);
                      setIsAddJadwal(false);
                      setKeteranganKonfirmasi({});
                      setSelectedHari(day);
                    }}
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
                    <div className="flex flex-col gap-4 px-4 pb-2">
                      <div className="grid grid-cols-4 gap-4 mt-4">
                        {dataJadwalDosenPA
                          .filter((data) => data.hari === day)
                          .map((data, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center"
                            >
                              <TrashButton
                                onClick={() => handleDeleteJadwalDosen(data.id)}
                                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                              />
                              <div className="text-[14px] w-[100px] mx-3">{`${data.jam_mulai}-${data.jam_selesai}`}</div>
                              {index <
                                dataJadwalDosenPA.filter(
                                  (data) => data.hari === day
                                ).length && (
                                <Image className="" src={line} alt="line" />
                              )}
                            </div>
                          ))}

                        {isAddJadwal ? (
                          <div className="flex gap-2">
                            <InputField
                              disabled={false}
                              type="text"
                              placeholder="00:00"
                              onChange={(e) => {
                                setJamMulai(e.target.value);
                              }}
                              value={jamMulai}
                              className="px-1 text-[14px] w-[56px] border rounded-md"
                            />
                            -
                            <InputField
                              disabled={false}
                              type="text"
                              placeholder="00:00"
                              onChange={(e) => {
                                setJamSelesai(e.target.value);
                              }}
                              value={jamSelesai}
                              className="px-1 text-[14px] w-[56px] border rounded-md"
                            />
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setIsAddJadwal(true);
                            }}
                            className={`bg-green-500 size-8 text-white p-2 rounded-lg hover:bg-green-600 ${isAddJadwal && "hidden"}`}
                          >
                            <Image
                              src={plusIcon}
                              className="size-4"
                              alt="addIcon"
                            />
                          </button>
                        )}
                      </div>
                      {isAddJadwal && (
                        <form
                          className="flex justify-end gap-4 mt-2"
                          onSubmit={handleAddJadwalDosen}
                        >
                          <button
                            onClick={() => {
                              setIsAddJadwal(false);
                            }}
                            className="bg-red-500 py-1 px-2 text-white hover:bg-red-600 rounded-md text-[13px]"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-green-500 py-1 px-2 text-white hover:bg-green-600 rounded-md text-[13px]"
                          >
                            Submit
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {selectedSubMenuDashboard === "Pengesahan Absensi Bimbingan" && (
        <div className="w-[75%] pl-[30px] pr-[128px] py-[30px] min-h-[500px]">
          <div className=" flex flex-col gap-6 border px-[30px] pt-[15px] pb-[30px] rounded-lg">
            <h1 className="font-semibold text-[24px]">
              Pengesahan Absensi Bimbingan Akademik Mahasiswa
            </h1>
            <div className="flex flex-col gap-4">
              {dataPengesahanBimbingan.length > 0 ? (
                dataPengesahanBimbingan
                  .slice()
                  .reverse()
                  .map((data) => (
                    <div
                      key={data.id}
                      className="flex flex-col border rounded-lg p-6 gap-4"
                    >
                      <div className="flex justify-between text-neutral-600">
                        <p>
                          {getDate(data.pengajuan_bimbingan.jadwal_bimbingan)}
                        </p>
                        <p>
                          {getTime(data.pengajuan_bimbingan.jadwal_bimbingan)}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">
                          {data.pengajuan_bimbingan.nama_lengkap}
                        </p>
                        <p>{data.pengajuan_bimbingan.jenis_bimbingan}</p>
                        <p className="font-medium">
                          {data.pengajuan_bimbingan.sistem_bimbingan}
                        </p>
                      </div>
                      <div className="flex gap-10">
                        <div className="flex flex-col gap-2">
                          <p>Dokumentasi :</p>
                          <div className="relative">
                            <img
                              className="w-[200px] cursor-pointer"
                              src={data.dokumentasi_kehadiran}
                              alt="Dokumentasi Kehadiran"
                            />
                            <button
                              className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-200"
                              onClick={() =>
                                openImageInNewTab(data.dokumentasi_kehadiran)
                              } // Membuka modal saat ikon diklik
                              title="Lihat Gambar"
                            >
                              <EyeIcon className="h-5 w-5 text-gray-700" />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <p>Tanda Tangan Kehadiran :</p>
                          <img
                            className="self-center p-4 w-[100px]"
                            src={data.ttd_kehadiran}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {/* Status Menunggu */}
                        {data.status_pengesahan_kehadiran === "Belum Sah" && (
                          <>
                            <button
                              onClick={() =>
                                handleEditPengesahanKehadiranBimbingan(
                                  data.id,
                                  "Reschedule"
                                )
                              }
                              className="w-1/2 bg-red-500 hover:bg-red-600 text-white cursor-pointer rounded-md py-2 font-medium text-[14px]"
                              disabled={keteranganKonfirmasi === ""}
                            >
                              Tidak Sah
                            </button>
                            <button
                              onClick={() =>
                                handleEditPengesahanKehadiranBimbingan(
                                  data.id,
                                  "Sah"
                                )
                              }
                              className="w-1/2 bg-green-500 hover:bg-green-600 text-white cursor-pointer rounded-md py-2 font-medium text-[14px]"
                              disabled={keteranganKonfirmasi === ""}
                            >
                              Sah
                            </button>
                          </>
                        )}

                        {data.status_pengesahan_kehadiran === "Sah" && (
                          <button
                            className="w-full bg-green-500 text-white rounded-md py-2 font-medium text-[14px] cursor-not-allowed"
                            disabled
                          >
                            Sah
                          </button>
                        )}

                        {/* Status Reschedule */}
                        {data.status_pengesahan_kehadiran === "Tidak Sah" && (
                          <button
                            className="w-full bg-red-500 text-white rounded-md py-2 font-medium text-[14px] cursor-not-allowed"
                            disabled
                          >
                            Tidak Sah
                          </button>
                        )}
                      </div>
                    </div>
                  ))
              ) : (
                <div className="border rounded-lg p-10 flex flex-col items-center">
                  <svg
                    className="h-12 w-12 text-red-500 mb-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>

                  <p className="text-center text-red-500">
                    Saat ini, belum ada absensi bimbingan yang diajukan oleh
                    mahasiswa.
                  </p>
                  <p className="text-center text-gray-600">
                    Silakan tunggu hingga mahasiswa mengisi absensi bimbingan.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {selectedSubMenuDashboard ===
        "Pengajuan Bimbingan Akademik Mahasiswa" && (
        <div className="w-[75%] pl-[30px] pr-[128px] py-[30px]">
          <div className=" flex flex-col gap-6 border px-[30px] pt-[15px] pb-[30px] rounded-lg">
            <h1 className="font-semibold text-[24px]">
              Pengajuan Bimbingan Akademik Mahasiswa
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
                    <div>
                      <p className="font-medium">{data.nama_lengkap}</p>
                      <p>{data.jenis_bimbingan}</p>
                      <p className="font-medium">{data.sistem_bimbingan}</p>
                    </div>
                    <InputField
                      type="text"
                      placeholder={
                        data.keterangan === null ? "Input Keterangan" : ""
                      }
                      onChange={(e) => {
                        setKeteranganKonfirmasi((prev) => ({
                          ...prev,
                          [data.id]: e.target.value, // Update keterangan untuk pengajuan ini
                        }));
                      }}
                      value={
                        data.keterangan === null
                          ? keteranganKonfirmasi[data.id] || ""
                          : data.keterangan
                      }
                      disabled={data.keterangan !== null}
                      className="px-3 pt-2 pb-10 text-[15px] border rounded-lg"
                    />
                    <div className="flex gap-2">
                      {/* Status Menunggu */}
                      {data.status === "Menunggu Konfirmasi" && (
                        <>
                          <button
                            onClick={() =>
                              handleEditPengajuanBimbingan(
                                data.id,
                                data.mahasiswa_id,
                                "Reschedule"
                              )
                            }
                            className="w-1/2 bg-red-500 text-white cursor-pointer rounded-md py-2 font-medium text-[14px]"
                            disabled={keteranganKonfirmasi === ""}
                          >
                            Reschedule
                          </button>
                          <button
                            onClick={() =>
                              handleEditPengajuanBimbingan(
                                data.id,
                                data.mahasiswa_id,
                                "Diterima"
                              )
                            }
                            className="w-1/2 bg-green-500 text-white cursor-pointer rounded-md py-2 font-medium text-[14px]"
                            disabled={keteranganKonfirmasi === ""}
                          >
                            Diterima
                          </button>
                        </>
                      )}

                      {/* Status Diterima */}
                      {data.status === "Diterima" && (
                        <button
                          className="w-full bg-green-500 text-white rounded-md py-2 font-medium text-[14px] cursor-not-allowed"
                          disabled
                        >
                          Diterima
                        </button>
                      )}

                      {/* Status Reschedule */}
                      {data.status === "Reschedule" && (
                        <button
                          className="w-full bg-red-500 text-white rounded-md py-2 font-medium text-[14px] cursor-not-allowed"
                          disabled
                        >
                          Reschedule
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
      {selectedSubMenuDashboard ===
        "Riwayat Laporan Bimbingan Role Dosen PA" && (
        <div className="w-[75%] pl-[30px] pr-[128px] py-[30px] min-h-[500px]">
          <div className=" flex flex-col gap-6 rounded-lg">
            {!isDetailLaporanDosenClicked ? (
              <div className="flex flex-col gap-4">
                <h1 className="font-semibold text-[24px]">
                  Riwayat Laporan Bimbingan Akademik
                </h1>
                {dataLaporanBimbingan.length > 0 ? (
                  dataLaporanBimbingan.map((data, index) => (
                    <div
                      key={index}
                      className="flex flex-col border rounded-lg p-6 gap-4 cursor-pointer"
                      onClick={() => handleDetailLaporanDosen(data)}
                    >
                      <div className="text-neutral-600">
                        <p>{data.waktu_bimbingan}</p>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{data.nama_mahasiswa}</p>
                          <p>{data.jenis_bimbingan}</p>
                          <p className="font-medium">{data.sistem_bimbingan}</p>
                        </div>
                        <div className="bg-red-500 p-3 self-center rounded-lg">
                          <p className="text-white text-center">
                            {data.status}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="border rounded-lg p-10 flex flex-col items-center">
                    <svg
                      className="h-12 w-12 text-red-500 mb-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>

                    <p className="text-center text-red-500">
                      Saat ini, belum ada laporan bimbingan yang dibuat.
                    </p>
                    <p className="text-center text-gray-600">
                      Silahkan buat laporan bimbingan terlebih dahulu.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="flex gap-2 mt-2">
                  <Image
                    src={backIconOrange}
                    alt="backIconOrange"
                    onClick={() => {
                      setIsDetailLaporanDosenClicked(
                        !isDetailLaporanDosenClicked
                      );
                      setDataClickedLaporanBimbingan(null);
                    }}
                    className="cursor-pointer"
                  />
                  <p className="text-orange-600 font-medium">Kembali</p>
                </div>
                <div className="mt-4">
                  <div className="flex flex-col border rounded-lg p-6 gap-4">
                    <div className="flex justify-between text-neutral-600">
                      {dataClickedLaporanBimbingan?.waktu_bimbingan}
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">
                          {dataClickedLaporanBimbingan?.nama_mahasiswa}
                        </p>
                        <p>{dataClickedLaporanBimbingan?.jenis_bimbingan}</p>
                        <p className="font-medium">
                          {dataClickedLaporanBimbingan?.sistem_bimbingan}
                        </p>
                      </div>
                      <div
                        className={`${
                          dataClickedLaporanBimbingan?.status ===
                          "Menunggu Feedback Kaprodi"
                            ? "bg-red-500"
                            : "bg-green-500"
                        } p-3 self-center rounded-lg`}
                      >
                        <p className="text-white text-center">
                          {dataClickedLaporanBimbingan?.status}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div>
                        <h3 className="font-medium">Kendala Mahasiswa</h3>
                        <p>{dataClickedLaporanBimbingan?.kendala_mahasiswa}</p>
                      </div>
                      <div>
                        <h3 className="font-medium">Solusi yang ditawarkan</h3>
                        <p>{dataClickedLaporanBimbingan?.solusi}</p>
                      </div>
                      <div>
                        <h3 className="font-medium">Kesimpulan</h3>
                        <p>{dataClickedLaporanBimbingan?.kesimpulan}</p>
                      </div>
                      <div>
                        <h3 className="font-medium">Dokumentasi</h3>
                        {dataClickedLaporanBimbingan?.dokumentasi === null ? (
                          "-"
                        ) : (
                          <p>{dataClickedLaporanBimbingan?.dokumentasi}</p>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">Feedback Kaprodi</h3>
                        {dataClickedLaporanBimbingan?.feedback_kaprodi ===
                        null ? (
                          "-"
                        ) : (
                          <p>{dataClickedLaporanBimbingan?.feedback_kaprodi}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardDosenPA;
