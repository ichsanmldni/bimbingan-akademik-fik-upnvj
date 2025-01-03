"use client";

import InputField from "@/components/ui/InputField";
import Logo from "@/components/ui/LogoUPNVJ";
import SelectField from "@/components/ui/SelectField";
import NavbarUser from "@/components/ui/NavbarUser";
import Link from "next/link";
import { useEffect, useState } from "react";
import ImagePlus from "../../assets/images/image-plus.png";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";
import cancelIcon from "../../assets/images/cancel-icon.png";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";

interface User {
  id: number;
  role: string;
  [key: string]: any; // Allow additional properties
}

interface Dosen {
  id: number;
  nama_lengkap: string;
  [key: string]: any; // Allow additional properties
}

interface Kaprodi {
  id: number;
  dosen: Dosen;
  dosen_id: number;
  kaprodi_jurusan: {
    jurusan: string;
  };
}

interface Bimbingan {
  id: number;
  pengajuan_bimbingan: {
    nama_lengkap: string;
    jadwal_bimbingan: string;
    jenis_bimbingan: string;
    sistem_bimbingan: string;
    dosen_pa_id: number;
  };
  laporan_bimbingan_id: string | null;
}

export default function Home() {
  const [selectedKaprodi, setSelectedKaprodi] = useState<string>("");
  const [kendala, setKendala] = useState<string>("");
  const [solusi, setSolusi] = useState<string>("");
  const [kesimpulan, setKesimpulan] = useState<string>("");
  const [dokumentasi, setDokumentasi] = useState<string>("");
  const [roleUser, setRoleUser] = useState<string>("");
  const [dataUser, setDataUser] = useState<User>({} as User);
  const [dataDosenPA, setDataDosenPA] = useState<Dosen[]>([]);
  const [dataKaprodi, setDataKaprodi] = useState<Kaprodi[]>([]);
  const [optionsKaprodi, setOptionsKaprodi] = useState<
    { value: string; label: string }[]
  >([]);
  const [dataSelectedKaprodi, setDataSelectedKaprodi] =
    useState<Kaprodi | null>(null);
  const [dataBimbingan, setDataBimbingan] = useState<Bimbingan[]>([]);
  const [userProfile, setUserProfile] = useState<{
    nama_lengkap: string;
    email: string;
    nip: string;
    no_whatsapp: string;
  } | null>(null);
  const [selectedBimbingan, setSelectedBimbingan] = useState<Bimbingan[]>([]);
  const [dataDosen, setDataDosen] = useState<Dosen[]>([]);
  const [dataMahasiswa, setDataMahasiswa] = useState<any[]>([]); // Adjust type as needed
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const toggleBimbingan = (data: Bimbingan) => {
    setSelectedBimbingan((prevSelected) => {
      if (prevSelected.some((bimbingan) => bimbingan.id === data.id)) {
        return prevSelected.filter((bimbingan) => bimbingan.id !== data.id);
      } else {
        return [...prevSelected, data];
      }
    });
  };

  const getDataDosen = async () => {
    try {
      const response = await axios.get<Dosen[]>(
        "http://localhost:3000/api/datadosen"
      );
      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }
      setDataDosen(response.data);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataMahasiswa = async () => {
    try {
      const response = await axios.get<any[]>(
        "http://localhost:3000/api/datamahasiswa"
      );
      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }
      setDataMahasiswa(response.data);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataDosenPA = async () => {
    try {
      const response = await axios.get<Dosen[]>(
        "http://localhost:3000/api/datadosenpa"
      );
      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }
      setDataDosenPA(response.data);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataKaprodi = async () => {
    try {
      const response = await axios.get<Kaprodi[]>(
        "http://localhost:3000/api/datakaprodi"
      );
      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }
      setDataKaprodi(response.data);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const addLaporanBimbingan = async (newData: any) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/laporanbimbingan",
        newData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleAddLaporanBimbingan = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      const laporanBimbinganValue = {
        nama_mahasiswa: [
          ...new Set(
            selectedBimbingan.map(
              (bimbingan) => bimbingan.pengajuan_bimbingan.nama_lengkap
            )
          ),
        ].join(", "),
        waktu_bimbingan: [
          ...new Set(
            selectedBimbingan.map(
              (bimbingan) => bimbingan.pengajuan_bimbingan.jadwal_bimbingan
            )
          ),
        ].join(", "),
        kaprodi_id: dataSelectedKaprodi?.id,
        kendala_mahasiswa: kendala,
        solusi,
        kesimpulan,
        dokumentasi:
          imagePreviews.length > 0
            ? [...new Set(imagePreviews.map((data) => data))].join(", ")
            : null,
        status: "Menunggu Feedback Kaprodi",
        dosen_pa_id: dataDosenPA.find((data) => data.dosen.id === dataUser.id)
          ?.id,
        nama_dosen_pa: dataDosenPA.find((data) => data.dosen.id === dataUser.id)
          ?.dosen.nama_lengkap,
        jenis_bimbingan: [
          ...new Set(
            selectedBimbingan.map(
              (bimbingan) => bimbingan.pengajuan_bimbingan.jenis_bimbingan
            )
          ),
        ].join(", "),
        sistem_bimbingan: [
          ...new Set(
            selectedBimbingan.map(
              (bimbingan) => bimbingan.pengajuan_bimbingan.sistem_bimbingan
            )
          ),
        ].join(", "),
        bimbingan_id: [
          ...new Set(selectedBimbingan.map((bimbingan) => bimbingan.id)),
        ].join(", "),
      };
      console.log(laporanBimbinganValue);

      const result = await addLaporanBimbingan(laporanBimbinganValue);
      console.log(result);
      setSelectedBimbingan([]);
      setSolusi("");
      setKesimpulan("");
      setKendala("");
      setSelectedKaprodi("");
      setDokumentasi("");
      getDataBimbinganByDosenPaId();
    } catch (error) {
      console.error("Registration error:", (error as Error).message);
    }
  };

  const getDataDosenById = async () => {
    try {
      const dataDosen = await axios.get<Dosen[]>(
        "http://localhost:3000/api/datadosen"
      );
      const dosen = dataDosen.data.find((data) => data.id === dataUser.id);

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
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataBimbinganByDosenPaId = async () => {
    try {
      const dataDosenPa = await axios.get<Dosen[]>(
        "http://localhost:3000/api/datadosenpa"
      );
      const dosenPa = dataDosenPa.data.find(
        (data) => data.dosen.nama_lengkap === userProfile?.nama_lengkap
      );

      console.log(dosenPa);

      if (!dosenPa) {
        throw new Error("Dosen PA tidak ditemukan");
      }

      const dosenpaid = dosenPa.id;

      const dataBimbingan = await axios.get<Bimbingan[]>(
        "http://localhost:3000/api/bimbingan"
      );
      const bimbingan = dataBimbingan.data.filter(
        (data) => data.pengajuan_bimbingan.dosen_pa_id === dosenpaid
      );

      setDataBimbingan(bimbingan);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []); // Ambil semua file sebagai array
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"]; // Format yang diperbolehkan
    const maxSize = 10 * 1024 * 1024; // Ukuran maksimum per file (10MB)

    const newPreviews: string[] = []; // Array untuk menampung preview gambar baru

    for (const file of files) {
      // Validasi ukuran file
      if (file.size > maxSize) {
        alert(`File "${file.name}" melebihi ukuran maksimal 10MB`);
        continue; // Skip file ini
      }

      // Validasi jenis file
      if (!allowedTypes.includes(file.type)) {
        alert(
          `Format file "${file.name}" tidak diperbolehkan. Gunakan .JPG, .JPEG, atau .PNG`
        );
        continue; // Skip file ini
      }

      // Membaca file sebagai Data URL untuk preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]); // Tambahkan preview baru ke state
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    e.preventDefault();
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  useEffect(() => {
    getDataDosenPA();
    getDataKaprodi();
    getDataDosen();
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

  useEffect(() => {
    if (dataKaprodi.length > 0) {
      const formattedOptions = dataKaprodi.map((data) => {
        return {
          value: data.dosen.nama_lengkap,
          label: `${data.dosen.nama_lengkap} (Kaprodi ${data.kaprodi_jurusan.jurusan})`,
        };
      });

      setOptionsKaprodi(formattedOptions);
    }
  }, [dataKaprodi]);

  useEffect(() => {
    if (dataUser && dataUser.id) {
      getDataDosenById();
    }
  }, [dataUser]);

  useEffect(() => {
    if (dataKaprodi.length > 0) {
      const data = dataKaprodi.find(
        (data) => data.dosen.nama_lengkap === selectedKaprodi
      );
      setDataSelectedKaprodi(data || null);
    }
  }, [selectedKaprodi]);

  useEffect(() => {
    if (dataUser.role === "Mahasiswa") {
      setRoleUser("Mahasiswa");
    } else if (dataUser.role === "Dosen") {
      const isDosenPA = dataDosenPA.find(
        (data) => data.dosen_id === dataUser.id
      );
      const isKaprodi = dataKaprodi.find(
        (data) => data.dosen_id === dataUser.id
      );
      if (isDosenPA) {
        setRoleUser("Dosen PA");
      } else if (isKaprodi) {
        setRoleUser("Kaprodi");
      }
    }
  }, [dataUser, dataDosenPA, dataKaprodi]);

  useEffect(() => {
    if (userProfile && userProfile.nama_lengkap) {
      getDataBimbinganByDosenPaId();
    }
  }, [userProfile]);

  return (
    <div>
      <NavbarUser
        roleUser={roleUser}
        dataUser={
          roleUser === "Mahasiswa"
            ? dataMahasiswa.find((data) => data.id === dataUser.id)
            : roleUser === "Dosen PA"
              ? dataDosen.find((data) => data.id === dataUser.id)
              : roleUser === "Kaprodi"
                ? dataDosen.find((data) => data.id === dataUser.id)
                : undefined
        }
      />
      <div className="pt-[100px]">
        <div className="mt-4 mb-[400px] mx-[130px] border rounded-lg">
          <h1 className="font-semibold text-[30px] text-center pt-8">
            Laporan Bimbingan Konseling Mahasiswa
          </h1>
          <form
            className="flex flex-col gap-4 p-8"
            onSubmit={handleAddLaporanBimbingan}
          >
            {dataBimbingan.filter((data) => data.laporan_bimbingan_id === null)
              .length === 0 ? (
              <p className="col-span-3 text-center text-gray-500">
                Tidak ada bimbingan yang belum dibuat laporannya.
              </p>
            ) : (
              <div>
                <p className="pl-2">Pilih Bimbingan :</p>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  {dataBimbingan
                    .filter((data) => data.laporan_bimbingan_id === null)
                    .map((data) => (
                      <div
                        className={`border rounded-lg flex flex-col gap-1 text-[15px] cursor-pointer ${
                          selectedBimbingan.some(
                            (bimbingan) => bimbingan.id === data.id
                          )
                            ? "bg-orange-500 text-white font-medium"
                            : ""
                        }`}
                        key={data.id}
                      >
                        <label className="flex flex-col gap-2 cursor-pointer">
                          <div className="flex justify-between px-4 pb-4">
                            <div className="">
                              <p className="pt-4">
                                {data.pengajuan_bimbingan.nama_lengkap}
                              </p>
                              {(() => {
                                const jadwal =
                                  data.pengajuan_bimbingan.jadwal_bimbingan;
                                const parts = jadwal.split(" ");

                                if (parts.length === 5) {
                                  const [day, date, month, year, timeRange] =
                                    parts;
                                  const formattedDay = day.replace(",", "");
                                  const formattedDate = `${formattedDay}, ${date} ${month} ${year}`;
                                  const [startTime, endTime] =
                                    timeRange.split("-");

                                  return (
                                    <>
                                      <p>{`${formattedDate}`}</p>
                                      <p>{`${startTime}-${endTime}`}</p>
                                    </>
                                  );
                                } else {
                                  return <p>Jadwal tidak valid.</p>;
                                }
                              })()}
                              <p>{data.pengajuan_bimbingan.jenis_bimbingan}</p>
                              <p>{data.pengajuan_bimbingan.sistem_bimbingan}</p>
                            </div>
                            <input
                              type="checkbox"
                              checked={selectedBimbingan.some(
                                (bimbingan) => bimbingan.id === data.id
                              )}
                              onChange={() => toggleBimbingan(data)}
                              className="size-4 self-start mt-4 cursor-pointer"
                            />
                          </div>
                        </label>
                      </div>
                    ))}
                </div>
              </div>
            )}
            {selectedBimbingan.length > 0 ? (
              <div className="flex flex-col gap-4">
                <InputField
                  disabled={false}
                  type="text"
                  placeholder="Kendala Mahasiswa"
                  onChange={(e) => setKendala(e.target.value)}
                  value={kendala}
                  className="px-3 py-2 text-[15px] border rounded-lg"
                />
                <InputField
                  disabled={false}
                  type="text"
                  placeholder="Solusi Yang Ditawarkan"
                  onChange={(e) => setSolusi(e.target.value)}
                  value={solusi}
                  className="px-3 py-2 text-[15px] border rounded-lg"
                />
                <InputField
                  disabled={false}
                  type="text"
                  placeholder="Kesimpulan"
                  onChange={(e) => setKesimpulan(e.target.value)}
                  value={kesimpulan}
                  className="px-3 py-2 text-[15px] border rounded-lg"
                />
                <SelectField
                  options={optionsKaprodi}
                  onChange={(e) => setSelectedKaprodi(e.target.value)}
                  value={selectedKaprodi}
                  placeholder="Pilih Kaprodi"
                  className={`px-3 py-2 text-[15px] border rounded-lg appearance-none w-full`}
                />
                {imagePreviews.length > 0 ? (
                  <div className="border rounded-lg px-3 py-2">
                    <label className="text-[15px] text-neutral-400">
                      Dokumentasi
                    </label>
                    <div className="grid grid-cols-3 gap-4 m-6">
                      {imagePreviews.map((src, index) => (
                        <div
                          key={index}
                          className="relative min-h-[100px] flex justify-center items-center border rounded-lg"
                        >
                          <img
                            src={src}
                            alt={`Preview ${index + 1}`}
                            className="max-h-[200px]"
                          />
                          <button
                            onClick={(e) => handleDeleteImage(e, index)}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold"
                          >
                            <Image
                              src={cancelIcon}
                              alt={`cancelicon`}
                              className="p-2"
                            />
                          </button>
                        </div>
                      ))}
                      <label className="cursor-pointer flex justify-center items-center border-dashed border-2 border-gray-300 rounded-lg h-[200px] w-full col-span-3">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <div className="flex justify-center items-center">
                          <Image src={ImagePlus} alt="imagePlus" />
                        </div>
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 h-[300px] px-3 py-2 text-[15px] border rounded-lg">
                    <label className="text-neutral-400">Dokumentasi</label>
                    <label className="cursor-pointer w-full h-full flex justify-center items-center">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div className="w-full h-full flex justify-center items-center">
                        <Image src={ImagePlus} alt="imagePlus" />
                      </div>
                    </label>
                  </div>
                )}
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 rounded-lg py-[6px] text-white font-medium"
                >
                  Buat Laporan
                </button>
              </div>
            ) : (
              ""
            )}
          </form>
        </div>
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
