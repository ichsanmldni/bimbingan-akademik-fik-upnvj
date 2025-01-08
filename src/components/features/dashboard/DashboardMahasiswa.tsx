"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import upIcon from "../../../assets/images/upIcon.png";
import downIcon from "../../../assets/images/downIcon.png";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectField";
import ProfileImage from "@/components/ui/ProfileImage";
import { TrashIcon, EyeIcon } from "@heroicons/react/outline";
import axios from "axios";
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import SignatureCanvas from "react-signature-canvas";
import { Fragment } from "react";
import { env } from "process";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [isOpen, setIsOpen] = useState(false);
  const [documentation, setDocumentation] = useState(null);
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
  const [dataBimbingan, setDataBimbingan] = useState<any>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dataMahasiswa, setDataMahasiswa] = useState<Record<string, any>>({});
  const [userProfile, setUserProfile] = useState({
    nama: "",
    email: "",
    nim: "",
    hp: "",
    jurusan: "",
    peminatan: "",
    dosen_pa: "",
  });
  const [isDataChanged, setIsDataChanged] = useState<boolean>(false);
  const [dataJadwalDosenPA, setDataJadwalDosenPA] = useState<any[]>([]); // Adjust type as needed
  const [previewDocumentation, setPreviewDocumentation] = useState([]);
  const [selectedBimbinganId, setSelectedBimbinganId] = useState();
  const [inputKey, setInputKey] = useState(Date.now());

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

  const sigCanvas = useRef({});

  const openModal = (id) => {
    setIsOpen(true);
    setSelectedBimbinganId(id);
  };

  const closeModal = () => {
    setSelectedBimbinganId(null);
    setIsOpen(false);
    setDocumentation(null);
    setPreviewDocumentation([]);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 10 * 1024 * 1024;

    const newPreviews: string[] = [];

    for (const file of files) {
      if (file.size > maxSize) {
        alert(`File "${file.name}" melebihi ukuran maksimal 10MB`);
        continue;
      }

      if (!allowedTypes.includes(file.type)) {
        alert(
          `Format file "${file.name}" tidak diperbolehkan. Gunakan .JPG, .JPEG, atau .PNG`
        );
        continue;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        setPreviewDocumentation(newPreviews);
      };
      reader.readAsDataURL(file);
    }
  };
  const addAbsensiBimbingan = async (absensiData: any) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/bimbingan/absensi`,
        absensiData
      );
      return {
        success: true,
        message: response.data.message || "Absensi bimbingan berhasil!!",
        data: response.data,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Terjadi kesalahan. Silakan coba lagi.";
      throw new Error(errorMessage);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const signatureData = sigCanvas.current
      .getTrimmedCanvas()
      .toDataURL("image/png");

    try {
      const absensiBimbinganValue = {
        id: selectedBimbinganId,
        dokumentasi_kehadiran: previewDocumentation[0],
        ttd_kehadiran:
          signatureData ===
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC"
            ? undefined
            : signatureData,
      };
      const result = await addAbsensiBimbingan(absensiBimbinganValue);
      toast.success(
        <div className="flex items-center">
          <span>{result.message || "Absensi bimbingan berhasil!"}</span>
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
      getDataBimbinganByIDMahasiswa();
      closeModal();
    } catch (error) {
      toast.error(
        <div className="flex items-center">
          <span>
            {error.message || "Absensi bimbingan gagal. Silahkan coba lagi!"}
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

  const openImageInNewTab = (base64: string) => {
    // Membuat Blob dari base64
    const byteString = atob(base64.split(",")[1]); // Mengambil bagian base64
    const mimeString = base64.split(",")[0].split(":")[1].split(";")[0]; // Mengambil MIME type
    const ab = new Uint8Array(byteString.length);

    for (let i = 0; i < byteString.length; i++) {
      ab[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ab], { type: mimeString });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank"); // Membuka URL di tab baru
  };

  const clearSignature = () => {
    sigCanvas.current.clear();
  };

  const resetImage = () => {
    setPreviewDocumentation([]);
    setDocumentation(null);
    setInputKey(Date.now());
  };

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
        (data: any) => data.nim === dataUser.nim
      );

      if (!mahasiswa) {
        console.error("Mahasiswa tidak ditemukan");
        return;
      }

      setDataMahasiswa(mahasiswa);

      if (mahasiswa.dosen_pa_id !== null) {
        const dosenpa = dataDosenPA.data.find(
          (data: any) => data.id === mahasiswa.dosen_pa_id
        );

        if (!dosenpa) {
          console.error("Dosen PA tidak ditemukan");
          return;
        }

        setUserProfile({
          nama: mahasiswa.nama,
          email: mahasiswa.email,
          nim: mahasiswa.nim,
          hp: mahasiswa.hp,
          jurusan: mahasiswa.jurusan,
          peminatan: mahasiswa.peminatan,
          dosen_pa: dosenpa.nama,
        });

        setNamaLengkapMahasiswa(mahasiswa.nama);
        setEmailMahasiswa(mahasiswa.email);
        setNim(mahasiswa.nim);
        setNoTelpMahasiswa(mahasiswa.hp);
        setSelectedJurusan(mahasiswa.jurusan);
        setSelectedPeminatan(
          mahasiswa.peminatan === null ? "" : mahasiswa.peminatan
        );

        setSelectedDosenPA(dosenpa.nama);
        return;
      }

      setUserProfile({
        nama: mahasiswa.nama,
        email: mahasiswa.email,
        nim: mahasiswa.nim,
        hp: mahasiswa.hp,
        jurusan: mahasiswa.jurusan,
        peminatan: mahasiswa.peminatan,
        dosen_pa: null,
      });

      setNamaLengkapMahasiswa(mahasiswa.nama);
      setEmailMahasiswa(mahasiswa.email);
      setNim(mahasiswa.nim);
      setNoTelpMahasiswa(mahasiswa.hp);
      setSelectedJurusan(mahasiswa.jurusan);
      setSelectedPeminatan(
        mahasiswa.peminatan === null ? "" : mahasiswa.peminatan
      );
      setSelectedDosenPA(
        mahasiswa.dosen_pa_id === null ? "" : mahasiswa.dosen_pa_id
      );
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataJadwalDosenPaByDosenPa = async () => {
    try {
      const dataDosenPa = await axios.get(`${API_BASE_URL}/api/datadosenpa`);

      if (userProfile.dosen_pa !== null) {
        const dosenPa = dataDosenPa.data.find(
          (data: any) => data.nama === userProfile.dosen_pa
        );

        const dosenpaid = dosenPa.id;

        if (!dosenPa) {
          throw new Error("Dosen PA tidak ditemukan");
        }

        const response = await axios.get(
          `${API_BASE_URL}/api/datajadwaldosenpa/${dosenpaid}`
        );

        if (response.status !== 200) {
          throw new Error("Gagal mengambil data");
        }

        const data = await response.data;
        setDataJadwalDosenPA(data);
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataJurusan = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/datajurusan`);

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      setDataJurusan(data);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };
  const getDataPeminatanByJurusan = async (selectedJurusan: string) => {
    try {
      const dataJurusan = await axios.post(`${API_BASE_URL}/api/datajurusan`);

      const jurusan = dataJurusan.data.find(
        (data: any) => data.nama_program_studi === selectedJurusan
      );

      if (!jurusan) {
        throw new Error("Jurusan tidak ditemukan");
      }

      const jurusanid = jurusan.id_program_studi;

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

      const dataMahasiswa = await axios.get(
        `${API_BASE_URL}/api/datamahasiswa`
      );

      const mahasiswa = dataMahasiswa.data.find(
        (data) => data.nim === dataUser.nim
      );

      const pengajuanBimbingan = dataPengajuanBimbingan.data.filter(
        (data: any) => data.mahasiswa_id === mahasiswa.id
      );

      setDataPengajuanBimbingan(pengajuanBimbingan);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataBimbinganByIDMahasiswa = async () => {
    try {
      const dataBimbingan = await axios.get(`${API_BASE_URL}/api/bimbingan`);

      const dataMahasiswa = await axios.get(
        `${API_BASE_URL}/api/datamahasiswa`
      );

      const mahasiswa = dataMahasiswa.data.find(
        (data) => (data.nim = dataUser.nim)
      );

      const bimbingan = dataBimbingan.data
        .filter(
          (data: any) => data.pengajuan_bimbingan.mahasiswa_id === mahasiswa.id
        )
        .filter((data) => data.pengajuan_bimbingan.status === "Diterima");

      setDataBimbingan(bimbingan);
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
      return response.data;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  };

  const handleEditMahasiswa = async (id: string) => {
    try {
      let mahasiswaValue = {
        nama: namaLengkapMahasiswa,
        email: emailMahasiswa,
        nim: nim,
        hp: noTelpMahasiswa,
        jurusan: selectedJurusan,
        peminatan: selectedPeminatan,
        dosen_pa_id:
          dataDosenPA.find((data) => data.nama === selectedDosenPA)?.id || null,
        profile_image: !imagePreview ? null : imagePreview,
      };

      const result = await patchMahasiswa(mahasiswaValue);
      getDataMahasiswaById();
      setImagePreview(null);
    } catch (error) {
      console.error("Failed to save the updated order.");
    }
  };

  useEffect(() => {
    if (dataJurusan.length > 0) {
      const formattedOptions = dataJurusan.map((data) => {
        return {
          value: data.nama_program_studi,
          label: data.nama_program_studi,
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
          value: data.nama,
          label: data.nama,
        };
      });

      setOptionsDosenPA(formattedOptions);
    }
  }, [dataDosenPA]);

  useEffect(() => {
    if (selectedJurusan !== "") {
      if (selectedJurusan === userProfile.jurusan) {
        setSelectedPeminatan(
          userProfile.peminatan === null ? "" : userProfile.peminatan
        );
      }
      if (selectedJurusan !== userProfile.jurusan) {
        setSelectedPeminatan("");
      }
      getDataPeminatanByJurusan(selectedJurusan);
    }
  }, [selectedJurusan]);

  useEffect(() => {
    if (dataUser && dataUser.nim) {
      getDataMahasiswaById();
      getDataPengajuanBimbinganByIDMahasiswa();
      getDataBimbinganByIDMahasiswa();
    }
  }, [dataUser]);

  useEffect(() => {
    if (userProfile && userProfile.nama !== "") {
      getDataJadwalDosenPaByDosenPa();
    }
  }, [userProfile]);

  useEffect(() => {
    if (userProfile && userProfile.nama !== "") {
      const isDataChanged =
        userProfile.nama !== namaLengkapMahasiswa ||
        userProfile.email !== emailMahasiswa ||
        userProfile.nim !== nim ||
        userProfile.hp !== noTelpMahasiswa ||
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
                disabled
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
                disabled
                type="text"
                placeholder={emailMahasiswa === "" ? "Email" : emailMahasiswa}
                onChange={(e) => {
                  setEmailMahasiswa(e.target.value);
                }}
                value={emailMahasiswa}
                className="px-3 py-2 text-[15px] border rounded-lg"
              />
              <InputField
                disabled
                type="text"
                placeholder={nim === "" ? "NIM" : nim}
                onChange={(e) => {
                  setNim(e.target.value);
                }}
                value={nim}
                className="px-3 py-2 text-[15px] border rounded-lg"
              />
              <InputField
                disabled
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
                disabled
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
                  handleEditMahasiswa(dataUser.nim);
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
      {selectedSubMenuDashboard === "Absensi Bimbingan" && (
        <div className="w-[75%] pl-[30px] pr-[128px] mb-[200px] py-[30px]">
          <div className=" flex flex-col gap-6 border px-[30px] pt-[15px] pb-[30px] rounded-lg">
            <h1 className="font-semibold text-[24px]">
              Absensi Bimbingan Akademik
            </h1>

            <div className="flex flex-col gap-4">
              {dataBimbingan
                .slice()
                .reverse()
                .map((data: any) => (
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
                      <p>{data.pengajuan_bimbingan.jenis_bimbingan}</p>
                      <p>{data.pengajuan_bimbingan.topik_bimbingan}</p>
                      <p className="font-medium">
                        {data.pengajuan_bimbingan.sistem_bimbingan}
                      </p>
                    </div>
                    <div>
                      <p className="text-[14px]">
                        {data.pengajuan_bimbingan.keterangan}
                      </p>
                    </div>
                    {data.laporan_bimbingan_id === null &&
                    data.status_kehadiran_mahasiswa === null ? (
                      <div className="flex justify-end">
                        <button
                          onClick={() => openModal(data.id)}
                          className="bg-orange-400 text-[14px] hover:bg-orange-500 justify-end rounded-lg p-2 text-white"
                        >
                          Isi Absensi
                        </button>
                        <Transition appear show={isOpen} as={Fragment}>
                          <Dialog
                            as="div"
                            className="relative z-[1000]"
                            onClose={closeModal}
                          >
                            <TransitionChild
                              as={Fragment}
                              enter="ease-out duration-300"
                              enterFrom="opacity-0"
                              enterTo="opacity-100"
                              leave="ease-in duration-200"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <div className="fixed inset-0 bg-black bg-opacity-5" />
                            </TransitionChild>

                            <div className="fixed inset-0 overflow-y-auto">
                              <div className="flex min-h-full items-center justify-center p-4 text-center">
                                <TransitionChild
                                  as={Fragment}
                                  enter="ease-out duration-300"
                                  enterFrom="opacity-0 scale-95"
                                  enterTo="opacity-100 scale-100"
                                  leave="ease-in duration-200"
                                  leaveFrom="opacity-100 scale-100"
                                  leaveTo="opacity-0 scale-95"
                                >
                                  <DialogPanel className="w-full scrollbar scrollbar-thumb-corner-900 max-w-md max-h-[500px] overflow-y-auto transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle transition-all">
                                    <DialogTitle
                                      as="h3"
                                      className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                      Isi Absensi
                                    </DialogTitle>
                                    <div className="mt-2">
                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tanda Tangan:
                                      </label>
                                      <SignatureCanvas
                                        ref={sigCanvas}
                                        penColor="black"
                                        canvasProps={{
                                          className:
                                            "border border-gray-300 rounded w-full h-[200px] hover:cursor-pointer",
                                        }}
                                      />
                                      <button
                                        className="mt-2 text-sm text-blue-500 hover:underline"
                                        onClick={clearSignature}
                                      >
                                        Clear
                                      </button>
                                    </div>
                                    <div className="mt-4">
                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Dokumentasi:
                                      </label>
                                      {previewDocumentation.length > 0 && (
                                        <div className="mt-4">
                                          {previewDocumentation.map(
                                            (preview, index) => (
                                              <div
                                                key={index}
                                                className="relative mb-2"
                                              >
                                                <img
                                                  src={preview}
                                                  alt={`Preview ${index}`}
                                                  className="w-full h-auto rounded border border-gray-300"
                                                />
                                                <div className="absolute top-2 right-2 flex space-x-2">
                                                  <button
                                                    onClick={resetImage}
                                                    className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                    title="Hapus Gambar"
                                                  >
                                                    <TrashIcon className="h-5 w-5" />
                                                  </button>
                                                  <button
                                                    onClick={() =>
                                                      openImageInNewTab(preview)
                                                    } // Menggunakan fungsi baru
                                                    className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                                                    title="Lihat Gambar"
                                                  >
                                                    <EyeIcon className="h-5 w-5" />
                                                  </button>
                                                </div>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      )}
                                      <input
                                        key={inputKey}
                                        type="file"
                                        onChange={handleImageUpload}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:cursor-pointer hover:file:bg-blue-100"
                                      />
                                    </div>

                                    <div className="mt-4 flex justify-end space-x-2">
                                      <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                                        onClick={closeModal}
                                      >
                                        Close
                                      </button>
                                      <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                        onClick={(e) => handleSubmit(e)}
                                      >
                                        Submit
                                      </button>
                                    </div>
                                  </DialogPanel>
                                </TransitionChild>
                              </div>
                            </div>
                          </Dialog>
                        </Transition>
                      </div>
                    ) : (
                      <div className="flex justify-end">
                        <div className="bg-green-400 text-[14px] justify-end rounded-lg p-2 text-white">
                          Sudah Absen
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
          <ToastContainer />
        </div>
      )}
      {selectedSubMenuDashboard === "Riwayat Pengajuan Bimbingan" && (
        <div className="w-[75%] pl-[30px] pr-[128px] mb-[200px] py-[30px]">
          <div className=" flex flex-col gap-6 border px-[30px] pt-[15px] pb-[30px] rounded-lg">
            <h1 className="font-semibold text-[24px]">
              Riwayat Pengajuan Bimbingan Akademik
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
