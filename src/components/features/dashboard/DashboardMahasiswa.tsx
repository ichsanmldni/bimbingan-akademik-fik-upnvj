"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import upIcon from "../../../assets/images/upIcon.png";
import downIcon from "../../../assets/images/downIcon.png";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectField";
import ProfileImage from "@/components/ui/ProfileImage";
import { TrashIcon, EyeIcon } from "@heroicons/react/outline";
import { useRouter } from "next/navigation";
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
import { Span } from "slate";
import AlumniRestrictionModal from "@/components/ui/AlumniRestrictionModal";
import Spinner from "@/components/ui/Spinner";
import DosenPASetRestrictionModal from "@/components/ui/DosenPASetRestrictionModal";

const schedule = {
  Senin: [],
  Selasa: [],
  Rabu: [],
  Kamis: [],
  Jumat: [],
};

const selectIsLoadingGlobal = ({ userProfile }) => {
  // Fungsi cek apakah data kosong (array kosong, object kosong, null, undefined)
  const isEmpty = (data) =>
    data === null ||
    data === undefined ||
    (Array.isArray(data) && data.length === 0) ||
    (typeof data === "object" &&
      !Array.isArray(data) &&
      Object.keys(data).length === 0);

  if (isEmpty(userProfile)) {
    return true;
  }

  return false; // semua data sudah ada
};

