"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import upIcon from "../../../assets/images/upIcon.png";
import backIconOrange from "../../../assets/images/back-icon-orange.png";
import downIcon from "../../../assets/images/downIcon.png";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import plusIcon from "../../../assets/images/plus.png";
import negatifIcon from "../../../assets/images/minus-icon.png";
import line from "../../../assets/images/line.png";
import InputField from "@/components/ui/InputField";
import ProfileImage from "@/components/ui/ProfileImage";
import axios from "axios";
import TrashButton from "@/components/ui/TrashButton";
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
import { EyeIcon } from "lucide-react";
import PDFModal from "@/components/ui/PDFModal";

const schedule: Record<string, string[]> = {
  Senin: [],
  Selasa: [],
  Rabu: [],
  Kamis: [],
  Jumat: [],
};

const DashboardDosenPA = ({ selectedSubMenuDashboard, dataUser }) => {
  const [userProfile, setUserProfile] = useState({
    nama: "",
    email: "",
    nip: "",
    hp: "",
  });
  const [dataJadwalDosenPA, setDataJadwalDosenPA] = useState([]);
  const [dataPengajuanBimbingan, setDataPengajuanBimbingan] = useState([]);
  const [dataLaporanBimbingan, setDataLaporanBimbingan] = useState([]);
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
  const [dataDosenPA, setDataDosenPA] = useState(null);
  const [dataDosen, setDataDosen] = useState(null);
  const [dataClickedLaporanBimbingan, setDataClickedLaporanBimbingan] =
    useState(null);
  const [selectedHari, setSelectedHari] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [openDay, setOpenDay] = useState<string | null>(null);
  const [dataPengesahanBimbingan, setDataPengesahanBimbingan] = useState([]);
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

  const [dataBimbingan, setDataBimbingan] = useState([]);

  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(1);
  const [dateReschedule, setDateReschedule] = useState("");
  const [startRescheduleTime, setStartRescheduleTime] = useState("00:00");
  const [endRescheduleTime, setEndRescheduleTime] = useState("00:00");
  const [rescheduleData, setRescheduleData] = useState("");
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [newSchedule, setNewSchedule] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [selectedPengajuan, setSelectedPengajuan] = useState(null);
  const [selectedTahunAjaran, setSelectedTahunAjaran] =
    useState<string>("Semua Tahun Ajaran");
  const [selectedSemester, setSelectedSemester] =
    useState<string>("Semua Semester");
  const [selectedPeriode, setSelectedPeriode] =
    useState<string>("Semua Periode");
  const [filteredDataBimbingan, setFilteredDataBimbingan] = useState([]);
  const [filteredDataLaporanBimbingan, setFilteredDataLaporanBimbingan] =
    useState([]);
  const [optionsTahunAjaran, setOptionsTahunAjaran] = useState([]);
  const [dataTahunAjaran, setDataTahunAjaran] = useState([]);
  const [pdfUrl, setPdfUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getDataTahunAJaran = async () => {
    try {
      const response = await axios.post<any>(
        `${API_BASE_URL}/api/datatahunajaran`
      );
      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }
      const data = await response.data.data;

      // Memfilter dan memformat data tahun ajaran
      const tahunAjaran = data.map((item: any) => {
        return `${item.tahun_periode}/${item.tahun_periode + 1}`;
      });

      // Menghilangkan duplikat dengan menggunakan Set
      const uniqueTahunAjaran = [...new Set(tahunAjaran)];

      // Menyimpan data tahun ajaran yang sudah difilter
      setDataTahunAjaran(uniqueTahunAjaran);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataBimbinganFilteredByTahunAjaranSemesterAndPeriode = () => {
    if (selectedTahunAjaran === "Semua Tahun Ajaran") {
      setFilteredDataBimbingan(dataBimbingan);
      return;
    }
    const filteredDataBimbinganByTahunAjaran = dataBimbingan
      .filter((data) => data.laporan_bimbingan_id !== null)
      .filter(
        (data) => data.laporan_bimbingan.tahun_ajaran === selectedTahunAjaran
      );
    if (selectedSemester === "Semua Semester") {
      setFilteredDataBimbingan(filteredDataBimbinganByTahunAjaran);
      return;
    }
    const filteredDataBimbinganBySemester = filteredDataBimbinganByTahunAjaran
      .filter((data) => data.laporan_bimbingan_id !== null)
      .filter((data) => data.laporan_bimbingan.semester === selectedSemester);

    if (selectedPeriode === "Semua Periode") {
      setFilteredDataBimbingan(filteredDataBimbinganBySemester);
      return;
    }
    const periodeMapping = {
      "Perwalian KRS": "Sebelum Perwalian KRS",
      "Perwalian UTS": "Setelah Perwalian KRS - Sebelum Perwalian UTS",
      "Perwalian UAS": "Setelah Perwalian UTS - Sebelum Perwalian UAS",
    };

    const mappedSelectedPeriode =
      periodeMapping[selectedPeriode] || selectedPeriode;

    const filteredDataBimbinganByPeriode = filteredDataBimbinganBySemester
      .filter((data) => data.laporan_bimbingan_id !== null)
      .filter(
        (data) =>
          data.pengajuan_bimbingan.periode_pengajuan === mappedSelectedPeriode
      );

    setFilteredDataBimbingan(filteredDataBimbinganByPeriode);
    return;
  };

  const getDataLaporanBimbinganFilteredByTahunAjaranSemesterAndPeriode = () => {
    if (selectedTahunAjaran === "Semua Tahun Ajaran") {
      setFilteredDataLaporanBimbingan(dataLaporanBimbingan);
      return;
    }
    const filteredDataLaporanBimbinganByTahunAjaran =
      dataLaporanBimbingan.filter(
        (data) => data.tahun_ajaran === selectedTahunAjaran
      );
    if (selectedSemester === "Semua Semester") {
      setFilteredDataLaporanBimbingan(
        filteredDataLaporanBimbinganByTahunAjaran
      );
      return;
    }
    const filteredDataLaporanBimbinganBySemester =
      filteredDataLaporanBimbinganByTahunAjaran.filter(
        (data) => data.semester === selectedSemester
      );
    if (selectedPeriode === "Semua Periode") {
      setFilteredDataLaporanBimbingan(filteredDataLaporanBimbinganBySemester);
      return;
    }
    const filteredDataLaporanBimbinganByPeriode =
      filteredDataLaporanBimbinganBySemester.filter(
        (data) => data.jenis_bimbingan === selectedPeriode
      );
    setFilteredDataLaporanBimbingan(filteredDataLaporanBimbinganByPeriode);
    return;
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const dateObject = new Date(selectedDate);

    // Mendapatkan format tanggal yang diinginkan
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    // Mengonversi tanggal ke format yang diinginkan
    const formattedDate = dateObject.toLocaleDateString("id-ID", options);

    setDateReschedule(e.target.value);
  };

  const handleStartTimeChange = (e) => {
    const newStartTime = e.target.value;
    setStartRescheduleTime(newStartTime);
  };

  const handleEndTimeChange = (e) => {
    const newEndTime = e.target.value;
    setEndRescheduleTime(newEndTime);
  };
  const openModal = (action, pengajuan) => {
    setSelectedAction(action);
    setSelectedPengajuan(pengajuan);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedAction(null);
    setSelectedPengajuan(null);
    setDateReschedule("");
    setStartRescheduleTime("00:00");
    setEndRescheduleTime("00:00");
    setKeterangan("");
  };

  const closePDFModal = () => {
    setIsModalOpen(false);
    setPdfUrl(""); // Clear the URL when closing
    URL.revokeObjectURL(pdfUrl); // Clean up the Blob URL
  };

  const handleSelectEntry = (id) => {
    setSelectedEntries((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((entryId) => entryId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const formatTime = (time) => {
    return (time < 10 ? "0" : "") + time + ":00";
  };

  const increaseTime = () => {
    const newStartTime = startTime + 1; // Menambah 2 jam
    if (newStartTime < 24) {
      setStartTime(newStartTime);
      setEndTime(newStartTime + 1 > 23 ? 24 : newStartTime + 1); // Update endTime
    }
  };

  const decreaseTime = () => {
    const newStartTime = startTime - 1; // Mengurangi 1 jam
    if (newStartTime >= 0) {
      setStartTime(newStartTime);
      setEndTime(newStartTime + 1 > 23 ? 23 : newStartTime + 1); // Update endTime
    }
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

  const addJadwalDosen = async (newData) => {
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

  const deleteJadwalDosen = async (deletedData) => {
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
      const dosen = dataDosenPA.data.find((data) => data.nip === dataUser.nip);

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
      const dosen = dataDosen.data.find((data) => data.nip === dataUser.nip);

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
        `${API_BASE_URL}/api/datadosenpa`,
        updatedData
      );
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
    } catch (error) {
      console.error("Failed to save the updated order.");
    }
  };

  const handleDetailLaporanDosen = (data) => {
    setDataClickedLaporanBimbingan(data);
    setIsDetailLaporanDosenClicked((prev) => !prev);
  };

  const handleAddJadwalDosen = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      function formatTime(hour) {
        // Menggunakan padStart untuk menambahkan nol di depan jika jam kurang dari 10
        return hour.toString().padStart(2, "0") + ":00";
      }

      let jadwalDosenValue = {
        dosen_pa_id: dataDosenPA?.id,
        hari: selectedHari,
        jam_mulai: formatTime(startTime), // Menggunakan fungsi formatTime
        jam_selesai: formatTime(endTime), // Menggunakan fungsi formatTime
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
      setStartTime(0);
      setEndTime(0);
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

  const handleEditPengajuanBimbingan = (
    id,
    mahasiswa_id,
    action,
    jadwal_bimbingan,
    permasalahan
  ) => {
    openModal(action, { id, mahasiswa_id, jadwal_bimbingan, permasalahan });
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

  const handleBunchEditPengesahanKehadiranBimbingan = async (
    dataSelectedEntries,
    status_pengesahan_kehadiran: string
  ) => {
    try {
      const promises = dataSelectedEntries.map(async (data) => {
        let pengesahanKehadiranBimbinganValue = {
          id: data,
          status_pengesahan_kehadiran,
        };

        // Return the result of the patch operation
        return await patchPengesahanKehadiranBimbingan(
          pengesahanKehadiranBimbinganValue
        );
      });

      // Wait for all promises to resolve
      const results = await Promise.all(promises);

      // Assuming you want to show a success message for the last result
      const lastResult = results[results.length - 1];
      toast.success(
        <div className="flex items-center">
          <span>
            {lastResult.message ||
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
      setSelectedEntries([]);
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

  const handleSubmitReschedule = async (
    id,
    status,
    keterangan_reschedule,
    jadwal_bimbingan_reschedule,
    mahasiswa_id
  ) => {
    try {
      let submitRescheduleValue = {
        id,
        status,
        status_reschedule: "Belum dikonfirmasi",
        keterangan_reschedule,
        jadwal_bimbingan_reschedule,
        mahasiswa_id,
      };

      const result = await patchPengajuanBimbingan(submitRescheduleValue);

      // const notificationResponse = await axios.post("/api/sendmessage", {
      //   to: "085810676264",
      //   body: `Yth Mahasiswa,\n\nPengajuan bimbingan Anda telah direschedule oleh Dosen Pembimbing Akademik (${dataDosenPA[0].nama}). Jadwal baru telah ditetapkan oleh Dosen Pembimbing Akademik Anda, silahkan konfirmasi ulang.\n\nMohon untuk mengecek detailnya melalui tautan berikut:\nhttps://bimbingan-konseling-fikupnvj.vercel.app/\n\nTerima kasih atas pengertiannya.`,
      // });

      // if (!notificationResponse.data.success) {
      //   throw new Error("Gagal mengirim notifikasi");
      // }

      toast.success(
        <div className="flex items-center">
          <span>{result.message || "Reschedule bimbingan berhasil!"}</span>
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

      getDataPengajuanBimbinganByDosenPaId();
    } catch (error) {
      toast.error(
        <div className="flex items-center">
          <span>
            {error.message || "Reschedule bimbingan gagal. coba lagi!!"}
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

  const handleSubmitDiterima = async (
    id,
    status,
    keterangan,
    mahasiswa_id,
    permasalahan
  ) => {
    try {
      let submitDiterimaValue = {
        id,
        status,
        keterangan,
        mahasiswa_id,
        permasalahan,
      };

      const result = await patchPengajuanBimbingan(submitDiterimaValue);
      await addBimbingan(id, permasalahan);

      // const notificationResponse = await axios.post("/api/sendmessage", {
      //   to: "085810676264",
      //   body: `Yth Mahasiswa,\n\nPengajuan bimbingan Anda telah diterima oleh Dosen Pembimbing Akademik (${dataDosenPA[0].nama}).\n\nSilakan cek jadwal bimbingan melalui tautan berikut:\nhttps://bimbingan-konseling-fikupnvj.vercel.app/\n\nTerima kasih telah mengajukan bimbingan.`,
      // });

      // if (!notificationResponse.data.success) {
      //   throw new Error("Gagal mengirim notifikasi");
      // }
      toast.success(
        <div className="flex items-center">
          <span>{result.message || "Penerimaan bimbingan berhasil!"}</span>
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

      getDataPengajuanBimbinganByDosenPaId();
    } catch (error) {
      toast.error(
        <div className="flex items-center">
          <span>
            {error.message || "Penerimaan bimbingan gagal. coba lagi!!"}
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

    const formatTanggal = (jadwal) => {
      // Memisahkan string berdasarkan spasi
      const parts = jadwal.split(" ");

      // Mengambil bagian tanggal (indeks 1 dan 2)
      const tanggal = `${parts[1]} ${parts[2]}`; // "20 Januari"
      const tahun = parts[3]; // "2025"

      // Menggabungkan kembali menjadi format yang diinginkan
      return `${tanggal} ${tahun}`; // "20 Januari 2025"
    };

    if (data.jenis_bimbingan === "Pribadi") {
      const doc = new jsPDF({
        orientation: "landscape", // or "landscape"
        unit: "mm", // units can be "pt", "mm", "cm", or "in"
        format: "a4", // format can be "a4", "letter", etc.
        putOnlyUsedFonts: true, // optional, to optimize font usage
      });

      doc.setFontSize(11);
      const judulLembarKonsultasi = "LEMBAR KONSULTASI MAHASISWA";
      const lebarJudulLembarKonsultasi = doc.getTextWidth(
        judulLembarKonsultasi
      );
      const lebarPageLembarKonsultasi = doc.internal.pageSize.getWidth();
      const judulLembarKonsultasiXPosition =
        (lebarPageLembarKonsultasi - lebarJudulLembarKonsultasi) / 2; // Calculate x position for center alignment
      doc.setFont("times new roman bold");
      doc.text(judulLembarKonsultasi, judulLembarKonsultasiXPosition, 20);
      doc.setFont("times new roman");
      doc.text(`Tahun Akademik    :    ${data.tahun_ajaran}`, 15, 32); // Moved up by 10y
      doc.text(`Semester                   :    ${data.semester}`, 15, 38); // Moved up by 10y
      doc.text(`Nama Dosen PA     :    ${data.nama_dosen_pa}`, 15, 44); // Moved up by 10y

      const selectedBimbingan = dataBimbingan.filter(
        (bimbingan) => bimbingan.laporan_bimbingan_id === data.id
      );

      const bodyBimbinganLembarKonsultasi =
        selectedBimbingan.length === 0
          ? [["-", "-", "-", "-", "-", "-", "-", "-"]] // Baris default untuk data kosong
          : selectedBimbingan.map((item, index) => [
              index + 1,
              formatTanggal(item.pengajuan_bimbingan.jadwal_bimbingan),
              item.pengajuan_bimbingan.nim,
              item.pengajuan_bimbingan.nama_lengkap,
              item.permasalahan,
              item.solusi,
              data.tanda_tangan_dosen_pa,
              item.ttd_kehadiran,
            ]);
      (doc as any).autoTable({
        head: [
          [
            "No",
            "Tanggal",
            "NIM",
            "Nama",
            "Permasalahan",
            "Solusi",
            "TTD Dosen PA",
            "TTD MHS",
          ],
        ],
        showHead: "firstPage", // Tampilkan header hanya di halaman pertama
        pageBreak: "auto", // Atur pemecahan halaman otomatis
        theme: "plain", // Tema polos
        body: bodyBimbinganLembarKonsultasi,
        startY: 54,
        headStyles: {
          fontSize: 11, // Ukuran font header
          halign: "center", // Rata tengah
          font: "times new roman", // Font header
        },
        bodyStyles: {
          fontSize: 11, // Ukuran font untuk isi
          halign: "center",
          valign: "top",
          font: "times new roman", // Font header
        },
        styles: {
          cellPadding: 3, // Padding sel
          lineWidth: 0.1, // Ketebalan garis
          lineColor: [0, 0, 0], // Warna garis hitam
        },
        tableWidth: "auto", // Lebar tabel otomatis
        margin: { bottom: 30 },
        didDrawCell: (data) => {
          if (
            data.row.index >= 0 &&
            data.column.index === 7 &&
            data.section === "body"
          ) {
            const imgSrc = data.cell.raw; // Mengambil sumber gambar dari properti raw
            if (imgSrc) {
              const imgWidth = 8;
              const imgHeight = 8;
              const x = data.cell.x + data.cell.width / 2 - imgWidth / 2;
              const y = data.cell.y + 2;
              doc.addImage(imgSrc, "PNG", x, y, imgWidth, imgHeight);
            }
          } else if (
            data.row.index >= 0 &&
            data.column.index === 6 &&
            data.section === "body"
          ) {
            const imgSrc = data.cell.raw; // Mengambil sumber gambar dari properti raw
            if (imgSrc) {
              const imgWidth = 8;
              const imgHeight = 8;
              const x = data.cell.x + data.cell.width / 2 - imgWidth / 2;
              const y = data.cell.y + 2;
              doc.addImage(imgSrc, "PNG", x, y, imgWidth, imgHeight);
            }
          }
        },
        didParseCell: (data) => {
          if (
            data.row.index >= 0 &&
            data.column.index === 7 &&
            data.section === "body"
          ) {
            const imgSrc = data.row.raw[7];
            if (imgSrc) {
              data.cell.raw = imgSrc; // Menyimpan sumber gambar di properti raw
              data.cell.text = ""; // Mengosongkan teks sel jika ada gambar
            }
          } else if (
            data.row.index >= 0 &&
            data.column.index === 6 &&
            data.section === "body"
          ) {
            const imgSrc = data.row.raw[6];
            if (imgSrc) {
              data.cell.raw = imgSrc; // Menyimpan sumber gambar di properti raw
              data.cell.text = ""; // Mengosongkan teks sel jika ada gambar
            }
          }
          if (data.row.index >= 0 && data.section === "body") {
            if (data.column.index === 4 || data.column.index === 5) {
              data.cell.styles.halign = "justify"; // Justify alignment
            }
          }
        },
      });

      const pdfOutput = doc.output("blob");
      const url = URL.createObjectURL(pdfOutput);

      // Membuka PDF di tab baru
      window.open(url, "_blank");
    } else if (data.jenis_bimbingan.startsWith("Perwalian")) {
      const doc = new jsPDF({
        orientation: "portrait", // or "landscape"
        unit: "mm", // units can be "pt", "mm", "cm", or "in"
        format: "a4",
        putOnlyUsedFonts: true, // optional, to optimize font usage
      });

      doc.setFont("times new roman bold");

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
      doc.setFont("times new roman");
      doc.text(`Tahun Akademik    :    ${data.tahun_ajaran}`, 15, 56); // Moved up by 10y
      doc.text(`Semester                   :    ${data.semester}`, 15, 62); // Moved up by 10y
      doc.text(
        `Periode                     :    ${data.jenis_bimbingan}`,
        15,
        68
      ); // Moved up by 10y
      doc.text(`Nama Dosen PA     :    ${data.nama_dosen_pa}`, 15, 74); // Moved up by 10y

      doc.setFont("times new roman bold");

      doc.text("A. PENDAHULUAN", 15, 91); // Adjusted x to 15 and y down by 20

      doc.setFont("times new roman");

      let yPosition = 104;
      const maxWidth = 175;

      const maxHeight = 276;

      data.pendahuluan.forEach((paragraph) => {
        if (paragraph.children && paragraph.children.length > 0) {
          const text = paragraph.children[0].text;
          const lines = doc.splitTextToSize(text, maxWidth);
          const alignment = paragraph.align || "left"; // Default to left if no alignment is specified

          lines.forEach((line, index) => {
            // Check if yPosition exceeds maxHeight
            if (yPosition > maxHeight) {
              doc.addPage(); // Add a new page
              yPosition = 20; // Reset yPosition for the new page
            }

            // Set alignment for the line
            if (alignment === "justify") {
              const words = line.split(/(\s+)/);
              const totalWidth = maxWidth;
              const lineWidth = doc.getTextWidth(line);

              if (index < lines.length - 1) {
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
                      const spacesToAdd =
                        baseSpaceWidth + (i / 2 < extraSpaces ? 1 : 0);
                      justifiedLine += " ".repeat(spacesToAdd);
                    }
                  }
                  doc.text(justifiedLine, 20, yPosition);
                } else {
                  doc.text(line, 20, yPosition);
                }
              } else {
                doc.text(line, 20, yPosition);
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

      doc.setFont("times new roman bold");
      let hasilKonsultasiPembimbinganYPosition = yPosition + 7;
      if (hasilKonsultasiPembimbinganYPosition > maxHeight) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text("B. HASIL KONSULTASI PEMBIMBINGAN", 15, yPosition + 7); // Adjusted x to 15 and y down by 20
      doc.setFont("times new roman");

      let textPrestasiAkademikYPosition = yPosition + 17;
      // Table for IPK
      const tableData = [
        { range: "IPK > 3.5", jumlah: data.jumlah_ipk_a },
        { range: "3 > IPK >= 3.5", jumlah: data.jumlah_ipk_b },
        { range: "2.5 <= IPK < 3", jumlah: data.jumlah_ipk_c },
        { range: "2 <= IPK < 2.5", jumlah: data.jumlah_ipk_d },
        { range: "IPK < 2", jumlah: data.jumlah_ipk_e },
      ];

      let tablePrestasiAkademikHeight = 1 * 15;

      if (
        textPrestasiAkademikYPosition + tablePrestasiAkademikHeight >
        maxHeight
      ) {
        doc.addPage();
        textPrestasiAkademikYPosition = 20;
      }

      doc.text(
        "Prestasi Akademik Mahasiswa",
        20,
        textPrestasiAkademikYPosition
      );

      let tablePrestasiAkademikYPosition = textPrestasiAkademikYPosition + 4;

      (doc as any).autoTable({
        head: [["Range IPK", "Jumlah Mahasiswa"]],
        body: tableData.map((item) => [item.range, item.jumlah]),
        startY: tablePrestasiAkademikYPosition,
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

      let textPrestasiIlmiahYPosition =
        (doc as any).autoTable.previous.finalY + 10;

      const prestasiData = selectedDataPrestasiIlmiahMahasiswa;
      const bodyDataIlmiah =
        prestasiData.length === 0
          ? [["-", "-", "-", "-"]] // Baris default untuk data kosong
          : prestasiData.map((item) => [
              item.bidang_prestasi,
              item.nim,
              item.nama,
              item.tingkat_prestasi,
            ]);

      const tablePrestasiIlmiahHeight = 1 * 15;

      if (textPrestasiIlmiahYPosition + tablePrestasiIlmiahHeight > maxHeight) {
        doc.addPage(); // Add a new page
        textPrestasiIlmiahYPosition = 20; // Reset Y position for the new page
      }

      doc.text("Prestasi Ilmiah Mahasiswa", 20, textPrestasiIlmiahYPosition);

      let tablePrestasiIlmiahYPosition = textPrestasiIlmiahYPosition + 4;

      (doc as any).autoTable({
        head: [["Bidang Prestasi", "NIM", "Nama", "Tingkat Prestasi"]],
        theme: "plain", // Tema polos
        body: bodyDataIlmiah,
        startY: tablePrestasiIlmiahYPosition, // Tambahkan margin 14
        headStyles: {
          fontSize: 11, // Ukuran font header
          halign: "center", // Rata tengah
          font: "times new roman", // Font header
        },
        bodyStyles: {
          fontSize: 11, // Ukuran font untuk isi
          halign: prestasiData.length === 0 ? "center" : "left", // Rata kiri
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

      let textPrestasiBeasiswaYPosition =
        (doc as any).autoTable.previous.finalY + 10;

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

      let tablePrestasiBeasiswaHeight = 1 * 15;

      if (
        textPrestasiBeasiswaYPosition + tablePrestasiBeasiswaHeight >
        maxHeight
      ) {
        doc.addPage();
        textPrestasiBeasiswaYPosition = 20;
      }

      doc.text(
        "Prestasi Mahasiswa Mendapatkan Beasiswa",
        20,
        textPrestasiBeasiswaYPosition
      );

      let tablePrestasiBeasiswaYPosition = textPrestasiBeasiswaYPosition + 4;

      (doc as any).autoTable({
        head: [["Jenis Beasiswa", "Jumlah Mahasiswa"]],
        body: tableBeasiswaData.map((item) => [item.beasiswa, item.jumlah]),
        startY: tablePrestasiBeasiswaYPosition,
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

      let textPrestasiPorseniYPosition =
        (doc as any).autoTable.previous.finalY + 10;

      const prestasiPorseniData = selectedDataPrestasiPorseniMahasiswa;

      const bodyDataPorseni =
        prestasiPorseniData.length === 0
          ? [["-", "-", "-", "-"]] // Baris default untuk data kosong
          : prestasiPorseniData.map((item) => [
              item.jenis_kegiatan,
              item.nim,
              item.nama,
              item.tingkat_prestasi,
            ]);

      const tablePrestasiPorseniHeight = 1 * 15;

      if (
        textPrestasiPorseniYPosition + tablePrestasiPorseniHeight >
        maxHeight
      ) {
        doc.addPage(); // Add a new page
        textPrestasiPorseniYPosition = 20; // Reset Y position for the new page
      }

      doc.text(
        "Prestasi Mahasiswa Mengikuti Porseni",
        20,
        textPrestasiPorseniYPosition
      );

      let tablePrestasiPorseniYPosition = textPrestasiPorseniYPosition + 4;

      (doc as any).autoTable({
        head: [["Jenis Kegiatan", "NIM", "Nama", "Tingkat Prestasi"]],
        theme: "plain", // Tema polos
        body: bodyDataPorseni,
        startY: tablePrestasiPorseniYPosition, // Tambahkan margin 14
        headStyles: {
          fontSize: 11, // Ukuran font header
          halign: "center", // Rata tengah
          font: "times new roman", // Font header
        },
        bodyStyles: {
          fontSize: 11, // Ukuran font untuk isi
          halign: prestasiPorseniData.length > 0 ? "left" : "center", // Rata kiri
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

      let textStatusDataYPosition = (doc as any).autoTable.previous.finalY + 10;

      const statusData = selectedDataStatusMahasiswa;

      const bodyDataStatus =
        statusData.length === 0
          ? [["-", "-", "-", "-"]] // Baris default untuk data kosong
          : statusData.map((item) => [item.nim, item.nama, item.status]);

      const tableStatusDataHeight = 1 * 15;

      if (textStatusDataYPosition + tableStatusDataHeight > maxHeight) {
        doc.addPage(); // Add a new page
        textStatusDataYPosition = 20; // Reset Y position for the new page
      }

      doc.text("Data Status Mahasiswa", 20, textStatusDataYPosition);

      let tableStatusDataYPosition = textStatusDataYPosition + 4;

      (doc as any).autoTable({
        head: [["NIM", "Nama", "Status"]],
        theme: "plain", // Tema polos
        body: bodyDataStatus,
        startY: tableStatusDataYPosition,
        headStyles: {
          fontSize: 11, // Ukuran font header
          halign: "center", // Rata tengah
          font: "times new roman", // Font header
        },
        bodyStyles: {
          fontSize: 11, // Ukuran font untuk isi
          halign: statusData.length > 0 ? "left" : "center",
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

      doc.setFont("times new roman bold");

      const selectedBimbingan = dataBimbingan.filter(
        (bimbingan) => bimbingan.laporan_bimbingan_id === data.id
      );
      const bimbinganData = selectedBimbingan.filter((data) =>
        data.pengajuan_bimbingan.jenis_bimbingan.startsWith("Perwalian")
      );

      const bodyBimbingan =
        bimbinganData.length === 0
          ? [["-", "-", "-", "-"]] // Baris default untuk data kosong
          : bimbinganData.map((item, index) => [
              index + 1,
              item.pengajuan_bimbingan.nim,
              item.pengajuan_bimbingan.nama_lengkap,
              item.ttd_kehadiran,
            ]);

      function calculateTableHeight(doc, options) {
        const cloneOptions = { ...options, startY: 0, margin: { bottom: 0 } };
        doc.addPage();
        (doc as any).autoTable(cloneOptions);
        const tableHeight = (doc as any).autoTable.previous.finalY - 62;
        doc.deletePage(doc.internal.getNumberOfPages()); // Hapus halaman sementara
        return tableHeight;
      }

      const tableOptions = {
        head: [["No", "NIM", "Nama", "TTD"]],
        theme: "plain", // Tema polos
        body: bodyBimbingan,
        startY: 62,
        headStyles: {
          fontSize: 11, // Ukuran font header
          halign: "center", // Rata tengah
          font: "times new roman", // Font header
        },
        bodyStyles: {
          fontSize: 11, // Ukuran font untuk isi
          halign: "center",
          font: "times new roman", // Font header
        },
        styles: {
          cellPadding: 3, // Padding sel
          lineWidth: 0.1, // Ketebalan garis
          lineColor: [0, 0, 0], // Warna garis hitam
        },
        tableWidth: "auto", // Lebar tabel otomatis
        margin: { bottom: 70 },
        didDrawCell: (data) => {
          if (
            data.row.index >= 0 &&
            data.column.index === 3 &&
            data.section === "body"
          ) {
            const imgSrc = data.cell.raw;
            if (imgSrc) {
              const imgWidth = 8;
              const imgHeight = 8;
              const x = data.cell.x + data.cell.width / 2 - imgWidth / 2;
              const y = data.cell.y + data.cell.height / 2 - imgHeight / 2;
              doc.addImage(imgSrc, "PNG", x, y, imgWidth, imgHeight);
            }
          }
        },
        didParseCell: (data) => {
          if (
            data.row.index >= 0 &&
            data.column.index === 3 &&
            data.section === "body"
          ) {
            const imgSrc = data.row.raw[3];
            if (imgSrc) {
              data.cell.raw = imgSrc; // Menyimpan sumber gambar di properti raw
              data.cell.text = ""; // Mengosongkan teks sel jika ada gambar
            }
          }
        },
        didDrawPage: (a) => {
          // Menambahkan TTD di setiap halaman setelah kolom tabel terakhir
          const ttdY = a.cursor.y + 22; // Jarak dari baris tabel

          const now = new Date();

          // Mengatur opsi untuk format tanggal
          const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "Asia/Jakarta",
          };

          // Mengonversi tanggal ke format yang diinginkan
          const formattedDate = now.toLocaleDateString("id-ID", options);

          // Menambahkan tanggal (posisi pertama)
          doc.text(`Jakarta, ${formattedDate}`, 170, ttdY, {
            align: "center",
          });

          // Menambahkan jabatan (di bawah tanggal)
          const jabatanDaftarHadirYPosition = ttdY + 7; // Jarak antar elemen
          doc.text("Dosen PA", 170, jabatanDaftarHadirYPosition, {
            align: "center",
          });

          // Menambahkan gambar TTD
          doc.addImage(
            data.tanda_tangan_dosen_pa,
            "PNG",
            160,
            jabatanDaftarHadirYPosition + 4,
            21,
            21
          );

          // Menambahkan nama dosen di bawah TTD
          doc.text(`( ${data.nama_dosen_pa} )`, 170, ttdY + 4 + 7 + 21 + 4, {
            align: "center",
          });
        },
      };

      const tableHeight = calculateTableHeight(doc, tableOptions);

      // Atur margin bottom

      doc.addPage();

      const judulDaftarHadir = "DAFTAR HADIR PERWALIAN";
      const lebarJudulDaftarHadir = doc.getTextWidth(judulDaftarHadir);
      const lebarPage = doc.internal.pageSize.getWidth();
      const judulDaftarHadirXPosition = (lebarPage - lebarJudulDaftarHadir) / 2; // Calculate x position for center alignment
      doc.setFont("times new roman bold");
      doc.text(judulDaftarHadir, judulDaftarHadirXPosition, 28);
      doc.setFont("times new roman");
      doc.text(`Tahun Akademik    :    ${data.tahun_ajaran}`, 15, 42); // Moved up by 10y
      doc.text(`Semester                   :    ${data.semester}`, 15, 48); // Moved up by 10y
      doc.text(
        `Periode                     :    ${data.jenis_bimbingan}`,
        15,
        54
      ); // Moved up by 10y
      (doc as any).autoTable(tableOptions);

      doc.addPage("a4", "landscape");
      const judulLembarKonsultasi = "LEMBAR KONSULTASI MAHASISWA";
      const lebarJudulLembarKonsultasi = doc.getTextWidth(
        judulLembarKonsultasi
      );
      const lebarPageLembarKonsultasi = doc.internal.pageSize.getWidth();
      const judulLembarKonsultasiXPosition =
        (lebarPageLembarKonsultasi - lebarJudulLembarKonsultasi) / 2; // Calculate x position for center alignment
      doc.setFont("times new roman bold");
      doc.text(judulLembarKonsultasi, judulLembarKonsultasiXPosition, 20);
      doc.setFont("times new roman");
      doc.text(`Tahun Akademik    :    ${data.tahun_ajaran}`, 15, 32); // Moved up by 10y
      doc.text(`Semester                   :    ${data.semester}`, 15, 38); // Moved up by 10y
      doc.text(
        `Periode                     :    ${data.jenis_bimbingan}`,
        15,
        44
      ); // Moved up by 10y

      console.log(data);

      const bimbinganDataLembarKonsultasi = data.konsultasi_mahasiswa;
      console.log(bimbinganDataLembarKonsultasi);

      const bodyBimbinganLembarKonsultasi =
        bimbinganDataLembarKonsultasi.length === 0
          ? [["-", "-", "-", "-", "-", "-", "-", "-"]] // Baris default untuk data kosong
          : bimbinganDataLembarKonsultasi.map((item, index) => [
              index + 1,
              item.tanggal,
              item.nim,
              item.nama,
              item.permasalahan,
              item.solusi,
              data.tanda_tangan_dosen_pa,
              item.ttd_mhs,
            ]);

      (doc as any).autoTable({
        head: [
          [
            "No",
            "Tanggal",
            "NIM",
            "Nama",
            "Permasalahan",
            "Solusi",
            "TTD Dosen PA",
            "TTD MHS",
          ],
        ],
        showHead: "firstPage", // Tampilkan header hanya di halaman pertama
        pageBreak: "auto", // Atur pemecahan halaman otomatis
        theme: "plain", // Tema polos
        body: bodyBimbinganLembarKonsultasi,
        startY: 60,
        headStyles: {
          fontSize: 11, // Ukuran font header
          halign: "center", // Rata tengah
          font: "times new roman", // Font header
        },
        bodyStyles: {
          fontSize: 11, // Ukuran font untuk isi
          halign: "center",
          valign: "top",
          font: "times new roman", // Font header
        },
        styles: {
          cellPadding: 3, // Padding sel
          lineWidth: 0.1, // Ketebalan garis
          lineColor: [0, 0, 0], // Warna garis hitam
        },
        tableWidth: "auto", // Lebar tabel otomatis
        margin: { bottom: 30 },
        didDrawCell: (data) => {
          if (
            data.row.index >= 0 &&
            data.column.index === 7 &&
            data.section === "body"
          ) {
            const imgSrc = data.cell.raw; // Mengambil sumber gambar dari properti raw
            if (imgSrc && imgSrc !== "-") {
              const imgWidth = 8;
              const imgHeight = 8;
              const x = data.cell.x + data.cell.width / 2 - imgWidth / 2;
              const y = data.cell.y + 2;
              doc.addImage(imgSrc, "PNG", x, y, imgWidth, imgHeight);
            }
          } else if (
            data.row.index >= 0 &&
            data.column.index === 6 &&
            data.section === "body"
          ) {
            console.log(data);
            const imgSrc = data.cell.raw; // Mengambil sumber gambar dari properti raw
            console.log(data.cell.raw);
            if (imgSrc && imgSrc !== "-") {
              const imgWidth = 8;
              const imgHeight = 8;
              const x = data.cell.x + data.cell.width / 2 - imgWidth / 2;
              const y = data.cell.y + 2;
              doc.addImage(imgSrc, "PNG", x, y, imgWidth, imgHeight);
            }
          }
        },
        didParseCell: (data) => {
          if (
            data.row.index >= 0 &&
            data.column.index === 7 &&
            data.section === "body"
          ) {
            const imgSrc = data.row.raw[7];
            if (imgSrc && imgSrc !== "-") {
              data.cell.raw = imgSrc; // Menyimpan sumber gambar di properti raw
              data.cell.text = ""; // Mengosongkan teks sel jika ada gambar
            }
          } else if (
            data.row.index >= 0 &&
            data.column.index === 6 &&
            data.section === "body"
          ) {
            const imgSrc = data.row.raw[6];
            if (imgSrc && imgSrc !== "-") {
              data.cell.raw = imgSrc; // Menyimpan sumber gambar di properti raw
              data.cell.text = ""; // Mengosongkan teks sel jika ada gambar
            }
          }
          if (data.row.index >= 0 && data.section === "body") {
            if (data.column.index === 4 && data.cell.raw !== "-") {
              data.cell.styles.halign = "justify"; // Justify alignment
            } else if (data.column.index === 5 && data.cell.raw !== "-") {
              data.cell.styles.halign = "justify"; // Justify alignment
            }
          }
        },
      });

      doc.addPage("a4", "portrait");
      doc.text("C. KESIMPULAN", 15, 20); // Adjusted x to 15 and y down by 20
      doc.setFont("times new roman");

      let yPositionKesimpulan = 30;
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
            if (yPositionKesimpulan > maxHeight) {
              doc.addPage(); // Add a new page
              yPositionKesimpulan = 20; // Reset yPosition for the new page
            }
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

      const now = new Date();

      // Mengatur opsi untuk format tanggal
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Jakarta",
      };

      // Mengonversi tanggal ke format yang diinginkan
      const formattedDate = now.toLocaleDateString("id-ID", options);

      // Mengatur posisi awal untuk elemen vertikal
      let verticalStart = yPositionKesimpulan + 14; // Posisi awal untuk elemen pertama
      if (verticalStart > maxHeight) {
        doc.addPage(); // Tambahkan halaman baru jika melebihi batas
        verticalStart = 20; // Reset posisi Y untuk halaman baru
      }

      // Menambahkan tanggal (posisi pertama)
      doc.text(`Jakarta, ${formattedDate}`, 170, verticalStart, {
        align: "center",
      });

      // Menambahkan jabatan (di bawah tanggal)
      const jabatanYPosition = verticalStart + 7; // Jarak antar elemen
      doc.text("Dosen PA", 170, jabatanYPosition, { align: "center" });

      const width = 21;
      const height = 21;
      // Menambahkan gambar tanda tangan (di bawah jabatan)
      const yImagePosition = jabatanYPosition + 4; // Jarak antar elemen
      const xImagePosition = 160; // Posisi X sesuai kebutuhan

      doc.addImage(
        data.tanda_tangan_dosen_pa,
        "PNG",
        xImagePosition,
        yImagePosition,
        width,
        height
      );

      // Menambahkan nama dosen (di bawah gambar)
      const ttdY = yImagePosition + height + 4; // Jarak di bawah gambar
      doc.text(`( ${data.nama_dosen_pa} )`, 170, ttdY, {
        align: "center",
      });

      const pdfOutput = doc.output("blob");
      const url = URL.createObjectURL(pdfOutput);

      // Set the URL and open the modal
      setPdfUrl(url);
      setIsModalOpen(true);
      // Membuka PDF di tab baru
      window.open(url, "_blank");
    }
  };

  const getDataBimbingan = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/bimbingan`);

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      setDataBimbingan(data);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
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
    getDataBimbingan();
    getDataTahunAJaran();
  }, []);

  useEffect(() => {
    if (dataTahunAjaran.length > 0) {
      const formattedOptions = dataTahunAjaran.map((data: any) => {
        return {
          value: data,
          label: `${data}`,
        };
      });

      setOptionsTahunAjaran(formattedOptions);
    }
  }, [dataTahunAjaran]);

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
    setIsDetailLaporanDosenClicked(false);
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
    if (dateReschedule && startRescheduleTime && endRescheduleTime) {
      const dateObject = new Date(dateReschedule);

      // Mendapatkan format tanggal yang diinginkan
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };

      // Mengonversi tanggal ke format yang diinginkan
      const formattedDate = dateObject.toLocaleDateString("id-ID", options);
      setRescheduleData(
        `${formattedDate} ${startRescheduleTime}-${endRescheduleTime}`
      );
    }
  }, [dateReschedule, startRescheduleTime, endRescheduleTime]);

  const today = new Date().toISOString().split("T")[0];
  useEffect(() => {
    if (
      dataBimbingan &&
      dataBimbingan.length > 0 &&
      dataLaporanBimbingan &&
      dataLaporanBimbingan.length > 0
    ) {
      getDataBimbinganFilteredByTahunAjaranSemesterAndPeriode();
      getDataLaporanBimbinganFilteredByTahunAjaranSemesterAndPeriode();
    }
  }, [selectedTahunAjaran, selectedSemester, selectedPeriode]);

  useEffect(() => {
    setSelectedSemester("Semua Semester");
    setSelectedPeriode("Semua Periode");
  }, [selectedTahunAjaran]);

  useEffect(() => {
    setSelectedPeriode("Semua Periode");
  }, [selectedSemester]);

  useEffect(() => {
    if (
      dataBimbingan &&
      dataBimbingan.length > 0 &&
      dataLaporanBimbingan &&
      dataLaporanBimbingan.length > 0
    ) {
      getDataBimbinganFilteredByTahunAjaranSemesterAndPeriode();
      getDataLaporanBimbinganFilteredByTahunAjaranSemesterAndPeriode();
    }
  }, [dataLaporanBimbingan, dataBimbingan]);

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
        <div className="md:w-[75%] px-4 md:pl-[30px] md:pr-[128px] py-4 md:py-[30px]">
          <div className="border px-4 md:px-[70px] py-[30px] rounded-lg">
            <div className="flex gap-10">
              {imagePreview ? (
                <img
                  alt="preview"
                  src={imagePreview}
                  className="size-[80px] min-w-[80px] md:size-[200px] rounded-full object-cover"
                />
              ) : dataDosen && dataDosen?.profile_image ? (
                <img
                  src={dataDosen.profile_image}
                  alt="Profile"
                  className="size-[80px] min-w-[80px] md:size-[200px] rounded-full object-cover"
                />
              ) : (
                <ProfileImage
                  onClick={() => {}}
                  className="size-[80px] min-w-[80px] md:size-[200px] rounded-full"
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
        <div className="md:w-[75%] px-4 md:pl-[30px] md:pr-[128px] py-4 md:py-[30px]">
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
                      <div className="grid grid-cols-1 md:grid-cols-3 w-[90%] gap-6 mt-6">
                        {dataJadwalDosenPA
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
                              className="flex justify-between items-center"
                            >
                              <TrashButton
                                onClick={() =>
                                  setIsDeleteJadwalDosenModalOpen(true)
                                }
                                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                              />
                              <div className="text-[14px] w-[100px] mx-3">{`${data.jam_mulai}-${data.jam_selesai}`}</div>
                              {index <
                                dataJadwalDosenPA.filter(
                                  (data) => data.hari === day
                                ).length && (
                                <Image className="" src={line} alt="line" />
                              )}
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
                                            className="text-lg font-medium leading-6 mb-10 text-gray-900 px-6 pt-6"
                                          >
                                            Konfirmasi hapus jadwal kosong ini?
                                          </DialogTitle>
                                          <div className="mt-4 flex justify-end space-x-2 pb-6 px-6 gap-4">
                                            <button
                                              type="button"
                                              className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-8 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
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
                            </div>
                          ))}

                        {isAddJadwal ? (
                          <div className="flex min-w-[400px] items-center gap-7">
                            <button
                              onClick={decreaseTime}
                              className="p-[10px] bg-red-500 outline-none text-white rounded-lg hover:bg-red-600"
                            >
                              <Image
                                src={negatifIcon}
                                className="size-[12px]"
                                alt="minIcon"
                              />
                            </button>
                            <div className="text-sm items-center flex gap-1">
                              <div className="border py-1 px-[3.5px] rounded-lg">
                                {formatTime(startTime)}
                              </div>
                              <div>-</div>
                              <div className="border py-1 px-[4px] rounded-lg">
                                {formatTime(endTime)}
                              </div>
                            </div>

                            <button
                              onClick={increaseTime}
                              className="p-2 bg-green-500 outline-none items-start rounded rounded-lg text-white hover:bg-green-600"
                            >
                              <Image
                                src={plusIcon}
                                className="size-4"
                                alt="addIcon"
                              />
                            </button>
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
        <div className="md:w-[75%] px-4 md:pl-[30px] mb-12 md:pr-[128px] py-4 md:py-[30px] md:min-h-[500px]">
          <div className="flex flex-col gap-6 border px-[30px] pt-[15px] pb-[30px] rounded-lg">
            <h1 className="font-semibold text-[24px]">
              Pengesahan Absensi Bimbingan Akademik Mahasiswa
            </h1>

            {dataPengesahanBimbingan.length > 0 && (
              <div className="flex flex-col gap-4">
                {dataPengesahanBimbingan.length > 0 && (
                  <div className="flex justify-between">
                    <div>Selected ({selectedEntries.length})</div>
                    <div className="flex items-center ">
                      <input
                        type="checkbox"
                        id="selectAll"
                        checked={
                          selectedEntries.length ===
                          dataPengesahanBimbingan.length
                        }
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          setSelectedEntries(
                            isChecked
                              ? dataPengesahanBimbingan.map((data) => data.id)
                              : []
                          );
                        }}
                        className="size-4 cursor-pointer outline-none"
                      />
                      <label htmlFor="selectAll" className="ml-2">
                        Select All ({dataPengesahanBimbingan.length})
                      </label>
                    </div>
                  </div>
                )}
                {selectedEntries.length > 0 ? (
                  <div className="p-4 border rounded-lg shadow-md">
                    <div className="flex flex-col gap-2">
                      <p className="text-md font-semibold">
                        Apakah Anda ingin mengonfirmasi pengesahan untuk{" "}
                        {selectedEntries.length} absensi bimbingan ini?
                      </p>
                      <p className="text-sm text-gray-600">
                        Silakan pilih opsi konfirmasi di bawah ini.
                      </p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() =>
                          handleBunchEditPengesahanKehadiranBimbingan(
                            selectedEntries,
                            "Tidak Sah"
                          )
                        }
                        className="w-1/2 bg-red-500 hover:bg-red-600 text-white cursor-pointer rounded-md py-2 font-medium text-sm transition duration-200 ease-in-out"
                        disabled={keteranganKonfirmasi === ""}
                        aria-label="Konfirmasi Tidak Sah"
                      >
                        Tidak Sah
                      </button>
                      <button
                        onClick={() =>
                          handleBunchEditPengesahanKehadiranBimbingan(
                            selectedEntries,
                            "Sah"
                          )
                        }
                        className="w-1/2 bg-green-500 hover:bg-green-600 text-white cursor-pointer rounded-md py-2 font-medium text-sm transition duration-200 ease-in-out"
                        disabled={keteranganKonfirmasi === ""}
                        aria-label="Konfirmasi Sah"
                      >
                        Sah
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 border rounded-lg shadow-md">
                    <div className="flex flex-col gap-2">
                      <p className="text-md font-semibold">
                        Saat ini, belum ada absensi yang dapat disahkan karena
                        dosen belum memilih bimbingan untuk konfirmasi.
                      </p>
                      <p className="text-sm text-gray-600">
                        Silakan pilih absensi di bawah ini untuk mengonfirmasi
                        pengesahannya!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {dataPengesahanBimbingan.length > 0 ? (
              <div className="flex flex-col gap-4">
                {dataPengesahanBimbingan
                  .slice()
                  .reverse()
                  .map((data) => (
                    <div
                      key={data.id}
                      className="flex flex-col border rounded-lg p-6 gap-4"
                    >
                      <div className="relative">
                        <input
                          className="size-4 cursor-pointer outline-none"
                          type="checkbox"
                          checked={selectedEntries.includes(data.id)}
                          onChange={() => handleSelectEntry(data.id)}
                        />
                      </div>
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
                            className="border mt-2 focus:outline-none text-sm rounded-lg px-3 py-2 w-full max-h-24"
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
                            className="border mt-2 focus:outline-none text-sm rounded-lg px-3 py-2 w-full max-h-24"
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
                              }
                              title="Lihat Gambar"
                            >
                              <EyeIcon className="h-5 w-5 text-gray-700" />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <p>Tanda Tangan Kehadiran :</p>
                          <img
                            alt="ttd absensi"
                            className="self-center p-4 w-[100px]"
                            src={data.ttd_kehadiran}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
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
          <ToastContainer />
        </div>
      )}

      {selectedSubMenuDashboard ===
        "Pengajuan Bimbingan Akademik Mahasiswa" && (
        <div className="md:w-[75%] px-4 md:pl-[30px] md:pr-[128px] py-4 md:py-[30px]">
          <div className="flex flex-col gap-6 border px-[30px] pt-[15px] pb-[30px] rounded-lg">
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
                      {data.status === "Diterima" && (
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
                      )}
                      {data.status === "Reschedule" && (
                        <div className="flex flex-col gap-2">
                          <p className="font-medium">{`Reschedule: ${data.jadwal_bimbingan_reschedule}`}</p>
                          <textarea
                            value={data.keterangan_reschedule}
                            disabled={true}
                            className="px-3 py-2 text-[15px] border rounded-lg resize-none" // Tambahkan 'resize-none' untuk mencegah perubahan ukuran
                            rows={4} // Menentukan jumlah baris yang ditampilkan
                          />
                        </div>
                      )}
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
                                  data.jadwal_bimbingan,
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
                                  data.jadwal_bimbingan,
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
                          <div className="flex flex-col w-full gap-4">
                            <button
                              className="w-full bg-red-500 text-white rounded-md py-2 font-medium text-[14px] cursor-not-allowed"
                              disabled
                            >
                              Reschedule
                            </button>
                            <p className="font-medium text-sm">
                              *Status Reschedule oleh mahasiswa :{" "}
                              {data.status_reschedule}
                            </p>
                          </div>
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
          <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[1000]" onClose={closeModal}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full flex flex-col max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        {selectedAction === "Reschedule"
                          ? "Reschedule Pengajuan"
                          : "Terima Pengajuan"}
                      </Dialog.Title>
                      <div className="mt-2">
                        {selectedAction === "Reschedule" && (
                          <div className="flex flex-col gap-2">
                            <p className="text-sm">{`Jadwal sebelumnya (${selectedPengajuan.jadwal_bimbingan})`}</p>
                            <div className="flex flex-col md:flex-row gap-2 md:gap-4 md:items-center">
                              <input
                                type="date"
                                value={dateReschedule}
                                onChange={handleDateChange}
                                min={today}
                                className="mt-2 px-3 py-2 text-[15px] border rounded-lg"
                              />
                              <div className="flex md:gap-3 items-center">
                                <input
                                  type="time"
                                  value={startRescheduleTime}
                                  onChange={handleStartTimeChange}
                                  className="mt-2 px-3 py-2 text-[15px] border rounded-lg"
                                />
                                <p>-</p>
                                <input
                                  type="time"
                                  value={endRescheduleTime}
                                  onChange={handleEndTimeChange}
                                  className="mt-2 px-3 py-2 text-[15px] border rounded-lg"
                                />
                              </div>
                            </div>
                            <textarea
                              placeholder="Input Keterangan (Misal: Ruang FIK 204 , https://meet.link, atau keterangan lainnya)"
                              value={keterangan}
                              onChange={(e) => setKeterangan(e.target.value)}
                              className="mt-2 px-3 py-2 outline-none text-[15px] border rounded-lg resize-none"
                              rows={4}
                            />
                          </div>
                        )}
                        {selectedAction === "Diterima" && (
                          <div className="flex flex-col gap-2">
                            <textarea
                              placeholder="Input Keterangan (Misal: Ruang FIK 204 , https://meet.link, atau keterangan lainnya)"
                              value={keterangan}
                              onChange={(e) => setKeterangan(e.target.value)}
                              className="mt-2 px-3 outline-none py-2 text-[15px] border rounded-lg resize-none"
                              rows={4}
                            />
                          </div>
                        )}
                      </div>

                      <div className="mt-4 ml-auto">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          onClick={closeModal}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="ml-2 inline-flex justify-center rounded-md border border-transparent bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                          onClick={() => {
                            if (selectedAction === "Diterima") {
                              handleSubmitDiterima(
                                selectedPengajuan.id,
                                "Diterima",
                                keterangan,
                                selectedPengajuan.mahasiswa_id,
                                selectedPengajuan.permasalahan
                              );
                            } else if (selectedAction === "Reschedule") {
                              handleSubmitReschedule(
                                selectedPengajuan.id,
                                "Reschedule",
                                keterangan,
                                rescheduleData,
                                selectedPengajuan.mahasiswa_id
                              );
                            }
                            closeModal();
                          }}
                        >
                          Simpan
                        </button>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>

          <ToastContainer />
        </div>
      )}

      {selectedSubMenuDashboard ===
        "Riwayat Laporan Bimbingan Role Dosen PA" && (
        <div className="md:w-[75%] border md:border-none mt-4 md:mt-0 mx-4 md:mx-0 rounded-lg md:rounded-none px-4 md:pl-[30px] md:pr-[128px] py-4 md:py-[30px] min-h-[500px]">
          <div className=" flex flex-col gap-6 rounded-lg">
            {!isDetailLaporanDosenClicked ? (
              <div className="flex flex-col gap-4">
                <h1 className="font-semibold text-[18px] md:text-[24px]">
                  Riwayat Laporan Bimbingan Akademik
                </h1>
                <div className="flex gap-5">
                  <div className="relative w-1/3">
                    <select
                      className={`px-3 py-2 text-[15px] border rounded-lg appearance-none w-full ${selectedTahunAjaran === "Semua Tahun Ajaran" ? "text-gray-400" : "text-black"}`}
                      value={selectedTahunAjaran}
                      onChange={(e) => setSelectedTahunAjaran(e.target.value)}
                    >
                      <option value="Semua Tahun Ajaran">
                        Semua Tahun Ajaran
                      </option>
                      {optionsTahunAjaran.map((option: any) => (
                        <option
                          className="text-black"
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div
                      className={`${"px-3 py-2 text-[15px] border rounded-lg appearance-none".includes("hidden") ? "hidden" : "block"} ${"px-3 py-2 text-[15px] border rounded-lg appearance-none w-[200px]".match(/mt-\d+/)?.[0] || ""} absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none`}
                    >
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <div className="relative w-1/3">
                    <select
                      disabled={selectedTahunAjaran === "Semua Tahun Ajaran"}
                      className={`px-3 py-2 text-[15px] border rounded-lg appearance-none w-full ${selectedSemester === "Semua Semester" ? "text-gray-400" : "text-black"}`}
                      value={selectedSemester}
                      onChange={(e) => setSelectedSemester(e.target.value)}
                    >
                      <option value="Semua Semester">Semua Semester</option>
                      {[
                        { value: "Ganjil", label: "Ganjil" },
                        { value: "Genap", label: "Genap" },
                      ].map((option: any) => (
                        <option
                          className="text-black"
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div
                      className={`${"px-3 py-2 text-[15px] border rounded-lg appearance-none md:w-[200px]".includes("hidden") ? "hidden" : "block"} ${"px-3 py-2 text-[15px] border rounded-lg appearance-none w-[200px]".match(/mt-\d+/)?.[0] || ""} absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none`}
                    >
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <div className="relative w-1/3">
                    <select
                      disabled={
                        selectedTahunAjaran === "Semua Tahun Ajaran" ||
                        selectedSemester === "Semua Semester"
                      }
                      className={`px-3 py-2 text-[15px] border rounded-lg appearance-none w-full ${selectedPeriode === "Semua Periode" ? "text-gray-400" : "text-black"}`}
                      value={selectedPeriode}
                      onChange={(e) => setSelectedPeriode(e.target.value)}
                    >
                      <option value="Semua Periode">Semua Periode</option>
                      {[
                        { value: "Perwalian KRS", label: "Perwalian KRS" },
                        { value: "Perwalian UTS", label: "Perwalian UTS" },
                        { value: "Perwalian UAS", label: "Perwalian UAS" },
                      ].map((option: any) => (
                        <option
                          className="text-black"
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div
                      className={`${"px-3 py-2 text-[15px] border rounded-lg appearance-none md:w-[200px]".includes("hidden") ? "hidden" : "block"} ${"px-3 py-2 text-[15px] border rounded-lg appearance-none w-[200px]".match(/mt-\d+/)?.[0] || ""} absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none`}
                    >
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
                {filteredDataLaporanBimbingan.length > 0 ? (
                  filteredDataLaporanBimbingan
                    .slice()
                    .reverse()
                    .map((data, index) => (
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
                            <p className="font-medium">
                              {data.jenis_bimbingan}
                            </p>
                            <p className="font-medium">
                              {data.sistem_bimbingan}
                            </p>
                          </div>
                          <div
                            className={`${data.status === "Menunggu Feedback Kaprodi" ? "bg-red-500" : "bg-green-500"} text-[10px] md:text-[16px] p-1 md:p-3 self-start md:self-center rounded-lg`}
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
              <div className="mb-20">
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
                        className={`self-start ${dataClickedLaporanBimbingan?.status === "Sudah Diberikan Feedback" ? "bg-green-500" : "bg-red-500"} text-[10px] md:text-[16px] p-1 md:p-3 rounded-lg`}
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
                          onClick={(e: any) => {
                            handlePreviewPDF(e, dataClickedLaporanBimbingan);
                          }}
                          className="flex underline hover:cursor-pointer items-center text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          <FontAwesomeIcon icon={faFilePdf} className="mr-2" />{" "}
                          {/* Ikon PDF */}
                          Buka PDF
                        </a>
                      </div>

                      <div className="flex overflow-x-auto gap-8 border p-8 rounded-xl mt-2 h-[300px]">
                        {dataClickedLaporanBimbingan?.dokumentasi
                          ?.split(", ")
                          .map((data, index) => (
                            <img
                              alt="dokumentasi"
                              key={index}
                              className="ronded rounded-xl"
                              src={data}
                            />
                          ))}
                      </div>
                      {dataClickedLaporanBimbingan?.feedback_kaprodi !==
                        null && (
                        <div className="flex flex-col gap-3 rounded-lg">
                          <h3 className="font-medium">Feedback Kaprodi</h3>

                          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                            <p className="text-gray-700">
                              {dataClickedLaporanBimbingan?.feedback_kaprodi}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <PDFModal
                  isOpen={isModalOpen}
                  closeModal={closePDFModal}
                  pdfUrl={pdfUrl}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardDosenPA;
