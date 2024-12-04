"use client";

import Logo from "@/components/ui/LogoUPNVJ";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import upIcon from "../../assets/images/upIcon.png";
import upnvjLogo from "../../assets/images/LOGO-UPNVJ.png";
import backIconOrange from "../../assets/images/back-icon-orange.png";
import downIcon from "../../assets/images/downIcon.png";
import addIcon from "../../assets/images/add-button.png";
import deleteIcon from "../../assets/images/trash-icon.png";
import line from "../../assets/images/line.png";
import profilePlaceholder from "../../assets/images/profile.png";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectField";
import NavbarUser from "@/components/ui/NavbarUser";
import ProfileImage from "@/components/ui/ProfileImage";

const schedule = {
  Senin: ["07.00 - 08.00", "13.00 - 15.00"],
  Selasa: ["09.00 - 11.00", "15.00 - 17.00"],
  Rabu: ["09.00 - 11.00", "15.00 - 17.00"],
  Kamis: ["09.00 - 11.00", "15.00 - 17.00"],
  Jumat: ["09.00 - 11.00", "15.00 - 17.00"],
};

export default function Home() {
  const [namaLengkapMahasiswa, setNamaLengkapMahasiswa] = useState("Saripah");
  const [namaLengkapDosen, setNamaLengkapDosen] = useState("Irmaya Salsabila");
  const [emailMahasiswa, setEmailMahasiswa] = useState("saripah@gmail.com");
  const [emailDosen, setEmailDosen] = useState("irmaya@gmail.com");
  const [nim, setNim] = useState("2110511076");
  const [nip, setNip] = useState("1284822791");
  const [noTelpMahasiswa, setNoTelpMahasiswa] = useState("0889776765737");
  const [noTelpDosen, setNoTelpDosen] = useState("0889773829183");
  const [selectedJurusan, setSelectedJurusan] = useState("Jurusan A");
  const [selectedPeminatan, setSelectedPeminatan] = useState("Peminatan A");
  const [selectedDosenPA, setSelectedDosenPA] = useState("Dosen PA A");
  const [keteranganKonfirmasi, setKeteranganKonfirmasi] = useState("");
  const [feedbackKaprodi, setFeedbackKaprodi] = useState("");
  const [selectedSubMenuDashboard, setSelectedSubMenuDashboard] = useState(
    "Pengaturan Role Mahasiswa"
  );
  const [selectedTahunAjaran, setSelectedTahunAjaran] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [isDetailLaporanDosenClicked, setIsDetailLaporanDosenClicked] =
    useState(true);
  const [isDetailLaporanKaprodiClicked, setIsDetailLaporanKaprodiClicked] =
    useState(true);
  const [idLaporanClicked, setIdLaporanClicked] = useState(1);
  const [dataDosen, setdataDosen] = useState([]);

  const [roleUser, setRoleUser] = useState("Kaprodi");

  // URL API yang telah Anda buat

  // Fungsi untuk mengambil data dari API
  async function fetchDosenData() {
    const apiUrl = "http://localhost:3000/api/datadosen";
    try {
      // Menggunakan fetch untuk membuat permintaan GET
      const response = await fetch(apiUrl);

      // Memeriksa apakah respons berhasil (status 200-299)
      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      // Mengambil data JSON dari respons
      const data = await response.json();

      // Menampilkan data di konsol atau proses lebih lanjut
      setdataDosen(data);
    } catch (error) {
      // Menangani error
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    if (roleUser === "Dosen") {
      setSelectedSubMenuDashboard("Pengaturan Role Dosen");
    } else if (roleUser === "Mahasiswa") {
      setSelectedSubMenuDashboard("Pengaturan Role Mahasiswa");
    } else if (roleUser === "Kaprodi") {
      setSelectedSubMenuDashboard("Pengaturan Role Kaprodi");
      fetchDosenData();
    }
  }, [roleUser]);

  const [openDay, setOpenDay] = useState(null);

  const toggleDay = (day) => {
    setOpenDay(openDay === day ? null : day);
  };

  const handleDetailLaporanDosen = () => {
    setIsDetailLaporanDosenClicked((prev) => !prev);
  };
  const handleDetailLaporanKaprodi = () => {
    setIsDetailLaporanKaprodiClicked((prev) => !prev);
  };

  return (
    <div>
      <NavbarUser />
      <div className="flex w-full pt-[80px]">
        <div className="flex flex-col w-[25%] border ml-32 gap-6 pt-8 pb-6 px-8">
          <h1 className="text-[18px] font-semibold">
            Dashboard Pengguna ({roleUser})
          </h1>
          {roleUser === "Mahasiswa" && (
            <div className="flex flex-col gap-1">
              <button
                className={`${selectedSubMenuDashboard === "Pengaturan Role Mahasiswa" && "bg-orange-400"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={(e) => {
                  setSelectedSubMenuDashboard("Pengaturan Role Mahasiswa");
                }}
              >
                Pengaturan
              </button>
              <button
                className={`${selectedSubMenuDashboard === "Jadwal Kosong Dosen Role Mahasiswa" && "bg-orange-400"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={(e) => {
                  setSelectedSubMenuDashboard(
                    "Jadwal Kosong Dosen Role Mahasiswa"
                  );
                }}
              >
                Jadwal Kosong Dosen
              </button>
              <button
                className={`${selectedSubMenuDashboard === "Riwayat Pengajuan Konseling" && "bg-orange-400"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={(e) => {
                  setSelectedSubMenuDashboard("Riwayat Pengajuan Konseling");
                }}
              >
                Riwayat Pengajuan Konseling
              </button>
            </div>
          )}
          {roleUser === "Dosen" && (
            <div className="flex flex-col gap-1">
              <button
                className={`${selectedSubMenuDashboard === "Pengaturan Role Dosen" && "bg-orange-400"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={(e) => {
                  setSelectedSubMenuDashboard("Pengaturan Role Dosen");
                }}
              >
                Pengaturan
              </button>
              <button
                className={`${selectedSubMenuDashboard === "Jadwal Kosong Dosen Role Dosen" && "bg-orange-400"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={(e) => {
                  setSelectedSubMenuDashboard("Jadwal Kosong Dosen Role Dosen");
                }}
              >
                Jadwal Kosong Dosen
              </button>
              <button
                className={`${selectedSubMenuDashboard === "Pengajuan Bimbingan Konseling Mahasiswa" && "bg-orange-400"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={(e) => {
                  setSelectedSubMenuDashboard(
                    "Pengajuan Bimbingan Konseling Mahasiswa"
                  );
                }}
              >
                Pengajuan Bimbingan Konseling Mahasiswa
              </button>
              <button
                className={`${selectedSubMenuDashboard === "Riwayat Laporan Bimbingan Role Dosen" && "bg-orange-400"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={(e) => {
                  setSelectedSubMenuDashboard(
                    "Riwayat Laporan Bimbingan Role Dosen"
                  );
                }}
              >
                Riwayat Laporan Bimbingan
              </button>
            </div>
          )}
          {roleUser === "Kaprodi" && (
            <div className="flex flex-col gap-1">
              <button
                className={`${selectedSubMenuDashboard === "Pengaturan Role Kaprodi" && "bg-orange-400"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={(e) => {
                  setSelectedSubMenuDashboard("Pengaturan Role Kaprodi");
                }}
              >
                Pengaturan
              </button>
              <button
                className={`${selectedSubMenuDashboard === "Statistik Bimbingan Konseling" && "bg-orange-400"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={(e) => {
                  setSelectedSubMenuDashboard("Statistik Bimbingan Konseling");
                }}
              >
                Statistik Bimbingan Konseling
              </button>
              <button
                className={`${selectedSubMenuDashboard === "Data Dosen" && "bg-orange-400"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={(e) => {
                  setSelectedSubMenuDashboard("Data Dosen");
                }}
              >
                Data Dosen
              </button>
              <button
                className={`${selectedSubMenuDashboard === "Riwayat Laporan Bimbingan Role Kaprodi" && "bg-orange-400"} text-left text-[14px] rounded-xl py-2 px-3`}
                onClick={(e) => {
                  setSelectedSubMenuDashboard(
                    "Riwayat Laporan Bimbingan Role Kaprodi"
                  );
                }}
              >
                Riwayat Laporan Bimbingan
              </button>
            </div>
          )}
        </div>
        {selectedSubMenuDashboard === "Pengaturan Role Mahasiswa" && (
          <div className="w-[75%] pl-[30px] pr-[128px] py-[30px]">
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
                  options={[
                    { value: "Jurusan A", label: "Jurusan A" },
                    { value: "Jurusan B", label: "Jurusan B" },
                    { value: "Jurusan C", label: "Jurusan C" },
                  ]}
                  onChange={(e) => setSelectedJurusan(e.target.value)}
                  value={selectedJurusan}
                  placeholder="Pilih Jurusan"
                  className={`px-3 py-2 text-[15px] border rounded-lg appearance-none w-full`}
                />
                <SelectField
                  options={[
                    { value: "Peminatan A", label: "Peminatan A" },
                    { value: "Peminatan B", label: "Peminatan B" },
                    { value: "Peminatan C", label: "Peminatan C" },
                  ]}
                  onChange={(e) => setSelectedPeminatan(e.target.value)}
                  value={selectedPeminatan}
                  placeholder="Pilih Peminatan"
                  className={`px-3 py-2 text-[15px] border rounded-lg appearance-none w-full`}
                />
                <SelectField
                  options={[
                    { value: "Dosen PA A", label: "Dosen PA A" },
                    { value: "Dosen PA B", label: "Dosen PA B" },
                    { value: "Dosen PA C", label: "Dosen PA C" },
                  ]}
                  onChange={(e) => setSelectedDosenPA(e.target.value)}
                  value={selectedDosenPA}
                  placeholder="Pilih Dosen PA"
                  className={`px-3 py-2 text-[15px] border rounded-lg appearance-none w-full`}
                />
                <button className="text-white bg-orange-500 text-[14px] py-2 font-medium rounded-lg">
                  Simpan
                </button>
              </form>
            </div>
          </div>
        )}
        {selectedSubMenuDashboard === "Jadwal Kosong Dosen Role Mahasiswa" && (
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
                    {openDay === day && schedule[day].length > 0 && (
                      <div className="flex px-4 pt-4">
                        {schedule[day].map((time, index) => (
                          <div key={index} className="inline-flex items-center">
                            <span className="text-[14px]">{time}</span>
                            {index < schedule[day].length - 1 && (
                              <span className="mx-2 text-gray-600">|</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {selectedSubMenuDashboard === "Pengaturan Role Dosen" && (
          <div className="w-[75%] pl-[30px] pr-[128px] py-[30px]">
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
                <button className="text-white bg-orange-500 text-[14px] py-2 font-medium rounded-lg">
                  Simpan
                </button>
              </form>
            </div>
          </div>
        )}
        {selectedSubMenuDashboard === "Jadwal Kosong Dosen Role Dosen" && (
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
                    {openDay === day && schedule[day].length > 0 && (
                      <div className="flex gap-4 px-4 pt-4">
                        <Image src={addIcon} alt="addIcon" />
                        {schedule[day].map((time, index) => (
                          <div
                            key={index}
                            className="inline-flex gap-3 items-center"
                          >
                            <Image src={deleteIcon} alt="deleteIcon" />
                            <span className="text-[14px]">{time}</span>
                            {index < schedule[day].length - 1 && (
                              <Image className="" src={line} alt="line" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {selectedSubMenuDashboard === "Pengaturan Role Kaprodi" && (
          <div className="w-[75%] pl-[30px] pr-[128px] py-[30px]">
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
                <button className="text-white bg-orange-500 text-[14px] py-2 font-medium rounded-lg">
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
        {selectedSubMenuDashboard === "Data Dosen" && (
          <div className="w-[75%] pl-[30px] pr-[128px] py-[30px]">
            <div className="flex flex-col gap-4 border px-[20px] py-[20px] rounded-lg">
              <h1 className="font-semibold text-[24px]">Data Dosen</h1>
              <div className="flex flex-col gap-4">
                {dataDosen.map((data) => {
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
                      <p className="self-center">{data.nama_lengkap}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {selectedSubMenuDashboard === "Riwayat Pengajuan Konseling" && (
          <div className="w-[75%] pl-[30px] pr-[128px] py-[30px]">
            <div className=" flex flex-col gap-6 border px-[30px] pt-[15px] pb-[30px] rounded-lg">
              <h1 className="font-semibold text-[24px]">
                Riwayat Pengajuan Bimbingan Konseling
              </h1>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col border rounded-lg p-6 gap-4">
                  <div className="flex justify-between text-neutral-600">
                    <p>20 Desember 2024</p>
                    <p>07.00 - 08.00</p>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">Afif Fakhri</p>
                      <p>Keuangan</p>
                      <p className="font-medium">Offline</p>
                    </div>
                    <div className="bg-red-500 p-3 self-center rounded-lg">
                      <p className="text-white text-center">Reschedule</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[14px]">
                      *Pengajuan bentrok silahkan mengajukan ulang dengan waktu
                      yang lain
                    </p>
                  </div>
                </div>
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
                <div className="flex flex-col border rounded-lg p-6 gap-4">
                  <div className="flex justify-between text-neutral-600">
                    <p>20 Desember 2024</p>
                    <p>07.00 - 08.00</p>
                  </div>
                  <div>
                    <p className="font-medium">Afif Fakhri</p>
                    <p>Keuangan</p>
                    <p className="font-medium">Offline</p>
                  </div>
                  <InputField
                    type="text"
                    placeholder={
                      keteranganKonfirmasi === ""
                        ? "Input Keterangan"
                        : keteranganKonfirmasi
                    }
                    onChange={(e) => {
                      setKeteranganKonfirmasi(e.target.value);
                    }}
                    value={keteranganKonfirmasi}
                    className="px-3 pt-2 pb-10 text-[15px] border rounded-lg"
                  />
                  <div className="flex gap-2">
                    <button
                      className="w-1/2 bg-red-500 text-white rounded-md py-2 font-medium text-[14px]"
                      disabled={keteranganKonfirmasi === "" ? true : false}
                    >
                      Reschedule
                    </button>
                    <button
                      className="w-1/2 bg-green-500 text-white rounded-md py-2 font-medium text-[14px]"
                      disabled={keteranganKonfirmasi === "" ? true : false}
                    >
                      Diterima
                    </button>
                  </div>
                </div>
                <div className="flex flex-col border rounded-lg p-6 gap-4">
                  <div className="flex justify-between text-neutral-600">
                    <p>20 Desember 2024</p>
                    <p>07.00 - 08.00</p>
                  </div>
                  <div>
                    <p className="font-medium">Afif Fakhri</p>
                    <p>Keuangan</p>
                    <p className="font-medium">Offline</p>
                  </div>
                  <InputField
                    type="text"
                    placeholder={
                      keteranganKonfirmasi === ""
                        ? "Input Keterangan"
                        : "Silahkan join tepat waktu, link meeting akan diberikan melalui  no whatsapp"
                    }
                    onChange={(e) => {
                      setKeteranganKonfirmasi(e.target.value);
                    }}
                    value="Silahkan join tepat waktu, link meeting akan diberikan melalui  no whatsapp"
                    className="px-3 pt-2 pb-10 text-[15px] border rounded-lg"
                    disabled={true}
                  />

                  <button
                    className="bg-green-500 text-white rounded-md py-2 font-medium text-[14px]"
                    disabled={keteranganKonfirmasi === "" ? true : false}
                  >
                    Diterima
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {selectedSubMenuDashboard ===
          "Riwayat Laporan Bimbingan Role Dosen" && (
          <div className="w-[75%] pl-[30px] pr-[128px] py-[30px]">
            <div className=" flex flex-col gap-6 border px-[30px] pt-[15px] pb-[30px] rounded-lg">
              <h1 className="font-semibold text-[24px]">
                Riwayat Pengajuan Bimbingan Konseling
              </h1>
              {!isDetailLaporanDosenClicked ? (
                <div className="flex flex-col gap-4">
                  <div
                    className="flex flex-col border rounded-lg p-6 gap-4 cursor-pointer"
                    onClick={handleDetailLaporanDosen}
                  >
                    <div className="flex justify-between text-neutral-600">
                      <p>20 Desember 2024</p>
                      <p>07.00 - 08.00</p>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">Afif Fakhri</p>
                        <p>Keuangan</p>
                        <p className="font-medium">Offline</p>
                      </div>
                      <div className="bg-red-500 p-3 self-center rounded-lg">
                        <p className="text-white text-center">Belum Diterima</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[14px]">
                        *Pengajuan bentrok silahkan mengajukan ulang dengan
                        waktu yang lain
                      </p>
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
                        setIsDetailLaporanDosenClicked(
                          !isDetailLaporanDosenClicked
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
                        <div>
                          <h3 className="font-medium">Kendala Mahasiswa</h3>
                          <ol className="list-disc pl-5">
                            <div>
                              <li>Kesulitan dalam mengatur waktu</li>
                              <p>
                                Banyak mahasiswa yang merasa kesulitan dalam
                                mengatur waktu antara kuliah, tugas, dan
                                kegiatan organisasi. Aktivitas yang padat dapat
                                membuat mereka kewalahan, terlebih jika ada
                                tenggat waktu yang bersamaan.
                              </p>
                            </div>
                          </ol>
                        </div>
                        <div>
                          <h3 className="font-medium">
                            Solusi yang ditawarkan
                          </h3>
                          <ol className="list-decimal pl-5">
                            <div>
                              <li>Mengatur Waktu dan Prioritas</li>
                              <ol className="list-disc pl-5">
                                <li>
                                  Solusi : Dosen pembimbing akademik dapat
                                  membantu mahasiswa dalam membuat jadwal yang
                                  realistis dan mengajarkan teknik manajemen
                                  waktu yang efektif, seperti metode time
                                  blocking, atau menggunakan aplikasi
                                  perencanaan waktu.
                                </li>
                                <li>
                                  Cara Implementasi : Dosen pembimbing akademik
                                  dapat membantu mahasiswa dalam membuat jadwal
                                  yang realistis dan mengajarkan teknik
                                  manajemen waktu yang efektif, seperti metode
                                  time blocking, atau menggunakan aplikasi
                                  perencanaan waktu.
                                </li>
                              </ol>
                            </div>
                          </ol>
                        </div>
                        <div>
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
                            aspek yang perlu kamu tingkatkan, seperti
                            keterlibatan dalam tugas kelompok dan pengelolaan
                            tugas dengan lebih baik.
                          </p>
                        </div>
                        <div>
                          <h3 className="font-medium">Dokumentasi</h3>
                          <Image
                            className="size-[100px]"
                            src={upnvjLogo}
                            alt="upnvjLogo"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">Feedback Kaprodi</h3>
                          <p>
                            Secara umum, saya melihat bahwa kamu telah
                            menunjukkan kemajuan yang baik dalam beberapa mata
                            kuliah, terutama pada [sebutkan mata kuliah yang
                            dikuasai dengan baik]. Nilai-nilai yang kamu peroleh
                            menunjukkan bahwa kamu memahami dengan baik materi
                            yang diberikan oleh dosen pengampu. Konsistensi
                            dalam hasil akademik kamu juga patut diacungi
                            jempol. Namun, terdapat beberapa mata kuliah seperti
                            [sebutkan mata kuliah yang mengalami kesulitan] yang
                            nilai atau pemahaman kamu masih perlu diperbaiki.
                            Saya menganjurkan agar kamu lebih banyak meluangkan
                            waktu untuk memahami topik-topik tersebut dan
                            mengikuti bimbingan atau konsultasi dengan dosen
                            pengampu untuk mendapatkan penjelasan yang lebih
                            mendalam.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {selectedSubMenuDashboard ===
          "Riwayat Laporan Bimbingan Role Kaprodi" && (
          <div className="w-[75%] pl-[30px] pr-[128px] py-[30px]">
            <div className=" flex flex-col gap-6 border px-[30px] pt-[15px] pb-[30px] rounded-lg">
              <h1 className="font-semibold text-[24px]">
                Riwayat Laporan Bimbingan
              </h1>
              {!isDetailLaporanKaprodiClicked ? (
                <div className="flex flex-col gap-4">
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
                                mengatur waktu antara kuliah, tugas, dan
                                kegiatan organisasi. Aktivitas yang padat dapat
                                membuat mereka kewalahan, terlebih jika ada
                                tenggat waktu yang bersamaan.
                              </p>
                            </div>
                          </ol>
                        </div>
                        <div className="flex flex-col gap-2">
                          <h3 className="font-medium">
                            Solusi yang ditawarkan
                          </h3>
                          <ol className="list-decimal pl-5">
                            <div className="flex flex-col gap-1">
                              <li>Mengatur Waktu dan Prioritas</li>
                              <ol className="list-disc pl-5 flex flex-col gap-1">
                                <li>
                                  Solusi : Dosen pembimbing akademik dapat
                                  membantu mahasiswa dalam membuat jadwal yang
                                  realistis dan mengajarkan teknik manajemen
                                  waktu yang efektif, seperti metode time
                                  blocking, atau menggunakan aplikasi
                                  perencanaan waktu.
                                </li>
                                <li>
                                  Cara Implementasi : Dosen pembimbing akademik
                                  dapat membantu mahasiswa dalam membuat jadwal
                                  yang realistis dan mengajarkan teknik
                                  manajemen waktu yang efektif, seperti metode
                                  time blocking, atau menggunakan aplikasi
                                  perencanaan waktu.
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
                            aspek yang perlu kamu tingkatkan, seperti
                            keterlibatan dalam tugas kelompok dan pengelolaan
                            tugas dengan lebih baik.
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
        <button
          onClick={() => {
            if (roleUser === "Dosen") {
              setRoleUser("Mahasiswa");
            } else if (roleUser === "Mahasiswa") {
              setRoleUser("Kaprodi");
            } else if (roleUser === "Kaprodi") {
              setRoleUser("Dosen");
            }
          }}
        >
          ganti role
        </button>
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