const DashboardMahasiswa = ({ selectedSubMenuDashboard, dataUser }) => {
  const [namaLengkapMahasiswa, setNamaLengkapMahasiswa] = useState<string>("");
  const [emailMahasiswa, setEmailMahasiswa] = useState<string>("");
  const [nim, setNim] = useState<string>("");
  const [noTelpMahasiswa, setNoTelpMahasiswa] = useState<string>("");
  const [selectedJurusan, setSelectedJurusan] = useState<string>("");
  const [selectedPeminatan, setSelectedPeminatan] = useState<string>("");
  const [selectedDosenPA, setSelectedDosenPA] = useState<string>("");
  const [dataJurusan, setDataJurusan] = useState([]);
  const [dataPeminatan, setDataPeminatan] = useState([]);
  const [dataDosenPA, setDataDosenPA] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenModalAlumni, setIsOpenModalAlumni] = useState(true);
  const [isOpenModalDosenNull, setIsOpenModalDosenNull] = useState(true);
  const [documentation, setDocumentation] = useState(null);
  const [optionsJurusan, setOptionsJurusan] = useState([]);
  const [optionsPeminatan, setOptionsPeminatan] = useState([]);
  const [optionsDosenPA, setOptionsDosenPA] = useState([]);
  const [dataPengajuanBimbingan, setDataPengajuanBimbingan] = useState([]);
  const [dataBimbingan, setDataBimbingan] = useState<any>([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [dataMahasiswa, setDataMahasiswa] = useState<any>();
  const [userProfile, setUserProfile] = useState(null);
  const [isDataChanged, setIsDataChanged] = useState<boolean>(false);
  const [dataJadwalDosenPA, setDataJadwalDosenPA] = useState<any[]>([]); // Adjust type as needed
  const [previewDocumentation, setPreviewDocumentation] = useState([]);
  const [selectedBimbinganId, setSelectedBimbinganId] = useState();
  const [permasalahan, setPermasalahan] = useState("");
  const [solusi, setSolusi] = useState("");
  const [selectedTopikBimbingan, setSelectedTopikBimbingan] = useState();
  const [inputKey, setInputKey] = useState(Date.now());
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

  const sigCanvas: any = useRef();

  const openModal = (id) => {
    setSigKey((prev) => prev + 1);
    setIsOpen(true);
    setSelectedBimbinganId(id);
  };

  useEffect(() => {
    if (selectedBimbinganId) {
      const selectedDataBimbingan = dataBimbingan.filter(
        (data) => data.id === selectedBimbinganId
      );

      setSelectedTopikBimbingan(
        selectedDataBimbingan[0].pengajuan_bimbingan.topik_bimbingan
      );
    }
  }, [selectedBimbinganId]);

  const closeModal = () => {
    setSelectedBimbinganId(null);
    setSigKey((prev) => prev + 1);
    setIsOpen(false);
    setSelectedTopikBimbingan(null);
    setDocumentation(null);
    setSolusi("");
    setPermasalahan("");
    setPreviewDocumentation([]);
  };

  const handleImageUpload = (e) => {
    const files: any = Array.from(e.target.files || []);
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
        solusi: solusi ? solusi : null,
        permasalahan: permasalahan ? permasalahan : null,
        ipk: userProfile.ipk,
      };
      const result = await addAbsensiBimbingan(absensiBimbinganValue);

      // const notificationResponse = await axios.post("/api/sendmessage", {
      //   to: "085810676264",
      //   body: `Yth Dosen Pembimbing Akademik. ${dataDosenPA[0].nama},\nAda absensi bimbingan baru dari mahasiswa perwalian Anda. Mohon untuk mengecek detail absensi melalui tautan berikut:\nhttps://bimbingan-konseling-fikupnvj.vercel.app/\nTerima kasih atas kerja samanya.`,
      // });

      // if (!notificationResponse.data.success) {
      //   throw new Error("Gagal mengirim notifikasi");
      // }

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

  const [isModalRescheduleOpen, setIsModalRescheduleOpen] = useState(false);
  const [statusSelectedReschedule, setStatusSelectedReschedule] = useState("");
  const [selectedRescheduleData, setSelectedRescheduleData] = useState(null);
  const [ipk, setIpk] = useState("");
  const [sigKey, setSigKey] = useState(0);

  const handleRescheduleOpenModal = (data, status_reschedule) => {
    setSelectedRescheduleData(data);
    setStatusSelectedReschedule(status_reschedule);
    setIsModalRescheduleOpen(true);
  };

  const handleRescheduleCloseModal = () => {
    setIsModalRescheduleOpen(false);
    setStatusSelectedReschedule("");
    setSelectedRescheduleData(null);
  };

  const patchPengajuanBimbingan = async (updatedData: any) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/pengajuanbimbingan`,
        updatedData
      );
      return {
        success: true,
        message:
          response.data.message || "Konfirmasi reschedule bimbingan berhasil!",
        data: response.data,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Terjadi kesalahan. Silakan coba lagi.";
      throw new Error(errorMessage);
    }
  };

  const addBimbingan = async (idPengajuan: number, permasalahan) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/bimbingan`, {
        pengajuan_bimbingan_id: idPengajuan,
        permasalahan,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleEditRescheduleKehadiranBimbingan = async (
    id: number,
    status_reschedule: string,
    status: string,
    keterangan_reschedule: string,
    jadwal_bimbingan_reschedule: string,
    mahasiswa_id: number,
    permasalahan: string
  ) => {
    try {
      let reschedulePengajuanBimbinganValue = {
        id,
        status_reschedule,
        status,
        keterangan_reschedule,
        jadwal_bimbingan_reschedule,
        mahasiswa_id,
      };

      const result = await patchPengajuanBimbingan(
        reschedulePengajuanBimbinganValue
      );

      if (status_reschedule === "Bisa") {
        await addBimbingan(id, permasalahan);
      }
      toast.success(
        <div className="flex items-center">
          <span>
            {result.message || "Konfirmasi reschedule bimbingan berhasil!"}
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

      getDataPengajuanBimbinganByIDMahasiswa();
    } catch (error) {
      toast.error(
        <div className="flex items-center">
          <span>
            {error.message ||
              "Konfirmasi kehadiran pada reschedule bimbingan gagal. Silahkan coba lagi!"}
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
        return;
      }

      setDataMahasiswa(mahasiswa);

      if (mahasiswa.dosen_pa_id !== null) {
        const dosenpa = dataDosenPA.data.find(
          (data: any) => data.id === mahasiswa.dosen_pa_id
        );

        if (!dosenpa) {
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
          ipk: mahasiswa.ipk,
        });

        setNamaLengkapMahasiswa(mahasiswa.nama);
        setEmailMahasiswa(mahasiswa.email);
        setNim(mahasiswa.nim);
        setNoTelpMahasiswa(mahasiswa.hp);
        setSelectedJurusan(mahasiswa.jurusan);
        setIpk(mahasiswa.ipk);
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
        ipk: mahasiswa.ipk,
      });

      setNamaLengkapMahasiswa(mahasiswa.nama);
      setEmailMahasiswa(mahasiswa.email);
      setNim(mahasiswa.nim);
      setNoTelpMahasiswa(mahasiswa.hp);
      setSelectedJurusan(mahasiswa.jurusan);
      setSelectedPeminatan(
        mahasiswa.peminatan === null ? "" : mahasiswa.peminatan
      );
      setIpk(mahasiswa.ipk);
      setSelectedDosenPA(
        mahasiswa.dosen_pa_id === null ? "" : mahasiswa.dosen_pa_id
      );
    } catch (error) {
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
      throw error;
    }
  };

  const getDataBimbinganByIDMahasiswa = async () => {
    try {
      const dataBimbingan = await axios.get(`${API_BASE_URL}/api/bimbingan`);

      const bimbingan = dataBimbingan.data
        .filter((data: any) => data.pengajuan_bimbingan.nim === dataUser.nim)
        .filter(
          (data) =>
            data.pengajuan_bimbingan.status === "Diterima" ||
            (data.pengajuan_bimbingan.status === "Reschedule" &&
              data.pengajuan_bimbingan.status_reschedule === "Bisa")
        );

      setDataBimbingan(bimbingan);
    } catch (error) {
      throw error;
    }
  };

  const patchMahasiswa = async (updatedData: any) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/datamahasiswa`,
        updatedData
      );
      return {
        success: true,
        message: response.data.message || "Edit Profile berhasil!",

        data: response.data,
      };
    } catch (error) {
      const errorMessage =
        (error as any).response?.data?.message ||
        "Terjadi kesalahan. Silakan coba lagi.";
      throw new Error(errorMessage);
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
          dataDosenPA.find((data: any) => data.nama === selectedDosenPA)?.id ||
          null,
        profile_image: !imagePreview ? null : imagePreview,
        ipk,
      };

      const result = await patchMahasiswa(mahasiswaValue);
      toast.success(
        <div className="flex items-center">
          <span>{result.message || "Profile berhasil diubah!"}</span>
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
      getDataMahasiswaById();
      setImagePreview(null);
    } catch (error) {
      toast.error(
        <div className="flex items-center">
          <span>
            {(error as any).message ||
              "Edit profile gagal. Silahkan coba lagi!"}
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
        userProfile.peminatan !== selectedPeminatan ||
        userProfile.ipk !== ipk;
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
    ipk,
  ]);

  useEffect(() => {
    getDataJurusan();
    getDataDosenPA();
  }, []);

  useEffect(() => {
    setImagePreview(null);
    getDataMahasiswaById();
    if (selectedSubMenuDashboard === "Profile Mahasiswa") {
      setIsOpenModalDosenNull(true);
    }
  }, [selectedSubMenuDashboard]);

  useEffect(() => {
    if (isOpen && sigCanvas.current) {
      try {
        // Force reset ukuran canvas agar pointer event aktif lagi
        const canvas = sigCanvas.current.getCanvas();
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      } catch (err) {
        console.warn("Gagal reset canvas:", err);
      }
    }
  }, [isOpen]);

  const closeModalAlumni = () => {
    setIsOpenModalAlumni(false);
    const targetUrl = `/dashboard?submenu=${encodeURIComponent("Profile Mahasiswa")}`;
    router.push(targetUrl);
  };
  const closeModalDosenNull = () => {
    setIsOpenModalDosenNull(false);
    const targetUrl = `/dashboard?submenu=${encodeURIComponent("Profile Mahasiswa")}`;
    router.push(targetUrl);
  };

  const isLoading = selectIsLoadingGlobal({
    userProfile,
  });

  return (
    <>
      {isLoading && <Spinner />}
      {selectedSubMenuDashboard === "Profile Mahasiswa" && (
        <div className="md:w-[75%] md:px-0 md:mb-[200px] md:py-0">
          {/* flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-440px)] px-5 md:pr-4 md:pl-0 py-4 md:pt-0 md:pb-0 md:mt-8 rounded-lg */}
          <div className="flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-120px)] mt-4 mb-20 md:mb-0 md:mt-0 mx-4 md:mx-0 px-[30px] md:px-[70px] py-[30px] rounded-lg">
            <div className="flex gap-10">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="size-[100px] md:size-[200px] rounded-full object-cover"
                />
              ) : dataMahasiswa && dataMahasiswa.profile_image ? (
                <img
                  src={dataMahasiswa.profile_image}
                  alt="Profile"
                  className="size-[100px] md:size-[200px] rounded-full object-cover"
                />
              ) : (
                <ProfileImage
                  onClick={() => {}}
                  className="size-[100px] md:size-[200px] rounded-full"
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
                  className="bg-orange-500 hover:bg-orange-600 md:w-[30%] px-4 py-2 text-white rounded-md text-center cursor-pointer"
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
              <SelectField
                options={optionsDosenPA}
                onChange={(e) => setSelectedDosenPA(e.target.value)}
                value={selectedDosenPA}
                placeholder="Pilih Dosen PA"
                disabled={dataUser.status_lulus}
                className={`px-3 py-2 text-[15px] border cursor-pointer outline-none rounded-lg appearance-none w-full`}
              />
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
              <InputField
                disabled
                type="text"
                placeholder={
                  selectedJurusan === "" ? "Jurusan" : selectedJurusan
                }
                onChange={(e) => setSelectedJurusan(e.target.value)}
                value={selectedJurusan}
                className="px-3 py-2 text-[15px] border rounded-lg"
              />
              <InputField
                type="text"
                placeholder={!ipk ? "IPK (contoh: 3.50)" : ipk}
                onChange={(e) => {
                  setIpk(e.target.value);
                }}
                value={ipk}
                disabled={dataUser.status_lulus}
                className="px-3 py-2 text-[15px] outline-none border rounded-lg"
              />
              <SelectField
                options={optionsPeminatan}
                onChange={(e) => setSelectedPeminatan(e.target.value)}
                value={selectedPeminatan}
                placeholder="Pilih Peminatan"
                disabled={dataUser.status_lulus}
                className={`px-3 py-2 text-[15px] outline-none cursor-pointer border rounded-lg appearance-none w-full`}
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleEditMahasiswa(dataUser.nim);
                }}
                className={`text-white bg-orange-500 hover:bg-orange-600 text-[14px] py-2 font-medium rounded-lg  ${
                  !isDataChanged && !imagePreview ? "hidden" : ""
                }`}
              >
                Simpan
              </button>
            </form>
          </div>
          <ToastContainer />
        </div>
      )}
      {selectedSubMenuDashboard === "Jadwal Kosong Dosen PA Role Mahasiswa" && (
        <>
          {dataUser?.status_lulus === false &&
          dataUser?.dosen_pa_id !== null ? (
            <div className="md:w-[75%] md:px-0 px-4 mb-[200px] py-4 md:py-0">
              <div className=" flex flex-col gap-6 md:pt-6 px-[25px] pt-[15px] pb-[30px] md:px-[30px] rounded-lg">
                <h1 className="font-semibold text-[20px]">
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
                          <div className="px-2 py-4 md:px-4 md:pt-6 md:pb-2">
                            {filteredJadwal.length > 0 ? (
                              <div className="grid grid-cols-3 gap-4">
                                {filteredJadwal
                                  .filter((data) => data.hari === day)
                                  .sort((a, b) => {
                                    // Mengonversi jam_mulai ke format yang bisa dibandingkan
                                    const jamMulaiA = a.jam_mulai
                                      .split(":")
                                      .map(Number);
                                    const jamMulaiB = b.jam_mulai
                                      .split(":")
                                      .map(Number);

                                    // Menghitung total menit untuk perbandingan
                                    const totalMenitA =
                                      jamMulaiA[0] * 60 + jamMulaiA[1];
                                    const totalMenitB =
                                      jamMulaiB[0] * 60 + jamMulaiB[1];

                                    return totalMenitA - totalMenitB; // Mengurutkan dari yang terkecil
                                  })
                                  .map((data, index) => (
                                    <div
                                      key={index}
                                      className="flex flex-col items-center justify-center bg-white shadow rounded p-2"
                                    >
                                      <span className="text-[14px] font-medium">
                                        {`${data.jam_mulai} - ${data.jam_selesai}`}
                                      </span>
                                    </div>
                                  ))}
                              </div>
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
          ) : dataUser?.dosen_pa_id === null ? (
            <DosenPASetRestrictionModal
              onClose={closeModalDosenNull}
              isOpen={isOpenModalDosenNull}
            />
          ) : dataUser?.status_lulus === true ? (
            <AlumniRestrictionModal
              onClose={closeModalAlumni}
              isOpen={isOpenModalAlumni}
            />
          ) : (
            ""
          )}
        </>
      )}
      {selectedSubMenuDashboard === "Absensi Bimbingan" && (
        <>
          {dataUser.status_lulus === false ? (
            <div className="md:w-[75%] px-4 md:px-0 mb-[60px] md:mb-[200px] py-[30px] md:py-0">
              <div className=" flex flex-col gap-4 px-5 md:px-[30px] pt-4 md:pt-0 pb-[30px] rounded-lg">
                <h1 className="font-semibold text-[20px] mt-6">
                  Absensi Bimbingan Akademik
                </h1>
                <div className="flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-168px)] px-5 md:pr-4 md:pl-0 py-4 md:pt-0 md:pb-6 rounded-lg">
                  {dataBimbingan.length > 0 ? (
                    dataBimbingan
                      .slice()
                      .reverse()
                      .map((data: any) => (
                        <div
                          key={data.id}
                          className="flex flex-col border rounded-lg p-6 gap-4 shadow-md"
                        >
                          {data.pengajuan_bimbingan.status === "Reschedule" && (
                            <div className="flex justify-between text-sm font-semibold text-neutral-600">
                              <div className="flex gap-2">
                                <p>
                                  {getDate(
                                    data.pengajuan_bimbingan.jadwal_bimbingan
                                  )}
                                </p>
                                <p>
                                  {getTime(
                                    data.pengajuan_bimbingan.jadwal_bimbingan
                                  )}
                                </p>
                              </div>
                              <p>
                                {data.pengajuan_bimbingan.tahun_ajaran} (
                                {data.pengajuan_bimbingan.semester})
                              </p>
                            </div>
                          )}
                          {data.pengajuan_bimbingan.status === "Diterima" && (
                            <div className="flex justify-between text-sm font-semibold text-neutral-600">
                              <div className="flex gap-2">
                                <p>
                                  {getDate(
                                    data.pengajuan_bimbingan.jadwal_bimbingan
                                  )}
                                </p>
                                <p>
                                  {getTime(
                                    data.pengajuan_bimbingan.jadwal_bimbingan
                                  )}
                                </p>
                              </div>
                              <p>
                                {data.pengajuan_bimbingan.tahun_ajaran} (
                                {data.pengajuan_bimbingan.semester})
                              </p>
                            </div>
                          )}
                          <div className="text-sm font-medium">
                            <p>{data.pengajuan_bimbingan.nama_lengkap}</p>
                            <p>
                              {data.pengajuan_bimbingan.jenis_bimbingan}
                              {data.pengajuan_bimbingan.topik_bimbingan
                                ? `(${data.pengajuan_bimbingan.topik_bimbingan})`
                                : ""}
                            </p>
                            <p className="font-medium">
                              {data.pengajuan_bimbingan.sistem_bimbingan}
                            </p>
                          </div>
                          {data.permasalahan && (
                            <div className="flex flex-col gap-2">
                              <p className="text-[14px] font-medium">
                                Permasalahan{" "}
                                {data.pengajuan_bimbingan.jenis_bimbingan ===
                                "Pribadi" ? (
                                  <span>
                                    {" "}
                                    (Topik bimbingan :{" "}
                                    {data.pengajuan_bimbingan.topik_bimbingan} )
                                  </span>
                                ) : (
                                  ""
                                )}
                              </p>
                              <textarea
                                value={data.permasalahan}
                                disabled
                                className="border rounded-lg text-sm p-2"
                              ></textarea>
                            </div>
                          )}

                          {data.laporan_bimbingan_id === null &&
                          data.status_kehadiran_mahasiswa === null ? (
                            <div className="flex justify-end">
                              <button
                                onClick={() => openModal(data.id)}
                                className="bg-orange-400 text-[14px] hover:bg-orange-500 justify-end rounded-lg p-2 text-white"
                              >
                                Isi Absensi
                              </button>
                              {data.id === selectedBimbinganId &&
                              data.pengajuan_bimbingan.jenis_bimbingan.startsWith(
                                "Perwalian"
                              ) &&
                              isOpen ? (
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
                                      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
                                    </TransitionChild>

                                    <div className="fixed inset-0 overflow-clip">
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
                                          <DialogPanel className="w-full max-w-md max-h-[500px] overflow-hidden rounded-2xl bg-white text-left align-middle transition-all">
                                            <DialogTitle
                                              as="h3"
                                              className="text-lg font-medium leading-6 text-gray-900 px-6 pt-6"
                                            >
                                              Isi Absensi
                                            </DialogTitle>
                                            <div className=" pl-6 px-3">
                                              <div className="max-h-[346px] overflow-y-auto pr-3">
                                                {data.permasalahan && (
                                                  <div>
                                                    <p className="text-sm font-medium text-gray-700 mt-2">
                                                      Permasalahan
                                                    </p>
                                                    <textarea
                                                      placeholder={
                                                        data.permasalahan === ""
                                                          ? "Permasalahan"
                                                          : data.permasalahan
                                                      }
                                                      value={data.permasalahan}
                                                      disabled
                                                      className="border mt-2 focus:outline-none text-sm rounded-lg px-3 py-2 w-full h-24" // Anda bisa menyesuaikan lebar dan tinggi sesuai kebutuhan
                                                    />
                                                    <p className="text-sm font-medium text-gray-700 mt-2">
                                                      Solusi
                                                    </p>
                                                    <textarea
                                                      placeholder={
                                                        solusi === ""
                                                          ? "Masukkan solusi yang diberikan selama bimbingan"
                                                          : solusi
                                                      }
                                                      onChange={(e) => {
                                                        setSolusi(
                                                          e.target.value
                                                        );
                                                      }}
                                                      value={solusi}
                                                      className="border mt-2 focus:outline-none text-sm rounded-lg px-3 py-2 w-full h-24" // Anda bisa menyesuaikan lebar dan tinggi sesuai kebutuhan
                                                    />
                                                  </div>
                                                )}
                                                <div className="mt-2">
                                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Tanda Tangan:
                                                  </label>
                                                  <SignatureCanvas
                                                    key={sigKey}
                                                    ref={sigCanvas}
                                                    penColor="black"
                                                    canvasProps={{
                                                      className:
                                                        "border border-gray-300 rounded w-full h-[250px] md:h-[200px] hover:cursor-pointer",
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
                                                  {previewDocumentation.length >
                                                    0 && (
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
                                                                onClick={
                                                                  resetImage
                                                                }
                                                                className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                                title="Hapus Gambar"
                                                              >
                                                                <TrashIcon className="h-5 w-5" />
                                                              </button>
                                                              <button
                                                                onClick={() =>
                                                                  openImageInNewTab(
                                                                    preview
                                                                  )
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
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:cursor-pointer hover:file:bg-blue-100"
                                                  />
                                                </div>
                                              </div>
                                            </div>

                                            <div className="mt-4 flex justify-end space-x-2 pb-6 px-6">
                                              <button
                                                type="button"
                                                className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                                                onClick={closeModal}
                                              >
                                                Close
                                              </button>
                                              <button
                                                type="button"
                                                className="inline-flex justify-center rounded-md border border-transparent bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
                              ) : data.id === selectedBimbinganId &&
                                data.pengajuan_bimbingan.jenis_bimbingan ===
                                  "Pribadi" &&
                                isOpen ? (
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
                                      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
                                    </TransitionChild>

                                    <div className="fixed inset-0 overflow-clip">
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
                                          <DialogPanel className="w-full max-w-md max-h-[500px] overflow-hidden rounded-2xl bg-white text-left align-middle transition-all">
                                            <DialogTitle
                                              as="h3"
                                              className="text-lg font-medium leading-6 text-gray-900 px-6 py-6"
                                            >
                                              Isi Absensi
                                            </DialogTitle>
                                            <div className=" pl-6 px-3">
                                              <div className="max-h-[346px] overflow-y-auto pr-3">
                                                <div className="flex flex-col gap-2">
                                                  <p className="text-sm font-medium text-gray-700">
                                                    Permasalahan (Topik
                                                    bimbingan :{" "}
                                                    {selectedTopikBimbingan})
                                                  </p>
                                                  <textarea
                                                    placeholder={
                                                      data.permasalahan === ""
                                                        ? "Permasalahan"
                                                        : data.permasalahan
                                                    }
                                                    value={data.permasalahan}
                                                    disabled
                                                    className="border focus:outline-none text-sm rounded-lg px-3 py-2 w-full h-24" // Anda bisa menyesuaikan lebar dan tinggi sesuai kebutuhan
                                                  />
                                                  <p className="text-sm font-medium text-gray-700">
                                                    Solusi
                                                  </p>
                                                  <textarea
                                                    placeholder={
                                                      solusi === ""
                                                        ? "Masukkan solusi yang diberikan selama bimbingan"
                                                        : solusi
                                                    }
                                                    onChange={(e) => {
                                                      setSolusi(e.target.value);
                                                    }}
                                                    value={solusi}
                                                    className="border focus:outline-none text-sm rounded-lg px-3 py-2 w-full h-24" // Anda bisa menyesuaikan lebar dan tinggi sesuai kebutuhan
                                                  />
                                                </div>
                                                <div className="mt-2">
                                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Tanda Tangan:
                                                  </label>
                                                  <SignatureCanvas
                                                    key={sigKey}
                                                    ref={sigCanvas}
                                                    penColor="black"
                                                    canvasProps={{
                                                      className:
                                                        "border border-gray-300 rounded w-full h-[250px] md:h-[200px] hover:cursor-pointer",
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
                                                  {previewDocumentation.length >
                                                    0 && (
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
                                                                onClick={
                                                                  resetImage
                                                                }
                                                                className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                                title="Hapus Gambar"
                                                              >
                                                                <TrashIcon className="h-5 w-5" />
                                                              </button>
                                                              <button
                                                                onClick={() =>
                                                                  openImageInNewTab(
                                                                    preview
                                                                  )
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
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:cursor-pointer hover:file:bg-blue-100"
                                                  />
                                                </div>
                                              </div>
                                            </div>

                                            <div className="mt-4 flex justify-end space-x-2 pb-6 px-6">
                                              <button
                                                type="button"
                                                className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                                                onClick={closeModal}
                                              >
                                                Close
                                              </button>
                                              <button
                                                type="button"
                                                className="inline-flex justify-center rounded-md border border-transparent bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
                              ) : (
                                ""
                              )}
                            </div>
                          ) : (
                            <div className="flex justify-end">
                              <div className="bg-green-400 text-[14px] justify-end rounded-lg p-2 text-white">
                                Sudah Absen
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                  ) : (
                    <div className="flex flex-col items-center p-10 border rounded-lg">
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
                        Saat ini tidak ada data absensi bimbingan.
                      </p>
                      <p className="text-center text-gray-600">
                        Belum ada bimbingan yang perlu diabsen. Silakan periksa
                        kembali setelah bimbingan dilaksanakan.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <ToastContainer />
            </div>
          ) : (
            <AlumniRestrictionModal
              onClose={closeModalAlumni}
              isOpen={isOpenModalAlumni}
            />
          )}
        </>
      )}
      {selectedSubMenuDashboard === "Riwayat Pengajuan Bimbingan" && (
        <div className="flex flex-col max-h-[calc(100vh)] md:w-[75%] px-4 md:pl-[30px] gap-4 py-4 md:py-6">
          <h1 className="font-semibold text-[20px]">
            Riwayat Pengajuan Bimbingan Akademik
          </h1>
          <div className="flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-148px)] px-5 md:pr-4 md:pl-0 py-4 md:pt-0 md:pb-0 rounded-lg">
            {dataPengajuanBimbingan.length > 0 ? (
              dataPengajuanBimbingan
                .slice()
                .reverse()
                .map((data) => (
                  <div
                    key={data.id}
                    className="flex flex-col border rounded-lg p-6 gap-4 shadow-md"
                  >
                    <div>
                      <div className="flex justify-between text-sm font-semibold text-neutral-600">
                        <div className="flex gap-2">
                          <p>{getDate(data.jadwal_bimbingan)}</p>
                          <p>{getTime(data.jadwal_bimbingan)}</p>
                        </div>
                        <p>
                          {data.tahun_ajaran} ({data.semester})
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="max-w-[500px] text-sm">
                        <p className="font-medium">{data.nama_lengkap}</p>
                        <p>{data.jenis_bimbingan}</p>
                        <p className="font-medium">{data.sistem_bimbingan}</p>
                      </div>
                      <div
                        className={`${data.status === "Diterima" ? "bg-green-500" : data.status === "Reschedule" ? "bg-red-500" : data.status === "Menunggu Konfirmasi" ? "bg-gray-400" : ""} py-1 px-2 flex items-center max-h-[36px] items-center rounded-lg`}
                      >
                        <p className="text-white text-sm text-center flex">
                          {data.status}
                        </p>
                      </div>
                    </div>
                    {data.permasalahan && (
                      <div className="flex flex-col text-sm gap-2">
                        <p className="font-medium">
                          Permasalahan{" "}
                          {data.jenis_bimbingan === "Pribadi" ? (
                            <span>
                              {" "}
                              (Topik bimbingan : {data.topik_bimbingan} )
                            </span>
                          ) : (
                            ""
                          )}
                        </p>
                        <textarea
                          value={data.permasalahan}
                          disabled
                          className="border rounded-lg p-2"
                        ></textarea>
                      </div>
                    )}
                    {data.status === "Diterima" &&
                      data.jenis_bimbingan === "Pribadi" && (
                        <div className="flex flex-col gap-2 text-sm">
                          <p className="font-medium">
                            Keterangan dari Dosen PA
                          </p>
                          <textarea
                            value={data.keterangan}
                            disabled
                            className="border rounded-lg p-2"
                          ></textarea>
                        </div>
                      )}
                    {data.status === "Diterima" &&
                      data.jenis_bimbingan.startsWith("Perwalian") && (
                        <div className="flex flex-col gap-2">
                          <p className="text-[14px] font-medium">
                            Keterangan dari Dosen PA
                          </p>
                          <textarea
                            value={data.keterangan}
                            disabled
                            className="border rounded-lg text-sm p-2"
                          ></textarea>
                        </div>
                      )}
                    {data.status === "Reschedule" && (
                      <div className="p-6 flex flex-col gap-4 border rounded-lg">
                        <div className="flex flex-col gap-2">
                          <p className="text-[14px] font-semibold">
                            {`Reschedule: ${data.jadwal_bimbingan_reschedule}`}
                          </p>
                          <textarea
                            value={data.keterangan_reschedule}
                            disabled
                            className="border rounded-lg text-sm p-2"
                          ></textarea>
                        </div>
                        {data.status_reschedule === "Belum dikonfirmasi" && (
                          <div>
                            <div className="flex flex-col gap-1">
                              <p className="text-sm font-semibold">
                                Konfirmasi Reschedule Bimbingan
                              </p>
                              <p className="text-[13px] text-gray-600">
                                Apakah Anda bisa menghadiri jadwal bimbingan
                                yang baru? Silakan pilih salah satu opsi di
                                bawah ini untuk mengonfirmasi.
                              </p>
                            </div>
                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={() =>
                                  handleRescheduleOpenModal(data, "Tidak bisa")
                                }
                                className="w-1/2 bg-red-500 hover:bg-red-600 text-white cursor-pointer rounded-md py-2 font-medium text-sm transition duration-200 ease-in-out"
                                aria-label="Konfirmasi Tidak Sah"
                              >
                                Tidak bisa
                              </button>
                              <button
                                onClick={() =>
                                  handleRescheduleOpenModal(data, "Bisa")
                                }
                                className="w-1/2 bg-green-500 hover:bg-green-600 text-white cursor-pointer rounded-md py-2 font-medium text-sm transition duration-200 ease-in-out"
                                aria-label="Konfirmasi Sah"
                              >
                                Bisa
                              </button>
                            </div>
                          </div>
                        )}
                        {data.status_reschedule !== "Belum dikonfirmasi" && (
                          <div>
                            <div className="flex flex-col gap-1">
                              <p className="text-sm font-semibold">
                                Hasil Konfirmasi Reschedule Bimbingan dari
                                Mahasiswa
                              </p>
                            </div>
                            <div className="flex gap-2 mt-3">
                              {data.status_reschedule === "Bisa" && (
                                <button
                                  onClick={() =>
                                    handleRescheduleOpenModal(data, "Bisa")
                                  }
                                  className="w-full bg-green-500 text-white rounded-md py-2 font-medium text-sm transition duration-200 ease-in-out"
                                  aria-label="Konfirmasi Sah"
                                  disabled
                                >
                                  Bisa
                                </button>
                              )}
                              {data.status_reschedule === "Tidak bisa" && (
                                <button
                                  onClick={() =>
                                    handleRescheduleOpenModal(
                                      data,
                                      "Tidak bisa"
                                    )
                                  }
                                  className="w-full bg-red-500 text-white rounded-md py-2 font-medium text-sm transition duration-200 ease-in-out"
                                  aria-label="Konfirmasi Tidak Sah"
                                  disabled
                                >
                                  Tidak bisa
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
            ) : (
              <div className="flex flex-col items-center p-10 border rounded-lg">
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
                  Saat ini tidak ada data riwayat pengajuan bimbingan.
                </p>
                <p className="text-center text-gray-600">
                  Silakan ajukan bimbingan terlebih dahulu.
                </p>
              </div>
            )}
            <Transition appear show={isModalRescheduleOpen} as={Fragment}>
              <Dialog
                onClose={handleRescheduleCloseModal}
                className="fixed z-[1000] inset-0 z-10 overflow-y-auto"
              >
                <div className="flex items-center justify-center min-h-screen px-4 text-center">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="fixed inset-0 bg-black opacity-30" />
                  </Transition.Child>

                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="transform scale-95"
                    enterTo="transform scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="transform scale-100"
                    leaveTo="transform scale-95"
                  >
                    <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Konfirmasi Reschedule
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Apakah Anda yakin ingin{" "}
                          {statusSelectedReschedule === "Bisa"
                            ? "menyetujui"
                            : "menolak"}{" "}
                          reschedule ?
                        </p>
                      </div>
                      <div className="mt-6 w-1/2 ml-auto flex gap-4">
                        <button
                          onClick={() => handleRescheduleCloseModal()}
                          className="bg-red-500 w-1/2 hover:bg-red-600 text-sm text-white rounded-md px-4 py-1 ml-2"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            handleEditRescheduleKehadiranBimbingan(
                              selectedRescheduleData.id,
                              statusSelectedReschedule,
                              "Reschedule",
                              selectedRescheduleData.keterangan_reschedule,
                              selectedRescheduleData.jadwal_bimbingan_reschedule,
                              selectedRescheduleData.mahasiswa_id,
                              selectedRescheduleData.permasalahan
                            );
                            handleRescheduleCloseModal();
                          }}
                          className="w-1/2 bg-green-500 hover:bg-green-600 text-sm text-white rounded-md px-4 py-2"
                        >
                          Ya
                        </button>
                      </div>
                    </div>
                  </Transition.Child>
                </div>
              </Dialog>
            </Transition>
            <ToastContainer />
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardMahasiswa;
