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

interface DashboardKaprodiProps {
  selectedSubMenuDashboard: string;
  dataUser: object;
}
const DashboardKaprodi: React.FC<DashboardKaprodiProps> = ({
  selectedSubMenuDashboard,
  dataUser,
}) => {
  const [namaLengkapKaprodi, setNamaLengkapKaprodi] = useState("");
  const [emailKaprodi, setEmailKaprodi] = useState("");
  const [nip, setNip] = useState("");
  const [noTelpKaprodi, setNoTelpKaprodi] = useState("");
  const [userProfile, setUserProfile] = useState({});
  const [feedbackKaprodi, setFeedbackKaprodi] = useState("");
  const [selectedTahunAjaran, setSelectedTahunAjaran] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [isDetailLaporanKaprodiClicked, setIsDetailLaporanKaprodiClicked] =
    useState(true);
  const [dataDosenPA, setDataDosenPA] = useState([]);
  const [isDataChanged, setIsDataChanged] = useState(false);

  const handleDetailLaporanKaprodi = () => {
    setIsDetailLaporanKaprodiClicked((prev) => !prev);
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

  const patchKaprodi = async (updatedData) => {
    try {
      const response = await axios.patch(
        "http://localhost:3000/api/datadosen",
        updatedData
      );
      console.log(updatedData);
      console.log("Kaprodi updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  };

  const handleEditKaprodi = async (id) => {
    try {
      let jurusanValue = {
        id,
        nama_lengkap: namaLengkapKaprodi,
        email: emailKaprodi,
        nip,
        no_whatsapp: noTelpKaprodi,
      };

      console.log(jurusanValue);

      const result = await patchKaprodi(jurusanValue);
      getDataDosenById();
      console.log("Response from backend:", result);
    } catch (error) {
      console.error("Failed to save the updated order.");
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

      setNamaLengkapKaprodi(dosen.nama_lengkap);
      setEmailKaprodi(dosen.email);
      setNip(dosen.nip);
      setNoTelpKaprodi(dosen.no_whatsapp);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (dataUser && dataUser.id) {
      getDataDosenById();
    }
  }, [dataUser]);

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
  }, []);

  return (
    <>
      {selectedSubMenuDashboard === "Profile Kaprodi" && (
        <div className="w-[75%] pl-[30px] pr-[128px] py-[30px]">
          <div className="border px-[70px] py-[30px] rounded-lg">
            <div className="flex gap-10">
              <ProfileImage className="size-[200px] rounded-full" />
              <div className="flex flex-col justify-center text-[13px] gap-4">
                <button className="bg-orange-500 hover:bg-orange-600 w-[30%] px-4 py-2 text-white rounded-md">
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
                type="text"
                placeholder={emailKaprodi === "" ? "Email" : emailKaprodi}
                onChange={(e) => {
                  setEmailKaprodi(e.target.value);
                }}
                value={emailKaprodi}
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
                className={`text-white bg-orange-500 hover:bg-orange-600 text-[14px] py-2 font-medium rounded-lg ${!isDataChanged ? "hidden" : ""}`}
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
          <div className="flex flex-col gap-4 border px-[20px] py-[20px] rounded-lg">
            <h1 className="font-semibold text-[24px]">Data Dosen PA</h1>
            <div className="flex flex-col gap-4">
              {dataDosenPA.map((data) => {
                return (
                  <div
                    key={data.id}
                    className="flex items-center gap-2 border rounded-xl p-2"
                  >
                    <Image
                      src={profilePlaceholder}
                      alt="Profile Image"
                      className="w-8 h-8 rounded-full cursor-pointer"
                    />
                    <p className="self-center">{data.dosen.nama_lengkap}</p>
                  </div>
                );
              })}
            </div>
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
            {!isDetailLaporanKaprodiClicked ? (
              <div className="flex flex-col gap-6">
                <div
                  className="flex flex-col border rounded-lg p-6 gap-4 cursor-pointer"
                  onClick={handleDetailLaporanKaprodi}
                >
                  <div className="flex justify-between text-neutral-600">
                    <p>20 Desember 2024</p>
                    <p>20 Mahasiswa</p>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">Afif Fakhri</p>
                      <p>Keuangan</p>
                      <p className="font-medium">Offline</p>
                    </div>
                    <div className="bg-red-500 p-3 self-center rounded-lg">
                      <p className="text-white text-center">
                        Belum Diberikan Feedback
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className="flex flex-col border rounded-lg p-6 gap-4 cursor-pointer"
                  onClick={handleDetailLaporanKaprodi}
                >
                  <div className="flex justify-between text-neutral-600">
                    <p>20 Desember 2024</p>
                    <p>20 Mahasiswa</p>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">Afif Fakhri</p>
                      <p>Keuangan</p>
                      <p className="font-medium">Offline</p>
                    </div>
                    <div className="bg-red-500 p-3 self-center rounded-lg">
                      <p className="text-white text-center">
                        Belum Diberikan Feedback
                      </p>
                    </div>
                  </div>
                </div>
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
                    }}
                    className="cursor-pointer"
                  />
                  <p className="text-orange-600 font-medium">Kembali</p>
                </div>
                <div className="mt-4">
                  <div className="flex flex-col border rounded-lg p-6 gap-4">
                    <div className="flex justify-between text-neutral-600">
                      <p>20 Desember 2024</p>
                      <p>20 Mahasiswa</p>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">Afif Fakhri</p>
                        <p>Keuangan</p>
                        <p className="font-medium">Offline</p>
                      </div>
                      <div className="bg-green-500 p-3 self-center rounded-lg">
                        <p className="text-white text-center">Diterima</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <h3 className="font-medium">Kendala Mahasiswa</h3>
                        <ol className="list-disc pl-5">
                          <div className="flex flex-col gap-1">
                            <li>Kesulitan dalam mengatur waktu</li>
                            <p>
                              Banyak mahasiswa yang merasa kesulitan dalam
                              mengatur waktu antara kuliah, tugas, dan kegiatan
                              organisasi. Aktivitas yang padat dapat membuat
                              mereka kewalahan, terlebih jika ada tenggat waktu
                              yang bersamaan.
                            </p>
                          </div>
                        </ol>
                      </div>
                      <div className="flex flex-col gap-2">
                        <h3 className="font-medium">Solusi yang ditawarkan</h3>
                        <ol className="list-decimal pl-5">
                          <div className="flex flex-col gap-1">
                            <li>Mengatur Waktu dan Prioritas</li>
                            <ol className="list-disc pl-5 flex flex-col gap-1">
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
                        </ol>
                      </div>
                      <div className="flex flex-col gap-2">
                        <h3 className="font-medium">Kesimpulan</h3>
                        <p>
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
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <h3 className="font-medium">Dokumentasi</h3>
                        <Image
                          className="size-[100px]"
                          src={upnvjLogo}
                          alt="upnvjLogo"
                        />
                      </div>
                      <div className="flex flex-col gap-3">
                        <h3 className="font-medium">Feedback Kaprodi</h3>
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
                        <button className="text-white bg-orange-500 text-[14px] py-2 font-medium rounded-lg w-1/5">
                          Submit
                        </button>
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
export default DashboardKaprodi;
