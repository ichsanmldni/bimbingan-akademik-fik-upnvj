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
import { div } from "framer-motion/client";

interface DashboardDosenPAProps {
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

const DashboardDosenPA: React.FC<DashboardDosenPAProps> = ({
  selectedSubMenuDashboard,
  dataUser,
}) => {
  const [userProfile, setUserProfile] = useState({
    nama_lengkap: "",
    email: "",
    nip: "",
    no_whatsapp: "",
  });
  const [dataJadwalDosenPA, setDataJadwalDosenPA] = useState([]);
  const [dataPengajuanBimbingan, setDataPengajuanBimbingan] = useState([]);
  const [dataLaporanBimbingan, setDataLaporanBimbingan] = useState([]);
  const [namaLengkapDosen, setNamaLengkapDosen] = useState("");
  const [emailDosen, setEmailDosen] = useState("");
  const [nip, setNip] = useState("");
  const [noTelpDosen, setNoTelpDosen] = useState("");
  const [keteranganKonfirmasi, setKeteranganKonfirmasi] = useState({});
  const [isDetailLaporanDosenClicked, setIsDetailLaporanDosenClicked] =
    useState(false);
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [isAddJadwal, setIsAddJadwal] = useState(false);
  const [dataDosenPA, setDataDosenPA] = useState({});
  const [dataDosen, setDataDosen] = useState({});
  const [dataClickedLaporanBimbingan, setDataClickedLaporanBimbingan] =
    useState({});
  const [selectedHari, setSelectedHari] = useState("");
  const [jamMulai, setJamMulai] = useState("");
  const [jamSelesai, setJamSelesai] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const [openDay, setOpenDay] = useState(null);
  const toggleDay = (day) => {
    setOpenDay(openDay === day ? null : day);
  };

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

  const addJadwalDosen = async (newData) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/datajadwaldosenpa/${dataDosenPA.id}`,
        newData
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteJadwalDosen = async (deletedData) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/datajadwaldosenpa/${deletedData.id}`,
        { data: deletedData }
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const patchPengajuanBimbingan = async (updatedData) => {
    try {
      const response = await axios.patch(
        "http://localhost:3000/api/pengajuanbimbingan",
        updatedData
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const getDataDosenPAByDosenId = async () => {
    try {
      const dataDosenPA = await axios.get(
        "http://localhost:3000/api/datadosenpa"
      );

      const dosen = dataDosenPA.data.find(
        (data) => data.dosen_id == dataUser.id
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

  const getDataPengajuanBimbinganByDosenPaId = async () => {
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

      const dataPengajuanBimbingan = await axios.get(
        `http://localhost:3000/api/pengajuanbimbingan`
      );

      const pengajuanBimbingan = dataPengajuanBimbingan.data.filter(
        (data) => data.dosen_pa_id === dosenpaid
      );

      setDataPengajuanBimbingan(pengajuanBimbingan);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataLaporanBimbinganByDosenPaId = async () => {
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

      const dataLaporanBimbingan = await axios.get(
        `http://localhost:3000/api/laporanbimbingan`
      );

      const laporanBimbingan = dataLaporanBimbingan.data.filter(
        (data) => data.dosen_pa_id === dosenpaid
      );

      setDataLaporanBimbingan(laporanBimbingan);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const patchDosenPA = async (updatedData) => {
    try {
      const response = await axios.patch(
        "http://localhost:3000/api/datadosen",
        updatedData
      );
      console.log("Dosen PA updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  };

  const addBimbingan = async (idPengajuan) => {
    try {
      const response = await axios.post(`http://localhost:3000/api/bimbingan`, {
        pengajuan_bimbingan_id: idPengajuan,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

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
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditDosenPA = async (id) => {
    try {
      let dosenPAValue = {
        id,
        nama_lengkap: namaLengkapDosen,
        email: emailDosen,
        nip,
        no_whatsapp: noTelpDosen,
        profile_image: !imagePreview ? null : imagePreview,
      };

      const result = await patchDosenPA(dosenPAValue);
      getDataDosenById();
      setImagePreview(null);
      console.log("Response from backend:", result);
    } catch (error) {
      console.error("Failed to save the updated order.");
    }
  };

  const handleDetailLaporanDosen = (data) => {
    setDataClickedLaporanBimbingan(data);
    setIsDetailLaporanDosenClicked((prev) => !prev);
  };

  const handleAddJadwalDosen = async (e) => {
    e.preventDefault();

    try {
      let jadwalDosenValue = {
        dosen_pa_id: dataDosenPA.id,
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
      console.error("Registration error:", error.message);
    }
  };

  const handleDeleteJadwalDosen = async (id) => {
    try {
      let jadwalDosenValue = {
        id,
      };
      const result = await deleteJadwalDosen(jadwalDosenValue);

      getDataJadwalDosenPaByDosenPa();

      console.log(result);
    } catch (error) {
      console.error("Registration error:", error.message);
    }
  };

  const handleEditPengajuanBimbingan = async (
    id,
    mahasiswa_id,
    statusPengajuan
  ) => {
    try {
      let pengajuanBimbinganValue = {
        id,
        status: statusPengajuan,
        keterangan: keteranganKonfirmasi[id],
        mahasiswa_id,
        dosen_pa_id: dataDosenPA.id,
      };

      const result = await patchPengajuanBimbingan(pengajuanBimbinganValue);
      await addBimbingan(id);
      console.log(result);
      setKeteranganKonfirmasi("");
      getDataPengajuanBimbinganByDosenPaId();
    } catch (error) {
      console.error("Registration error:", error.message);
    }
  };

  useEffect(() => {
    if (dataUser && dataUser.id) {
      getDataDosenById();
      getDataDosenPAByDosenId();
    }
  }, [dataUser]);

  useEffect(() => {
    setImagePreview(null);
    getDataDosenById();
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
              ) : dataDosen.profile_image ? (
                <img
                  src={dataDosen.profile_image}
                  alt="Profile"
                  className="size-[200px] rounded-full object-cover"
                />
              ) : (
                <ProfileImage className="size-[200px] rounded-full" />
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
                type="text"
                placeholder={emailDosen === "" ? "Email" : emailDosen}
                onChange={(e) => {
                  setEmailDosen(e.target.value);
                }}
                value={emailDosen}
                className="px-3 py-2 text-[15px] border rounded-lg"
              />
              <InputField
                type="text"
                placeholder={nip === "" ? "NIP" : nip}
                onChange={(e) => {
                  setNip(e.target.value);
                }}
                value={nip}
                className="px-3 py-2 text-[15px] border rounded-lg"
              />
              <InputField
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
                      setKeteranganKonfirmasi("");
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
                        <form className="flex justify-end gap-4 mt-2">
                          <button
                            onClick={() => {
                              setIsAddJadwal(false);
                            }}
                            className="bg-red-500 py-1 px-2 text-white hover:bg-red-600 rounded-md text-[13px]"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleAddJadwalDosen}
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
      {selectedSubMenuDashboard ===
        "Pengajuan Bimbingan Konseling Mahasiswa" && (
        <div className="w-[75%] pl-[30px] pr-[128px] py-[30px]">
          <div className=" flex flex-col gap-6 border px-[30px] pt-[15px] pb-[30px] rounded-lg">
            <h1 className="font-semibold text-[24px]">
              Pengajuan Bimbingan Konseling Mahasiswa
            </h1>
            <div className="flex flex-col gap-4">
              {dataPengajuanBimbingan
                .slice()
                .reverse()
                .map((data) => (
                  <div className="flex flex-col border rounded-lg p-6 gap-4">
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
        <div className="w-[75%] pl-[30px] pr-[128px] py-[30px]">
          <div className=" flex flex-col gap-6 rounded-lg">
            {!isDetailLaporanDosenClicked ? (
              <div className="flex flex-col gap-4">
                <h1 className="font-semibold text-[24px]">
                  Riwayat Laporan Bimbingan Konseling
                </h1>
                {dataLaporanBimbingan.map((data) => (
                  <div
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
                        <p className="text-white text-center">{data.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
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
                      setDataClickedLaporanBimbingan({});
                    }}
                    className="cursor-pointer"
                  />
                  <p className="text-orange-600 font-medium">Kembali</p>
                </div>
                <div className="mt-4">
                  <div className="flex flex-col border rounded-lg p-6 gap-4">
                    <div className="flex justify-between text-neutral-600">
                      {dataClickedLaporanBimbingan.waktu_bimbingan}
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">
                          {dataClickedLaporanBimbingan.nama_mahasiswa}
                        </p>
                        <p>{dataClickedLaporanBimbingan.jenis_bimbingan}</p>
                        <p className="font-medium">
                          {dataClickedLaporanBimbingan.sistem_bimbingan}
                        </p>
                      </div>
                      <div
                        className={`${dataClickedLaporanBimbingan.status === "Menunggu Feedback Kaprodi" ? "bg-red-500" : "bg-green-500"} p-3 self-center rounded-lg`}
                      >
                        <p className="text-white text-center">
                          {dataClickedLaporanBimbingan.status}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div>
                        <h3 className="font-medium">Kendala Mahasiswa</h3>
                        <p>{dataClickedLaporanBimbingan.kendala_mahasiswa}</p>
                        {/* <ol className="list-disc pl-5">
                          <div>
                            <li>
                              {dataClickedLaporanBimbingan.kendala_mahasiswa}
                            </li>
                            <p>
                              Banyak mahasiswa yang merasa kesulitan dalam
                              mengatur waktu antara kuliah, tugas, dan kegiatan
                              organisasi. Aktivitas yang padat dapat membuat
                              mereka kewalahan, terlebih jika ada tenggat waktu
                              yang bersamaan.
                            </p>
                          </div>
                        </ol> */}
                      </div>
                      <div>
                        <h3 className="font-medium">Solusi yang ditawarkan</h3>
                        <p>{dataClickedLaporanBimbingan.solusi}</p>
                        {/* <ol className="list-decimal pl-5">
                          <div>
                            <li>Mengatur Waktu dan Prioritas</li>
                            <ol className="list-disc pl-5">
                              <li>
                                Solusi : Dosen pembimbing akademik dapat
                                membantu mahasiswa dalam membuat jadwal yang
                                realistis dan mengajarkan teknik manajemen waktu
                                yang efektif, seperti metode time blocking, atau
                                menggunakan aplikasi perencanaan waktu.
                              </li>
                              <li>
                                Cara Implementasi : Dosen pembimbing akademik
                                dapat membantu mahasiswa dalam membuat jadwal
                                yang realistis dan mengajarkan teknik manajemen
                                waktu yang efektif, seperti metode time
                                blocking, atau menggunakan aplikasi perencanaan
                                waktu.
                              </li>
                            </ol>
                          </div>
                        </ol> */}
                      </div>
                      <div>
                        <h3 className="font-medium">Kesimpulan</h3>
                        <p>{dataClickedLaporanBimbingan.kesimpulan}</p>
                        {/* <p>
                          Secara keseluruhan, saya melihat bahwa kamu adalah
                          mahasiswa yang memiliki potensi besar dan komitmen
                          yang tinggi terhadap studi. Pencapaian akademik kamu
                          di beberapa mata kuliah menunjukkan bahwa kamu mampu
                          menguasai materi dengan baik. Namun, masih ada
                          beberapa area yang perlu perhatian lebih, terutama
                          dalam hal manajemen waktu dan pemahaman materi pada
                          beberapa mata kuliah yang lebih kompleks. Saya juga
                          mengapresiasi keaktifan kamu dalam perkuliahan dan
                          keterlibatan dalam diskusi, meskipun ada beberapa
                          aspek yang perlu kamu tingkatkan, seperti keterlibatan
                          dalam tugas kelompok dan pengelolaan tugas dengan
                          lebih baik.
                        </p> */}
                      </div>
                      <div>
                        <h3 className="font-medium">Dokumentasi</h3>
                        {dataClickedLaporanBimbingan.dokumentasi === null ? (
                          "-"
                        ) : (
                          <p>{dataClickedLaporanBimbingan.dokumentasi}</p>
                        )}
                        {/* <Image
                          className="size-[100px]"
                          src={upnvjLogo}
                          alt="upnvjLogo"
                        /> */}
                      </div>
                      <div>
                        <h3 className="font-medium">Feedback Kaprodi</h3>
                        {dataClickedLaporanBimbingan.feedback_kaprodi ===
                        null ? (
                          "-"
                        ) : (
                          <p>{dataClickedLaporanBimbingan.feedback_kaprodi}</p>
                        )}
                        {/* <p>
                          Secara umum, saya melihat bahwa kamu telah menunjukkan
                          kemajuan yang baik dalam beberapa mata kuliah,
                          terutama pada [sebutkan mata kuliah yang dikuasai
                          dengan baik]. Nilai-nilai yang kamu peroleh
                          menunjukkan bahwa kamu memahami dengan baik materi
                          yang diberikan oleh dosen pengampu. Konsistensi dalam
                          hasil akademik kamu juga patut diacungi jempol. Namun,
                          terdapat beberapa mata kuliah seperti [sebutkan mata
                          kuliah yang mengalami kesulitan] yang nilai atau
                          pemahaman kamu masih perlu diperbaiki. Saya
                          menganjurkan agar kamu lebih banyak meluangkan waktu
                          untuk memahami topik-topik tersebut dan mengikuti
                          bimbingan atau konsultasi dengan dosen pengampu untuk
                          mendapatkan penjelasan yang lebih mendalam.
                        </p> */}
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
