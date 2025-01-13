"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import upIcon from "../../../assets/images/upIcon.png";
import upnvjLogo from "../../../assets/images/LOGO-UPNVJ.png";
import backIconOrange from "../../../assets/images/back-icon-orange.png";
import downIcon from "../../../assets/images/downIcon.png";
import addIcon from "../../../assets/images/add-button.png";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import plusIcon from "../../../assets/images/plus.png";
import deleteIcon from "../../../assets/images/trash-icon.png";
import line from "../../../assets/images/line.png";
import InputField from "@/components/ui/InputField";
import ProfileImage from "@/components/ui/ProfileImage";
import axios from "axios";
import TrashButton from "@/components/ui/TrashButton";
import { format } from "date-fns";
import { env } from "process";
import { EyeIcon } from "@heroicons/react/outline";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./fonts/times new roman bold-normal";
import "./fonts/times new roman-normal";
import { Fragment } from "react";
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

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
    nama: "",
    email: "",
    nip: "",
    hp: "",
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
  const [
    selectedDataPrestasiIlmiahMahasiswa,
    setSelectedDataPrestasiIlmiahMahasiswa,
  ] = useState([]);
  const [
    selectedDataPrestasiPorseniMahasiswa,
    setSelectedDataPrestasiPorseniMahasiswa,
  ] = useState([]);
  const [selectedDataStatusMahasiswa, setSelectedDataStatusMahasiswa] =
    useState([]);

  const [isDeleteJadwalDosenModalOpen, setIsDeleteJadwalDosenModalOpen] =
    useState(false);

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

      const dataDosenPA = await axios.get(`${API_BASE_URL}/api/datadosenpa`);

      const dosenPA = dataDosenPA.data.find(
        (data) => data.nip === dataUser.nip
      );

      const bimbinganUser = dataBimbingan.data.filter(
        (data: any) => data.pengajuan_bimbingan.dosen_pa_id === dosenPA.id
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
      return {
        success: true,
        message: response.data.message || "Jadwal kosong berhasil ditambahkan!",
        data: response.data,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Terjadi kesalahan. Silakan coba lagi.";
      throw new Error(errorMessage);
    }
  };

  const deleteJadwalDosen = async (deletedData: DataJadwalDosenPA) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/datajadwaldosenpa/${deletedData.id}`,
        { data: deletedData }
      );
      return {
        success: true,
        message: response.data.message || "Jadwal kosong berhasil dihapus!",
        data: response.data,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Terjadi kesalahan. Silakan coba lagi.";
      throw new Error(errorMessage);
    }
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
          response.data.message || "Konfirmasi pengajuan bimbingan berhasil!",
        data: response.data,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Terjadi kesalahan. Silakan coba lagi.";
      throw new Error(errorMessage);
    }
  };
  const patchPengesahanKehadiranBimbingan = async (updatedData: any) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/bimbingan/pengesahanabsensi`,
        updatedData
      );
      return {
        success: true,
        message:
          response.data.message || "Konfirmasi pengajuan bimbingan berhasil!",
        data: response.data,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Terjadi kesalahan. Silakan coba lagi.";
      throw new Error(errorMessage);
    }
  };

  const getDataDosenPAByDosenNip = async () => {
    try {
      const dataDosenPA = await axios.get(`${API_BASE_URL}/api/datadosenpa`);
      const dosen = dataDosenPA.data.find(
        (data: DataDosenPA) => data.nip === dataUser.nip
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
      const dataDosen = await axios.get(`${API_BASE_URL}/api/datadosenpa`);
      const dosen = dataDosen.data.find(
        (data: DataDosenPA) => data.nip === dataUser.nip
      );

      if (!dosen) {
        console.error("Dosen tidak ditemukan");
        return;
      }

      setUserProfile({
        nama: dosen.nama,
        email: dosen.email,
        nip: dosen.nip,
        hp: dosen.hp,
      });

      setDataDosen(dosen);
      setNamaLengkapDosen(dosen.nama);
      setEmailDosen(dosen.email);
      setNip(dosen.nip);
      setNoTelpDosen(dosen.hp);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataJadwalDosenPaByDosenPa = async () => {
    try {
      const dataDosenPa = await axios.get(`${API_BASE_URL}/api/datadosenpa`);
      const dosenPa = dataDosenPa.data.find(
        (data: any) => data.nama === userProfile.nama
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
        (data: any) => data.nama === userProfile.nama
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
        (data: any) => data.nama === userProfile.nama
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
        `${API_BASE_URL}/api/datadosenpa`,
        updatedData
      );
      console.log("Dosen PA updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
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

  const handleEditDosenPA = async () => {
    try {
      let dosenPAValue: any = {
        nama: namaLengkapDosen,
        email: emailDosen,
        nip,
        hp: noTelpDosen,
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
      toast.success(
        <div className="flex items-center">
          <span>{result.message || "Jadwal kosong berhasil ditambahkan!"}</span>
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
      getDataJadwalDosenPaByDosenPa();
      setJamMulai("");
      setJamSelesai("");
      setIsAddJadwal(false);
    } catch (error) {
      toast.error(
        <div className="flex items-center">
          <span>
            {error.message ||
              "Penambahan jadwal kosong gagal. Silahkan coba lagi!"}
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

  const handleDeleteJadwalDosen = async (id: number) => {
    try {
      let jadwalDosenValue: any = {
        id,
      };
      const result = await deleteJadwalDosen(jadwalDosenValue);
      toast.success(
        <div className="flex items-center">
          <span>{result.message || "Jadwal kosong berhasil dihapus!"}</span>
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
      getDataJadwalDosenPaByDosenPa();
      setIsDeleteJadwalDosenModalOpen(false);
    } catch (error) {
      toast.error(
        <div className="flex items-center">
          <span>
            {error.message ||
              "Penghapusan jadwal kosong gagal. Silahkan coba lagi!"}
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

  const handleEditPengajuanBimbingan = async (
    id: number,
    mahasiswa_id: number,
    statusPengajuan: string,
    permasalahan
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
      console.log(result);
      toast.success(
        <div className="flex items-center">
          <span>
            {result.message || "Pengajuan bimbingan berhasil dikonfirmasi!"}
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
      await addBimbingan(id, permasalahan);
      setKeteranganKonfirmasi((prev) => ({ ...prev, [id]: "" }));
      getDataPengajuanBimbinganByDosenPaId();
    } catch (error) {
      toast.error(
        <div className="flex items-center">
          <span>
            {error.message ||
              "Konfirmasi pengajuan bimbingan gagal. Silahkan coba lagi!"}
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
      toast.success(
        <div className="flex items-center">
          <span>
            {result.message ||
              "Pengesahan absensi bimbingan berhasil dikonfirmasi!"}
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

      getDataPengesahanBimbinganByIDDosenPA();
    } catch (error) {
      toast.error(
        <div className="flex items-center">
          <span>
            {error.message ||
              "Konfirmasi pengesahan absensi bimbingan gagal. Silahkan coba lagi!"}
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

  const handlePreviewPDF = async (
    e: React.FormEvent<HTMLFormElement>,
    data
  ) => {
    e.preventDefault();

    const doc = new jsPDF({
      orientation: "portrait", // or "landscape"
      unit: "mm", // units can be "pt", "mm", "cm", or "in"
      format: "a4", // format can be "a4", "letter", etc.
      putOnlyUsedFonts: true, // optional, to optimize font usage
    });

    doc.setFont("times new roman");

    // Title
    doc.setFontSize(11);
    const title = "LAPORAN PERWALIAN DOSEN PEMBIMBING AKADEMIK";
    const titleWidth = doc.getTextWidth(title);
    const pageWidth = doc.internal.pageSize.getWidth();
    const titleX = (pageWidth - titleWidth) / 2; // Calculate x position for center alignment
    doc.text(title, titleX, 28);
    const subtitle = "FAKULTAS ILMU KOMPUTER  UPN “VETERAN” JAKARTA";
    const subtitleWidth = doc.getTextWidth(subtitle);
    const subtitleX = (pageWidth - subtitleWidth) / 2; // Calculate x position for center alignment
    doc.text(subtitle, subtitleX, 35);
    doc.text(`Tahun Akademik    :    ${data.tahun_ajaran}`, 15, 56); // Moved up by 10y
    doc.text(`Semester                   :    ${data.semester}`, 15, 62); // Moved up by 10y
    doc.text(`Nama Dosen PA     :    ${data.nama_dosen_pa}`, 15, 68); // Moved up by 10y

    doc.text("A. PENDAHULUAN", 15, 91); // Adjusted x to 15 and y down by 20

    let yPosition = 98;
    const maxWidth = 175;

    data.pendahuluan.forEach((paragraph) => {
      // Check if the paragraph has children and extract the text
      if (paragraph.children && paragraph.children.length > 0) {
        const text = paragraph.children[0].text;

        // Split the text into lines based on maxWidth
        const lines = doc.splitTextToSize(text, maxWidth);

        // Set alignment based on paragraph properties
        const alignment = paragraph.align || "left"; // Default to left if no alignment is specified

        // Add each line to the document and adjust yPosition
        lines.forEach((line, index) => {
          // Set alignment for the line
          if (alignment === "justify") {
            const words = line.split(/(\s+)/); // Memecah teks berdasarkan spasi dan mempertahankan spasi asli
            const totalWidth = maxWidth; // Lebar area teks
            const lineWidth = doc.getTextWidth(line);

            if (index < lines.length - 1) {
              // Hanya justify jika bukan baris terakhir
              if (words.length > 1) {
                const totalSpaces = words.filter(
                  (word) => word.trim() === ""
                ).length;
                const totalExtraSpace = totalWidth - lineWidth;
                const baseSpaceWidth = Math.floor(
                  totalExtraSpace / totalSpaces
                );
                const extraSpaces = totalExtraSpace % totalSpaces;

                let justifiedLine = "";

                for (let i = 0; i < words.length; i++) {
                  justifiedLine += words[i];
                  if (i < words.length - 1 && words[i].trim() === "") {
                    // Menambahkan spasi
                    const spacesToAdd =
                      baseSpaceWidth + (i / 2 < extraSpaces ? 1 : 0);
                    justifiedLine += " ".repeat(spacesToAdd);
                  }
                }
                doc.text(justifiedLine, 20, yPosition);
              } else {
                doc.text(line, 20, yPosition); // Jika hanya satu kata, tidak perlu justify
              }
            } else {
              doc.text(line, 20, yPosition); // Baris terakhir tidak di-justify
            }
          } else if (alignment === "center") {
            doc.text(line, 110, yPosition, { align: "center" });
          } else if (alignment === "right") {
            doc.text(line, 200, yPosition, { align: "right" });
          } else {
            doc.text(line, 20, yPosition); // Default left alignment
          }
          yPosition += 6; // Adjust the spacing between lines
        });
      }
    });

    // Section Title
    doc.text("B. HASIL KONSULTASI PEMBIMBINGAN", 15, yPosition + 7); // Adjusted x to 15 and y down by 20
    doc.text("Prestasi Akademik Mahasiswa", 20, yPosition + 17); // Adjusted x to 15 and y down by 20

    // Table for IPK
    const tableData = [
      { range: "IPK > 3.5", jumlah: data.jumlah_ipk_a },
      { range: "3 > IPK >= 3.5", jumlah: data.jumlah_ipk_b },
      { range: "2.5 <= IPK < 3", jumlah: data.jumlah_ipk_c },
      { range: "2 <= IPK < 2.5", jumlah: data.jumlah_ipk_d },
      { range: "IPK < 2", jumlah: data.jumlah_ipk_e },
    ];

    doc.autoTable({
      head: [["Range IPK", "Jumlah Mahasiswa"]],
      body: tableData.map((item) => [item.range, item.jumlah]),
      startY: yPosition + 21, // Posisi tabel
      theme: "plain", // Tema polos
      headStyles: {
        fontSize: 11, // Ukuran font header
        halign: "center", // Rata tengah
        font: "times new roman", // Font header
      },
      bodyStyles: {
        fontSize: 11, // Ukuran font untuk isi
        halign: "left", // Rata kiri
        font: "times new roman", // Font header
      },
      styles: {
        cellPadding: 3, // Padding sel
        lineWidth: 0.1, // Ketebalan garis
        lineColor: [0, 0, 0], // Warna garis hitam
      },
      tableWidth: "auto", // Lebar tabel otomatis
      margin: { left: 20 },
    });

    doc.text(
      "Prestasi Ilmiah Mahasiswa",
      20,
      doc.autoTable.previous.finalY + 10 // Tambahkan margin 10
    );
    const prestasiData = selectedDataPrestasiIlmiahMahasiswa;

    doc.autoTable({
      head: [["Bidang Prestasi", "NIM", "Nama", "Tingkat Prestasi"]],
      theme: "plain", // Tema polos
      body: prestasiData.map((item) => [
        item.bidang_prestasi,
        item.nim,
        item.nama,
        item.tingkat_prestasi,
      ]),
      startY: doc.autoTable.previous.finalY + 14, // Tambahkan margin 14
      headStyles: {
        fontSize: 11, // Ukuran font header
        halign: "center", // Rata tengah
        font: "times new roman", // Font header
      },
      bodyStyles: {
        fontSize: 11, // Ukuran font untuk isi
        halign: "left", // Rata kiri
        font: "times new roman", // Font header
      },
      styles: {
        cellPadding: 3, // Padding sel
        lineWidth: 0.1, // Ketebalan garis
        lineColor: [0, 0, 0], // Warna garis hitam
      },
      tableWidth: "auto", // Lebar tabel otomatis
      margin: { left: 20 },
    });

    doc.text(
      "Prestasi Mahasiswa Mendapatkan Beasiswa",
      20,
      doc.autoTable.previous.finalY + 10 // Tambahkan margin 10
    );

    // Table for Beasiswa
    const tableBeasiswaData = [
      { beasiswa: "BBM", jumlah: data.jumlah_beasiswa_bbm },
      { beasiswa: "Pegadaian", jumlah: data.jumlah_beasiswa_pegadaian },
      {
        beasiswa: "Supersemar",
        jumlah: data.jumlah_beasiswa_supersemar,
      },
      { beasiswa: "PPA", jumlah: data.jumlah_beasiswa_ppa },
      { beasiswa: "YKL", jumlah: data.jumlah_beasiswa_ykl },
      { beasiswa: "Dan Lain-lainnya", jumlah: data.jumlah_beasiswa_dll },
    ];

    doc.autoTable({
      head: [["Jenis Beasiswa", "Jumlah Mahasiswa"]],
      body: tableBeasiswaData.map((item) => [item.beasiswa, item.jumlah]),
      startY: doc.autoTable.previous.finalY + 14, // Tambahkan margin 14
      theme: "plain", // Tema polos
      headStyles: {
        fontSize: 11, // Ukuran font header
        halign: "center", // Rata tengah
        font: "times new roman", // Font header
      },
      bodyStyles: {
        fontSize: 11, // Ukuran font untuk isi
        halign: "left", // Rata kiri
        font: "times new roman", // Font header
      },
      styles: {
        cellPadding: 3, // Padding sel
        lineWidth: 0.1, // Ketebalan garis
        lineColor: [0, 0, 0], // Warna garis hitam
      },
      tableWidth: "auto", // Lebar tabel otomatis
      margin: { left: 20 },
    });

    doc.text(
      "Prestasi Mahasiswa Mengikuti Porseni",
      20,
      doc.autoTable.previous.finalY + 10 // Tambahkan margin 10
    );
    const prestasiPorseniData = selectedDataPrestasiPorseniMahasiswa;

    doc.autoTable({
      head: [["Jenis Kegiatan", "NIM", "Nama", "Tingkat Prestasi"]],
      theme: "plain", // Tema polos
      body: prestasiPorseniData.map((item) => [
        item.jenis_kegiatan,
        item.nim,
        item.nama,
        item.tingkat_prestasi,
      ]),
      startY: doc.autoTable.previous.finalY + 14, // Tambahkan margin 14
      headStyles: {
        fontSize: 11, // Ukuran font header
        halign: "center", // Rata tengah
        font: "times new roman", // Font header
      },
      bodyStyles: {
        fontSize: 11, // Ukuran font untuk isi
        halign: "left", // Rata kiri
        font: "times new roman", // Font header
      },
      styles: {
        cellPadding: 3, // Padding sel
        lineWidth: 0.1, // Ketebalan garis
        lineColor: [0, 0, 0], // Warna garis hitam
      },
      tableWidth: "auto", // Lebar tabel otomatis
      margin: { left: 20 },
    });

    doc.text(
      "Data Status Mahasiswa",
      20,
      doc.autoTable.previous.finalY + 10 // Tambahkan margin 10
    );
    const statusData = selectedDataStatusMahasiswa;

    doc.autoTable({
      head: [["NIM", "Nama", "Status"]],
      theme: "plain", // Tema polos
      body: statusData.map((item) => [item.nim, item.nama, item.status]),
      startY: doc.autoTable.previous.finalY + 14, // Tambahkan margin 14
      headStyles: {
        fontSize: 11, // Ukuran font header
        halign: "center", // Rata tengah
        font: "times new roman", // Font header
      },
      bodyStyles: {
        fontSize: 11, // Ukuran font untuk isi
        halign: "left", // Rata kiri
        font: "times new roman", // Font header
      },
      styles: {
        cellPadding: 3, // Padding sel
        lineWidth: 0.1, // Ketebalan garis
        lineColor: [0, 0, 0], // Warna garis hitam
      },
      tableWidth: "auto", // Lebar tabel otomatis
      margin: { left: 20 },
    });

    doc.text("C. KESIMPULAN", 15, doc.autoTable.previous.finalY + 10); // Adjusted x to 15 and y down by 20

    let yPositionKesimpulan = doc.autoTable.previous.finalY + 20;
    data.kesimpulan.forEach((paragraph) => {
      // Check if the paragraph has children and extract the text
      if (paragraph.children && paragraph.children.length > 0) {
        const text = paragraph.children[0].text;

        // Split the text into lines based on maxWidth
        const lines = doc.splitTextToSize(text, maxWidth);

        // Set alignment based on paragraph properties
        const alignment = paragraph.align || "left"; // Default to left if no alignment is specified

        // Add each line to the document and adjust yPosition
        lines.forEach((line, index) => {
          // Set alignment for the line
          if (alignment === "justify") {
            const words = line.split(/(\s+)/); // Memecah teks berdasarkan spasi dan mempertahankan spasi asli
            const totalWidth = maxWidth; // Lebar area teks
            const lineWidth = doc.getTextWidth(line);

            if (index < lines.length - 1) {
              // Hanya justify jika bukan baris terakhir
              if (words.length > 1) {
                const totalSpaces = words.filter(
                  (word) => word.trim() === ""
                ).length;
                const totalExtraSpace = totalWidth - lineWidth;
                const baseSpaceWidth = Math.floor(
                  totalExtraSpace / totalSpaces
                );
                const extraSpaces = totalExtraSpace % totalSpaces;

                let justifiedLine = "";

                for (let i = 0; i < words.length; i++) {
                  justifiedLine += words[i];
                  if (i < words.length - 1 && words[i].trim() === "") {
                    // Menambahkan spasi
                    const spacesToAdd =
                      baseSpaceWidth + (i / 2 < extraSpaces ? 1 : 0);
                    justifiedLine += " ".repeat(spacesToAdd);
                  }
                }
                doc.text(justifiedLine, 20, yPositionKesimpulan);
              } else {
                doc.text(line, 20, yPositionKesimpulan); // Jika hanya satu kata, tidak perlu justify
              }
            } else {
              doc.text(line, 20, yPositionKesimpulan); // Baris terakhir tidak di-justify
            }
          } else if (alignment === "center") {
            doc.text(line, 110, yPositionKesimpulan, { align: "center" });
          } else if (alignment === "right") {
            doc.text(line, 200, yPositionKesimpulan, { align: "right" });
          } else {
            doc.text(line, 20, yPositionKesimpulan); // Default left alignment
          }
          yPositionKesimpulan += 6; // Adjust the spacing between lines
        });
      }
    });

    // Menambahkan informasi tanggal dan jabatan
    const now = new Date();

    // Mengatur opsi untuk format tanggal
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Jakarta",
    };

    // Mengonversi tanggal ke format yang diinginkan
    const formattedDate = now.toLocaleDateString("id-ID", options);

    const dateYPosition = yPositionKesimpulan + 7; // Posisi Y untuk tanggal
    doc.text(`Jakarta, ${formattedDate}`, 195, dateYPosition, {
      align: "right",
    });
    const jabatanYPosition = dateYPosition + 7; // Posisi Y untuk jabatan
    doc.text("Dosen PA", 185, jabatanYPosition, { align: "right" });

    // Menambahkan kolom untuk tanda tangan
    const imgData = data.tanda_tangan_dosen_pa;
    const xImagePosition = 167; // Atur posisi X sesuai kebutuhan
    const yImagePosition = jabatanYPosition + 4; // Atur posisi Y sesuai kebutuhan
    const width = 21; // Lebar gambar
    const height = 21; // Tinggi gambar

    // Menambahkan gambar ke dokumen
    doc.addImage(imgData, "PNG", xImagePosition, yImagePosition, width, height);
    const ttdY = jabatanYPosition + 28; // Posisi Y untuk kolom TTD
    doc.text(`( ${data.nama_dosen_pa} )`, 195, ttdY, { align: "right" });
    // Open the PDF in a new window instead of saving
    const pdfOutput = doc.output("blob");
    const url = URL.createObjectURL(pdfOutput);

    // Membuka PDF di tab baru
    window.open(url, "_blank");
  };

  const getDataPrestasiIlmiahMahasiswaByIdLaporan = async () => {
    try {
      const dataPrestasiIlmiahMahasiswa = await axios.get<any>(
        `${API_BASE_URL}/api/prestasiilmiahmahasiswa`
      );
      const idLaporan = dataClickedLaporanBimbingan?.id;

      const selectedDataPrestasiIlmiahMahasiswa =
        dataPrestasiIlmiahMahasiswa.data.filter(
          (data) => data.laporan_bimbingan_id === idLaporan
        );

      setSelectedDataPrestasiIlmiahMahasiswa(
        selectedDataPrestasiIlmiahMahasiswa
      );
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };
  const getDataPrestasiPorseniMahasiswaByIdLaporan = async () => {
    try {
      const dataPrestasiPorseniMahasiswa = await axios.get<any>(
        `${API_BASE_URL}/api/prestasiporsenimahasiswa`
      );
      const idLaporan = dataClickedLaporanBimbingan?.id;

      const dataSelectedPrestasiPorseniMahasiswa =
        dataPrestasiPorseniMahasiswa.data.filter(
          (data) => data.laporan_bimbingan_id === idLaporan
        );

      setSelectedDataPrestasiPorseniMahasiswa(
        dataSelectedPrestasiPorseniMahasiswa
      );
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };
  const getDataStatusMahasiswaByIdLaporan = async () => {
    try {
      const dataStatusMahasiswa = await axios.get<any>(
        `${API_BASE_URL}/api/datastatusmahasiswa`
      );
      const idLaporan = dataClickedLaporanBimbingan?.id;

      const selectedDataStatusMahasiswa = dataStatusMahasiswa.data.filter(
        (data) => data.laporan_bimbingan_id === idLaporan
      );

      setSelectedDataStatusMahasiswa(selectedDataStatusMahasiswa);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  useEffect(() => {
    getDataPrestasiIlmiahMahasiswaByIdLaporan();
    getDataPrestasiPorseniMahasiswaByIdLaporan();
    getDataStatusMahasiswaByIdLaporan();
  }, [dataClickedLaporanBimbingan]);

  useEffect(() => {
    if (dataUser && dataUser.nip) {
      getDataDosenById();
      getDataPengesahanBimbinganByIDDosenPA();
      getDataDosenPAByDosenNip();
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
      userProfile.nama
    ) {
      getDataJadwalDosenPaByDosenPa();
    }
  }, [userProfile]);

  useEffect(() => {
    if (userProfile && userProfile.nama !== "") {
      getDataPengajuanBimbinganByDosenPaId();
      getDataLaporanBimbinganByDosenPaId();
      const isDataChanged =
        userProfile.nama !== namaLengkapDosen ||
        userProfile.email !== emailDosen ||
        userProfile.nip !== nip ||
        userProfile.hp !== noTelpDosen;
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
                disabled
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
                disabled
                type="text"
                placeholder={emailDosen === "" ? "Email" : emailDosen}
                onChange={(e) => {
                  setEmailDosen(e.target.value);
                }}
                value={emailDosen}
                className="px-3 py-2 text-[15px] border rounded-lg"
              />
              <InputField
                disabled
                type="text"
                placeholder={nip === "" ? "NIP" : nip}
                onChange={(e) => {
                  setNip(e.target.value);
                }}
                value={nip}
                className="px-3 py-2 text-[15px] border rounded-lg"
              />
              <InputField
                disabled
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
                  handleEditDosenPA();
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
                                onClick={() =>
                                  setIsDeleteJadwalDosenModalOpen(true)
                                }
                                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                              />
                              <Transition
                                appear
                                show={isDeleteJadwalDosenModalOpen}
                                as={Fragment}
                              >
                                <Dialog
                                  as="div"
                                  className="relative z-[1000]"
                                  onClose={() =>
                                    setIsDeleteJadwalDosenModalOpen(false)
                                  }
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
                                            Apakah anda yakin ingin menghapus
                                            jadwal kosong ini?
                                          </DialogTitle>
                                          <div className="mt-4 flex justify-end space-x-2 pb-6 px-6">
                                            <button
                                              type="button"
                                              className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                                              onClick={() =>
                                                setIsDeleteJadwalDosenModalOpen(
                                                  false
                                                )
                                              }
                                            >
                                              Batal
                                            </button>
                                            <button
                                              type="button"
                                              className="inline-flex justify-center rounded-md border border-transparent bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                              onClick={(e) =>
                                                handleDeleteJadwalDosen(data.id)
                                              }
                                            >
                                              Konfirmasi
                                            </button>
                                          </div>
                                        </DialogPanel>
                                      </TransitionChild>
                                    </div>
                                  </div>
                                </Dialog>
                              </Transition>
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
            <ToastContainer />
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
                      {data.permasalahan && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mt-2">
                            Permasalahan{" "}
                            {data.pengajuan_bimbingan.jenis_bimbingan ===
                              "Pribadi" && (
                              <span>
                                (Topik bimbingan :{" "}
                                {data.pengajuan_bimbingan.topik_bimbingan})
                              </span>
                            )}
                          </p>
                          <textarea
                            placeholder={
                              data.permasalahan === ""
                                ? "Permasalahan"
                                : data.permasalahan
                            }
                            value={data.permasalahan}
                            disabled
                            className="border mt-2 focus:outline-none text-sm rounded-lg px-3 py-2 w-full max-h-24" // Anda bisa menyesuaikan lebar dan tinggi sesuai kebutuhan
                          />
                          <p className="text-sm font-medium text-gray-700 mt-2">
                            Solusi
                          </p>
                          <textarea
                            placeholder={
                              data.solusi === "" ? "Solusi" : data.solusi
                            }
                            disabled
                            value={data.solusi}
                            className="border mt-2 focus:outline-none text-sm rounded-lg px-3 py-2 w-full max-h-24" // Anda bisa menyesuaikan lebar dan tinggi sesuai kebutuhan
                          />
                        </div>
                      )}
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
                                  "Tidak Sah"
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
          <ToastContainer />
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
              {dataPengajuanBimbingan.length > 0 ? (
                dataPengajuanBimbingan
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
                        {data.permasalahan && (
                          <p>
                            <span className="font-medium">Permasalahan :</span>{" "}
                            {data.permasalahan}
                          </p>
                        )}
                      </div>
                      <textarea
                        placeholder={
                          data.keterangan === null
                            ? "Input Keterangan (Misal: Ruang FIK 204 , https://meet.link, atau keterangan lainnya)"
                            : ""
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
                        className="px-3 py-2 text-[15px] border rounded-lg resize-none" // Tambahkan 'resize-none' untuk mencegah perubahan ukuran
                        rows={4} // Menentukan jumlah baris yang ditampilkan
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
                                  "Reschedule",
                                  data.permasalahan
                                )
                              }
                              className="w-1/2 bg-red-500 text-white cursor-pointer hover:bg-red-600 rounded-md py-2 font-medium text-[14px]"
                              disabled={keteranganKonfirmasi === ""}
                            >
                              Reschedule
                            </button>
                            <button
                              onClick={() =>
                                handleEditPengajuanBimbingan(
                                  data.id,
                                  data.mahasiswa_id,
                                  "Diterima",
                                  data.permasalahan
                                )
                              }
                              className="w-1/2 bg-green-500 text-white cursor-pointer rounded-md py-2 hover:bg-green-600 font-medium text-[14px]"
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
                    Saat ini tidak ada pengajuan bimbingan yang perlu
                    dikonfirmasi.
                  </p>
                  <p className="text-center text-gray-600">
                    Belum ada mahasiswa yang mengajukan bimbingan. Silakan
                    tunggu.
                  </p>
                </div>
              )}
            </div>
          </div>
          <ToastContainer />
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
                      key={data.id}
                      className="flex flex-col border rounded-lg p-6 gap-4 cursor-pointer"
                      onClick={() => handleDetailLaporanDosen(data)}
                    >
                      <div className="flex justify-between text-neutral-600">
                        <p>{data.jadwal_bimbingan}</p>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{data.nama_dosen_pa}</p>
                          <p>{data.jumlah_mahasiswa} Mahasiswa</p>
                          <p className="font-medium">{data.jenis_bimbingan}</p>
                          <p className="font-medium">{data.sistem_bimbingan}</p>
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
                      <p>{dataClickedLaporanBimbingan?.jadwal_bimbingan}</p>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex flex-col gap-4 w-[55%]">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center">
                            <p className="font-medium w-1/3">Tahun Akademik</p>
                            <span className="font-medium">:</span>
                            <p className="flex-1 ml-4">
                              {dataClickedLaporanBimbingan.tahun_ajaran}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <p className="font-medium w-1/3">Semester</p>
                            <span className="font-medium">:</span>
                            <p className="flex-1 ml-4">
                              {dataClickedLaporanBimbingan.semester}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <p className="font-medium w-1/3">Nama Dosen PA</p>
                            <span className="font-medium">:</span>
                            <p className="flex-1 ml-4">
                              {dataClickedLaporanBimbingan.nama_dosen_pa}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <p className="font-medium w-1/3">Jenis Bimbingan</p>
                            <span className="font-medium">:</span>
                            <p className="flex-1 ml-4">
                              {dataClickedLaporanBimbingan?.jenis_bimbingan}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <p className="font-medium w-1/3">Jumlah Peserta</p>
                            <span className="font-medium">:</span>
                            <p className="flex-1 ml-4">
                              {dataClickedLaporanBimbingan?.jumlah_mahasiswa}{" "}
                              Mahasiswa
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`self-start ${dataClickedLaporanBimbingan?.status === "Sudah Diberikan Feedback" ? "bg-green-500" : "bg-red-500"} p-3 rounded-lg`}
                      >
                        <p className="text-white text-center">
                          {dataClickedLaporanBimbingan?.status}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <h3 className="font-medium">PDF Laporan Bimbingan</h3>
                        <a
                          onClick={(e) => {
                            handlePreviewPDF(e, dataClickedLaporanBimbingan);
                          }}
                          className="flex underline hover:cursor-pointer items-center text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          <FontAwesomeIcon icon={faFilePdf} className="mr-2" />{" "}
                          {/* Ikon PDF */}
                          Buka PDF
                        </a>
                      </div>

                      <div className="flex flex-col gap-2">
                        <h3 className="font-medium">Dokumentasi</h3>
                        <img
                          className="w-1/2"
                          src={dataClickedLaporanBimbingan?.dokumentasi}
                        />
                      </div>
                      <div className="flex flex-col gap-3 rounded-lg">
                        <h3 className="font-medium">Feedback Kaprodi</h3>
                        {dataClickedLaporanBimbingan?.feedback_kaprodi !==
                        null ? (
                          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                            <p className="text-gray-700">
                              {dataClickedLaporanBimbingan?.feedback_kaprodi}
                            </p>
                          </div>
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
                              className="px-3 pt-2 h-[200px] text-[15px] border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            ></textarea>
                            <button
                              onClick={() => {
                                handleEditLaporanBimbingan(
                                  dataClickedLaporanBimbingan?.id,
                                  dataClickedLaporanBimbingan?.dosen_pa_id,
                                  "Sudah Diberikan Feedback"
                                );
                              }}
                              className="text-white bg-green-500 text-[14px] py-2 font-medium rounded-lg ml-auto w-1/5 hover:bg-green-600 transition duration-200"
                            >
                              Submit
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                          <h3 className="font-medium">Dokumentasi</h3>
                          <img
                            src={dataClickedLaporanBimbingan?.dokumentasi}
                          />
                          <p>
                            {dataClickedLaporanBimbingan?.kendala_mahasiswa}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <h3 className="font-medium">
                            Solusi yang ditawarkan
                          </h3>
                          <p>{dataClickedLaporanBimbingan?.solusi}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <h3 className="font-medium">Kesimpulan</h3>
                          <p>{dataClickedLaporanBimbingan?.kesimpulan}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <h3 className="font-medium">Dokumentasi</h3>
                          <div className="grid grid-cols-2 gap-4 items-center">
                            {dataClickedLaporanBimbingan?.dokumentasi ? (
                              dataClickedLaporanBimbingan.dokumentasi
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
                          {dataClickedLaporanBimbingan?.feedback_kaprodi !==
                          null ? (
                            <p>
                              {dataClickedLaporanBimbingan?.feedback_kaprodi}
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
                                    dataClickedLaporanBimbingan?.id,
                                    dataClickedLaporanBimbingan?.dosen_pa_id,
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
                      </div> */}
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
