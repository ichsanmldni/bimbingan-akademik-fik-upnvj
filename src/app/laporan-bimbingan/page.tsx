"use client";

import InputField from "@/components/ui/InputField";
import Logo from "@/components/ui/LogoUPNVJ";
import SelectField from "@/components/ui/SelectField";
import NavbarUser from "@/components/ui/NavbarUser";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ImagePlus from "../../assets/images/image-plus.png";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";
import cancelIcon from "../../assets/images/cancel-icon.png";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import isHotkey from "is-hotkey";
import plusIcon from "../../assets/images/plus.png";
import SignatureCanvas from "react-signature-canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Editable, withReact, useSlate, Slate } from "slate-react";
import "./fonts/times new roman bold-normal";
import "./fonts/times new roman-normal";
import {
  Editor,
  Transforms,
  createEditor,
  Descendant,
  Element as SlateElement,
} from "slate";
import { withHistory } from "slate-history";
import { Button, Toolbar } from "./components";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import CodeIcon from "@mui/icons-material/Code";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import Modal from "@/components/features/home/Modal";
import EditButton from "@/components/ui/EditButton";
import TrashButton from "@/components/ui/TrashButton";
import FileButton from "@/components/ui/FileButton";
import PDFModal from "./pdfModal";

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

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
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [selectedTahunAjaran, setSelectedTahunAjaran] = useState<string>("");
  const [pendahuluan, setPendahuluan] = useState([]);
  const [kendala, setKendala] = useState<string>("");
  const [solusi, setSolusi] = useState<string>("");
  const [kesimpulan, setKesimpulan] = useState([]);
  const [dokumentasi, setDokumentasi] = useState<string>("");
  const [roleUser, setRoleUser] = useState<string>("");
  const [dataUser, setDataUser] = useState<User>({} as User);
  const [dataDosenPA, setDataDosenPA] = useState<Dosen[]>([]);
  const [dataKaprodi, setDataKaprodi] = useState<Kaprodi[]>([]);
  const [optionsKaprodi, setOptionsKaprodi] = useState<
    { value: string; label: string }[]
  >([]);
  const [optionsSemester, setOptionsSemester] = useState<
    { value: string; label: string }[]
  >([
    { value: "Ganjil", label: "Ganjil" },
    { value: "Genap", label: "Genap" },
  ]);
  const [dataSelectedKaprodi, setDataSelectedKaprodi] =
    useState<Kaprodi | null>(null);
  const [dataTahunAjaran, setDataTahunAjaran] = useState<any[]>([]);
  const [optionsTahunAjaran, setOptionsTahunAjaran] = useState<
    { value: string; label: string }[]
  >([]);
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

  const [jurusanFilter, setJurusanFilter] = useState("");
  const [jadwalFilter, setJadwalFilter] = useState("");
  const [jenisBimbinganFilter, setJenisBimbinganFilter] = useState("");
  const [
    showPrestasiAkademikMahasiswaForm,
    setShowPrestasiAkademikMahasiswaForm,
  ] = useState(false);
  const [
    jumlahMahasiswaIpkAPrestasiAkademikMahasiswaForm,
    setJumlahMahasiswaIpkAPrestasiAkademikMahasiswaForm,
  ] = useState(0);
  const [
    jumlahMahasiswaIpkBPrestasiAkademikMahasiswaForm,
    setJumlahMahasiswaIpkBPrestasiAkademikMahasiswaForm,
  ] = useState(0);
  const [
    jumlahMahasiswaIpkCPrestasiAkademikMahasiswaForm,
    setJumlahMahasiswaIpkCPrestasiAkademikMahasiswaForm,
  ] = useState(0);
  const [
    jumlahMahasiswaIpkDPrestasiAkademikMahasiswaForm,
    setJumlahMahasiswaIpkDPrestasiAkademikMahasiswaForm,
  ] = useState(0);
  const [
    jumlahMahasiswaIpkEPrestasiAkademikMahasiswaForm,
    setJumlahMahasiswaIpkEPrestasiAkademikMahasiswaForm,
  ] = useState(0);
  const [
    jumlahMahasiswaBeasiswaBBMPrestasiMahasiswaMendapatkanBeasiswaForm,
    setJumlahMahasiswaBeasiswaBBMPrestasiMahasiswaMendapatkanBeasiswaForm,
  ] = useState(0);
  const [
    jumlahMahasiswaBeasiswaPegadaianPrestasiMahasiswaMendapatkanBeasiswaForm,
    setJumlahMahasiswaBeasiswaPegadaianPrestasiMahasiswaMendapatkanBeasiswaForm,
  ] = useState(0);
  const [
    jumlahMahasiswaBeasiswaSupersemarPrestasiMahasiswaMendapatkanBeasiswaForm,
    setJumlahMahasiswaBeasiswaSupersemarPrestasiMahasiswaMendapatkanBeasiswaForm,
  ] = useState(0);
  const [
    jumlahMahasiswaBeasiswaPPAPrestasiMahasiswaMendapatkanBeasiswaForm,
    setJumlahMahasiswaBeasiswaPPAPrestasiMahasiswaMendapatkanBeasiswaForm,
  ] = useState(0);
  const [
    jumlahMahasiswaBeasiswaYKLPrestasiMahasiswaMendapatkanBeasiswaForm,
    setJumlahMahasiswaBeasiswaYKLPrestasiMahasiswaMendapatkanBeasiswaForm,
  ] = useState(0);
  const [
    jumlahMahasiswaBeasiswaDllPrestasiMahasiswaMendapatkanBeasiswaForm,
    setJumlahMahasiswaBeasiswaDllPrestasiMahasiswaMendapatkanBeasiswaForm,
  ] = useState(0);
  const [showPrestasiIlmiahMahasiswaForm, setShowPrestasiIlmiahMahasiswaForm] =
    useState(false);
  const [
    prestasiIlmiahMahasiswaFormValue,
    setPrestasiIlmiahMahasiswaFormValue,
  ] = useState([]);
  const [
    prestasiMahasiswaMengikutiPorseniFormValue,
    setPrestasiMahasiswaMengikutiPorseniFormValue,
  ] = useState([]);
  const [dataStatusMahasiswaFormValue, setDataStatusMahasiswaFormValue] =
    useState([]);
  const [
    isModalAddPrestasiIlmiahMahasiswaOpen,
    setIsModalAddPrestasiIlmiahMahasiswaOpen,
  ] = useState(false);
  const [
    isModalAddPrestasiMahasiswaMengikutiPorseniOpen,
    setIsModalAddPrestasiMahasiswaMengikutiPorseniOpen,
  ] = useState(false);
  const [
    isModalAddDataStatusMahasiswaOpen,
    setIsModalAddDataStatusMahasiswaOpen,
  ] = useState(false);
  const [
    isModalEditPrestasiIlmiahMahasiswaOpen,
    setIsModalEditPrestasiIlmiahMahasiswaOpen,
  ] = useState(false);
  const [
    isModalEditPrestasiMahasiswaMengikutiPorseniOpen,
    setIsModalEditPrestasiMahasiswaMengikutiPorseniOpen,
  ] = useState(false);
  const [
    isModalEditDataStatusMahasiswaOpen,
    setIsModalEditDataStatusMahasiswaOpen,
  ] = useState(false);
  const [
    isModalDeletePrestasiIlmiahMahasiswaOpen,
    setIsModalDeletePrestasiIlmiahMahasiswaOpen,
  ] = useState(false);
  const [
    isModalDeletePrestasiMahasiswaMengikutiPorseniOpen,
    setIsModalDeletePrestasiMahasiswaMengikutiPorseniOpen,
  ] = useState(false);
  const [
    isModalDeleteDataStatusMahasiswaOpen,
    setIsModalDeleteDataStatusMahasiswaOpen,
  ] = useState(false);
  const [
    dataSelectedPrestasiIlmiahMahasiswaEditModal,
    setDataSelectedPrestasiIlmiahMahasiswaEditModal,
  ] = useState({});
  const [
    dataSelectedPrestasiMahasiswaMengikutiPorseniEditModal,
    setDataSelectedPrestasiMahasiswaMengikutiPorseniEditModal,
  ] = useState({});
  const [
    dataSelectedDataStatusMahasiswaEditModal,
    setDataSelectedDataStatusMahasiswaEditModal,
  ] = useState({});
  const [
    idSelectedPrestasiIlmiahMahasiswaDeleteModal,
    setIdSelectedPrestasiIlmiahMahasiswaDeleteModal,
  ] = useState(null);
  const [
    idSelectedPrestasiMahasiswaMengikutiPorseniDeleteModal,
    setIdSelectedPrestasiMahasiswaMengikutiPorseniDeleteModal,
  ] = useState(null);
  const [
    idSelectedDataStatusMahasiswaDeleteModal,
    setIdSelectedDataStatusMahasiswaDeleteModal,
  ] = useState(null);
  const [
    bidangPrestasiAddPrestasiIlmiahMahasiswaModal,
    setBidangPrestasiAddPrestasiIlmiahMahasiswaModal,
  ] = useState("");
  const [
    jenisKegiatanAddPrestasiMahasiswaMengikutiPorseniModal,
    setJenisKegiatanAddPrestasiMahasiswaMengikutiPorseniModal,
  ] = useState("");
  const [
    nimAddPrestasiIlmiahMahasiswaModal,
    setNimAddPrestasiIlmiahMahasiswaModal,
  ] = useState("");
  const [
    nimAddPrestasiMahasiswaMengikutiPorseniModal,
    setNimAddPrestasiMahasiswaMengikutiPorseniModal,
  ] = useState("");
  const [nimAddDataStatusMahasiswaModal, setNimAddDataStatusMahasiswaModal] =
    useState("");
  const [
    namaLengkapAddPrestasiIlmiahMahasiswaModal,
    setNamaLengkapAddPrestasiIlmiahMahasiswaModal,
  ] = useState("");
  const [
    namaLengkapAddPrestasiMahasiswaMengikutiPorseniModal,
    setNamaLengkapAddPrestasiMahasiswaMengikutiPorseniModal,
  ] = useState("");
  const [
    namaLengkapAddDataStatusMahasiswaModal,
    setNamaLengkapAddDataStatusMahasiswaModal,
  ] = useState("");
  const [
    tingkatPrestasiAddPrestasiIlmiahMahasiswaModal,
    setTingkatPrestasiAddPrestasiIlmiahMahasiswaModal,
  ] = useState("");
  const [
    tingkatPrestasiAddPrestasiMahasiswaMengikutiPorseniModal,
    setTingkatPrestasiAddPrestasiMahasiswaMengikutiPorseniModal,
  ] = useState("");
  const [
    statusAddDataStatusMahasiswaModal,
    setStatusAddDataStatusMahasiswaModal,
  ] = useState("");
  const [
    fileAddPrestasiIlmiahMahasiswaModal,
    setFileAddPrestasiIlmiahMahasiswaModal,
  ] = useState(null);
  const [
    fileAddPrestasiMahasiswaMengikutiPorseniModal,
    setFileAddPrestasiMahasiswaMengikutiPorseniModal,
  ] = useState(null);
  const [
    previewUrlAddPrestasiIlmiahMahasiswaModal,
    setPreviewUrlAddPrestasiIlmiahMahasiswaModal,
  ] = useState("");
  const [
    previewUrlAddPrestasiMahasiswaMengikutiPorseniModal,
    setPreviewUrlAddPrestasiMahasiswaMengikutiPorseniModal,
  ] = useState("");
  const [
    previewUrlEditPrestasiIlmiahMahasiswaModal,
    setPreviewUrlEditPrestasiIlmiahMahasiswaModal,
  ] = useState("");
  const [
    previewUrlEditPrestasiMahasiswaMengikutiPorseniModal,
    setPreviewUrlEditPrestasiMahasiswaMengikutiPorseniModal,
  ] = useState("");
  const [
    showPrestasiMahasiswaMendapatkanBeasiswaForm,
    setShowPrestasiMahasiswaMendapatkanBeasiswaForm,
  ] = useState(false);
  const [
    showPrestasiMahasiswaMengikutiPorseniForm,
    setShowPrestasiMahasiswaMengikutiPorseniForm,
  ] = useState(false);
  const [showDataStatusMahasiswaForm, setShowDataStatusMahasiswaForm] =
    useState(false);
  const [
    showDataMahasiswaBerprestasiAkademikForm,
    setShowDataMahasiswaBerprestasiAkademikForm,
  ] = useState(false);

  const sigCanvas = useRef({});
  const clearSignature = () => {
    sigCanvas.current.clear();
  };

  const togglePrestasiAkademikMahasiswaForm = (e) => {
    e.preventDefault();
    setShowPrestasiAkademikMahasiswaForm(!showPrestasiAkademikMahasiswaForm);
  };
  const togglePrestasiIlmiahMahasiswaForm = (e) => {
    e.preventDefault();
    setShowPrestasiIlmiahMahasiswaForm(!showPrestasiIlmiahMahasiswaForm);
  };
  const openAddPrestasiIlmiahMahasiswaModal = (e) => {
    e.preventDefault();
    setIsModalAddPrestasiIlmiahMahasiswaOpen(true);
  };
  const openAddPrestasiMahasiswaMengikutiPorseniModal = (e) => {
    e.preventDefault();
    setIsModalAddPrestasiMahasiswaMengikutiPorseniOpen(true);
  };
  const openAddDataStatusMahasiswaModal = (e) => {
    e.preventDefault();
    setIsModalAddDataStatusMahasiswaOpen(true);
  };

  const openEditPrestasiIlmiahMahasiswaModal = (e) => {
    e.preventDefault();
    setIsModalEditPrestasiIlmiahMahasiswaOpen(true);
  };
  const openEditPrestasiMahasiswaMengikutiPorseniModal = (e) => {
    e.preventDefault();
    setIsModalEditPrestasiMahasiswaMengikutiPorseniOpen(true);
  };
  const openEditDataStatusMahasiswaModal = (e) => {
    e.preventDefault();
    setIsModalEditDataStatusMahasiswaOpen(true);
  };

  const openDeletePrestasiIlmiahMahasiswaModal = (e) => {
    e.preventDefault();
    setIsModalDeletePrestasiIlmiahMahasiswaOpen(true);
  };
  const openDeletePrestasiMahasiswaMengikutiPorseniModal = (e) => {
    e.preventDefault();
    setIsModalDeletePrestasiMahasiswaMengikutiPorseniOpen(true);
  };
  const openDeleteDataStatusMahasiswaModal = (e) => {
    e.preventDefault();
    setIsModalDeleteDataStatusMahasiswaOpen(true);
  };
  const closeAddPrestasiIlmiahMahasiswaModal = () => {
    setBidangPrestasiAddPrestasiIlmiahMahasiswaModal("");
    setNimAddPrestasiIlmiahMahasiswaModal("");
    setNamaLengkapAddPrestasiIlmiahMahasiswaModal("");
    setFileAddPrestasiIlmiahMahasiswaModal(null);
    setTingkatPrestasiAddPrestasiIlmiahMahasiswaModal("");
    setPreviewUrlAddPrestasiIlmiahMahasiswaModal("");
    setIsModalAddPrestasiIlmiahMahasiswaOpen(false);
  };
  const closeAddPrestasiMahasiswaMengikutiPorseniModal = () => {
    setJenisKegiatanAddPrestasiMahasiswaMengikutiPorseniModal("");
    setNimAddPrestasiMahasiswaMengikutiPorseniModal("");
    setNamaLengkapAddPrestasiMahasiswaMengikutiPorseniModal("");
    setFileAddPrestasiMahasiswaMengikutiPorseniModal(null);
    setTingkatPrestasiAddPrestasiMahasiswaMengikutiPorseniModal("");
    setPreviewUrlAddPrestasiMahasiswaMengikutiPorseniModal("");
    setIsModalAddPrestasiMahasiswaMengikutiPorseniOpen(false);
  };
  const closeAddDataStatusMahasiswaModal = () => {
    setNimAddDataStatusMahasiswaModal("");
    setNamaLengkapAddDataStatusMahasiswaModal("");
    setStatusAddDataStatusMahasiswaModal("");
    setIsModalAddDataStatusMahasiswaOpen(false);
  };

  const closeEditPrestasiIlmiahMahasiswaModal = () => {
    setDataSelectedPrestasiIlmiahMahasiswaEditModal({});
    setIsModalEditPrestasiIlmiahMahasiswaOpen(false);
  };
  const closeEditPrestasiMahasiswaMengikutiPorseniModal = () => {
    setDataSelectedPrestasiMahasiswaMengikutiPorseniEditModal({});
    setIsModalEditPrestasiMahasiswaMengikutiPorseniOpen(false);
  };
  const closeEditDataStatusMahasiswaModal = () => {
    setDataSelectedDataStatusMahasiswaEditModal({});
    setIsModalEditDataStatusMahasiswaOpen(false);
  };

  const closeDeletePrestasiIlmiahMahasiswaModal = () => {
    setIdSelectedPrestasiIlmiahMahasiswaDeleteModal(null);
    setIsModalDeletePrestasiIlmiahMahasiswaOpen(false);
  };
  const closeDeletePrestasiMahasiswaMengikutiPorseniModal = () => {
    setIdSelectedPrestasiMahasiswaMengikutiPorseniDeleteModal(null);
    setIsModalDeletePrestasiMahasiswaMengikutiPorseniOpen(false);
  };
  const closeDeleteDataStatusMahasiswaModal = () => {
    setIdSelectedDataStatusMahasiswaDeleteModal(null);
    setIsModalDeleteDataStatusMahasiswaOpen(false);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  const handleAddPrestasiMahasiswaMengikutiPorseni = async (e: any) => {
    e.preventDefault();
    setPrestasiMahasiswaMengikutiPorseniFormValue((prevValues) => [
      ...prevValues,
      {
        id: generateUniqueId(),
        jenis_kegiatan: jenisKegiatanAddPrestasiMahasiswaMengikutiPorseniModal,
        nim: nimAddPrestasiMahasiswaMengikutiPorseniModal,
        nama: namaLengkapAddPrestasiMahasiswaMengikutiPorseniModal,
        tingkat_prestasi:
          tingkatPrestasiAddPrestasiMahasiswaMengikutiPorseniModal,
        file: fileAddPrestasiMahasiswaMengikutiPorseniModal,
      },
    ]);
    closeAddPrestasiMahasiswaMengikutiPorseniModal();
  };
  const handleAddDataStatusMahasiswa = async (e: any) => {
    e.preventDefault();
    setDataStatusMahasiswaFormValue((prevValues) => [
      ...prevValues,
      {
        id: generateUniqueId(),
        nim: nimAddDataStatusMahasiswaModal,
        nama: namaLengkapAddDataStatusMahasiswaModal,
        status: statusAddDataStatusMahasiswaModal,
      },
    ]);
    closeAddDataStatusMahasiswaModal();
  };
  const handleAddPrestasiIlmiahMahasiswa = async (e: any) => {
    e.preventDefault();
    setPrestasiIlmiahMahasiswaFormValue((prevValues) => [
      ...prevValues,
      {
        id: generateUniqueId(),
        bidang_prestasi: bidangPrestasiAddPrestasiIlmiahMahasiswaModal,
        nim: nimAddPrestasiIlmiahMahasiswaModal,
        nama: namaLengkapAddPrestasiIlmiahMahasiswaModal,
        tingkat_prestasi: tingkatPrestasiAddPrestasiIlmiahMahasiswaModal,
        file: fileAddPrestasiIlmiahMahasiswaModal,
      },
    ]);
    closeAddPrestasiIlmiahMahasiswaModal();
  };

  const generateUniqueId = () => {
    return `id-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  const handleEditPrestasiIlmiahMahasiswa = async () => {
    setPrestasiIlmiahMahasiswaFormValue((prevValues) => {
      return prevValues.map((item) =>
        item.id === dataSelectedPrestasiIlmiahMahasiswaEditModal.id
          ? {
              ...item,
              bidang_prestasi:
                dataSelectedPrestasiIlmiahMahasiswaEditModal.bidang_prestasi,
              nim: dataSelectedPrestasiIlmiahMahasiswaEditModal.nim,
              nama: dataSelectedPrestasiIlmiahMahasiswaEditModal.nama,
              tingkat_prestasi:
                dataSelectedPrestasiIlmiahMahasiswaEditModal.tingkat_prestasi,
              file: dataSelectedPrestasiIlmiahMahasiswaEditModal.file,
            }
          : item
      );
    });
    closeEditPrestasiIlmiahMahasiswaModal();
  };
  const handleEditPrestasiMahasiswaMengikutiPorseni = async () => {
    setPrestasiMahasiswaMengikutiPorseniFormValue((prevValues) => {
      return prevValues.map((item) =>
        item.id === dataSelectedPrestasiMahasiswaMengikutiPorseniEditModal.id
          ? {
              ...item,
              jenis_kegiatan:
                dataSelectedPrestasiMahasiswaMengikutiPorseniEditModal.jenis_kegiatan,
              nim: dataSelectedPrestasiMahasiswaMengikutiPorseniEditModal.nim,
              nama: dataSelectedPrestasiMahasiswaMengikutiPorseniEditModal.nama,
              tingkat_prestasi:
                dataSelectedPrestasiMahasiswaMengikutiPorseniEditModal.tingkat_prestasi,
              file: dataSelectedPrestasiMahasiswaMengikutiPorseniEditModal.file,
            }
          : item
      );
    });
    closeEditPrestasiMahasiswaMengikutiPorseniModal();
  };
  const handleEditDataStatusMahasiswa = async () => {
    setDataStatusMahasiswaFormValue((prevValues) => {
      return prevValues.map((item) =>
        item.id === dataSelectedDataStatusMahasiswaEditModal.id
          ? {
              ...item,
              nim: dataSelectedDataStatusMahasiswaEditModal.nim,
              nama: dataSelectedDataStatusMahasiswaEditModal.nama,
              status: dataSelectedDataStatusMahasiswaEditModal.status,
            }
          : item
      );
    });
    closeEditDataStatusMahasiswaModal();
  };

  const handleDeletePrestasiIlmiahMahasiswa = async () => {
    setPrestasiIlmiahMahasiswaFormValue((prevValues) =>
      prevValues.filter(
        (item) => item.id !== idSelectedPrestasiIlmiahMahasiswaDeleteModal
      )
    );
    closeDeletePrestasiIlmiahMahasiswaModal();
  };
  const handleDeletePrestasiMahasiswaMengikutiPorseni = async () => {
    setPrestasiMahasiswaMengikutiPorseniFormValue((prevValues) =>
      prevValues.filter(
        (item) =>
          item.id !== idSelectedPrestasiMahasiswaMengikutiPorseniDeleteModal
      )
    );
    closeDeletePrestasiMahasiswaMengikutiPorseniModal();
  };
  const handleDeleteDataStatusMahasiswa = async () => {
    setDataStatusMahasiswaFormValue((prevValues) =>
      prevValues.filter(
        (item) => item.id !== idSelectedDataStatusMahasiswaDeleteModal
      )
    );
    closeDeleteDataStatusMahasiswaModal();
  };

  const handleFileChangeEditPrestasiIlmiahMahasiswaModal = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setDataSelectedPrestasiIlmiahMahasiswaEditModal({
        ...dataSelectedPrestasiIlmiahMahasiswaEditModal,
        file: selectedFile,
      });
      setPreviewUrlEditPrestasiIlmiahMahasiswaModal(
        URL.createObjectURL(selectedFile)
      );
    } else {
      setFileAddPrestasiIlmiahMahasiswaModal(null); // Reset file jika tidak ada file yang dipilih
      setPreviewUrlAddPrestasiIlmiahMahasiswaModal(""); // Reset preview jika tidak ada file
    }
  };
  const handleFileChangeEditPrestasiMahasiswaMengikutiPorseniModal = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setDataSelectedPrestasiMahasiswaMengikutiPorseniEditModal({
        ...dataSelectedPrestasiMahasiswaMengikutiPorseniEditModal,
        file: selectedFile,
      });
      setPreviewUrlEditPrestasiMahasiswaMengikutiPorseniModal(
        URL.createObjectURL(selectedFile)
      );
    } else {
      setFileAddPrestasiMahasiswaMengikutiPorseniModal(null); // Reset file jika tidak ada file yang dipilih
      setPreviewUrlAddPrestasiMahasiswaMengikutiPorseniModal(""); // Reset preview jika tidak ada file
    }
  };

  const handleFileChangeAddPrestasiIlmiahMahasiswaModal = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFileAddPrestasiIlmiahMahasiswaModal(selectedFile);
      setPreviewUrlAddPrestasiIlmiahMahasiswaModal(
        URL.createObjectURL(selectedFile)
      );
    } else {
      setFileAddPrestasiIlmiahMahasiswaModal(null); // Reset file jika tidak ada file yang dipilih
      setPreviewUrlAddPrestasiIlmiahMahasiswaModal(""); // Reset preview jika tidak ada file
    }
  };
  const handleFileChangeAddPrestasiMahasiswaMengikutiPorseniModal = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFileAddPrestasiMahasiswaMengikutiPorseniModal(selectedFile);
      setPreviewUrlAddPrestasiMahasiswaMengikutiPorseniModal(
        URL.createObjectURL(selectedFile)
      );
    } else {
      setFileAddPrestasiMahasiswaMengikutiPorseniModal(null); // Reset file jika tidak ada file yang dipilih
      setPreviewUrlAddPrestasiMahasiswaMengikutiPorseniModal(""); // Reset preview jika tidak ada file
    }
  };
  const togglePrestasiMahasiswaMendapatkanBeasiswaForm = (e) => {
    e.preventDefault();
    setShowPrestasiMahasiswaMendapatkanBeasiswaForm(
      !showPrestasiMahasiswaMendapatkanBeasiswaForm
    );
  };
  const togglePrestasiMahasiswaMengikutiPorseniForm = (e) => {
    e.preventDefault();
    setShowPrestasiMahasiswaMengikutiPorseniForm(
      !showPrestasiMahasiswaMengikutiPorseniForm
    );
  };
  const toggleDataStatusMahasiswaForm = (e) => {
    e.preventDefault();
    setShowDataStatusMahasiswaForm(!showDataStatusMahasiswaForm);
  };
  const toggleDataMahasiswaBerprestasiAkademikForm = (e) => {
    e.preventDefault();
    setShowDataMahasiswaBerprestasiAkademikForm(
      !showDataMahasiswaBerprestasiAkademikForm
    );
  };

  const jurusanOptions = [
    ...new Set(dataBimbingan.map((data) => data.pengajuan_bimbingan.jurusan)),
  ];
  const jadwalOptions = [
    ...new Set(
      dataBimbingan.map((data) => data.pengajuan_bimbingan.jadwal_bimbingan)
    ),
  ];
  const jenisBimbinganOptions = [
    ...new Set(
      dataBimbingan.map((data) => data.pengajuan_bimbingan.jenis_bimbingan)
    ),
  ];

  const filteredBimbingan = dataBimbingan
    .filter((data) => data.laporan_bimbingan_id === null)
    .filter((data) => {
      const matchesJurusan = jurusanFilter
        ? data.pengajuan_bimbingan.jurusan === jurusanFilter
        : true;
      const matchesJadwal = jadwalFilter
        ? data.pengajuan_bimbingan.jadwal_bimbingan === jadwalFilter
        : true;
      const matchesJenisBimbingan = jenisBimbinganFilter
        ? data.pengajuan_bimbingan.jenis_bimbingan === jenisBimbinganFilter
        : true;
      return matchesJurusan && matchesJadwal && matchesJenisBimbingan;
    });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

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
        `${API_BASE_URL}/api/datadosen`
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
        `${API_BASE_URL}/api/datamahasiswa`
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
        `${API_BASE_URL}/api/datadosenpa`
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
        `${API_BASE_URL}/api/datakaprodi`
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

  const getDataTahunAJaran = async () => {
    try {
      const response = await axios.get<any>(
        `${API_BASE_URL}/api/datatahunajaran`
      );
      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }
      const data = await response.data;
      const sortedDataTahunAjaran = data.sort((a, b) => a.order - b.order);
      setDataTahunAjaran(sortedDataTahunAjaran);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const addLaporanBimbingan = async (newData: any) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/laporanbimbingan`,
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

    const signatureData = sigCanvas.current
      .getTrimmedCanvas()
      .toDataURL("image/png");

    const laporanData = {
      nama_dosen_pa: userProfile?.nama_lengkap,
      tahun_ajaran: selectedTahunAjaran,
      semester: selectedSemester,
      kaprodi: selectedKaprodi,
      pendahuluan,
      jumlah_ipk_a: jumlahMahasiswaIpkAPrestasiAkademikMahasiswaForm,
      jumlah_ipk_b: jumlahMahasiswaIpkBPrestasiAkademikMahasiswaForm,
      jumlah_ipk_c: jumlahMahasiswaIpkCPrestasiAkademikMahasiswaForm,
      jumlah_ipk_d: jumlahMahasiswaIpkDPrestasiAkademikMahasiswaForm,
      jumlah_ipk_e: jumlahMahasiswaIpkEPrestasiAkademikMahasiswaForm,
      prestasi_ilmiah_mahasiswa: prestasiIlmiahMahasiswaFormValue,
      jumlah_beasiswa_bbm:
        jumlahMahasiswaBeasiswaBBMPrestasiMahasiswaMendapatkanBeasiswaForm,
      jumlah_beasiswa_pegadaian:
        jumlahMahasiswaBeasiswaPegadaianPrestasiMahasiswaMendapatkanBeasiswaForm,
      jumlah_beasiswa_supersemar:
        jumlahMahasiswaBeasiswaSupersemarPrestasiMahasiswaMendapatkanBeasiswaForm,
      jumlah_beasiswa_ppa:
        jumlahMahasiswaBeasiswaPPAPrestasiMahasiswaMendapatkanBeasiswaForm,
      jumlah_beasiswa_ykl:
        jumlahMahasiswaBeasiswaYKLPrestasiMahasiswaMendapatkanBeasiswaForm,
      jumlah_beasiswa_dll:
        jumlahMahasiswaBeasiswaDllPrestasiMahasiswaMendapatkanBeasiswaForm,
      prestasi_porseni_mahasiswa: prestasiMahasiswaMengikutiPorseniFormValue,
      data_status_mahasiswa: dataStatusMahasiswaFormValue,
      kesimpulan,
      dokumentasi: imagePreviews,
      tanda_tangan_dosen_pa: signatureData,
    };

    console.log(laporanData);

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
    doc.text(`Tahun Akademik    :    ${laporanData.tahun_ajaran}`, 15, 56); // Moved up by 10y
    doc.text(`Semester                   :    ${laporanData.semester}`, 15, 62); // Moved up by 10y
    doc.text(`Nama Dosen PA     :    Neny Rosmawarni, M.Kom`, 15, 68); // Moved up by 10y

    doc.text("A. PENDAHULUAN", 15, 91); // Adjusted x to 15 and y down by 20

    let yPosition = 98;
    const maxWidth = 175;

    laporanData.pendahuluan.forEach((paragraph) => {
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
      { range: "IPK > 3.5", jumlah: laporanData.jumlah_ipk_a },
      { range: "3 > IPK >= 3.5", jumlah: laporanData.jumlah_ipk_b },
      { range: "2.5 <= IPK < 3", jumlah: laporanData.jumlah_ipk_c },
      { range: "2 <= IPK < 2.5", jumlah: laporanData.jumlah_ipk_d },
      { range: "IPK < 2", jumlah: laporanData.jumlah_ipk_e },
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
    const prestasiData = laporanData.prestasi_ilmiah_mahasiswa;

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
      { beasiswa: "BBM", jumlah: laporanData.jumlah_beasiswa_bbm },
      { beasiswa: "Pegadaian", jumlah: laporanData.jumlah_beasiswa_pegadaian },
      {
        beasiswa: "Supersemar",
        jumlah: laporanData.jumlah_beasiswa_supersemar,
      },
      { beasiswa: "PPA", jumlah: laporanData.jumlah_beasiswa_ppa },
      { beasiswa: "YKL", jumlah: laporanData.jumlah_beasiswa_ykl },
      { beasiswa: "Dan Lain-lainnya", jumlah: laporanData.jumlah_beasiswa_dll },
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
    const prestasiPorseniData = laporanData.prestasi_porseni_mahasiswa;

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
    const statusData = laporanData.data_status_mahasiswa;

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
    laporanData.kesimpulan.forEach((paragraph) => {
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
    const imgData = laporanData.tanda_tangan_dosen_pa;
    const xImagePosition = 167; // Atur posisi X sesuai kebutuhan
    const yImagePosition = jabatanYPosition + 4; // Atur posisi Y sesuai kebutuhan
    const width = 21; // Lebar gambar
    const height = 21; // Tinggi gambar

    // Menambahkan gambar ke dokumen
    doc.addImage(imgData, "PNG", xImagePosition, yImagePosition, width, height);
    const ttdY = jabatanYPosition + 28; // Posisi Y untuk kolom TTD
    doc.text(`( ${laporanData.nama_dosen_pa} )`, 195, ttdY, { align: "right" });
    // Open the PDF in a new window instead of saving
    doc.output("dataurlnewwindow");

    // try {
    //   const laporanBimbinganValue = {
    //     nama_mahasiswa: [
    //       ...new Set(
    //         selectedBimbingan.map(
    //           (bimbingan) => bimbingan.pengajuan_bimbingan.nama_lengkap
    //         )
    //       ),
    //     ].join(", "),
    //     waktu_bimbingan: [
    //       ...new Set(
    //         selectedBimbingan.map(
    //           (bimbingan) => bimbingan.pengajuan_bimbingan.jadwal_bimbingan
    //         )
    //       ),
    //     ].join(", "),
    //     kaprodi_id: dataSelectedKaprodi?.id,
    //     kendala_mahasiswa: kendala,
    //     solusi,
    //     kesimpulan,
    //     dokumentasi:
    //       imagePreviews.length > 0
    //         ? [...new Set(imagePreviews.map((data) => data))].join(", ")
    //         : null,
    //     status: "Menunggu Feedback Kaprodi",
    //     dosen_pa_id: dataDosenPA.find((data) => data.dosen.id === dataUser.id)
    //       ?.id,
    //     nama_dosen_pa: dataDosenPA.find((data) => data.dosen.id === dataUser.id)
    //       ?.dosen.nama_lengkap,
    //     jenis_bimbingan: [
    //       ...new Set(
    //         selectedBimbingan.map(
    //           (bimbingan) => bimbingan.pengajuan_bimbingan.jenis_bimbingan
    //         )
    //       ),
    //     ].join(", "),
    //     sistem_bimbingan: [
    //       ...new Set(
    //         selectedBimbingan.map(
    //           (bimbingan) => bimbingan.pengajuan_bimbingan.sistem_bimbingan
    //         )
    //       ),
    //     ].join(", "),
    //     bimbingan_id: [
    //       ...new Set(selectedBimbingan.map((bimbingan) => bimbingan.id)),
    //     ].join(", "),
    //   };

    //   const result = await addLaporanBimbingan(laporanBimbinganValue);
    //   console.log(result);
    //   setSelectedBimbingan([]);
    //   setSolusi("");
    //   setKesimpulan("");
    //   setKendala("");
    //   setSelectedKaprodi("");
    //   setSelectedTahunAjaran("");
    //   setDokumentasi("");
    //   getDataBimbinganByDosenPaId();
    // } catch (error) {
    //   console.error("Registration error:", (error as Error).message);
    // }
  };

  const handlePreviewPDF = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const signatureData = sigCanvas.current
      .getTrimmedCanvas()
      .toDataURL("image/png");

    const laporanData = {
      nama_dosen_pa: userProfile?.nama_lengkap,
      tahun_ajaran: selectedTahunAjaran,
      semester: selectedSemester,
      kaprodi: selectedKaprodi,
      pendahuluan,
      jumlah_ipk_a: jumlahMahasiswaIpkAPrestasiAkademikMahasiswaForm,
      jumlah_ipk_b: jumlahMahasiswaIpkBPrestasiAkademikMahasiswaForm,
      jumlah_ipk_c: jumlahMahasiswaIpkCPrestasiAkademikMahasiswaForm,
      jumlah_ipk_d: jumlahMahasiswaIpkDPrestasiAkademikMahasiswaForm,
      jumlah_ipk_e: jumlahMahasiswaIpkEPrestasiAkademikMahasiswaForm,
      prestasi_ilmiah_mahasiswa: prestasiIlmiahMahasiswaFormValue,
      jumlah_beasiswa_bbm:
        jumlahMahasiswaBeasiswaBBMPrestasiMahasiswaMendapatkanBeasiswaForm,
      jumlah_beasiswa_pegadaian:
        jumlahMahasiswaBeasiswaPegadaianPrestasiMahasiswaMendapatkanBeasiswaForm,
      jumlah_beasiswa_supersemar:
        jumlahMahasiswaBeasiswaSupersemarPrestasiMahasiswaMendapatkanBeasiswaForm,
      jumlah_beasiswa_ppa:
        jumlahMahasiswaBeasiswaPPAPrestasiMahasiswaMendapatkanBeasiswaForm,
      jumlah_beasiswa_ykl:
        jumlahMahasiswaBeasiswaYKLPrestasiMahasiswaMendapatkanBeasiswaForm,
      jumlah_beasiswa_dll:
        jumlahMahasiswaBeasiswaDllPrestasiMahasiswaMendapatkanBeasiswaForm,
      prestasi_porseni_mahasiswa: prestasiMahasiswaMengikutiPorseniFormValue,
      data_status_mahasiswa: dataStatusMahasiswaFormValue,
      kesimpulan,
      dokumentasi: imagePreviews,
      tanda_tangan_dosen_pa: signatureData,
    };

    console.log(laporanData);

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
    doc.text(`Tahun Akademik    :    ${laporanData.tahun_ajaran}`, 15, 56); // Moved up by 10y
    doc.text(`Semester                   :    ${laporanData.semester}`, 15, 62); // Moved up by 10y
    doc.text(`Nama Dosen PA     :    Neny Rosmawarni, M.Kom`, 15, 68); // Moved up by 10y

    doc.text("A. PENDAHULUAN", 15, 91); // Adjusted x to 15 and y down by 20

    let yPosition = 98;
    const maxWidth = 175;

    laporanData.pendahuluan.forEach((paragraph) => {
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
      { range: "IPK > 3.5", jumlah: laporanData.jumlah_ipk_a },
      { range: "3 > IPK >= 3.5", jumlah: laporanData.jumlah_ipk_b },
      { range: "2.5 <= IPK < 3", jumlah: laporanData.jumlah_ipk_c },
      { range: "2 <= IPK < 2.5", jumlah: laporanData.jumlah_ipk_d },
      { range: "IPK < 2", jumlah: laporanData.jumlah_ipk_e },
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
    const prestasiData = laporanData.prestasi_ilmiah_mahasiswa;

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
      { beasiswa: "BBM", jumlah: laporanData.jumlah_beasiswa_bbm },
      { beasiswa: "Pegadaian", jumlah: laporanData.jumlah_beasiswa_pegadaian },
      {
        beasiswa: "Supersemar",
        jumlah: laporanData.jumlah_beasiswa_supersemar,
      },
      { beasiswa: "PPA", jumlah: laporanData.jumlah_beasiswa_ppa },
      { beasiswa: "YKL", jumlah: laporanData.jumlah_beasiswa_ykl },
      { beasiswa: "Dan Lain-lainnya", jumlah: laporanData.jumlah_beasiswa_dll },
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
    const prestasiPorseniData = laporanData.prestasi_porseni_mahasiswa;

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
    const statusData = laporanData.data_status_mahasiswa;

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
    laporanData.kesimpulan.forEach((paragraph) => {
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
    const imgData = laporanData.tanda_tangan_dosen_pa;
    const xImagePosition = 167; // Atur posisi X sesuai kebutuhan
    const yImagePosition = jabatanYPosition + 4; // Atur posisi Y sesuai kebutuhan
    const width = 21; // Lebar gambar
    const height = 21; // Tinggi gambar

    // Menambahkan gambar ke dokumen
    doc.addImage(imgData, "PNG", xImagePosition, yImagePosition, width, height);
    const ttdY = jabatanYPosition + 28; // Posisi Y untuk kolom TTD
    doc.text(`( ${laporanData.nama_dosen_pa} )`, 195, ttdY, { align: "right" });
    // Open the PDF in a new window instead of saving
    const pdfOutput = doc.output("blob");
    const url = URL.createObjectURL(pdfOutput);

    // Set the URL and open the modal
    setPdfUrl(url);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPdfUrl(""); // Clear the URL when closing
    URL.revokeObjectURL(pdfUrl); // Clean up the Blob URL
  };

  const getDataDosenById = async () => {
    try {
      const dataDosen = await axios.get<Dosen[]>(
        `${API_BASE_URL}/api/datadosen`
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
        `${API_BASE_URL}/api/datadosenpa`
      );
      const dosenPa = dataDosenPa.data.find(
        (data) => data.dosen.nama_lengkap === userProfile?.nama_lengkap
      );

      if (!dosenPa) {
        throw new Error("Dosen PA tidak ditemukan");
      }

      const dosenpaid = dosenPa.id;

      const dataBimbingan = await axios.get<Bimbingan[]>(
        `${API_BASE_URL}/api/bimbingan`
      );
      const userbimbingan = dataBimbingan.data.filter(
        (data) => data.pengajuan_bimbingan.dosen_pa_id === dosenpaid
      );
      const bimbingan = userbimbingan.filter(
        (data) => data.status_pengesahan_kehadiran === "Sah"
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
    setSelectedBimbingan([]);
  }, [jenisBimbinganFilter, jadwalFilter, jurusanFilter]);

  useEffect(() => {
    getDataDosenPA();
    getDataKaprodi();
    getDataTahunAJaran();
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
    if (dataTahunAjaran.length > 0) {
      const formattedOptions = dataTahunAjaran.map((data) => {
        return {
          value: data.tahun_ajaran,
          label: `${data.tahun_ajaran}`,
        };
      });

      setOptionsTahunAjaran(formattedOptions);
    }
  }, [dataTahunAjaran]);

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
    setSelectedSemester("");
  }, [selectedTahunAjaran]);

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
        <div className="mt-4 mb-[100px] mx-[130px] border rounded-lg">
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-medium mb-2">
                      Filter Jurusan:
                    </label>
                    <select
                      value={jurusanFilter}
                      onChange={(e) => setJurusanFilter(e.target.value)}
                      className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-500"
                    >
                      <option value="">Semua Jurusan</option>
                      {jurusanOptions.map((jurusan, index) => (
                        <option key={index} value={jurusan}>
                          {jurusan}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium mb-2">
                      Filter Jadwal Bimbingan:
                    </label>
                    <select
                      value={jadwalFilter}
                      onChange={(e) => setJadwalFilter(e.target.value)}
                      className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-500"
                    >
                      <option value="">Semua Jadwal Bimbingan</option>
                      {jadwalOptions.map((jadwal, index) => (
                        <option key={index} value={jadwal}>
                          {jadwal}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium mb-2">
                      Filter Jenis Bimbingan:
                    </label>
                    <select
                      value={jenisBimbinganFilter}
                      onChange={(e) => setJenisBimbinganFilter(e.target.value)}
                      className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-500"
                    >
                      <option value="">Semua Jenis Bimbingan</option>
                      {jenisBimbinganOptions.map((jenis, index) => (
                        <option key={index} value={jenis}>
                          {jenis}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex mt-6 mb-4 justify-between items-center">
                  <p className="font-medium">
                    Pilih Bimbingan ({filteredBimbingan.length}) :
                  </p>
                  <div className="flex items-center">
                    <label className="font-medium cursor-pointer">
                      Select All
                    </label>
                    <input
                      type="checkbox"
                      checked={
                        selectedBimbingan.length === filteredBimbingan.length &&
                        filteredBimbingan.length > 0
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          // Select all filtered bimbingan
                          const allFilteredBimbingan = filteredBimbingan.map(
                            (data) => data
                          );
                          // Update selectedBimbingan state with all filtered bimbingan
                          setSelectedBimbingan(allFilteredBimbingan);
                        } else {
                          // Deselect all
                          setSelectedBimbingan([]);
                        }
                      }}
                      className="ml-2 size-4 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto mt-2">
                  <div className="flex space-x-4 pb-4">
                    {filteredBimbingan.map((data) => (
                      <div
                        className={`border rounded-lg min-w-[30%] flex flex-col gap-1 text-[15px] cursor-pointer ${
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
              </div>
            )}
            {selectedBimbingan.length > 0 ? (
              <div className="flex flex-col gap-4 mt-6 border p-8 rounded-lg">
                <h1 className="text-center font-bold text-[20px] mb-2">
                  LAPORAN PERWALIAN DOSEN PEMBIMBING AKADEMIK FAKULTAS ILMU
                  KOMPUTER UPN “VETERAN” JAKARTA
                </h1>
                <SelectField
                  options={optionsTahunAjaran}
                  onChange={(e) => setSelectedTahunAjaran(e.target.value)}
                  value={selectedTahunAjaran}
                  placeholder="Pilih Tahun Ajaran"
                  className={`px-3 py-2 text-[15px] border rounded-lg appearance-none w-full`}
                />
                <SelectField
                  options={optionsSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  value={selectedSemester}
                  placeholder="Pilih Semester"
                  className={`px-3 py-2 text-[15px] border rounded-lg appearance-none w-full`}
                />
                <SelectField
                  options={optionsKaprodi}
                  onChange={(e) => setSelectedKaprodi(e.target.value)}
                  value={selectedKaprodi}
                  placeholder="Pilih Kaprodi"
                  className={`px-3 py-2 text-[15px] border rounded-lg appearance-none w-full`}
                />
                <div className="flex flex-col gap-4">
                  <p className="font-bold">A. PENDAHULUAN</p>
                  <div className="p-6 border rounded-lg ">
                    <RichTextPendahuluan
                      value={pendahuluan}
                      onChange={setPendahuluan}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <p className="font-bold">B. HASIL KONSULTASI PEMBIMBINGAN</p>
                  <div className="p-6 flex flex-col gap-4 border rounded-lg ">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">
                          Prestasi Akademik Mahasiswa
                        </p>
                        <button
                          onClick={(e) =>
                            togglePrestasiAkademikMahasiswaForm(e)
                          }
                          className="flex items-center px-3 py-2"
                        >
                          {showPrestasiAkademikMahasiswaForm ? (
                            <FontAwesomeIcon icon={faChevronUp} />
                          ) : (
                            <FontAwesomeIcon icon={faChevronDown} />
                          )}
                        </button>
                      </div>

                      {showPrestasiAkademikMahasiswaForm && (
                        <div className="mt-2 flex flex-col gap-4 p-4">
                          <div className="flex items-center">
                            <label className="w-1/6">IPK &ge; 3.5</label>
                            <InputField
                              disabled={false}
                              type="number"
                              placeholder="Jumlah Mahasiswa"
                              onChange={(e) =>
                                setJumlahMahasiswaIpkAPrestasiAkademikMahasiswaForm(
                                  e.target.value
                                )
                              }
                              value={
                                jumlahMahasiswaIpkAPrestasiAkademikMahasiswaForm
                              }
                              className="px-3 py-2 w-5/6 text-[15px] border rounded-lg"
                            />
                          </div>
                          <div className="flex items-center">
                            <label className="w-1/6">3 &le; IPK &lt; 3.5</label>
                            <InputField
                              disabled={false}
                              type="number"
                              placeholder="Jumlah Mahasiswa"
                              onChange={(e) =>
                                setJumlahMahasiswaIpkBPrestasiAkademikMahasiswaForm(
                                  e.target.value
                                )
                              }
                              value={
                                jumlahMahasiswaIpkBPrestasiAkademikMahasiswaForm
                              }
                              className="px-3 py-2 w-5/6 text-[15px] border rounded-lg"
                            />
                          </div>
                          <div className="flex items-center">
                            <label className="w-1/6">2.5 &le; IPK &lt; 3</label>
                            <InputField
                              disabled={false}
                              type="number"
                              placeholder="Jumlah Mahasiswa"
                              onChange={(e) =>
                                setJumlahMahasiswaIpkCPrestasiAkademikMahasiswaForm(
                                  e.target.value
                                )
                              }
                              value={
                                jumlahMahasiswaIpkCPrestasiAkademikMahasiswaForm
                              }
                              className="px-3 py-2 w-5/6 text-[15px] border rounded-lg"
                            />
                          </div>
                          <div className="flex items-center">
                            <label className="w-1/6">2 &le; IPK &lt; 2.5</label>
                            <InputField
                              disabled={false}
                              type="number"
                              placeholder="Jumlah Mahasiswa"
                              onChange={(e) =>
                                setJumlahMahasiswaIpkDPrestasiAkademikMahasiswaForm(
                                  e.target.value
                                )
                              }
                              value={
                                jumlahMahasiswaIpkDPrestasiAkademikMahasiswaForm
                              }
                              className="px-3 py-2 w-5/6 text-[15px] border rounded-lg"
                            />
                          </div>
                          <div className="flex items-center">
                            <label className="w-1/6">IPK &lt; 2</label>
                            <InputField
                              disabled={false}
                              type="number"
                              placeholder="Jumlah Mahasiswa"
                              onChange={(e) =>
                                setJumlahMahasiswaIpkEPrestasiAkademikMahasiswaForm(
                                  e.target.value
                                )
                              }
                              value={
                                jumlahMahasiswaIpkEPrestasiAkademikMahasiswaForm
                              }
                              className="px-3 w-5/6 py-2 text-[15px] border rounded-lg"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Prestasi Ilmiah Mahasiswa</p>
                        <button
                          onClick={(e) => togglePrestasiIlmiahMahasiswaForm(e)}
                          className="flex items-center px-3 py-2"
                        >
                          {showPrestasiIlmiahMahasiswaForm ? (
                            <FontAwesomeIcon icon={faChevronUp} />
                          ) : (
                            <FontAwesomeIcon icon={faChevronDown} />
                          )}
                        </button>
                      </div>

                      {showPrestasiIlmiahMahasiswaForm && (
                        <div className="mt-2 flex flex-col p-4">
                          <>
                            <button
                              className="flex px-3 py-2 bg-orange-500 items-center gap-2 rounded-lg ml-auto hover:bg-orange-600"
                              onClick={(e) => {
                                openAddPrestasiIlmiahMahasiswaModal(e);
                              }}
                            >
                              <Image src={plusIcon} alt="Plus Icon" />
                              <p className="text-white text-[14px]">
                                Tambah Prestasi Ilmiah Mahasiswa
                              </p>
                            </button>
                            <div className="mt-6 overflow-x-auto">
                              <table className="min-w-full text-[16px] border-collapse table-fixed">
                                <thead>
                                  <tr className="bg-gray-100 text-center">
                                    <th className="px-4 py-2 w-[20%] rounded-tl-lg rounded-bl-lg">
                                      Bidang Prestasi
                                    </th>
                                    <th className="px-4 py-2 w-[15%]">NIM</th>
                                    <th className="px-4 py-2 w-[15%]">Nama</th>
                                    <th className="px-4 py-2 w-[15%]">
                                      Tingkat Prestasi
                                    </th>
                                    <th className="px-4 py-2 w-[10%]">
                                      Lampiran
                                    </th>
                                    <th className="px-4 py-2 w-[25%] rounded-tr-lg rounded-br-lg">
                                      Action
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {prestasiIlmiahMahasiswaFormValue.length ===
                                  0 ? (
                                    <tr>
                                      <td
                                        colSpan={6}
                                        className="text-center py-4"
                                      >
                                        <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                                          <h2 className="text-xl font-semibold text-gray-700">
                                            Silahkan Tambah Prestasi Ilmiah
                                            Mahasiswa
                                          </h2>
                                          <p className="text-gray-500 mt-2">
                                            Saat ini belum ada data prestasi
                                            ilmiah yang dimasukkan. Klik tombol
                                            tambah prestasi ilmiah mahasiswa
                                            untuk menambahkannya.
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  ) : (
                                    prestasiIlmiahMahasiswaFormValue.map(
                                      (data: any, index: any) => (
                                        <tr key={index}>
                                          <td className="border-b text-center border-gray-200 px-4 break-words overflow-wrap">
                                            {data.bidang_prestasi}
                                          </td>
                                          <td className="border-b text-center border-gray-200 px-4 max-w-[200px] break-words overflow-wrap">
                                            {data.nim}
                                          </td>
                                          <td className="border-b text-center border-gray-200 px-4">
                                            {data.nama}
                                          </td>
                                          <td className="border-b text-center border-gray-200 px-4">
                                            {data.tingkat_prestasi}
                                          </td>
                                          <td className="border-b text-center border-gray-200 px-4">
                                            <FileButton
                                              data={data}
                                              className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600"
                                            />
                                          </td>
                                          <td className="border-b border-gray-200 px-4 py-4">
                                            <div className="flex gap-2 items-center justify-center">
                                              <EditButton
                                                className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
                                                onClick={(e) => {
                                                  setDataSelectedPrestasiIlmiahMahasiswaEditModal(
                                                    data
                                                  );
                                                  setPreviewUrlEditPrestasiIlmiahMahasiswaModal(
                                                    URL.createObjectURL(
                                                      data.file
                                                    )
                                                  );
                                                  openEditPrestasiIlmiahMahasiswaModal(
                                                    e
                                                  );
                                                }}
                                              />
                                              <TrashButton
                                                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                                                onClick={(e) => {
                                                  setIdSelectedPrestasiIlmiahMahasiswaDeleteModal(
                                                    data.id
                                                  );
                                                  openDeletePrestasiIlmiahMahasiswaModal(
                                                    e
                                                  );
                                                }}
                                              />
                                            </div>
                                          </td>
                                        </tr>
                                      )
                                    )
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </>
                          <Modal
                            isOpen={isModalAddPrestasiIlmiahMahasiswaOpen}
                            onClose={closeAddPrestasiIlmiahMahasiswaModal}
                            onAdd={handleAddPrestasiIlmiahMahasiswa}
                            modalType="Tambah"
                            title="Tambah Prestasi Akademik Mahasiswa"
                          >
                            <form className="max-h-[400px] flex flex-col gap-2 pr-4 overflow-y-auto">
                              <InputField
                                type="text"
                                placeholder="Masukkan Bidang Prestasi"
                                onChange={(e) =>
                                  setBidangPrestasiAddPrestasiIlmiahMahasiswaModal(
                                    e.target.value
                                  )
                                }
                                value={
                                  bidangPrestasiAddPrestasiIlmiahMahasiswaModal
                                }
                                className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                              />
                              <InputField
                                type="text"
                                placeholder="Masukkan NIM"
                                onChange={(e) =>
                                  setNimAddPrestasiIlmiahMahasiswaModal(
                                    e.target.value
                                  )
                                }
                                value={nimAddPrestasiIlmiahMahasiswaModal}
                                className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                              />
                              <InputField
                                type="text"
                                placeholder="Masukkan Nama Lengkap"
                                onChange={(e) =>
                                  setNamaLengkapAddPrestasiIlmiahMahasiswaModal(
                                    e.target.value
                                  )
                                }
                                value={
                                  namaLengkapAddPrestasiIlmiahMahasiswaModal
                                }
                                className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                              />
                              <select
                                value={
                                  tingkatPrestasiAddPrestasiIlmiahMahasiswaModal
                                }
                                onChange={(e) =>
                                  setTingkatPrestasiAddPrestasiIlmiahMahasiswaModal(
                                    e.target.value
                                  )
                                }
                                className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                              >
                                <option value="">Pilih Tingkat Prestasi</option>
                                <option value="Lokal">Lokal</option>
                                <option value="Nasional">Nasional</option>
                                <option value="Internasional">
                                  Internasional
                                </option>
                              </select>
                              <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) =>
                                  handleFileChangeAddPrestasiIlmiahMahasiswaModal(
                                    e
                                  )
                                }
                                className="mb-3"
                              />
                              {previewUrlAddPrestasiIlmiahMahasiswaModal && (
                                <iframe
                                  src={
                                    previewUrlAddPrestasiIlmiahMahasiswaModal
                                  }
                                  title="Preview PDF"
                                  width="100%"
                                  height="300"
                                  className="mb-3"
                                />
                              )}
                            </form>
                          </Modal>
                          <Modal
                            isOpen={isModalEditPrestasiIlmiahMahasiswaOpen}
                            onClose={closeEditPrestasiIlmiahMahasiswaModal}
                            onEdit={handleEditPrestasiIlmiahMahasiswa}
                            modalType="Edit"
                            title="Tambah Prestasi Akademik Mahasiswa"
                          >
                            <form className="max-h-[400px] flex flex-col gap-2 pr-4 overflow-y-auto">
                              <InputField
                                type="text"
                                placeholder="Masukkan Bidang Prestasi"
                                onChange={(e) =>
                                  setDataSelectedPrestasiIlmiahMahasiswaEditModal(
                                    {
                                      ...dataSelectedPrestasiIlmiahMahasiswaEditModal,
                                      bidang_prestasi: e.target.value,
                                    }
                                  )
                                }
                                value={
                                  dataSelectedPrestasiIlmiahMahasiswaEditModal.bidang_prestasi
                                }
                                className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                              />
                              <InputField
                                type="text"
                                placeholder="Masukkan NIM"
                                onChange={(e) =>
                                  setDataSelectedPrestasiIlmiahMahasiswaEditModal(
                                    {
                                      ...dataSelectedPrestasiIlmiahMahasiswaEditModal,
                                      nim: e.target.value,
                                    }
                                  )
                                }
                                value={
                                  dataSelectedPrestasiIlmiahMahasiswaEditModal.nim
                                }
                                className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                              />
                              <InputField
                                type="text"
                                placeholder="Masukkan Nama Lengkap"
                                onChange={(e) =>
                                  setDataSelectedPrestasiIlmiahMahasiswaEditModal(
                                    {
                                      ...dataSelectedPrestasiIlmiahMahasiswaEditModal,
                                      nama: e.target.value,
                                    }
                                  )
                                }
                                value={
                                  dataSelectedPrestasiIlmiahMahasiswaEditModal.nama
                                }
                                className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                              />
                              <select
                                value={
                                  dataSelectedPrestasiIlmiahMahasiswaEditModal.tingkat_prestasi
                                }
                                onChange={(e) =>
                                  setDataSelectedPrestasiIlmiahMahasiswaEditModal(
                                    {
                                      ...dataSelectedPrestasiIlmiahMahasiswaEditModal,
                                      tingkat_prestasi: e.target.value,
                                    }
                                  )
                                }
                                className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                              >
                                <option value="">Pilih Tingkat Prestasi</option>
                                <option value="Lokal">Lokal</option>
                                <option value="Nasional">Nasional</option>
                                <option value="Internasional">
                                  Internasional
                                </option>
                              </select>
                              <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) =>
                                  handleFileChangeEditPrestasiIlmiahMahasiswaModal(
                                    e
                                  )
                                }
                                className="mb-3"
                              />
                              <iframe
                                src={previewUrlEditPrestasiIlmiahMahasiswaModal}
                                title="Preview PDF"
                                width="100%"
                                height="300"
                                className="mb-3"
                              />
                            </form>
                          </Modal>
                          <Modal
                            isOpen={isModalDeletePrestasiIlmiahMahasiswaOpen}
                            onClose={closeDeletePrestasiIlmiahMahasiswaModal}
                            onDelete={handleDeletePrestasiIlmiahMahasiswa}
                            modalType="Delete"
                            title="Hapus Prestasi Ilmiah Mahasiswa"
                          >
                            <p>
                              Apakah Anda yakin ingin menghapus Prestasi Ilmiah
                              Mahasiswa ini?
                            </p>
                          </Modal>
                        </div>
                      )}
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">
                          Prestasi Mahasiswa mendapatkan Beasiswa
                        </p>
                        <button
                          onClick={(e) =>
                            togglePrestasiMahasiswaMendapatkanBeasiswaForm(e)
                          }
                          className="flex items-center px-3 py-2"
                        >
                          {showPrestasiMahasiswaMendapatkanBeasiswaForm ? (
                            <FontAwesomeIcon icon={faChevronUp} />
                          ) : (
                            <FontAwesomeIcon icon={faChevronDown} />
                          )}
                        </button>
                      </div>

                      {showPrestasiMahasiswaMendapatkanBeasiswaForm && (
                        <div className="mt-2 flex flex-col gap-4 p-4">
                          <div className="flex items-center">
                            <label className="w-1/6">BBM</label>
                            <InputField
                              disabled={false}
                              type="number"
                              placeholder="Jumlah Mahasiswa"
                              onChange={(e) =>
                                setJumlahMahasiswaBeasiswaBBMPrestasiMahasiswaMendapatkanBeasiswaForm(
                                  e.target.value
                                )
                              }
                              value={
                                jumlahMahasiswaBeasiswaBBMPrestasiMahasiswaMendapatkanBeasiswaForm
                              }
                              className="px-3 py-2 w-5/6 text-[15px] border rounded-lg"
                            />
                          </div>
                          <div className="flex items-center">
                            <label className="w-1/6">Pegadaian</label>
                            <InputField
                              disabled={false}
                              type="number"
                              placeholder="Jumlah Mahasiswa"
                              onChange={(e) =>
                                setJumlahMahasiswaBeasiswaPegadaianPrestasiMahasiswaMendapatkanBeasiswaForm(
                                  e.target.value
                                )
                              }
                              value={
                                jumlahMahasiswaBeasiswaPegadaianPrestasiMahasiswaMendapatkanBeasiswaForm
                              }
                              className="px-3 py-2 w-5/6 text-[15px] border rounded-lg"
                            />
                          </div>
                          <div className="flex items-center">
                            <label className="w-1/6">Supersemar</label>
                            <InputField
                              disabled={false}
                              type="number"
                              placeholder="Jumlah Mahasiswa"
                              onChange={(e) =>
                                setJumlahMahasiswaBeasiswaSupersemarPrestasiMahasiswaMendapatkanBeasiswaForm(
                                  e.target.value
                                )
                              }
                              value={
                                jumlahMahasiswaBeasiswaSupersemarPrestasiMahasiswaMendapatkanBeasiswaForm
                              }
                              className="px-3 py-2 w-5/6 text-[15px] border rounded-lg"
                            />
                          </div>
                          <div className="flex items-center">
                            <label className="w-1/6">PPA</label>
                            <InputField
                              disabled={false}
                              type="number"
                              placeholder="Jumlah Mahasiswa"
                              onChange={(e) =>
                                setJumlahMahasiswaBeasiswaPPAPrestasiMahasiswaMendapatkanBeasiswaForm(
                                  e.target.value
                                )
                              }
                              value={
                                jumlahMahasiswaBeasiswaPPAPrestasiMahasiswaMendapatkanBeasiswaForm
                              }
                              className="px-3 py-2 w-5/6 text-[15px] border rounded-lg"
                            />
                          </div>
                          <div className="flex items-center">
                            <label className="w-1/6">YKL</label>
                            <InputField
                              disabled={false}
                              type="number"
                              placeholder="Jumlah Mahasiswa"
                              onChange={(e) =>
                                setJumlahMahasiswaBeasiswaYKLPrestasiMahasiswaMendapatkanBeasiswaForm(
                                  e.target.value
                                )
                              }
                              value={
                                jumlahMahasiswaBeasiswaYKLPrestasiMahasiswaMendapatkanBeasiswaForm
                              }
                              className="px-3 py-2 w-5/6 text-[15px] border rounded-lg"
                            />
                          </div>
                          <div className="flex items-center">
                            <label className="w-1/6">Dan lain-lain</label>
                            <InputField
                              disabled={false}
                              type="number"
                              placeholder="Jumlah Mahasiswa"
                              onChange={(e) =>
                                setJumlahMahasiswaBeasiswaDllPrestasiMahasiswaMendapatkanBeasiswaForm(
                                  e.target.value
                                )
                              }
                              value={
                                jumlahMahasiswaBeasiswaDllPrestasiMahasiswaMendapatkanBeasiswaForm
                              }
                              className="px-3 py-2 w-5/6 text-[15px] border rounded-lg"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">
                          Prestasi Mahasiswa mengikuti PORSENI
                        </p>
                        <button
                          onClick={(e) =>
                            togglePrestasiMahasiswaMengikutiPorseniForm(e)
                          }
                          className="flex items-center px-3 py-2"
                        >
                          {showPrestasiMahasiswaMengikutiPorseniForm ? (
                            <FontAwesomeIcon icon={faChevronUp} />
                          ) : (
                            <FontAwesomeIcon icon={faChevronDown} />
                          )}
                        </button>
                      </div>

                      {showPrestasiMahasiswaMengikutiPorseniForm && (
                        <div className="mt-2 flex flex-col p-4">
                          <>
                            <button
                              className="flex px-3 py-2 bg-orange-500 items-center gap-2 rounded-lg ml-auto hover:bg-orange-600"
                              onClick={(e) => {
                                openAddPrestasiMahasiswaMengikutiPorseniModal(
                                  e
                                );
                              }}
                            >
                              <Image src={plusIcon} alt="Plus Icon" />
                              <p className="text-white text-[14px]">
                                Tambah Prestasi Porseni Mahasiswa
                              </p>
                            </button>
                            <div className="mt-6 overflow-x-auto">
                              <table className="min-w-full text-[16px] border-collapse table-fixed">
                                <thead>
                                  <tr className="bg-gray-100 text-center">
                                    <th className="px-4 py-2 w-[20%] rounded-tl-lg rounded-bl-lg">
                                      Jenis Kegiatan
                                    </th>
                                    <th className="px-4 py-2 w-[15%]">NIM</th>
                                    <th className="px-4 py-2 w-[15%]">Nama</th>
                                    <th className="px-4 py-2 w-[15%]">
                                      Tingkat Prestasi
                                    </th>
                                    <th className="px-4 py-2 w-[10%]">
                                      Lampiran
                                    </th>
                                    <th className="px-4 py-2 w-[25%] rounded-tr-lg rounded-br-lg">
                                      Action
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {prestasiMahasiswaMengikutiPorseniFormValue.length ===
                                  0 ? (
                                    <tr>
                                      <td
                                        colSpan={6}
                                        className="text-center py-4"
                                      >
                                        <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                                          <h2 className="text-xl font-semibold text-gray-700">
                                            Silahkan Tambah Prestasi Porseni
                                            Mahasiswa
                                          </h2>
                                          <p className="text-gray-500 mt-2">
                                            Saat ini belum ada data prestasi
                                            porseni yang dimasukkan. Klik tombol
                                            tambah prestasi porseni mahasiswa
                                            untuk menambahkannya.
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  ) : (
                                    prestasiMahasiswaMengikutiPorseniFormValue.map(
                                      (data: any, index: any) => (
                                        <tr key={index}>
                                          <td className="border-b text-center border-gray-200 px-4 break-words overflow-wrap">
                                            {data.jenis_kegiatan}
                                          </td>
                                          <td className="border-b text-center border-gray-200 px-4 max-w-[200px] break-words overflow-wrap">
                                            {data.nim}
                                          </td>
                                          <td className="border-b text-center border-gray-200 px-4">
                                            {data.nama}
                                          </td>
                                          <td className="border-b text-center border-gray-200 px-4">
                                            {data.tingkat_prestasi}
                                          </td>
                                          <td className="border-b text-center border-gray-200 px-4">
                                            <FileButton
                                              data={data}
                                              className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600"
                                            />
                                          </td>
                                          <td className="border-b border-gray-200 px-4 py-4">
                                            <div className="flex gap-2 items-center justify-center">
                                              <EditButton
                                                className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
                                                onClick={(e) => {
                                                  setDataSelectedPrestasiMahasiswaMengikutiPorseniEditModal(
                                                    data
                                                  );
                                                  setPreviewUrlEditPrestasiMahasiswaMengikutiPorseniModal(
                                                    URL.createObjectURL(
                                                      data.file
                                                    )
                                                  );
                                                  openEditPrestasiMahasiswaMengikutiPorseniModal(
                                                    e
                                                  );
                                                }}
                                              />
                                              <TrashButton
                                                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                                                onClick={(e) => {
                                                  setIdSelectedPrestasiMahasiswaMengikutiPorseniDeleteModal(
                                                    data.id
                                                  );
                                                  openDeletePrestasiMahasiswaMengikutiPorseniModal(
                                                    e
                                                  );
                                                }}
                                              />
                                            </div>
                                          </td>
                                        </tr>
                                      )
                                    )
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </>
                          <Modal
                            isOpen={
                              isModalAddPrestasiMahasiswaMengikutiPorseniOpen
                            }
                            onClose={
                              closeAddPrestasiMahasiswaMengikutiPorseniModal
                            }
                            onAdd={handleAddPrestasiMahasiswaMengikutiPorseni}
                            modalType="Tambah"
                            title="Tambah Prestasi PORSENI Mahasiswa"
                          >
                            <form className="max-h-[400px] flex flex-col gap-2 pr-4 overflow-y-auto">
                              <InputField
                                type="text"
                                placeholder="Masukkan Jenis Kegiatan"
                                onChange={(e) =>
                                  setJenisKegiatanAddPrestasiMahasiswaMengikutiPorseniModal(
                                    e.target.value
                                  )
                                }
                                value={
                                  jenisKegiatanAddPrestasiMahasiswaMengikutiPorseniModal
                                }
                                className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                              />
                              <InputField
                                type="text"
                                placeholder="Masukkan NIM"
                                onChange={(e) =>
                                  setNimAddPrestasiMahasiswaMengikutiPorseniModal(
                                    e.target.value
                                  )
                                }
                                value={
                                  nimAddPrestasiMahasiswaMengikutiPorseniModal
                                }
                                className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                              />
                              <InputField
                                type="text"
                                placeholder="Masukkan Nama Lengkap"
                                onChange={(e) =>
                                  setNamaLengkapAddPrestasiMahasiswaMengikutiPorseniModal(
                                    e.target.value
                                  )
                                }
                                value={
                                  namaLengkapAddPrestasiMahasiswaMengikutiPorseniModal
                                }
                                className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                              />
                              <select
                                value={
                                  tingkatPrestasiAddPrestasiMahasiswaMengikutiPorseniModal
                                }
                                onChange={(e) =>
                                  setTingkatPrestasiAddPrestasiMahasiswaMengikutiPorseniModal(
                                    e.target.value
                                  )
                                }
                                className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                              >
                                <option value="">Pilih Tingkat Prestasi</option>
                                <option value="Lokal">Lokal</option>
                                <option value="Nasional">Nasional</option>
                                <option value="Internasional">
                                  Internasional
                                </option>
                              </select>
                              <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) =>
                                  handleFileChangeAddPrestasiMahasiswaMengikutiPorseniModal(
                                    e
                                  )
                                }
                                className="mb-3"
                              />
                              {previewUrlAddPrestasiMahasiswaMengikutiPorseniModal && (
                                <iframe
                                  src={
                                    previewUrlAddPrestasiMahasiswaMengikutiPorseniModal
                                  }
                                  title="Preview PDF"
                                  width="100%"
                                  height="300"
                                  className="mb-3"
                                />
                              )}
                            </form>
                          </Modal>
                          <Modal
                            isOpen={
                              isModalEditPrestasiMahasiswaMengikutiPorseniOpen
                            }
                            onClose={
                              closeEditPrestasiMahasiswaMengikutiPorseniModal
                            }
                            onEdit={handleEditPrestasiMahasiswaMengikutiPorseni}
                            modalType="Edit"
                            title="Edit Prestasi PORSENI Mahasiswa"
                          >
                            <form className="max-h-[400px] flex flex-col gap-2 pr-4 overflow-y-auto">
                              <InputField
                                type="text"
                                placeholder="Masukkan Jenis Kegiatan"
                                onChange={(e) =>
                                  setDataSelectedPrestasiMahasiswaMengikutiPorseniEditModal(
                                    {
                                      ...dataSelectedPrestasiMahasiswaMengikutiPorseniEditModal,
                                      jenis_kegiatan: e.target.value,
                                    }
                                  )
                                }
                                value={
                                  dataSelectedPrestasiMahasiswaMengikutiPorseniEditModal.jenis_kegiatan
                                }
                                className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                              />
                              <InputField
                                type="text"
                                placeholder="Masukkan NIM"
                                onChange={(e) =>
                                  setDataSelectedPrestasiMahasiswaMengikutiPorseniEditModal(
                                    {
                                      ...dataSelectedPrestasiMahasiswaMengikutiPorseniEditModal,
                                      nim: e.target.value,
                                    }
                                  )
                                }
                                value={
                                  dataSelectedPrestasiMahasiswaMengikutiPorseniEditModal.nim
                                }
                                className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                              />
                              <InputField
                                type="text"
                                placeholder="Masukkan Nama Lengkap"
                                onChange={(e) =>
                                  setDataSelectedPrestasiMahasiswaMengikutiPorseniEditModal(
                                    {
                                      ...dataSelectedPrestasiMahasiswaMengikutiPorseniEditModal,
                                      nama: e.target.value,
                                    }
                                  )
                                }
                                value={
                                  dataSelectedPrestasiMahasiswaMengikutiPorseniEditModal.nama
                                }
                                className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                              />
                              <select
                                value={
                                  dataSelectedPrestasiMahasiswaMengikutiPorseniEditModal.tingkat_prestasi
                                }
                                onChange={(e) =>
                                  setDataSelectedPrestasiMahasiswaMengikutiPorseniEditModal(
                                    {
                                      ...dataSelectedPrestasiMahasiswaMengikutiPorseniEditModal,
                                      tingkat_prestasi: e.target.value,
                                    }
                                  )
                                }
                                className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                              >
                                <option value="">Pilih Tingkat Prestasi</option>
                                <option value="Lokal">Lokal</option>
                                <option value="Nasional">Nasional</option>
                                <option value="Internasional">
                                  Internasional
                                </option>
                              </select>
                              <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) =>
                                  handleFileChangeEditPrestasiMahasiswaMengikutiPorseniModal(
                                    e
                                  )
                                }
                                className="mb-3"
                              />
                              <iframe
                                src={
                                  previewUrlEditPrestasiMahasiswaMengikutiPorseniModal
                                }
                                title="Preview PDF"
                                width="100%"
                                height="300"
                                className="mb-3"
                              />
                            </form>
                          </Modal>
                          <Modal
                            isOpen={
                              isModalDeletePrestasiMahasiswaMengikutiPorseniOpen
                            }
                            onClose={
                              closeDeletePrestasiMahasiswaMengikutiPorseniModal
                            }
                            onDelete={
                              handleDeletePrestasiMahasiswaMengikutiPorseni
                            }
                            modalType="Delete"
                            title="Hapus Prestasi Porseni Mahasiswa"
                          >
                            <p>
                              Apakah Anda yakin ingin menghapus Prestasi Porseni
                              Mahasiswa ini?
                            </p>
                          </Modal>
                        </div>
                      )}
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Data Status Mahasiswa</p>
                        <button
                          onClick={(e) => toggleDataStatusMahasiswaForm(e)}
                          className="flex items-center px-3 py-2"
                        >
                          {showDataStatusMahasiswaForm ? (
                            <FontAwesomeIcon icon={faChevronUp} />
                          ) : (
                            <FontAwesomeIcon icon={faChevronDown} />
                          )}
                        </button>
                      </div>

                      {showDataStatusMahasiswaForm && (
                        <div className="mt-2 flex flex-col p-4">
                          <>
                            <button
                              className="flex px-3 py-2 bg-orange-500 items-center gap-2 rounded-lg ml-auto hover:bg-orange-600"
                              onClick={(e) => {
                                openAddDataStatusMahasiswaModal(e);
                              }}
                            >
                              <Image src={plusIcon} alt="Plus Icon" />
                              <p className="text-white text-[14px]">
                                Tambah Data Status Mahasiswa
                              </p>
                            </button>
                            <div className="mt-6 overflow-x-auto">
                              <table className="min-w-full text-[16px] border-collapse table-fixed">
                                <thead>
                                  <tr className="bg-gray-100 text-center">
                                    <th className="px-4 py-2 w-[15%] rounded-tl-lg rounded-bl-lg">
                                      NIM
                                    </th>
                                    <th className="px-4 py-2 w-[15%]">Nama</th>
                                    <th className="px-4 py-2 w-[20%]">
                                      Status
                                    </th>
                                    <th className="px-4 py-2 w-[25%] rounded-tr-lg rounded-br-lg">
                                      Action
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {dataStatusMahasiswaFormValue.length === 0 ? (
                                    <tr>
                                      <td
                                        colSpan={4}
                                        className="text-center py-4"
                                      >
                                        <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                                          <h2 className="text-xl font-semibold text-gray-700">
                                            Silahkan Tambah Data Status
                                            Mahasiswa
                                          </h2>
                                          <p className="text-gray-500 mt-2">
                                            Saat ini belum ada data status yang
                                            dimasukkan. Klik tombol tambah data
                                            status mahasiswa untuk
                                            menambahkannya.
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  ) : (
                                    dataStatusMahasiswaFormValue.map(
                                      (data: any, index: any) => (
                                        <tr key={index}>
                                          <td className="border-b text-center border-gray-200 px-4 max-w-[200px] break-words overflow-wrap">
                                            {data.nim}
                                          </td>
                                          <td className="border-b text-center border-gray-200 px-4">
                                            {data.nama}
                                          </td>
                                          <td className="border-b text-center border-gray-200 px-4">
                                            {data.status}
                                          </td>
                                          <td className="border-b border-gray-200 px-4 py-4">
                                            <div className="flex gap-2 items-center justify-center">
                                              <EditButton
                                                className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
                                                onClick={(e) => {
                                                  setDataSelectedDataStatusMahasiswaEditModal(
                                                    data
                                                  );
                                                  openEditDataStatusMahasiswaModal(
                                                    e
                                                  );
                                                }}
                                              />
                                              <TrashButton
                                                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                                                onClick={(e) => {
                                                  setIdSelectedDataStatusMahasiswaDeleteModal(
                                                    data.id
                                                  );
                                                  openDeleteDataStatusMahasiswaModal(
                                                    e
                                                  );
                                                }}
                                              />
                                            </div>
                                          </td>
                                        </tr>
                                      )
                                    )
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </>
                          <Modal
                            isOpen={isModalAddDataStatusMahasiswaOpen}
                            onClose={closeAddDataStatusMahasiswaModal}
                            onAdd={handleAddDataStatusMahasiswa}
                            modalType="Tambah"
                            title="Tambah Data Status Mahasiswa"
                          >
                            <form className="max-h-[400px] flex flex-col gap-2 pr-4 overflow-y-auto">
                              <InputField
                                type="text"
                                placeholder="Masukkan NIM"
                                onChange={(e) =>
                                  setNimAddDataStatusMahasiswaModal(
                                    e.target.value
                                  )
                                }
                                value={nimAddDataStatusMahasiswaModal}
                                className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                              />
                              <InputField
                                type="text"
                                placeholder="Masukkan Nama Lengkap"
                                onChange={(e) =>
                                  setNamaLengkapAddDataStatusMahasiswaModal(
                                    e.target.value
                                  )
                                }
                                value={namaLengkapAddDataStatusMahasiswaModal}
                                className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                              />
                              <select
                                value={statusAddDataStatusMahasiswaModal}
                                onChange={(e) =>
                                  setStatusAddDataStatusMahasiswaModal(
                                    e.target.value
                                  )
                                }
                                className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                              >
                                <option value="">Pilih Status</option>
                                <option value="Cuti">Cuti</option>
                                <option value="Mengundurkan Diri">
                                  Mengundurkan Diri
                                </option>
                                <option value="Tanpa Keterangan">
                                  Tanpa Keterangan
                                </option>
                              </select>
                            </form>
                          </Modal>
                          <Modal
                            isOpen={isModalEditDataStatusMahasiswaOpen}
                            onClose={closeEditDataStatusMahasiswaModal}
                            onEdit={handleEditDataStatusMahasiswa}
                            modalType="Edit"
                            title="Edit Data Status Mahasiswa"
                          >
                            <form className="max-h-[400px] flex flex-col gap-2 pr-4 overflow-y-auto">
                              <InputField
                                type="text"
                                placeholder="Masukkan NIM"
                                onChange={(e) =>
                                  setDataSelectedDataStatusMahasiswaEditModal({
                                    ...dataSelectedDataStatusMahasiswaEditModal,
                                    nim: e.target.value,
                                  })
                                }
                                value={
                                  dataSelectedDataStatusMahasiswaEditModal.nim
                                }
                                className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                              />
                              <InputField
                                type="text"
                                placeholder="Masukkan Nama Lengkap"
                                onChange={(e) =>
                                  setDataSelectedDataStatusMahasiswaEditModal({
                                    ...dataSelectedDataStatusMahasiswaEditModal,
                                    nama: e.target.value,
                                  })
                                }
                                value={
                                  dataSelectedDataStatusMahasiswaEditModal.nama
                                }
                                className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                              />
                              <select
                                value={
                                  dataSelectedDataStatusMahasiswaEditModal.status
                                }
                                onChange={(e) =>
                                  setDataSelectedDataStatusMahasiswaEditModal({
                                    ...dataSelectedDataStatusMahasiswaEditModal,
                                    status: e.target.value,
                                  })
                                }
                                className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                              >
                                <option value="">Pilih Status</option>
                                <option value="Cuti">Cuti</option>
                                <option value="Mengundurkan Diri">
                                  Mengundurkan Diri
                                </option>
                                <option value="Tanpa Keterangan">
                                  Tanpa Keterangan
                                </option>
                              </select>
                            </form>
                          </Modal>
                          <Modal
                            isOpen={isModalDeleteDataStatusMahasiswaOpen}
                            onClose={closeDeleteDataStatusMahasiswaModal}
                            onDelete={handleDeleteDataStatusMahasiswa}
                            modalType="Delete"
                            title="Hapus Data Status Mahasiswa"
                          >
                            <p>
                              Apakah Anda yakin ingin menghapus Data Status
                              Mahasiswa ini?
                            </p>
                          </Modal>
                        </div>
                      )}
                    </div>
                    {/* <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">
                          Data Mahasiswa berprestasi Akademik
                        </p>
                        <button
                          onClick={(e) =>
                            toggleDataMahasiswaBerprestasiAkademikForm(e)
                          }
                          className="flex items-center px-3 py-2"
                        >
                          {showDataMahasiswaBerprestasiAkademikForm ? (
                            <FontAwesomeIcon icon={faChevronUp} />
                          ) : (
                            <FontAwesomeIcon icon={faChevronDown} />
                          )}
                        </button>
                      </div>

                      {showDataMahasiswaBerprestasiAkademikForm && (
                        <div className="mt-2 flex flex-col p-4">
                          <>
                            <button
                              className="flex px-3 py-2 bg-orange-500 items-center gap-2 rounded-lg ml-auto hover:bg-orange-600"
                              onClick={(e) => {
                                openAddPrestasiIlmiahMahasiswaModal(e);
                              }}
                            >
                              <Image src={plusIcon} alt="Plus Icon" />
                              <p className="text-white text-[14px]">
                                Tambah Prestasi Ilmiah Mahasiswa
                              </p>
                            </button>
                            <div className="mt-6 overflow-x-auto">
                              <table className="min-w-full text-[16px] border-collapse table-fixed">
                                <thead>
                                  <tr className="bg-gray-100 text-center">
                                    <th className="px-4 py-2 w-[20%] rounded-tl-lg rounded-bl-lg">
                                      Bidang Prestasi
                                    </th>
                                    <th className="px-4 py-2 w-[15%]">NIM</th>
                                    <th className="px-4 py-2 w-[15%]">Nama</th>
                                    <th className="px-4 py-2 w-[15%]">
                                      Tingkat Prestasi
                                    </th>
                                    <th className="px-4 py-2 w-[10%]">
                                      Lampiran
                                    </th>
                                    <th className="px-4 py-2 w-[25%] rounded-tr-lg rounded-br-lg">
                                      Action
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {prestasiIlmiahMahasiswaFormValue.length ===
                                  0 ? (
                                    <tr>
                                      <td
                                        colSpan={6}
                                        className="text-center py-4"
                                      >
                                        <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                                          <h2 className="text-xl font-semibold text-gray-700">
                                            Silahkan Tambah Prestasi Ilmiah
                                            Mahasiswa
                                          </h2>
                                          <p className="text-gray-500 mt-2">
                                            Saat ini belum ada data prestasi
                                            ilmiah yang dimasukkan. Klik tombol
                                            tambah prestasi ilmiah mahasiswa
                                            untuk menambahkannya.
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  ) : (
                                    prestasiIlmiahMahasiswaFormValue.map(
                                      (data: any, index: any) => (
                                        <tr key={index}>
                                          <td className="border-b text-center border-gray-200 px-4 break-words overflow-wrap">
                                            {data.bidang_prestasi}
                                          </td>
                                          <td className="border-b text-center border-gray-200 px-4 max-w-[200px] break-words overflow-wrap">
                                            {data.nim}
                                          </td>
                                          <td className="border-b text-center border-gray-200 px-4">
                                            {data.nama}
                                          </td>
                                          <td className="border-b text-center border-gray-200 px-4">
                                            {data.tingkat_prestasi}
                                          </td>
                                          <td className="border-b text-center border-gray-200 px-4">
                                            <FileButton
                                              data={data}
                                              className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600"
                                            />
                                          </td>
                                          <td className="border-b border-gray-200 px-4 py-4">
                                            <div className="flex gap-2 items-center justify-center">
                                              <EditButton
                                                className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
                                                onClick={(e) => {
                                                  setDataSelectedPrestasiIlmiahMahasiswaEditModal(
                                                    data
                                                  );
                                                  setPreviewUrlEditPrestasiIlmiahMahasiswaModal(
                                                    URL.createObjectURL(
                                                      data.file
                                                    )
                                                  );
                                                  openEditPrestasiIlmiahMahasiswaModal(
                                                    e
                                                  );
                                                }}
                                              />
                                              <TrashButton
                                                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                                                onClick={(e) => {
                                                  setIdSelectedPrestasiIlmiahMahasiswaDeleteModal(
                                                    data.id
                                                  );
                                                  openDeletePrestasiIlmiahMahasiswaModal(
                                                    e
                                                  );
                                                }}
                                              />
                                            </div>
                                          </td>
                                        </tr>
                                      )
                                    )
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </>
                          <Modal
                            isOpen={isModalAddPrestasiIlmiahMahasiswaOpen}
                            onClose={closeAddPrestasiIlmiahMahasiswaModal}
                            onAdd={handleAddPrestasiIlmiahMahasiswa}
                            modalType="Tambah"
                            title="Tambah Prestasi Akademik Mahasiswa"
                          >
                            <form className="max-h-[400px] flex flex-col gap-2 pr-4 overflow-y-auto">
                              <InputField
                                type="text"
                                placeholder="Masukkan Bidang Prestasi"
                                onChange={(e) =>
                                  setBidangPrestasiAddPrestasiIlmiahMahasiswaModal(
                                    e.target.value
                                  )
                                }
                                value={
                                  bidangPrestasiAddPrestasiIlmiahMahasiswaModal
                                }
                                className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                              />
                              <InputField
                                type="text"
                                placeholder="Masukkan NIM"
                                onChange={(e) =>
                                  setNimAddPrestasiIlmiahMahasiswaModal(
                                    e.target.value
                                  )
                                }
                                value={nimAddPrestasiIlmiahMahasiswaModal}
                                className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                              />
                              <InputField
                                type="text"
                                placeholder="Masukkan Nama Lengkap"
                                onChange={(e) =>
                                  setNamaLengkapAddPrestasiIlmiahMahasiswaModal(
                                    e.target.value
                                  )
                                }
                                value={
                                  namaLengkapAddPrestasiIlmiahMahasiswaModal
                                }
                                className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                              />
                              <select
                                value={
                                  tingkatPrestasiAddPrestasiIlmiahMahasiswaModal
                                }
                                onChange={(e) =>
                                  setTingkatPrestasiAddPrestasiIlmiahMahasiswaModal(
                                    e.target.value
                                  )
                                }
                                className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                              >
                                <option value="">Pilih Tingkat Prestasi</option>
                                <option value="Lokal">Lokal</option>
                                <option value="Nasional">Nasional</option>
                                <option value="Internasional">
                                  Internasional
                                </option>
                              </select>
                              <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) =>
                                  handleFileChangeAddPrestasiIlmiahMahasiswaModal(
                                    e
                                  )
                                }
                                className="mb-3"
                              />
                              {previewUrlAddPrestasiIlmiahMahasiswaModal && (
                                <iframe
                                  src={
                                    previewUrlAddPrestasiIlmiahMahasiswaModal
                                  }
                                  title="Preview PDF"
                                  width="100%"
                                  height="300"
                                  className="mb-3"
                                />
                              )}
                            </form>
                          </Modal>
                          <Modal
                            isOpen={isModalEditPrestasiIlmiahMahasiswaOpen}
                            onClose={closeEditPrestasiIlmiahMahasiswaModal}
                            onEdit={handleEditPrestasiIlmiahMahasiswa}
                            modalType="Edit"
                            title="Tambah Prestasi Akademik Mahasiswa"
                          >
                            <form className="max-h-[400px] flex flex-col gap-2 pr-4 overflow-y-auto">
                              <InputField
                                type="text"
                                placeholder="Masukkan Bidang Prestasi"
                                onChange={(e) =>
                                  setDataSelectedPrestasiIlmiahMahasiswaEditModal(
                                    {
                                      ...dataSelectedPrestasiIlmiahMahasiswaEditModal,
                                      bidang_prestasi: e.target.value,
                                    }
                                  )
                                }
                                value={
                                  dataSelectedPrestasiIlmiahMahasiswaEditModal.bidang_prestasi
                                }
                                className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                              />
                              <InputField
                                type="text"
                                placeholder="Masukkan NIM"
                                onChange={(e) =>
                                  setDataSelectedPrestasiIlmiahMahasiswaEditModal(
                                    {
                                      ...dataSelectedPrestasiIlmiahMahasiswaEditModal,
                                      nim: e.target.value,
                                    }
                                  )
                                }
                                value={
                                  dataSelectedPrestasiIlmiahMahasiswaEditModal.nim
                                }
                                className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                              />
                              <InputField
                                type="text"
                                placeholder="Masukkan Nama Lengkap"
                                onChange={(e) =>
                                  setDataSelectedPrestasiIlmiahMahasiswaEditModal(
                                    {
                                      ...dataSelectedPrestasiIlmiahMahasiswaEditModal,
                                      nama: e.target.value,
                                    }
                                  )
                                }
                                value={
                                  dataSelectedPrestasiIlmiahMahasiswaEditModal.nama
                                }
                                className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                              />
                              <select
                                value={
                                  dataSelectedPrestasiIlmiahMahasiswaEditModal.tingkat_prestasi
                                }
                                onChange={(e) =>
                                  setDataSelectedPrestasiIlmiahMahasiswaEditModal(
                                    {
                                      ...dataSelectedPrestasiIlmiahMahasiswaEditModal,
                                      tingkat_prestasi: e.target.value,
                                    }
                                  )
                                }
                                className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                              >
                                <option value="">Pilih Tingkat Prestasi</option>
                                <option value="Lokal">Lokal</option>
                                <option value="Nasional">Nasional</option>
                                <option value="Internasional">
                                  Internasional
                                </option>
                              </select>
                              <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) =>
                                  handleFileChangeEditPrestasiIlmiahMahasiswaModal(
                                    e
                                  )
                                }
                                className="mb-3"
                              />
                              <iframe
                                src={previewUrlEditPrestasiIlmiahMahasiswaModal}
                                title="Preview PDF"
                                width="100%"
                                height="300"
                                className="mb-3"
                              />
                            </form>
                          </Modal>
                          <Modal
                            isOpen={isModalDeletePrestasiIlmiahMahasiswaOpen}
                            onClose={closeDeletePrestasiIlmiahMahasiswaModal}
                            onDelete={handleDeletePrestasiIlmiahMahasiswa}
                            modalType="Delete"
                            title="Hapus Prestasi Ilmiah Mahasiswa"
                          >
                            <p>
                              Apakah Anda yakin ingin menghapus Prestasi Ilmiah
                              Mahasiswa ini?
                            </p>
                          </Modal>
                        </div>
                      )}
                    </div> */}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <p className="font-bold">C. KESIMPULAN DAN SARAN</p>
                  <div className="p-6 border rounded-lg ">
                    <RichTextKesimpulan
                      value={kesimpulan}
                      onChange={setKesimpulan}
                    />
                  </div>
                </div>
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
                <div className="flex flex-col w-1/2 mx-auto gap-2 my-4">
                  <p className="text-center font-medium">
                    Silahkan Tanda Tangan Laporan Perwalian
                  </p>
                  <div className="flex flex-col">
                    <SignatureCanvas
                      ref={sigCanvas}
                      penColor="black"
                      penWidth={15} // Set the pen width to make the signature thicker
                      canvasProps={{
                        className:
                          "border border-gray-300 rounded-lg h-[300px]",
                      }}
                    />
                    <a
                      onClick={clearSignature}
                      className="text-blue-500 underline text-end cursor-pointer hover:text-blue-700"
                    >
                      Clear
                    </a>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <p>Sudah selesai membuat laporan?</p>
                  <a
                    onClick={(e) => handlePreviewPDF(e)}
                    className="text-blue-500 underline text-end cursor-pointer hover:text-blue-700"
                  >
                    Preview PDF Laporan
                  </a>
                </div>
                <PDFModal
                  isOpen={isModalOpen}
                  closeModal={closeModal}
                  pdfUrl={pdfUrl}
                />
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

const RichTextPendahuluan = ({ value, onChange }) => {
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const [editorValue, setEditorValue] = useState<Descendant[]>(value);
  useEffect(() => {
    setEditorValue(value);
  }, [value]);

  const handleChange = (newValue: Descendant[]) => {
    setEditorValue(newValue); // Update local state
    onChange(newValue); // Call the onChange prop to notify parent
  };
  return (
    <Slate
      editor={editor}
      value={editorValue}
      onChange={handleChange}
      initialValue={initialValue}
    >
      <Toolbar>
        <MarkButton format="bold" />
        <MarkButton format="italic" />
        <MarkButton format="underline" />
        <BlockButton format="left" />
        <BlockButton format="center" />
        <BlockButton format="right" />
        <BlockButton format="justify" />
      </Toolbar>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Masukkan Pendahuluan…"
        spellCheck
        style={{ outline: "none" }}
        onKeyDown={(event) => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event as any)) {
              event.preventDefault();
              const mark = HOTKEYS[hotkey];
              toggleMark(editor, mark);
            }
          }
        }}
      />
    </Slate>
  );
};
const RichTextKesimpulan = ({ value, onChange }) => {
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [editorValue, setEditorValue] = useState<Descendant[]>(value);

  useEffect(() => {
    setEditorValue(value);
  }, [value]);

  const handleChange = (newValue: Descendant[]) => {
    setEditorValue(newValue); // Update local state
    onChange(newValue); // Call the onChange prop to notify parent
  };

  return (
    <Slate
      editor={editor}
      value={editorValue}
      onChange={handleChange}
      initialValue={initialValue}
    >
      <Toolbar>
        <MarkButton format="bold" />
        <MarkButton format="italic" />
        <MarkButton format="underline" />
        <BlockButton format="left" />
        <BlockButton format="center" />
        <BlockButton format="right" />
        <BlockButton format="justify" />
      </Toolbar>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Masukkan Kesimpulan...."
        spellCheck
        style={{ outline: "none" }}
        onKeyDown={(event) => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event as any)) {
              event.preventDefault();
              const mark = HOTKEYS[hotkey];
              toggleMark(editor, mark);
            }
          }
        }}
      />
    </Slate>
  );
};

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
  );
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });
  let newProperties: Partial<SlateElement>;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      type: isActive ? "paragraph" : isList ? "list-item" : format,
    };
  }
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor, format, blockType = "type") => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType] === format,
    })
  );

  return !!match;
};

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const Element = ({ attributes, children, element }) => {
  const style = { textAlign: element.align };
  switch (element.type) {
    case "block-quote":
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      );
    case "bulleted-list":
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      );
    case "heading-one":
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      );
    case "list-item":
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case "numbered-list":
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      );
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const BlockButton = ({ format }) => {
  const editor = useSlate();

  const renderIcon = () => {
    switch (format) {
      case "heading-one":
        return <LooksOneIcon />;
      case "heading-two":
        return <LooksTwoIcon />;
      case "block-quote":
        return <FormatQuoteIcon />;
      case "numbered-list":
        return <FormatListNumberedIcon />;
      case "bulleted-list":
        return <FormatListBulletedIcon />;
      case "left":
        return <FormatAlignLeftIcon />;
      case "center":
        return <FormatAlignCenterIcon />;
      case "right":
        return <FormatAlignRightIcon />;
      case "justify":
        return <FormatAlignJustifyIcon />;
      default:
        return null;
    }
  };

  return (
    <Button
      active={isBlockActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      {renderIcon()}
    </Button>
  );
};

const MarkButton = ({ format }) => {
  const editor = useSlate();

  const renderIcon = () => {
    switch (format) {
      case "bold":
        return <FormatBoldIcon />;
      case "italic":
        return <FormatItalicIcon />;
      case "underline":
        return <FormatUnderlinedIcon />;
      case "code":
        return <CodeIcon />;
      default:
        return null;
    }
  };

  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {renderIcon()}
    </Button>
  );
};
