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
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./fonts/times new roman bold-normal";
import "./fonts/times new roman-normal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import DonutChart from "@/components/ui/DonutChart";
import TabelStatistikLaporan from "@/components/ui/TabelStatistikLaporan";
import { Provider } from "react-redux";
import store from "@/components/store/store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DashboardKaprodi = ({ selectedSubMenuDashboard, dataUser }) => {
  const [namaLengkapKaprodi, setNamaLengkapKaprodi] = useState<string>("");
  const [emailKaprodi, setEmailKaprodi] = useState<string>("");
  const [nip, setNip] = useState<string>("");
  const [noTelpKaprodi, setNoTelpKaprodi] = useState<string>("");
  const [userProfile, setUserProfile] = useState(null);
  const [selectedDataLaporanBimbingan, setSelectedDataLaporanBimbingan] =
    useState(null);
  const [selectedDataDosenPA, setSelectedDataDosenPA] = useState(null);
  const [feedbackKaprodi, setFeedbackKaprodi] = useState<string>("");
  const [selectedTahunAjaran, setSelectedTahunAjaran] =
    useState<string>("Semua Tahun Ajaran");
  const [selectedSemester, setSelectedSemester] =
    useState<string>("Semua Semester");
  const [isDetailLaporanKaprodiClicked, setIsDetailLaporanKaprodiClicked] =
    useState<boolean>(false);
  const [isDetailDosenPAClicked, setIsDetailDosenPAClicked] =
    useState<boolean>(false);
  const [dataDosenPA, setDataDosenPA] = useState([]);
  const [dataLaporanBimbingan, setDataLaporanBimbingan] = useState([]);
  const [filteredDataLaporanBimbingan, setFilteredDataLaporanBimbingan] =
    useState([]);
  const [dataLaporanBimbinganByDosenPAID, setDataLaporanBimbinganByDosenPAID] =
    useState<any>([]);
  const [isDataChanged, setIsDataChanged] = useState<boolean>(false);
  const [dataBimbinganBySelectedDosenPA, setDataBimbinganBySelectedDosenPA] =
    useState([]);
  const [dataBimbingan, setDataBimbingan] = useState([]);
  const [filteredDataBimbingan, setFilteredDataBimbingan] = useState([]);
  const [dataAllMahasiswa, setDataAllMahasiswa] = useState([]);
  const [dataKaprodi, setDataKaprodi] = useState<any>({});
  const [dataKaprodiUser, setDataKaprodiUser] = useState<any>({});
  const [imagePreview, setImagePreview] = useState(null);
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
  const [dataTahunAjaran, setDataTahunAjaran] = useState([]);
  const [optionsTahunAjaran, setOptionsTahunAjaran] = useState([]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

  const handleDetailLaporanKaprodi = (data) => {
    setSelectedDataLaporanBimbingan(data);
    setIsDetailLaporanKaprodiClicked((prev) => !prev);
  };

  const handleDetailDosenPA = (data) => {
    setSelectedDataDosenPA(data);
    setIsDetailDosenPAClicked((prev) => !prev);
  };

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
        `${API_BASE_URL}/api/datakaprodi`,
        updatedData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  };

  const handleEditKaprodi = async () => {
    try {
      let jurusanValue = {
        nama: namaLengkapKaprodi,
        email: emailKaprodi,
        nip,
        hp: noTelpKaprodi,
        profile_image: !imagePreview ? null : imagePreview,
      };

      await patchKaprodi(jurusanValue);
      getDataKaprodiByNip();
      setImagePreview(null);
    } catch (error) {
      console.error("Failed to save the updated order.");
    }
  };

  const getDataKaprodiByNip = async () => {
    try {
      const dataKaprodi = await axios.get(`${API_BASE_URL}/api/datakaprodi`);

      const kaprodi = dataKaprodi.data.find(
        (data: any) => data.nip === dataUser.nip
      );

      if (!kaprodi) {
        console.error("Kaprodi tidak ditemukan");
        return;
      }

      setUserProfile({
        nama: kaprodi.nama,
        email: kaprodi.email,
        nip: kaprodi.nip,
        hp: kaprodi.hp,
      });

      setDataKaprodi(kaprodi);

      setNamaLengkapKaprodi(kaprodi.nama);
      setEmailKaprodi(kaprodi.email);
      setNip(kaprodi.nip);
      setNoTelpKaprodi(kaprodi.hp);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataKaprodiByKaprodiNip = async () => {
    try {
      const dataKaprodi = await axios.get(`${API_BASE_URL}/api/datakaprodi`);

      const kaprodi = dataKaprodi.data.find(
        (data: any) => data.nip == dataUser.nip
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
        (data: any) => data.nip === dataUser.nip
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
  const getDataLaporanBimbinganBySelectedDosenPA = async () => {
    try {
      const dataDosenPA = await axios.get(`${API_BASE_URL}/api/datadosenpa`);

      const dosenPA = dataDosenPA.data.find(
        (data: any) => data.nip === selectedDataDosenPA.nip
      );

      if (!dosenPA) {
        throw new Error("Dosen PA tidak ditemukan");
      }

      const dosenPAID = dosenPA.id;

      const dataLaporanBimbingan = await axios.get(
        `${API_BASE_URL}/api/laporanbimbingan`
      );

      const laporanBimbingan = dataLaporanBimbingan.data.filter(
        (data: any) => data.dosen_pa_id === dosenPAID
      );

      setDataLaporanBimbinganByDosenPAID(laporanBimbingan);
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

      return {
        success: true,
        message:
          response.data.message ||
          "Feedback laporan bimbingan telah berhasil diberikan!",

        data: response.data,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Terjadi kesalahan. Silakan coba lagi.";
      throw new Error(errorMessage);
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
      toast.success(
        <div className="flex items-center">
          <span>
            {result.message ||
              "Feedback laporan bimbingan telah berhasil diberikan!"}
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
      setFeedbackKaprodi("");
      getDataLaporanBimbinganByKaprodiId();
      setIsDetailLaporanKaprodiClicked(!isDetailLaporanKaprodiClicked);
      setSelectedDataLaporanBimbingan(null);
      setTimeout(() => {
        setIsDetailLaporanKaprodiClicked(isDetailLaporanKaprodiClicked);
        setSelectedDataLaporanBimbingan({
          ...selectedDataLaporanBimbingan,
          status: "Sudah Diberikan Feedback",
          feedback_kaprodi: feedbackKaprodi,
        });
      }, 1);
    } catch (error) {
      toast.error(
        <div className="flex items-center">
          <span>
            {error.message ||
              "Feedback laporan bimbingan gagal diberikan. Silahkan coba lagi!"}
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

  const getDataPrestasiIlmiahMahasiswaByIdLaporan = async () => {
    try {
      const dataPrestasiIlmiahMahasiswa = await axios.get<any>(
        `${API_BASE_URL}/api/prestasiilmiahmahasiswa`
      );
      const idLaporan = selectedDataLaporanBimbingan?.id;

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
      const idLaporan = selectedDataLaporanBimbingan?.id;

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

  const getDataBimbinganFilteredByTahunAjaranAndSemester = () => {
    console.log(selectedTahunAjaran);
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
    setFilteredDataBimbingan(filteredDataBimbinganBySemester);
    return;
  };

  const getDataLaporanBimbinganFilteredByTahunAjaranAndSemester = () => {
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
    setFilteredDataLaporanBimbingan(filteredDataLaporanBimbinganBySemester);
    return;
  };

  const getDataStatusMahasiswaByIdLaporan = async () => {
    try {
      const dataStatusMahasiswa = await axios.get<any>(
        `${API_BASE_URL}/api/datastatusmahasiswa`
      );
      const idLaporan = selectedDataLaporanBimbingan?.id;

      const selectedDataStatusMahasiswa = dataStatusMahasiswa.data.filter(
        (data) => data.laporan_bimbingan_id === idLaporan
      );

      setSelectedDataStatusMahasiswa(selectedDataStatusMahasiswa);
    } catch (error) {
      console.error("Error:", error);
      throw error;
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
    } else if (data.jenis_bimbingan === "Perwalian") {
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
      doc.text(`Nama Dosen PA     :    ${data.nama_dosen_pa}`, 15, 68); // Moved up by 10y

      doc.setFont("times new roman bold");

      doc.text("A. PENDAHULUAN", 15, 91); // Adjusted x to 15 and y down by 20

      doc.setFont("times new roman");

      let yPosition = 98;
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
      const bimbinganData = selectedBimbingan;

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

      const bimbinganDataLembarKonsultasi = selectedBimbingan.filter(
        (data) => data.permasalahan !== null
      );

      const bodyBimbinganLembarKonsultasi =
        bimbinganDataLembarKonsultasi.length === 0
          ? [["-", "-", "-", "-", "-", "-", "-", "-"]] // Baris default untuk data kosong
          : bimbinganDataLembarKonsultasi.map((item, index) => [
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
        startY: 48,
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

      // Membuka PDF di tab baru
      window.open(url, "_blank");
    }
  };

  useEffect(() => {
    getDataPrestasiIlmiahMahasiswaByIdLaporan();
    getDataPrestasiPorseniMahasiswaByIdLaporan();
    getDataStatusMahasiswaByIdLaporan();
  }, [selectedDataLaporanBimbingan]);

  useEffect(() => {
    setImagePreview(null);
    getDataKaprodiByNip();
    setIsDetailLaporanKaprodiClicked(false);
    setSelectedTahunAjaran("Semua Tahun Ajaran");
    setSelectedSemester("Semua Semester");
  }, [selectedSubMenuDashboard]);

  useEffect(() => {
    if (dataUser && Object.keys(dataUser).length > 0 && dataUser.nip) {
      getDataKaprodiByNip();
      getDataKaprodiByKaprodiNip();
    }
  }, [dataUser]);

  useEffect(() => {
    if (
      selectedDataDosenPA &&
      selectedDataDosenPA.nip &&
      selectedDataDosenPA.id
    ) {
      getDataBimbinganByDosenPaId();
      getDataLaporanBimbinganBySelectedDosenPA();
    }
  }, [selectedDataDosenPA]);

  useEffect(() => {
    if (
      userProfile &&
      Object.keys(userProfile).length > 0 &&
      userProfile.nama
    ) {
      getDataLaporanBimbinganByKaprodiId();
    }
  }, [userProfile]);

  useEffect(() => {
    if (userProfile && userProfile.nama !== "") {
      const isDataChanged =
        userProfile.nama !== namaLengkapKaprodi ||
        userProfile.email !== emailKaprodi ||
        userProfile.nip !== nip ||
        userProfile.hp !== noTelpKaprodi;
      setIsDataChanged(isDataChanged);
    }
  }, [userProfile, namaLengkapKaprodi, emailKaprodi, nip, noTelpKaprodi]);

  useEffect(() => {
    getDataDosenPA();
    getDataMahasiswa();
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
    if (
      dataBimbingan &&
      dataBimbingan.length > 0 &&
      dataLaporanBimbingan &&
      dataLaporanBimbingan.length > 0
    ) {
      getDataBimbinganFilteredByTahunAjaranAndSemester();
      getDataLaporanBimbinganFilteredByTahunAjaranAndSemester();
    }
  }, [selectedTahunAjaran, selectedSemester]);

  useEffect(() => {
    if (
      dataBimbingan &&
      dataBimbingan.length > 0 &&
      dataLaporanBimbingan &&
      dataLaporanBimbingan.length > 0
    ) {
      getDataBimbinganFilteredByTahunAjaranAndSemester();
      getDataLaporanBimbinganFilteredByTahunAjaranAndSemester();
    }
  }, [dataLaporanBimbingan, dataBimbingan]);

  return (
    <Provider store={store}>
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
              ) : dataKaprodi && dataKaprodi.profile_image ? (
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
                disabled
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
                disabled
                type="text"
                placeholder={emailKaprodi === "" ? "Email" : emailKaprodi}
                onChange={(e) => {
                  setEmailKaprodi(e.target.value);
                }}
                value={emailKaprodi}
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
                  handleEditKaprodi();
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
      {selectedSubMenuDashboard === "Statistik Bimbingan Akademik" && (
        <div className="w-[75%] pl-[30px] pr-[128px] py-[30px]">
          <div className="border px-[30px] py-[30px] rounded-lg">
            <div className="flex flex-col gap-4">
              <div className="flex gap-5">
                <div className="relative">
                  <select
                    className={`px-3 py-2 text-[15px] border rounded-lg appearance-none w-[200px] ${selectedTahunAjaran === "Semua Tahun Ajaran" ? "text-gray-400" : "text-black"}`}
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
                    className={`${"px-3 py-2 text-[15px] border rounded-lg appearance-none w-[200px]".includes("hidden") ? "hidden" : "block"} ${"px-3 py-2 text-[15px] border rounded-lg appearance-none w-[200px]".match(/mt-\d+/)?.[0] || ""} absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none`}
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
                <div className="relative">
                  <select
                    className={`px-3 py-2 text-[15px] border rounded-lg appearance-none w-[200px] ${selectedSemester === "Semua Semester" ? "text-gray-400" : "text-black"}`}
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
                    className={`${"px-3 py-2 text-[15px] border rounded-lg appearance-none w-[200px]".includes("hidden") ? "hidden" : "block"} ${"px-3 py-2 text-[15px] border rounded-lg appearance-none w-[200px]".match(/mt-\d+/)?.[0] || ""} absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none`}
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
              {filteredDataBimbingan && filteredDataLaporanBimbingan && (
                <div className="flex flex-col gap-5">
                  <div className="border rounded-lg font-semibold text-[18px]">
                    <h1 className="p-6">
                      Persentase Sebaran Bimbingan Pribadi
                    </h1>
                    <div className="w-full mt-4 mx-auto">
                      <DonutChart dataBimbingan={filteredDataBimbingan} />
                    </div>
                  </div>
                  <TabelStatistikLaporan
                    dataBimbingan={filteredDataBimbingan}
                    dataLaporanBimbingan={filteredDataLaporanBimbingan}
                  />
                </div>
              )}
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
                      src={selectedDataDosenPA?.profile_image}
                      alt="Profile Image"
                      className="size-[120px] rounded-full cursor-pointer"
                    />
                    <div className="font-medium mt-2">
                      <p className="self-center">{selectedDataDosenPA?.nama}</p>
                      <p className="self-center">{selectedDataDosenPA?.nip}</p>
                      <p className="self-center">
                        {selectedDataDosenPA?.email}
                      </p>
                      <p className="self-center">{selectedDataDosenPA?.hp}</p>
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
                          dataLaporanBimbinganByDosenPAID.filter(
                            (data) =>
                              data !== null &&
                              data.status === "Sudah Diberikan Feedback"
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
                {dataDosenPA.length > 0 ? (
                  dataDosenPA.map((data) => {
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
                            src={data.profile_image}
                            alt="Profile Image"
                            className="w-8 h-8 rounded-full cursor-pointer"
                          />
                          <p className="self-center font-medium">{data.nama}</p>
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
                  })
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
                      Data dosen tidak ditemukan.
                    </p>
                    <p className="text-center text-gray-600">
                      Tunggu hingga data dosen ditambahkan.
                    </p>
                  </div>
                )}
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
                        <p>{selectedDataLaporanBimbingan?.jadwal_bimbingan}</p>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex flex-col gap-4 w-[55%]">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center">
                              <p className="font-medium w-1/3">
                                Tahun Akademik
                              </p>
                              <span className="font-medium">:</span>
                              <p className="flex-1 ml-4">
                                {selectedDataLaporanBimbingan.tahun_ajaran}
                              </p>
                            </div>
                            <div className="flex items-center">
                              <p className="font-medium w-1/3">Semester</p>
                              <span className="font-medium">:</span>
                              <p className="flex-1 ml-4">
                                {selectedDataLaporanBimbingan.semester}
                              </p>
                            </div>
                            <div className="flex items-center">
                              <p className="font-medium w-1/3">Nama Dosen PA</p>
                              <span className="font-medium">:</span>
                              <p className="flex-1 ml-4">
                                {selectedDataLaporanBimbingan.nama_dosen_pa}
                              </p>
                            </div>
                            <div className="flex items-center">
                              <p className="font-medium w-1/3">
                                Jenis Bimbingan
                              </p>
                              <span className="font-medium">:</span>
                              <p className="flex-1 ml-4">
                                {selectedDataLaporanBimbingan?.jenis_bimbingan}
                              </p>
                            </div>
                            <div className="flex items-center">
                              <p className="font-medium w-1/3">
                                Jumlah Peserta
                              </p>
                              <span className="font-medium">:</span>
                              <p className="flex-1 ml-4">
                                {selectedDataLaporanBimbingan?.jumlah_mahasiswa}{" "}
                                Mahasiswa
                              </p>
                            </div>
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
                          <h3 className="font-medium">PDF Laporan Bimbingan</h3>
                          <a
                            onClick={(e: any) => {
                              handlePreviewPDF(e, selectedDataLaporanBimbingan);
                            }}
                            className="flex underline hover:cursor-pointer items-center text-blue-600 hover:text-blue-800 font-semibold"
                          >
                            <FontAwesomeIcon
                              icon={faFilePdf}
                              className="mr-2"
                            />{" "}
                            {/* Ikon PDF */}
                            Buka PDF
                          </a>
                        </div>

                        <div className="flex flex-col gap-2">
                          <h3 className="font-medium">Dokumentasi</h3>
                          <div className="flex overflow-x-auto gap-8 border p-8 rounded-xl mt-2 h-[300px]">
                            {selectedDataLaporanBimbingan?.dokumentasi
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
                        </div>
                        <div className="flex flex-col gap-3 rounded-lg">
                          <h3 className="font-medium">Feedback Kaprodi</h3>
                          {selectedDataLaporanBimbingan?.feedback_kaprodi !==
                          null ? (
                            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                              <p className="text-gray-700">
                                {selectedDataLaporanBimbingan?.feedback_kaprodi}
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
                                    selectedDataLaporanBimbingan?.id,
                                    selectedDataLaporanBimbingan?.dosen_pa_id,
                                    "Sudah Diberikan Feedback"
                                  );
                                }}
                                className="text-white bg-green-500 hover:bg-green-600 text-[14px] py-2 font-medium rounded-lg ml-auto w-1/5 hover:bg--600 transition duration-200"
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
                  Saat ini belum ada data riwayat laporan bimbingan.
                </p>
                <p className="text-center text-gray-600">
                  Silakan tunggu dosen pembimbing akademik melaporkan bimbingan.
                </p>
              </div>
            )}
          </div>
          <ToastContainer />
        </div>
      )}
    </Provider>
  );
};

export default DashboardKaprodi;
