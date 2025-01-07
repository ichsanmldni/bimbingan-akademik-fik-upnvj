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
      console.log(laporanBimbingan);

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

  const getDataPrestasiIlmiahMahasiswaByIdLaporan = async () => {
    try {
      const dataPrestasiIlmiahMahasiswa = await axios.get<any>(
        `${API_BASE_URL}/api/prestasiilmiahmahasiswa`
      );
      console.log(dataPrestasiIlmiahMahasiswa);
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

  useEffect(() => {
    getDataPrestasiIlmiahMahasiswaByIdLaporan();
    getDataPrestasiPorseniMahasiswaByIdLaporan();
    getDataStatusMahasiswaByIdLaporan();
  }, [selectedDataLaporanBimbingan]);

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
      {selectedSubMenuDashboard === "Statistik Bimbingan Akademik" && (
        <div className="w-[75%] pl-[30px] pr-[128px] py-[30px]">
          <div className="border px-[30px] py-[30px] rounded-lg">
            <div className="flex flex-col gap-4">
              <div className="flex gap-5">
                <SelectField
                  options={[{ value: "2024/2025", label: "2024/2025" }]}
                  onChange={(e) => setSelectedTahunAjaran(e.target.value)}
                  value={selectedTahunAjaran}
                  placeholder="Semua Tahun Ajaran"
                  className={`px-3 py-2 text-[15px] border rounded-lg appearance-none w-[240px]`}
                />
                <SelectField
                  options={[
                    { value: "Gasal", label: "Gasal" },
                    { value: "Genap", label: "Genap" },
                  ]}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  value={selectedSemester}
                  placeholder="Semua Semester"
                  className={`px-3 py-2 text-[15px] border rounded-lg appearance-none w-[200px]`}
                />
              </div>
              <div className="border rounded-lg font-semibold text-[18px]">
                <h1 className="p-6">Persentase Sebaran</h1>
                <div className="w-full mt-4 mx-auto max-w-[320px]">
                  <DonutChart />
                </div>
              </div>
              <TabelStatistikLaporan />
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
                            onClick={(e) => {
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
                          <img
                            className="w-1/2"
                            src={selectedDataLaporanBimbingan?.dokumentasi}
                          />
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
                                  setIsDetailLaporanKaprodiClicked(
                                    !isDetailLaporanKaprodiClicked
                                  );
                                  setSelectedDataLaporanBimbingan(null);
                                  setTimeout(() => {
                                    setIsDetailLaporanKaprodiClicked(
                                      isDetailLaporanKaprodiClicked
                                    );
                                    setSelectedDataLaporanBimbingan({
                                      ...selectedDataLaporanBimbingan,
                                      status: "Sudah Diberikan Feedback",
                                      feedback_kaprodi: feedbackKaprodi,
                                    });
                                  }, 1);
                                }}
                                className="text-white bg-orange-500 text-[14px] py-2 font-medium rounded-lg ml-auto w-1/5 hover:bg-orange-600 transition duration-200"
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
                            src={selectedDataLaporanBimbingan?.dokumentasi}
                          />
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
                      </div> */}
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
