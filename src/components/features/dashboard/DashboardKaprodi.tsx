"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import upnvjLogo from "../../../assets/images/LOGO-UPNVJ.png";
import backIconOrange from "../../../assets/images/back-icon-orange.png";
import profilePlaceholder from "../../../assets/images/profile.png";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectField";
import ProfileImage from "@/components/ui/ProfileImage";
import axios from "axios";
import { env } from "process";

interface DashboardKaprodiProps {
  selectedSubMenuDashboard: string;
  dataUser: { id: number; [key: string]: any };
}

interface UserProfile {
  nama_lengkap: string;
  email: string;
  nip: string;
  no_whatsapp: string;
}

interface DosenPA {
  id: number;
  dosen: {
    profile_image: string;
    nama_lengkap: string;
    nip: string;
    email: string;
    no_whatsapp: string;
  };
}

interface LaporanBimbingan {
  id: number;
  nama_mahasiswa: string;
  waktu_bimbingan: string;
  nama_dosen_pa: string;
  jumlah_mahasiswa: number;
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

const DashboardKaprodi: React.FC<DashboardKaprodiProps> = ({
  selectedSubMenuDashboard,
  dataUser,
}) => {
  const [namaLengkapKaprodi, setNamaLengkapKaprodi] = useState<string>("");
  const [emailKaprodi, setEmailKaprodi] = useState<string>("");
  const [nip, setNip] = useState<string>("");
  const [noTelpKaprodi, setNoTelpKaprodi] = useState<string>("");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedDataLaporanBimbingan, setSelectedDataLaporanBimbingan] =
    useState<LaporanBimbingan | null>(null);
  const [selectedDataDosenPA, setSelectedDataDosenPA] =
    useState<DosenPA | null>(null);
  const [feedbackKaprodi, setFeedbackKaprodi] = useState<string>("");
  const [selectedTahunAjaran, setSelectedTahunAjaran] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [isDetailLaporanKaprodiClicked, setIsDetailLaporanKaprodiClicked] =
    useState<boolean>(false);
  const [isDetailDosenPAClicked, setIsDetailDosenPAClicked] =
    useState<boolean>(false);
  const [dataDosenPA, setDataDosenPA] = useState<DosenPA[]>([]);
  const [dataLaporanBimbingan, setDataLaporanBimbingan] = useState<
    LaporanBimbingan[]
  >([]);
  const [isDataChanged, setIsDataChanged] = useState<boolean>(false);
  const [dataBimbinganBySelectedDosenPA, setDataBimbinganBySelectedDosenPA] =
    useState<any[]>([]);
  const [dataAllMahasiswa, setDataAllMahasiswa] = useState<any[]>([]);
  const [dataKaprodi, setDataKaprodi] = useState<any>({});
  const [dataKaprodiUser, setDataKaprodiUser] = useState<any>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

  const handleDetailLaporanKaprodi = (data: LaporanBimbingan) => {
    setSelectedDataLaporanBimbingan(data);
    setIsDetailLaporanKaprodiClicked((prev) => !prev);
  };

  const handleDetailDosenPA = (data: DosenPA) => {
    setSelectedDataDosenPA(data);
    setIsDetailDosenPAClicked((prev) => !prev);
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

  const patchKaprodi = async (updatedData: any) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/datadosen`,
        updatedData
      );
      console.log("Kaprodi updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  };

  const handleEditKaprodi = async (id: number) => {
    try {
      let jurusanValue = {
        id,
        nama_lengkap: namaLengkapKaprodi,
        email: emailKaprodi,
        nip,
        no_whatsapp: noTelpKaprodi,
        profile_image: !imagePreview ? null : imagePreview,
      };

      const result = await patchKaprodi(jurusanValue);
      getDataDosenById();
      setImagePreview(null);
      console.log("Response from backend:", result);
    } catch (error) {
      console.error("Failed to save the updated order.");
    }
  };

  const getDataDosenById = async () => {
    try {
      const dataDosen = await axios.get(`${API_BASE_URL}/api/datadosen`);

      const dosen = dataDosen.data.find((data: any) => data.id === dataUser.id);

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

      setDataKaprodi(dosen);

      setNamaLengkapKaprodi(dosen.nama_lengkap);
      setEmailKaprodi(dosen.email);
      setNip(dosen.nip);
      setNoTelpKaprodi(dosen.no_whatsapp);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataKaprodiByDosenId = async () => {
    try {
      const dataKaprodi = await axios.get(`${API_BASE_URL}/api/datakaprodi`);

      const kaprodi = dataKaprodi.data.find(
        (data: any) => data.dosen_id == dataUser.id
      );

      if (!kaprodi) {
        console.error("Kaprodi tidak ditemukan");
        return;
      }

      setDataKaprodiUser(kaprodi);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataLaporanBimbinganByKaprodiId = async () => {
    try {
      const dataKaprodi = await axios.get(`${API_BASE_URL}/api/datakaprodi`);

      const kaprodi = dataKaprodi.data.find(
        (data: any) => data.dosen.nama_lengkap === userProfile?.nama_lengkap
      );

      if (!kaprodi) {
        throw new Error("Kaprodi tidak ditemukan");
      }

      const kaprodiid = kaprodi.id;

      const dataLaporanBimbingan = await axios.get(
        `${API_BASE_URL}/api/laporanbimbingan`
      );

      const laporanBimbingan = dataLaporanBimbingan.data.filter(
        (data: any) => data.kaprodi_id === kaprodiid
      );

      setDataLaporanBimbingan(laporanBimbingan);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const patchLaporanBimbingan = async (updatedData: any) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/laporanbimbingan`,
        updatedData
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleEditLaporanBimbingan = async (
    id: number,
    dosen_pa_id: number,
    status: string
  ) => {
    try {
      let laporanBimbinganValue = {
        id,
        feedback_kaprodi: feedbackKaprodi,
        status,
        dosen_pa_id,
        kaprodi_id: dataKaprodiUser.id,
      };

      const result = await patchLaporanBimbingan(laporanBimbinganValue);
      console.log(result);
      setFeedbackKaprodi("");
      getDataLaporanBimbinganByKaprodiId();
    } catch (error) {
      console.error("Registration error:", (error as Error).message);
    }
  };

  const getDataBimbinganByDosenPaId = async () => {
    try {
      const dataBimbingan = await axios.get(`${API_BASE_URL}/api/bimbingan`);

      const bimbingan = dataBimbingan.data.filter(
        (data: any) =>
          data.pengajuan_bimbingan.dosen_pa_id === selectedDataDosenPA?.id
      );

      setDataBimbinganBySelectedDosenPA(bimbingan);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataMahasiswa = async () => {
    try {
      const dataMahasiswa = await axios.get(
        `${API_BASE_URL}/api/datamahasiswa`
      );

      setDataAllMahasiswa(dataMahasiswa.data);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  useEffect(() => {
    setImagePreview(null);
    getDataDosenById();
  }, [selectedSubMenuDashboard]);

  useEffect(() => {
    if (dataUser && Object.keys(dataUser).length > 0 && dataUser.id) {
      getDataDosenById();
      getDataKaprodiByDosenId();
    }
  }, [dataUser]);

  useEffect(() => {
    getDataBimbinganByDosenPaId();
  }, [selectedDataDosenPA]);

  useEffect(() => {
    if (
      userProfile &&
      Object.keys(userProfile).length > 0 &&
      userProfile.nama_lengkap
    ) {
      getDataLaporanBimbinganByKaprodiId();
    }
  }, [userProfile]);

  useEffect(() => {
    if (userProfile && userProfile.nama_lengkap !== "") {
      const isDataChanged =
        userProfile.nama_lengkap !== namaLengkapKaprodi ||
        userProfile.email !== emailKaprodi ||
        userProfile.nip !== nip ||
        userProfile.no_whatsapp !== noTelpKaprodi;
      setIsDataChanged(isDataChanged);
    }
  }, [userProfile, namaLengkapKaprodi, emailKaprodi, nip, noTelpKaprodi]);

  useEffect(() => {
    getDataDosenPA();
    getDataMahasiswa();
  }, []);

  return (
    <>
      {selectedSubMenuDashboard === "Profile Kaprodi" && (
        <div className="w-[75%] pl-[30px] pr-[128px] py-[30px]">
          <div className="border px-[70px] py-[30px] rounded-lg">
            <div className="flex gap-10">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="size-[200px] rounded-full object-cover"
                />
              ) : dataKaprodi.profile_image ? (
                <img
                  src={dataKaprodi.profile_image}
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
                  namaLengkapKaprodi === ""
                    ? "Nama Lengkap"
                    : namaLengkapKaprodi
                }
                onChange={(e) => {
                  setNamaLengkapKaprodi(e.target.value);
                }}
                value={namaLengkapKaprodi}
                className="px-3 py-2 text-[15px] border rounded-lg"
              />
              <InputField
                disabled={false}
                type="text"
                placeholder={emailKaprodi === "" ? "Email" : emailKaprodi}
                onChange={(e) => {
                  setEmailKaprodi(e.target.value);
                }}
                value={emailKaprodi}
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
                placeholder={noTelpKaprodi === "" ? "No Telp" : noTelpKaprodi}
                onChange={(e) => {
                  setNoTelpKaprodi(e.target.value);
                }}
                value={noTelpKaprodi}
                className="px-3 py-2 text-[15px] border rounded-lg"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleEditKaprodi(dataUser.id);
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
      {selectedSubMenuDashboard === "Statistik Bimbingan Konseling" && (
        <div className="w-[75%] pl-[30px] pr-[128px] py-[30px]">
          <div className="border px-[30px] py-[30px] rounded-lg">
            <div className="flex flex-col gap-4">
              <div className="flex gap-5">
                <SelectField
                  options={[{ value: "2024/2025", label: "2024/2025" }]}
                  onChange={(e) => setSelectedTahunAjaran(e.target.value)}
                  value={selectedTahunAjaran}
                  placeholder="Pilih Tahun Ajaran"
                  className={`px-3 py-2 text-[15px] border rounded-lg appearance-none w-[240px]`}
                />
                <SelectField
                  options={[
                    { value: "Gasal", label: "Gasal" },
                    { value: "Genap", label: "Genap" },
                  ]}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  value={selectedSemester}
                  placeholder="Pilih Semester"
                  className={`px-3 py-2 text-[15px] border rounded-lg appearance-none w-[200px]`}
                />
              </div>
              <div className="border rounded-lg font-semibold text-[18px]">
                <h1 className="p-4">Persentase Sebaran</h1>
              </div>
              <div className="border rounded-lg font-semibold text-[18px]">
                <h1 className="p-4">Total Laporan Bimbingan Dosen PA</h1>
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedSubMenuDashboard === "Data Dosen PA" && (
        <div className="w-[75%] pl-[30px] pr-[128px] py-[30px]">
          <div className="flex flex-col gap-4 rounded-lg">
            <h1 className="font-semibold text-[24px]">Data Dosen PA</h1>
            {isDetailDosenPAClicked ? (
              <div>
                <div className="flex gap-2 mt-2">
                  <Image
                    src={backIconOrange}
                    alt="backIconOrange"
                    onClick={() => {
                      setIsDetailDosenPAClicked(!isDetailDosenPAClicked);
                      setSelectedDataDosenPA(null);
                    }}
                    className="cursor-pointer"
                  />
                  <p className="text-orange-600 font-medium">Kembali</p>
                </div>
                <div className="flex flex-col gap-4 mt-4 border rounded-xl p-8">
                  <div className="flex gap-6">
                    <img
                      src={selectedDataDosenPA?.dosen.profile_image}
                      alt="Profile Image"
                      className="size-[120px] rounded-full cursor-pointer"
                    />
                    <div className="font-medium mt-2">
                      <p className="self-center">
                        {selectedDataDosenPA?.dosen.nama_lengkap}
                      </p>
                      <p className="self-center">
                        {selectedDataDosenPA?.dosen.nip}
                      </p>
                      <p className="self-center">
                        {selectedDataDosenPA?.dosen.email}
                      </p>
                      <p className="self-center">
                        {selectedDataDosenPA?.dosen.no_whatsapp}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div>
                      <p>Jumlah pengajuan oleh mahasiswa : </p>
                      <p>
                        {dataBimbinganBySelectedDosenPA.length} Pengajuan
                        Bimbingan
                      </p>
                    </div>
                    <div>
                      <p>Jumlah pengajuan yang diterima : </p>
                      <p>
                        {
                          dataBimbinganBySelectedDosenPA.filter(
                            (data) =>
                              data.pengajuan_bimbingan.status === "Diterima"
                          ).length
                        }{" "}
                        Pengajuan Bimbingan
                      </p>
                    </div>
                    <div>
                      <p>Jumlah laporan bimbingan : </p>
                      <p>
                        {
                          dataBimbinganBySelectedDosenPA.filter(
                            (data) =>
                              data.laporan_bimbingan !== null &&
                              data.laporan_bimbingan?.status ===
                                "Sudah Diberikan Feedback"
                          ).length
                        }{" "}
                        Laporan Bimbingan
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {dataDosenPA.map((data) => {
                  return (
                    <div
                      key={data.id}
                      className="flex justify-between border rounded-xl p-4 cursor-pointer"
                      onClick={() => {
                        handleDetailDosenPA(data);
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={data.dosen.profile_image}
                          alt="Profile Image"
                          className="w-8 h-8 rounded-full cursor-pointer"
                        />
                        <p className="self-center font-medium">
                          {data.dosen.nama_lengkap}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <p className="font-semibold text-orange-500">
                          {`
                          ${
                            dataAllMahasiswa.filter(
                              (dataMahasiswa) =>
                                dataMahasiswa.dosen_pa_id === data.id
                            ).length
                          } mahasiswa bimbingan
                        `}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
      {selectedSubMenuDashboard ===
        "Riwayat Laporan Bimbingan Role Kaprodi" && (
        <div className="w-[75%] pl-[30px] pr-[128px] py-[30px]">
          <div className=" flex flex-col gap-6 rounded-lg">
            <h1 className="font-semibold text-[24px]">
              Riwayat Laporan Bimbingan
            </h1>
            {dataLaporanBimbingan.length > 0 ? (
              !isDetailLaporanKaprodiClicked ? (
                <div className="flex flex-col gap-6">
                  {dataLaporanBimbingan
                    .slice()
                    .reverse()
                    .map((data) => (
                      <div
                        key={data.id}
                        className="flex flex-col border rounded-lg p-6 gap-4 cursor-pointer"
                        onClick={() => handleDetailLaporanKaprodi(data)}
                      >
                        <div className="flex justify-between text-neutral-600">
                          <p>{data.waktu_bimbingan}</p>
                        </div>
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">{data.nama_dosen_pa}</p>
                            <p>{data.jumlah_mahasiswa} Mahasiswa</p>
                            <p className="font-medium">
                              {data.jenis_bimbingan}
                            </p>
                            <p className="font-medium">
                              {data.sistem_bimbingan}
                            </p>
                          </div>
                          <div
                            className={`${data.status === "Menunggu Feedback Kaprodi" ? "bg-red-500" : "bg-green-500"} p-3 self-center rounded-lg`}
                          >
                            <p className="text-white text-center">
                              {data.status}
                            </p>
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
                        setIsDetailLaporanKaprodiClicked(
                          !isDetailLaporanKaprodiClicked
                        );
                        setSelectedDataLaporanBimbingan(null);
                      }}
                      className="cursor-pointer"
                    />
                    <p className="text-orange-600 font-medium">Kembali</p>
                  </div>
                  <div className="mt-4">
                    <div className="flex flex-col border rounded-lg p-6 gap-4">
                      <div className="flex justify-between text-neutral-600">
                        <p>{selectedDataLaporanBimbingan?.waktu_bimbingan}</p>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex flex-col gap-4 w-[55%]">
                          <div className="flex flex-col gap-2">
                            <p className="font-medium">{`Peserta Bimbingan (${selectedDataLaporanBimbingan?.jumlah_mahasiswa} mahasiswa) :`}</p>
                            <p>
                              {selectedDataLaporanBimbingan?.nama_mahasiswa}
                            </p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <p className="font-medium">Jenis Bimbingan :</p>
                            <p>
                              <p>
                                {selectedDataLaporanBimbingan?.jenis_bimbingan}
                              </p>
                            </p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <p className="font-medium">Sistem Bimbingan :</p>
                            <p>
                              {selectedDataLaporanBimbingan?.sistem_bimbingan}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`self-start ${selectedDataLaporanBimbingan?.status === "Sudah Diberikan Feedback" ? "bg-green-500" : "bg-red-500"} p-3 rounded-lg`}
                        >
                          <p className="text-white text-center">
                            {selectedDataLaporanBimbingan?.status}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                          <h3 className="font-medium">Kendala Mahasiswa</h3>
                          <p>
                            {selectedDataLaporanBimbingan?.kendala_mahasiswa}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <h3 className="font-medium">
                            Solusi yang ditawarkan
                          </h3>
                          <p>{selectedDataLaporanBimbingan?.solusi}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <h3 className="font-medium">Kesimpulan</h3>
                          <p>{selectedDataLaporanBimbingan?.kesimpulan}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <h3 className="font-medium">Dokumentasi</h3>
                          <div className="grid grid-cols-2 gap-4 items-center">
                            {selectedDataLaporanBimbingan?.dokumentasi ? (
                              selectedDataLaporanBimbingan.dokumentasi
                                .split(", ")
                                .map((data, index) => (
                                  <div
                                    key={index}
                                    className="flex justify-center border rounded-lg"
                                  >
                                    <img
                                      src={data}
                                      alt="dokumentasi"
                                      className="min-h-[100px] p-4 max-h-[200px]"
                                    />
                                  </div>
                                ))
                            ) : (
                              <p>-</p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-3">
                          <h3 className="font-medium">Feedback Kaprodi</h3>
                          {selectedDataLaporanBimbingan?.feedback_kaprodi !==
                          null ? (
                            <p>
                              {selectedDataLaporanBimbingan?.feedback_kaprodi}
                            </p>
                          ) : (
                            <div className="flex flex-col gap-3">
                              <textarea
                                placeholder={
                                  feedbackKaprodi === ""
                                    ? "Input Feedback"
                                    : feedbackKaprodi
                                }
                                onChange={(e) => {
                                  setFeedbackKaprodi(e.target.value);
                                }}
                                value={feedbackKaprodi}
                                className="px-3 pt-2 h-[200px] text-[15px] border rounded-lg"
                              ></textarea>
                              <button
                                onClick={() => {
                                  handleEditLaporanBimbingan(
                                    selectedDataLaporanBimbingan?.id,
                                    selectedDataLaporanBimbingan?.dosen_pa_id,
                                    "Sudah Diberikan Feedback"
                                  );
                                  setIsDetailLaporanKaprodiClicked(
                                    !isDetailLaporanKaprodiClicked
                                  );
                                  setSelectedDataLaporanBimbingan(null);
                                }}
                                className="text-white bg-orange-500 text-[14px] py-2 font-medium rounded-lg w-1/5"
                              >
                                Submit
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="text-center border rounded-lg py-12 text-gray-500 mb-[400px]">
                <p>Belum ada laporan bimbingan</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardKaprodi;
