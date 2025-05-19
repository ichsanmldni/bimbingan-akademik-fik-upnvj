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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PDFModal from "@/components/ui/PDFModal";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchMahasiswa } from "@/lib/features/mahasiswaSlice";
import { fetchDosenPA } from "@/lib/features/dosenPASlice";
import { fetchKaprodi } from "@/lib/features/kaprodiSlice";
import { useDispatch } from "react-redux";

const HOTKEYS: { [key: string]: string } = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];

const initialValue: any = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

export const selectIsLoadingGlobal = ({
  dataUser,
  dataMahasiswaUser,
  dataDosenPA,
  dataKaprodi,
  optionsTahunAjaran,
  dataTahunAjaran,
  roleUser,
}) => {
  const isEmpty = (data) =>
    data === null ||
    data === undefined ||
    (Array.isArray(data) && data.length === 0) ||
    (typeof data === "object" && Object.keys(data).length === 0);

  if (!roleUser) {
    return true;
  }

  if (["Mahasiswa", "Dosen PA", "Kaprodi"].includes(roleUser)) {
    if (isEmpty(dataMahasiswaUser)) return true;
    if (isEmpty(dataDosenPA)) return true;
    if (isEmpty(dataKaprodi)) return true;
    if (isEmpty(optionsTahunAjaran)) return true;
    if (isEmpty(dataTahunAjaran)) return true;
  }

  if (roleUser === "Admin" && isEmpty(dataUser)) {
    return true;
  }

  return false;
};

export function Spinner() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-[1000]">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-blue-600 border-b-transparent"></div>
    </div>
  );
}

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const roleUser =
    useSelector((state: RootState) => state.auth?.roleUser) || "";
  const dataUser = useSelector((state: RootState) => state.auth?.dataUser);

  // Data states
  const dataMahasiswa = useSelector(
    (state: RootState) => state.mahasiswa?.data
  );
  const dataDosenPA = useSelector((state: RootState) => state.dosenPA?.data);
  const dataKaprodi = useSelector((state: RootState) => state.kaprodi?.data);
  const statusDataMahasiswa = useSelector(
    (state: RootState) => state.mahasiswa.status
  );
  const statusDataDosenPA = useSelector(
    (state: RootState) => state.dosenPA.status
  );
  const statusDataKaprodi = useSelector(
    (state: RootState) => state.kaprodi.status
  );
  const statusDataUser = useSelector((state: RootState) => state.user.status);
  const [selectedKaprodi, setSelectedKaprodi] = useState<any>("");
  const [selectedSemester, setSelectedSemester] = useState<any>("");
  const [selectedTahunAjaran, setSelectedTahunAjaran] = useState<any>("");
  const [pendahuluan, setPendahuluan] = useState<any>([]);
  const [kesimpulan, setKesimpulan] = useState<any>([]);
  const [optionsKaprodi, setOptionsKaprodi] = useState<any>([]);
  const [optionsJenisBimbingan, setOptionsJenisBimbingan] = useState<any>([]);
  const [optionsSemester, setOptionsSemester] = useState<any>([]);
  const [optionsPeriodePengajuan, setOptionsPeriodePengajuan] = useState([]);
  const [dataSelectedKaprodi, setDataSelectedKaprodi] = useState<any>(null);
  const [dataTahunAjaran, setDataTahunAjaran] = useState<any>([]);
  const [dataBimbingan, setDataBimbingan] = useState<any>([]);
  const [filteredBimbingan, setFilteredBimbingan] = useState<any>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [selectedBimbingan, setSelectedBimbingan] = useState<any>([]);
  const [imagePreviews, setImagePreviews] = useState<any>([]);
  const [
    dataSelectedNamaMahasiswaAddKonsultasiBimbinganModal,
    setDataSelectedNamaMahasiswaAddKonsultasiBimbinganModal,
  ] = useState("");

  const [jurusanFilter, setJurusanFilter] = useState<any>("");
  const [jadwalFilter, setJadwalFilter] = useState<any>("");
  const [periodePengajuanFilter, setPeriodePengajuanFilter] = useState<any>("");
  const [jenisBimbinganFilter, setJenisBimbinganFilter] = useState<any>("");
  const [tahunAjaranFilter, setTahunAjaranFilter] = useState<any>("");
  const [semesterFilter, setSemesterFilter] = useState<any>("");
  const [
    showPrestasiAkademikMahasiswaForm,
    setShowPrestasiAkademikMahasiswaForm,
  ] = useState<any>(false);
  const [
    jumlahMahasiswaIpkAPrestasiAkademikMahasiswaForm,
    setJumlahMahasiswaIpkAPrestasiAkademikMahasiswaForm,
  ] = useState<any>(0);
  const [
    jumlahMahasiswaIpkBPrestasiAkademikMahasiswaForm,
    setJumlahMahasiswaIpkBPrestasiAkademikMahasiswaForm,
  ] = useState<any>(0);
  const [
    jumlahMahasiswaIpkCPrestasiAkademikMahasiswaForm,
    setJumlahMahasiswaIpkCPrestasiAkademikMahasiswaForm,
  ] = useState<any>(0);
  const [
    jumlahMahasiswaIpkDPrestasiAkademikMahasiswaForm,
    setJumlahMahasiswaIpkDPrestasiAkademikMahasiswaForm,
  ] = useState<any>(0);
  const [
    jumlahMahasiswaIpkEPrestasiAkademikMahasiswaForm,
    setJumlahMahasiswaIpkEPrestasiAkademikMahasiswaForm,
  ] = useState<any>(0);
  const [
    jumlahMahasiswaBeasiswaBBMPrestasiMahasiswaMendapatkanBeasiswaForm,
    setJumlahMahasiswaBeasiswaBBMPrestasiMahasiswaMendapatkanBeasiswaForm,
  ] = useState<any>(0);
  const [
    jumlahMahasiswaBeasiswaPegadaianPrestasiMahasiswaMendapatkanBeasiswaForm,
    setJumlahMahasiswaBeasiswaPegadaianPrestasiMahasiswaMendapatkanBeasiswaForm,
  ] = useState<any>(0);
  const [
    jumlahMahasiswaBeasiswaSupersemarPrestasiMahasiswaMendapatkanBeasiswaForm,
    setJumlahMahasiswaBeasiswaSupersemarPrestasiMahasiswaMendapatkanBeasiswaForm,
  ] = useState<any>(0);
  const [
    jumlahMahasiswaBeasiswaPPAPrestasiMahasiswaMendapatkanBeasiswaForm,
    setJumlahMahasiswaBeasiswaPPAPrestasiMahasiswaMendapatkanBeasiswaForm,
  ] = useState<any>(0);
  const [
    jumlahMahasiswaBeasiswaYKLPrestasiMahasiswaMendapatkanBeasiswaForm,
    setJumlahMahasiswaBeasiswaYKLPrestasiMahasiswaMendapatkanBeasiswaForm,
  ] = useState<any>(0);
  const [
    jumlahMahasiswaBeasiswaDllPrestasiMahasiswaMendapatkanBeasiswaForm,
    setJumlahMahasiswaBeasiswaDllPrestasiMahasiswaMendapatkanBeasiswaForm,
  ] = useState<any>(0);
  const [showPrestasiIlmiahMahasiswaForm, setShowPrestasiIlmiahMahasiswaForm] =
    useState<any>(false);
  const [
    prestasiIlmiahMahasiswaFormValue,
    setPrestasiIlmiahMahasiswaFormValue,
  ] = useState<any>([]);
  const [
    prestasiMahasiswaMengikutiPorseniFormValue,
    setPrestasiMahasiswaMengikutiPorseniFormValue,
  ] = useState<any>([]);
  const [dataStatusMahasiswaFormValue, setDataStatusMahasiswaFormValue] =
    useState<any>([]);
  const [
    isModalAddPrestasiIlmiahMahasiswaOpen,
    setIsModalAddPrestasiIlmiahMahasiswaOpen,
  ] = useState<any>(false);
  const [
    isModalAddPrestasiMahasiswaMengikutiPorseniOpen,
    setIsModalAddPrestasiMahasiswaMengikutiPorseniOpen,
  ] = useState<any>(false);
  const [
    isModalAddDataStatusMahasiswaOpen,
    setIsModalAddDataStatusMahasiswaOpen,
  ] = useState<any>(false);
  const [
    isModalAddDataKonsultasiMahasiswaOpen,
    setIsModalAddDataKonsultasiMahasiswaOpen,
  ] = useState<any>(false);
  const [
    isModalEditPrestasiIlmiahMahasiswaOpen,
    setIsModalEditPrestasiIlmiahMahasiswaOpen,
  ] = useState<any>(false);
  const [
    isModalEditPrestasiMahasiswaMengikutiPorseniOpen,
    setIsModalEditPrestasiMahasiswaMengikutiPorseniOpen,
  ] = useState<any>(false);
  const [
    isModalEditDataStatusMahasiswaOpen,
    setIsModalEditDataStatusMahasiswaOpen,
  ] = useState<any>(false);
  const [
    isModalEditDataKonsultasiMahasiswaOpen,
    setIsModalEditDataKonsultasiMahasiswaOpen,
  ] = useState<any>(false);
  const [
    isModalDeletePrestasiIlmiahMahasiswaOpen,
    setIsModalDeletePrestasiIlmiahMahasiswaOpen,
  ] = useState<any>(false);
  const [
    isModalDeletePrestasiMahasiswaMengikutiPorseniOpen,
    setIsModalDeletePrestasiMahasiswaMengikutiPorseniOpen,
  ] = useState<any>(false);
  const [
    isModalDeleteDataStatusMahasiswaOpen,
    setIsModalDeleteDataStatusMahasiswaOpen,
  ] = useState<any>(false);
  const [
    isModalDeleteDataKonsultasiMahasiswaOpen,
    setIsModalDeleteDataKonsultasiMahasiswaOpen,
  ] = useState<any>(false);
  const [
    dataSelectedPrestasiIlmiahMahasiswaEditModal,
    setDataSelectedPrestasiIlmiahMahasiswaEditModal,
  ] = useState<any>({});
  const [
    dataSelectedPrestasiMahasiswaMengikutiPorseniEditModal,
    setDataSelectedPrestasiMahasiswaMengikutiPorseniEditModal,
  ] = useState<any>({});
  const [
    dataSelectedDataStatusMahasiswaEditModal,
    setDataSelectedDataStatusMahasiswaEditModal,
  ] = useState<any>({});
  const [
    dataSelectedDataKonsultasiMahasiswaEditModal,
    setDataSelectedDataKonsultasiMahasiswaEditModal,
  ] = useState<any>({});
  const [
    idSelectedPrestasiIlmiahMahasiswaDeleteModal,
    setIdSelectedPrestasiIlmiahMahasiswaDeleteModal,
  ] = useState<any>(null);
  const [
    idSelectedPrestasiMahasiswaMengikutiPorseniDeleteModal,
    setIdSelectedPrestasiMahasiswaMengikutiPorseniDeleteModal,
  ] = useState<any>(null);
  const [
    idSelectedDataStatusMahasiswaDeleteModal,
    setIdSelectedDataStatusMahasiswaDeleteModal,
  ] = useState<any>(null);
  const [
    idSelectedDataKonsultasiMahasiswaDeleteModal,
    setIdSelectedDataKonsultasiMahasiswaDeleteModal,
  ] = useState<any>(null);
  const [
    bidangPrestasiAddPrestasiIlmiahMahasiswaModal,
    setBidangPrestasiAddPrestasiIlmiahMahasiswaModal,
  ] = useState<any>("");
  const [
    jenisKegiatanAddPrestasiMahasiswaMengikutiPorseniModal,
    setJenisKegiatanAddPrestasiMahasiswaMengikutiPorseniModal,
  ] = useState<any>("");
  const [
    nimAddPrestasiIlmiahMahasiswaModal,
    setNimAddPrestasiIlmiahMahasiswaModal,
  ] = useState<any>("");
  const [
    nimAddPrestasiMahasiswaMengikutiPorseniModal,
    setNimAddPrestasiMahasiswaMengikutiPorseniModal,
  ] = useState<any>("");
  const [nimAddDataStatusMahasiswaModal, setNimAddDataStatusMahasiswaModal] =
    useState<any>("");
  const [
    namaLengkapAddPrestasiIlmiahMahasiswaModal,
    setNamaLengkapAddPrestasiIlmiahMahasiswaModal,
  ] = useState<any>("");
  const [
    namaLengkapAddPrestasiMahasiswaMengikutiPorseniModal,
    setNamaLengkapAddPrestasiMahasiswaMengikutiPorseniModal,
  ] = useState<any>("");
  const [
    namaLengkapAddDataStatusMahasiswaModal,
    setNamaLengkapAddDataStatusMahasiswaModal,
  ] = useState<any>("");
  const [
    selectedDataBimbinganAddDataKonsultasiMahasiswaModal,
    setSelectedDataBimbinganAddDataKonsultasiMahasiswaModal,
  ] = useState<any>({});
  const [
    permasalahanAddDataKonsultasiMahasiswaModal,
    setPermasalahanAddDataKonsultasiMahasiswaModal,
  ] = useState<any>("");
  const [
    solusiAddDataKonsultasiMahasiswaModal,
    setSolusiAddDataKonsultasiMahasiswaModal,
  ] = useState<any>("");
  const [
    tingkatPrestasiAddPrestasiIlmiahMahasiswaModal,
    setTingkatPrestasiAddPrestasiIlmiahMahasiswaModal,
  ] = useState<any>("");
  const [
    tingkatPrestasiAddPrestasiMahasiswaMengikutiPorseniModal,
    setTingkatPrestasiAddPrestasiMahasiswaMengikutiPorseniModal,
  ] = useState<any>("");
  const [
    statusAddDataStatusMahasiswaModal,
    setStatusAddDataStatusMahasiswaModal,
  ] = useState<any>("");
  const [
    fileAddPrestasiIlmiahMahasiswaModal,
    setFileAddPrestasiIlmiahMahasiswaModal,
  ] = useState<any>(null);
  const [
    fileAddPrestasiMahasiswaMengikutiPorseniModal,
    setFileAddPrestasiMahasiswaMengikutiPorseniModal,
  ] = useState<any>(null);
  const [
    previewUrlAddPrestasiIlmiahMahasiswaModal,
    setPreviewUrlAddPrestasiIlmiahMahasiswaModal,
  ] = useState<any>("");
  const [
    previewUrlAddPrestasiMahasiswaMengikutiPorseniModal,
    setPreviewUrlAddPrestasiMahasiswaMengikutiPorseniModal,
  ] = useState<any>("");
  const [
    previewUrlEditPrestasiIlmiahMahasiswaModal,
    setPreviewUrlEditPrestasiIlmiahMahasiswaModal,
  ] = useState<any>("");
  const [
    previewUrlEditPrestasiMahasiswaMengikutiPorseniModal,
    setPreviewUrlEditPrestasiMahasiswaMengikutiPorseniModal,
  ] = useState<any>("");
  const [
    showPrestasiMahasiswaMendapatkanBeasiswaForm,
    setShowPrestasiMahasiswaMendapatkanBeasiswaForm,
  ] = useState<any>(false);
  const [
    showPrestasiMahasiswaMengikutiPorseniForm,
    setShowPrestasiMahasiswaMengikutiPorseniForm,
  ] = useState<any>(false);
  const [showDataStatusMahasiswaForm, setShowDataStatusMahasiswaForm] =
    useState<any>(false);
  const [
    showDataMahasiswaBerprestasiAkademikForm,
    setShowDataMahasiswaBerprestasiAkademikForm,
  ] = useState<any>(false);
  const [jadwalOptions, setJadwalOptions] = useState<any>([]);
  const [jurusanOptions, setJurusanOptions] = useState<any>([]);

  const sigCanvas: any = useRef<any>(null);
  const clearSignature = () => {
    sigCanvas.current.clear();
  };

  const togglePrestasiAkademikMahasiswaForm = (e: any) => {
    e.preventDefault();
    setShowPrestasiAkademikMahasiswaForm(!showPrestasiAkademikMahasiswaForm);
  };
  const togglePrestasiIlmiahMahasiswaForm = (e: any) => {
    e.preventDefault();
    setShowPrestasiIlmiahMahasiswaForm(!showPrestasiIlmiahMahasiswaForm);
  };
  const openAddPrestasiIlmiahMahasiswaModal = (e: any) => {
    e.preventDefault();
    setIsModalAddPrestasiIlmiahMahasiswaOpen(true);
  };
  const openAddPrestasiMahasiswaMengikutiPorseniModal = (e: any) => {
    e.preventDefault();
    setIsModalAddPrestasiMahasiswaMengikutiPorseniOpen(true);
  };
  const openAddDataStatusMahasiswaModal = (e: any) => {
    e.preventDefault();
    setIsModalAddDataStatusMahasiswaOpen(true);
  };
  const openAddDataKonsultasiMahasiswaModal = (e: any) => {
    e.preventDefault();
    setIsModalAddDataKonsultasiMahasiswaOpen(true);
  };

  const openEditPrestasiIlmiahMahasiswaModal = (e: any) => {
    e.preventDefault();
    setIsModalEditPrestasiIlmiahMahasiswaOpen(true);
  };
  const openEditPrestasiMahasiswaMengikutiPorseniModal = (e: any) => {
    e.preventDefault();
    setIsModalEditPrestasiMahasiswaMengikutiPorseniOpen(true);
  };
  const openEditDataStatusMahasiswaModal = (e: any) => {
    e.preventDefault();
    setIsModalEditDataStatusMahasiswaOpen(true);
  };
  const openEditDataKonsultasiMahasiswaModal = (e: any) => {
    e.preventDefault();
    setIsModalEditDataKonsultasiMahasiswaOpen(true);
  };

  const openDeletePrestasiIlmiahMahasiswaModal = (e: any) => {
    e.preventDefault();
    setIsModalDeletePrestasiIlmiahMahasiswaOpen(true);
  };
  const openDeletePrestasiMahasiswaMengikutiPorseniModal = (e: any) => {
    e.preventDefault();
    setIsModalDeletePrestasiMahasiswaMengikutiPorseniOpen(true);
  };
  const openDeleteDataStatusMahasiswaModal = (e: any) => {
    e.preventDefault();
    setIsModalDeleteDataStatusMahasiswaOpen(true);
  };
  const openDeleteDataKonsultasiMahasiswaModal = (e: any) => {
    e.preventDefault();
    setIsModalDeleteDataKonsultasiMahasiswaOpen(true);
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
  const closeAddDataKonsultasiMahasiswaModal = () => {
    setIsModalAddDataKonsultasiMahasiswaOpen(false);
    setDataSelectedNamaMahasiswaAddKonsultasiBimbinganModal("");
    setPermasalahanAddDataKonsultasiMahasiswaModal("");
    setSolusiAddDataKonsultasiMahasiswaModal("");
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
  const closeEditDataKonsultasiMahasiswaModal = () => {
    setDataSelectedDataKonsultasiMahasiswaEditModal({});
    setIsModalEditDataKonsultasiMahasiswaOpen(false);
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
  const closeDeleteDataKonsultasiMahasiswaModal = () => {
    setIdSelectedDataKonsultasiMahasiswaDeleteModal(null);
    setIsModalDeleteDataKonsultasiMahasiswaOpen(false);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  const [dataKonsultasiMahasiswa, setDataKonsultasiMahasiswa] = useState<any>(
    []
  );

  const DataRowKonsultasiMahasiswa: React.FC<{ data: any; index: any }> = ({
    data,
    index,
  }) => {
    const [visiblePermasalahan, setVisiblePermasalahan] = useState(100);
    const [visibleSolusi, setVisibleSolusi] = useState(100);
    const increment = 100;

    return (
      <tr key={index}>
        <td className="border-b text-center align-top border-gray-200 px-2 py-2">
          {index + 1}
        </td>
        <td className="border-b text-center align-top border-gray-200 px-2 py-2">
          {data.tanggal}
        </td>
        <td className="border-b text-center align-top border-gray-200 px-2 py-2">
          {data.nim}
        </td>
        <td className="border-b text-center align-top border-gray-200 px-2 py-2">
          {data.nama}
        </td>
        <td className="border-b text-justify align-top border-gray-200 px-2 py-2">
          {data.permasalahan.substring(0, visiblePermasalahan)}
          {data.permasalahan.length > visiblePermasalahan && (
            <>
              <span>...</span>
              <button
                className="text-blue-500 ml-2"
                onClick={(e) => {
                  e.preventDefault();
                  setVisiblePermasalahan(visiblePermasalahan + increment);
                }}
              >
                Show More
              </button>
            </>
          )}
          {visiblePermasalahan > 100 && (
            <button
              className="text-blue-500 ml-2"
              onClick={(e) => {
                e.preventDefault();
                setVisiblePermasalahan(visiblePermasalahan - increment);
              }}
            >
              Show Less
            </button>
          )}
        </td>
        <td className="border-b text-justify align-top border-gray-200 px-2 py-2">
          {data.solusi.substring(0, visibleSolusi)}
          {data.solusi.length > visibleSolusi && (
            <>
              <span>...</span>
              <button
                className="text-blue-500 ml-2"
                onClick={(e) => {
                  e.preventDefault();
                  setVisibleSolusi(visibleSolusi + increment);
                }}
              >
                Show More
              </button>
            </>
          )}
          {visibleSolusi > 100 && (
            <button
              className="text-blue-500 ml-2"
              onClick={(e) => {
                e.preventDefault();
                setVisibleSolusi(visibleSolusi - increment);
              }}
            >
              Show Less
            </button>
          )}
        </td>
        <td className="border-b text-center align-top border-gray-200 px-2 py-2">
          <img
            alt="ttd mhs"
            src={data.ttd_mhs}
            className="size-[48px] mx-auto p-1"
          />
        </td>
        <td className="border-b align-top border-gray-200 px-4 py-4">
          <div className="flex gap-2 items-center justify-center">
            <EditButton
              className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
              onClick={(e: any) => {
                setDataSelectedDataKonsultasiMahasiswaEditModal(data);
                openEditDataKonsultasiMahasiswaModal(e);
              }}
            />
            <TrashButton
              className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
              onClick={(e: any) => {
                setIdSelectedDataKonsultasiMahasiswaDeleteModal(data.id);
                openDeleteDataKonsultasiMahasiswaModal(e);
              }}
            />
          </div>
        </td>
      </tr>
    );
  };

  const DataRowAbsensiMahasiswa: React.FC<{ data: any; index: any }> = ({
    data,
    index,
  }) => {
    return (
      <tr key={index}>
        <td className="border-b text-center align-top border-gray-200 px-2 py-2">
          {index + 1}
        </td>
        <td className="border-b text-center align-top border-gray-200 px-2 py-2">
          {data.pengajuan_bimbingan.nim}
        </td>
        <td className="border-b text-center align-top border-gray-200 px-2 py-2">
          {data.pengajuan_bimbingan.nama_lengkap}
        </td>
        <td className="border-b text-center align-top border-gray-200 px-2 py-2">
          <img
            alt="ttd absen"
            src={data.ttd_kehadiran}
            className="size-[48px] mx-auto p-1"
          />
        </td>
      </tr>
    );
  };

  const handleAddPrestasiMahasiswaMengikutiPorseni = async (e: any) => {
    e.preventDefault();
    setPrestasiMahasiswaMengikutiPorseniFormValue((prevValues: any) => [
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
    setDataStatusMahasiswaFormValue((prevValues: any) => [
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
  const handleAddDataKonsultasiMahasiswa = async (e: any) => {
    e.preventDefault();
    setDataKonsultasiMahasiswa((prevValues: any) => [
      ...prevValues,
      {
        id: generateUniqueId(),
        tanggal: formatTanggal(
          selectedDataBimbinganAddDataKonsultasiMahasiswaModal
            .pengajuan_bimbingan.jadwal_bimbingan
        ),
        nim: selectedDataBimbinganAddDataKonsultasiMahasiswaModal
          .pengajuan_bimbingan.nim,
        nama: selectedDataBimbinganAddDataKonsultasiMahasiswaModal
          .pengajuan_bimbingan.nama_lengkap,
        permasalahan: permasalahanAddDataKonsultasiMahasiswaModal,
        solusi: solusiAddDataKonsultasiMahasiswaModal,
        ttd_mhs:
          selectedDataBimbinganAddDataKonsultasiMahasiswaModal.ttd_kehadiran,
      },
    ]);
    closeAddDataKonsultasiMahasiswaModal();
  };
  const handleAddPrestasiIlmiahMahasiswa = async (e: any) => {
    e.preventDefault();
    setPrestasiIlmiahMahasiswaFormValue((prevValues: any) => [
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
    setPrestasiIlmiahMahasiswaFormValue((prevValues: any) => {
      return prevValues.map((item: any) =>
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
    setPrestasiMahasiswaMengikutiPorseniFormValue((prevValues: any) => {
      return prevValues.map((item: any) =>
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
    setDataStatusMahasiswaFormValue((prevValues: any) => {
      return prevValues.map((item: any) =>
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

  const handleEditDataKonsultasiMahasiswa = async () => {
    setDataKonsultasiMahasiswa((prevValues: any) => {
      return prevValues.map((item: any) =>
        item.id === dataSelectedDataKonsultasiMahasiswaEditModal.id
          ? {
              ...item,
              permasalahan:
                dataSelectedDataKonsultasiMahasiswaEditModal.permasalahan,
              solusi: dataSelectedDataKonsultasiMahasiswaEditModal.solusi,
            }
          : item
      );
    });
    closeEditDataKonsultasiMahasiswaModal();
  };

  const handleDeletePrestasiIlmiahMahasiswa = async () => {
    setPrestasiIlmiahMahasiswaFormValue((prevValues: any) =>
      prevValues.filter(
        (item: any) => item.id !== idSelectedPrestasiIlmiahMahasiswaDeleteModal
      )
    );
    closeDeletePrestasiIlmiahMahasiswaModal();
  };
  const handleDeletePrestasiMahasiswaMengikutiPorseni = async () => {
    setPrestasiMahasiswaMengikutiPorseniFormValue((prevValues: any) =>
      prevValues.filter(
        (item: any) =>
          item.id !== idSelectedPrestasiMahasiswaMengikutiPorseniDeleteModal
      )
    );
    closeDeletePrestasiMahasiswaMengikutiPorseniModal();
  };
  const handleDeleteDataStatusMahasiswa = async () => {
    setDataStatusMahasiswaFormValue((prevValues: any) =>
      prevValues.filter(
        (item: any) => item.id !== idSelectedDataStatusMahasiswaDeleteModal
      )
    );
    closeDeleteDataStatusMahasiswaModal();
  };
  const handleDeleteDataKonsultasiMahasiswa = async () => {
    setDataKonsultasiMahasiswa((prevValues: any) =>
      prevValues.filter(
        (item: any) => item.id !== idSelectedDataKonsultasiMahasiswaDeleteModal
      )
    );
    closeDeleteDataKonsultasiMahasiswaModal();
  };

  const handleFileChangeEditPrestasiIlmiahMahasiswaModal = (e: any) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setDataSelectedPrestasiIlmiahMahasiswaEditModal({
        ...dataSelectedPrestasiIlmiahMahasiswaEditModal,
        file: selectedFile,
      });
      setPreviewUrlEditPrestasiIlmiahMahasiswaModal(
        URL.createObjectURL(selectedFile)
      );
    }
  };
  const handleFileChangeEditPrestasiMahasiswaMengikutiPorseniModal = (
    e: any
  ) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setDataSelectedPrestasiMahasiswaMengikutiPorseniEditModal({
        ...dataSelectedPrestasiMahasiswaMengikutiPorseniEditModal,
        file: selectedFile,
      });
      setPreviewUrlEditPrestasiMahasiswaMengikutiPorseniModal(
        URL.createObjectURL(selectedFile)
      );
    }
  };

  const handleFileChangeAddPrestasiIlmiahMahasiswaModal = (e: any) => {
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
  const handleFileChangeAddPrestasiMahasiswaMengikutiPorseniModal = (
    e: any
  ) => {
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
  const togglePrestasiMahasiswaMendapatkanBeasiswaForm = (e: any) => {
    e.preventDefault();
    setShowPrestasiMahasiswaMendapatkanBeasiswaForm(
      !showPrestasiMahasiswaMendapatkanBeasiswaForm
    );
  };
  const togglePrestasiMahasiswaMengikutiPorseniForm = (e: any) => {
    e.preventDefault();
    setShowPrestasiMahasiswaMengikutiPorseniForm(
      !showPrestasiMahasiswaMengikutiPorseniForm
    );
  };
  const toggleDataStatusMahasiswaForm = (e: any) => {
    e.preventDefault();
    setShowDataStatusMahasiswaForm(!showDataStatusMahasiswaForm);
  };
  const toggleDataMahasiswaBerprestasiAkademikForm = (e: any) => {
    e.preventDefault();
    setShowDataMahasiswaBerprestasiAkademikForm(
      !showDataMahasiswaBerprestasiAkademikForm
    );
  };

  useEffect(() => {
    dispatch(fetchMahasiswa());
    dispatch(fetchDosenPA());
    dispatch(fetchKaprodi());
  }, []);

  useEffect(() => {
    setFilteredBimbingan(
      dataBimbingan.filter(
        (data) => data.pengajuan_bimbingan.tahun_ajaran === tahunAjaranFilter
      )
    );
    const opsiSemester = [
      ...new Set(
        dataBimbingan
          .filter(
            (data: any) =>
              data.pengajuan_bimbingan.tahun_ajaran === tahunAjaranFilter
          )
          .map((data: any) => data.pengajuan_bimbingan.semester)
      ),
    ];
    setOptionsSemester(opsiSemester);
    setSemesterFilter("");
    setJenisBimbinganFilter("");
    setJurusanFilter("");
    setJadwalFilter("");
    setSelectedTahunAjaran(tahunAjaranFilter);
    setSelectedSemester("");
    setJumlahMahasiswaIpkAPrestasiAkademikMahasiswaForm(0);
    setJumlahMahasiswaIpkBPrestasiAkademikMahasiswaForm(0);
    setJumlahMahasiswaIpkCPrestasiAkademikMahasiswaForm(0);
    setJumlahMahasiswaIpkDPrestasiAkademikMahasiswaForm(0);
    setJumlahMahasiswaIpkEPrestasiAkademikMahasiswaForm(0);
    setPrestasiIlmiahMahasiswaFormValue([]);
    setPrestasiMahasiswaMengikutiPorseniFormValue([]);
    setDataStatusMahasiswaFormValue([]);
    setSelectedTahunAjaran("");
    setSelectedSemester("");
    setPendahuluan([]);
    setKesimpulan([]);
    setImagePreviews([]);
  }, [tahunAjaranFilter]);

  useEffect(() => {
    setFilteredBimbingan(
      dataBimbingan
        .filter(
          (data) => data.pengajuan_bimbingan.tahun_ajaran === tahunAjaranFilter
        )
        .filter((data) => data.pengajuan_bimbingan.semester === semesterFilter)
    );
    const optionsPeriodePengajuan = [
      ...new Set(
        dataBimbingan
          .filter(
            (data: any) =>
              data.pengajuan_bimbingan.tahun_ajaran === tahunAjaranFilter
          )
          .filter(
            (data: any) => data.pengajuan_bimbingan.semester === semesterFilter
          )
          .map((data: any) => data.pengajuan_bimbingan.periode_pengajuan)
      ),
    ];
    setOptionsPeriodePengajuan(optionsPeriodePengajuan);
    setPeriodePengajuanFilter("");
    setJurusanFilter("");
    setJadwalFilter("");
    setSelectedSemester(semesterFilter);
    setSelectedSemester("");
    setJumlahMahasiswaIpkAPrestasiAkademikMahasiswaForm(0);
    setJumlahMahasiswaIpkBPrestasiAkademikMahasiswaForm(0);
    setJumlahMahasiswaIpkCPrestasiAkademikMahasiswaForm(0);
    setJumlahMahasiswaIpkDPrestasiAkademikMahasiswaForm(0);
    setJumlahMahasiswaIpkEPrestasiAkademikMahasiswaForm(0);
    setPrestasiIlmiahMahasiswaFormValue([]);
    setPrestasiMahasiswaMengikutiPorseniFormValue([]);
    setDataStatusMahasiswaFormValue([]);
    setSelectedTahunAjaran("");
    setSelectedSemester("");
    setPendahuluan([]);
    setKesimpulan([]);
    setImagePreviews([]);
  }, [semesterFilter]);

  useEffect(() => {
    setFilteredBimbingan(
      dataBimbingan
        .filter(
          (data: any) =>
            data.pengajuan_bimbingan.tahun_ajaran === tahunAjaranFilter
        )
        .filter(
          (data: any) => data.pengajuan_bimbingan.semester === semesterFilter
        )
        .filter(
          (data: any) =>
            data.pengajuan_bimbingan.periode_pengajuan ===
            periodePengajuanFilter
        )
        .filter((data) => data.pengajuan_bimbingan.jurusan === jurusanFilter)
    );
    const opsiJadwal = [
      ...new Set(
        dataBimbingan
          .filter(
            (data: any) =>
              data.pengajuan_bimbingan.jenis_bimbingan === jenisBimbinganFilter
          )
          .filter(
            (data: any) => data.pengajuan_bimbingan.jurusan === jurusanFilter
          )
          .filter((data: any) => data.laporan_bimbingan_id === null)
          .map((data: any) => data.pengajuan_bimbingan.jadwal_bimbingan)
          .sort((a: any, b: any) => {
            const parseDate = (str: any) => {
              // Contoh: "Senin, 13 Januari 2025 10:00-11:00"
              const months: { [key: string]: number } = {
                Januari: 0,
                Februari: 1,
                Maret: 2,
                April: 3,
                Mei: 4,
                Juni: 5,
                Juli: 6,
                Agustus: 7,
                September: 8,
                Oktober: 9,
                November: 10,
                Desember: 11,
              };

              const [, day, month, year, timeRange] = str.match(
                /.+?, (\d{1,2}) (\w+) (\d{4}) (\d{2}:\d{2})-\d{2}:\d{2}/
              );
              const [hour, minute] = timeRange.split(":").map(Number);
              return new Date(year, months[month], day, hour, minute);
            };

            const dateA: any = parseDate(a);
            const dateB: any = parseDate(b);

            return dateA - dateB; // Ascending order
          })
      ),
    ];
    setJadwalOptions(opsiJadwal);
    setJadwalFilter("");
    setSelectedTahunAjaran("");
    setSelectedSemester("");
    setImagePreviews([]);
  }, [jurusanFilter]);

  useEffect(() => {
    setFilteredBimbingan(
      dataBimbingan
        .filter(
          (data: any) =>
            data.pengajuan_bimbingan.tahun_ajaran === tahunAjaranFilter
        )
        .filter(
          (data: any) => data.pengajuan_bimbingan.semester === semesterFilter
        )
        .filter(
          (data: any) =>
            data.pengajuan_bimbingan.periode_pengajuan ===
            periodePengajuanFilter
        )
    );
    const opsiJurusan = [
      ...new Set(
        dataBimbingan
          .filter(
            (data: any) =>
              data.pengajuan_bimbingan.tahun_ajaran === tahunAjaranFilter
          )
          .filter(
            (data: any) => data.pengajuan_bimbingan.semester === semesterFilter
          )
          .filter(
            (data: any) =>
              data.pengajuan_bimbingan.periode_pengajuan ===
              periodePengajuanFilter
          )
          .map((data: any) => data.pengajuan_bimbingan.jurusan)
      ),
    ];
    setJurusanOptions(opsiJurusan);
    setJurusanFilter("");
    setJadwalFilter("");
    setJumlahMahasiswaIpkAPrestasiAkademikMahasiswaForm(0);
    setJumlahMahasiswaIpkBPrestasiAkademikMahasiswaForm(0);
    setJumlahMahasiswaIpkCPrestasiAkademikMahasiswaForm(0);
    setJumlahMahasiswaIpkDPrestasiAkademikMahasiswaForm(0);
    setJumlahMahasiswaIpkEPrestasiAkademikMahasiswaForm(0);
    setPrestasiIlmiahMahasiswaFormValue([]);
    setPrestasiMahasiswaMengikutiPorseniFormValue([]);
    setDataStatusMahasiswaFormValue([]);
    setSelectedTahunAjaran("");
    setSelectedSemester("");
    setPendahuluan([]);
    setKesimpulan([]);
    setImagePreviews([]);
  }, [periodePengajuanFilter]);

  useEffect(() => {
    setSelectedTahunAjaran("");
    setSelectedSemester("");
    setImagePreviews([]);
  }, [jadwalFilter]);

  const tahunAjaranOptions = [
    ...new Set(
      dataBimbingan.map((data: any) => data.pengajuan_bimbingan.tahun_ajaran)
    ),
  ];

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

  const toggleBimbingan = (data: any) => {
    setSelectedBimbingan((prevSelected: any) => {
      if (prevSelected.some((bimbingan: any) => bimbingan.id === data.id)) {
        return prevSelected.filter(
          (bimbingan: any) => bimbingan.id !== data.id
        );
      } else {
        return [...prevSelected, data];
      }
    });
    if (selectedBimbingan.some((bimbingan: any) => bimbingan.id === data.id)) {
      setImagePreviews((prev: any) =>
        prev.filter((preview: any) => preview !== data.dokumentasi_kehadiran)
      );
    } else {
      setImagePreviews((prev: any) => [...prev, data.dokumentasi_kehadiran]);
    }
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
      throw error;
    }
  };

  const addLaporanBimbingan = async (newData: any) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/laporanbimbingan`,
        newData
      );
      return {
        success: true,
        message: response.data.message || "Pelaporan bimbingan berhasil!",

        data: response.data,
      };
    } catch (error) {
      const errorMessage =
        (error as any).response?.data?.message ||
        "Terjadi kesalahan. Silakan coba lagi.";
      throw new Error(errorMessage);
    }
  };

  const handleAddLaporanBimbingan = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const signatureCanvas = sigCanvas.current.getTrimmedCanvas();
    const signatureData = signatureCanvas.toDataURL("image/png");

    // Check if the signature data is valid (not just a blank image)
    const isSignatureValid =
      signatureData &&
      signatureData !==
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC"; // This is a placeholder for a blank image

    try {
      const laporanData = {
        kaprodi_id: dataSelectedKaprodi?.id,
        jadwal_bimbingan:
          [
            ...new Set(
              selectedBimbingan
                .filter((data) =>
                  data.pengajuan_bimbingan.jenis_bimbingan.startsWith(
                    "Perwalian"
                  )
                )
                .map((data: any) => data.pengajuan_bimbingan.jadwal_bimbingan)
            ),
          ].length > 1
            ? [
                ...new Set(
                  selectedBimbingan
                    .filter((data) =>
                      data.pengajuan_bimbingan.jenis_bimbingan.startsWith(
                        "Perwalian"
                      )
                    )
                    .map(
                      (data: any) => data.pengajuan_bimbingan.jadwal_bimbingan
                    )
                ),
              ].join(" | ")
            : [
                ...new Set(
                  selectedBimbingan
                    .filter((data) =>
                      data.pengajuan_bimbingan.jenis_bimbingan.startsWith(
                        "Perwalian"
                      )
                    )
                    .map(
                      (data: any) => data.pengajuan_bimbingan.jadwal_bimbingan
                    )
                ),
              ][0],
        nama_kaprodi: selectedKaprodi,
        status: "Menunggu Feedback Kaprodi",
        dosen_pa_id: dataDosenPA.find(
          (data: any) => data.email === dataUser.email
        )?.id,
        nama_dosen_pa: dataUser.nama,
        jenis_bimbingan: [
          ...new Set(
            selectedBimbingan
              .filter((data) =>
                data.pengajuan_bimbingan.jenis_bimbingan.startsWith("Perwalian")
              )
              .map(
                (bimbingan: any) =>
                  bimbingan.pengajuan_bimbingan.jenis_bimbingan
              )
          ),
        ].join(", "),
        topik_bimbingan: null,
        bimbingan_id: [
          ...new Set(selectedBimbingan.map((bimbingan: any) => bimbingan.id)),
        ].join(", "),
        jumlah_peserta_perwalian: [
          ...new Set(
            selectedBimbingan
              .filter((data) =>
                data.pengajuan_bimbingan.jenis_bimbingan.startsWith("Perwalian")
              )
              .map((bimbingan: any) => bimbingan.id)
          ),
        ].length,
        tahun_ajaran: tahunAjaranFilter,
        semester: semesterFilter,
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
        dokumentasi:
          imagePreviews.length > 0
            ? [...new Set(imagePreviews.map((data: any) => data))].join(", ")
            : null,
        tanda_tangan_dosen_pa: isSignatureValid ? signatureData : null,
        konsultasi_mahasiswa: dataKonsultasiMahasiswa,
      };

      const result = await addLaporanBimbingan(laporanData);

      // const notificationResponse = await axios.post("/api/sendmessage", {
      //   to: "085810676264",
      //   body: `Yth Kaprodi. ${dataSelectedKaprodi?.nama},\nAnda memiliki laporan bimbingan baru dari Dosen Pembimbing Akademik (${dataUser.nama}) yang diajukan pada ${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}. Mohon untuk meninjau dan memberikan feedback melalui tautan berikut:\nhttps://bimbingan-konseling-fikupnvj.vercel.app/\nTerima kasih atas perhatian Anda.`,
      // });

      // if (!notificationResponse.data.success) {
      //   throw new Error("Gagal mengirim notifikasi");
      // }

      toast.success(
        <div className="flex items-center">
          <span>{result.message || "Laporan bimbingan berhasil dibuat!"}</span>
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
      setJadwalFilter("");
      setJurusanFilter("");
      setJenisBimbinganFilter("");
      setSelectedBimbingan([]);
      setSelectedKaprodi("");
      setSelectedTahunAjaran("");
      setImagePreviews([]);
      setJumlahMahasiswaIpkAPrestasiAkademikMahasiswaForm(0);
      setJumlahMahasiswaIpkBPrestasiAkademikMahasiswaForm(0);
      setJumlahMahasiswaIpkCPrestasiAkademikMahasiswaForm(0);
      setJumlahMahasiswaIpkDPrestasiAkademikMahasiswaForm(0);
      setJumlahMahasiswaIpkEPrestasiAkademikMahasiswaForm(0);
      setPrestasiIlmiahMahasiswaFormValue([]);
      setPrestasiMahasiswaMengikutiPorseniFormValue([]);
      setDataStatusMahasiswaFormValue([]);
      clearSignature();
      getDataBimbinganByDosenPaId();
    } catch (error) {
      toast.error(
        <div className="flex items-center">
          <span>
            {(error as any).message ||
              "Pelaporan bimbingan gagal. Silahkan coba lagi!"}
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

  const handlePreviewPDFPerwalian = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const signatureData = sigCanvas.current
      .getTrimmedCanvas()
      .toDataURL("image/png");

    const selectedJenisBimbingan = selectedBimbingan.filter((data) =>
      data.pengajuan_bimbingan.jenis_bimbingan.startsWith("Perwalian")
    );

    let periode = null;

    if (selectedJenisBimbingan.length > 0) {
      periode = selectedJenisBimbingan[0].pengajuan_bimbingan.jenis_bimbingan;
    } else {
      periode = filteredBimbingan[0].pengajuan_bimbingan.periode_pengajuan;
    }

    const laporanData = {
      nama_dosen_pa: userProfile?.nama,
      tahun_ajaran: tahunAjaranFilter,
      periode,
      semester: semesterFilter,
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
      konsultasi_mahasiswa: dataKonsultasiMahasiswa,
    };

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
    doc.text(`Tahun Akademik    :    ${laporanData.tahun_ajaran}`, 15, 56); // Moved up by 10y
    doc.text(`Semester                   :    ${laporanData.semester}`, 15, 62); // Moved up by 10y
    doc.text(`Periode                     :    ${laporanData.periode}`, 15, 68); // Moved up by 10y
    doc.text(`Nama Dosen PA     :    ${laporanData.nama_dosen_pa}`, 15, 74); // Moved up by 10y

    doc.setFont("times new roman bold");

    doc.text("A. PENDAHULUAN", 15, 97); // Adjusted x to 15 and y down by 20

    doc.setFont("times new roman");

    let yPosition = 104;
    const maxWidth = 175;

    const maxHeight = 276;

    laporanData.pendahuluan.forEach((paragraph: any) => {
      if (paragraph.children && paragraph.children.length > 0) {
        const text = paragraph.children[0].text;
        const lines = doc.splitTextToSize(text, maxWidth);
        const alignment = paragraph.align || "left"; // Default to left if no alignment is specified

        lines.forEach((line: any, index: any) => {
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
                  (word: any) => word.trim() === ""
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
      { range: "IPK > 3.5", jumlah: laporanData.jumlah_ipk_a },
      { range: "3 > IPK >= 3.5", jumlah: laporanData.jumlah_ipk_b },
      { range: "2.5 <= IPK < 3", jumlah: laporanData.jumlah_ipk_c },
      { range: "2 <= IPK < 2.5", jumlah: laporanData.jumlah_ipk_d },
      { range: "IPK < 2", jumlah: laporanData.jumlah_ipk_e },
    ];

    let tablePrestasiAkademikHeight = 1 * 15;

    if (
      textPrestasiAkademikYPosition + tablePrestasiAkademikHeight >
      maxHeight
    ) {
      doc.addPage();
      textPrestasiAkademikYPosition = 20;
    }

    doc.text("Prestasi Akademik Mahasiswa", 20, textPrestasiAkademikYPosition);

    let tablePrestasiAkademikYPosition = textPrestasiAkademikYPosition + 4;

    (doc as any).autoTable({
      head: [["Range IPK", "Jumlah Mahasiswa"]],
      body: tableData.map((item: any) => [item.range, item.jumlah]),
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

    const prestasiData = laporanData.prestasi_ilmiah_mahasiswa;
    const bodyDataIlmiah =
      prestasiData.length === 0
        ? [["-", "-", "-", "-"]] // Baris default untuk data kosong
        : prestasiData.map((item: any) => [
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

    const prestasiPorseniData = laporanData.prestasi_porseni_mahasiswa;

    const bodyDataPorseni =
      prestasiPorseniData.length === 0
        ? [["-", "-", "-", "-"]] // Baris default untuk data kosong
        : prestasiPorseniData.map((item: any) => [
            item.jenis_kegiatan,
            item.nim,
            item.nama,
            item.tingkat_prestasi,
          ]);

    const tablePrestasiPorseniHeight = 1 * 15;

    if (textPrestasiPorseniYPosition + tablePrestasiPorseniHeight > maxHeight) {
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

    const statusData = laporanData.data_status_mahasiswa;

    const bodyDataStatus =
      statusData.length === 0
        ? [["-", "-", "-", "-"]] // Baris default untuk data kosong
        : statusData.map((item: any) => [item.nim, item.nama, item.status]);

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

    const bimbinganData = selectedBimbingan.filter((data) =>
      data.pengajuan_bimbingan.jenis_bimbingan.startsWith("Perwalian")
    );

    const bodyBimbingan =
      bimbinganData.length === 0
        ? [["-", "-", "-", "-"]] // Baris default untuk data kosong
        : bimbinganData.map((item: any, index: any) => [
            index + 1,
            item.pengajuan_bimbingan.nim,
            item.pengajuan_bimbingan.nama_lengkap,
            item.ttd_kehadiran,
          ]);

    function calculateTableHeight(doc: any, options: any) {
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
      startY: 68,
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
      didDrawCell: (data: any) => {
        if (
          data.row.index >= 0 &&
          data.column.index === 3 &&
          data.section === "body"
        ) {
          const imgSrc = data.cell.raw; // Mengambil sumber gambar dari properti raw
          if (imgSrc) {
            const imgWidth = 8;
            const imgHeight = 8;
            const x = data.cell.x + data.cell.width / 2 - imgWidth / 2;
            const y = data.cell.y + data.cell.height / 2 - imgHeight / 2;
            doc.addImage(imgSrc, "PNG", x, y, imgWidth, imgHeight);
          }
        }
      },
      didParseCell: (data: any) => {
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
      didDrawPage: (data: any) => {
        // Menambahkan TTD di setiap halaman setelah kolom tabel terakhir
        const lastColumnWidth =
          data.table.columns[data.table.columns.length - 1].width;
        const ttdY = data.cursor.y + 22; // Jarak dari baris tabel

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
          laporanData.tanda_tangan_dosen_pa,
          "PNG",
          160,
          jabatanDaftarHadirYPosition + 4,
          21,
          21
        );

        // Menambahkan nama dosen di bawah TTD
        doc.text(
          `( ${laporanData.nama_dosen_pa} )`,
          170,
          ttdY + 4 + 7 + 21 + 4,
          {
            align: "center",
          }
        );
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
    doc.text(`Tahun Akademik    :    ${laporanData.tahun_ajaran}`, 15, 42); // Moved up by 10y
    doc.text(`Semester                   :    ${laporanData.semester}`, 15, 48); // Moved up by 10y
    doc.text(`Periode                     :    ${laporanData.periode}`, 15, 54); // Moved up by 10y
    (doc as any).autoTable(tableOptions);

    doc.addPage("a4", "landscape");
    const judulLembarKonsultasi = "LEMBAR KONSULTASI MAHASISWA";
    const lebarJudulLembarKonsultasi = doc.getTextWidth(judulLembarKonsultasi);
    const lebarPageLembarKonsultasi = doc.internal.pageSize.getWidth();
    const judulLembarKonsultasiXPosition =
      (lebarPageLembarKonsultasi - lebarJudulLembarKonsultasi) / 2; // Calculate x position for center alignment
    doc.setFont("times new roman bold");
    doc.text(judulLembarKonsultasi, judulLembarKonsultasiXPosition, 20);
    doc.setFont("times new roman");
    doc.text(`Tahun Akademik    :    ${laporanData.tahun_ajaran}`, 15, 32); // Moved up by 10y
    doc.text(`Semester                   :    ${laporanData.semester}`, 15, 38); // Moved up by 10y
    doc.text(`Periode                     :    ${laporanData.periode}`, 15, 44); // Moved up by 10y

    const bimbinganDataLembarKonsultasi = laporanData.konsultasi_mahasiswa;

    const bodyBimbinganLembarKonsultasi =
      bimbinganDataLembarKonsultasi.length === 0
        ? [["-", "-", "-", "-", "-", "-", "-", "-"]] // Baris default untuk data kosong
        : bimbinganDataLembarKonsultasi.map((item: any, index: any) => [
            index + 1,
            item.tanggal,
            item.nim,
            item.nama,
            item.permasalahan,
            item.solusi,
            laporanData.tanda_tangan_dosen_pa,
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
      didDrawCell: (data: any) => {
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
          const imgSrc = data.cell.raw; // Mengambil sumber gambar dari properti raw
          if (imgSrc && imgSrc !== "-") {
            const imgWidth = 8;
            const imgHeight = 8;
            const x = data.cell.x + data.cell.width / 2 - imgWidth / 2;
            const y = data.cell.y + 2;
            doc.addImage(imgSrc, "PNG", x, y, imgWidth, imgHeight);
          }
        }
      },
      didParseCell: (data: any) => {
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
          if (
            (data.column.index === 4 && data.cell.raw !== "-") ||
            (data.column.index === 5 && data.cell.raw !== "-")
          ) {
            data.cell.styles.halign = "justify"; // Justify alignment
          }
        }
      },
    });

    doc.addPage("a4", "portrait");
    doc.text("C. KESIMPULAN", 15, 20); // Adjusted x to 15 and y down by 20
    doc.setFont("times new roman");

    let yPositionKesimpulan = 30;
    laporanData.kesimpulan.forEach((paragraph: any) => {
      // Check if the paragraph has children and extract the text
      if (paragraph.children && paragraph.children.length > 0) {
        const text = paragraph.children[0].text;

        // Split the text into lines based on maxWidth
        const lines = doc.splitTextToSize(text, maxWidth);

        // Set alignment based on paragraph properties
        const alignment = paragraph.align || "left"; // Default to left if no alignment is specified

        // Add each line to the document and adjust yPosition
        lines.forEach((line: any, index: any) => {
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
                  (word: any) => word.trim() === ""
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
      laporanData.tanda_tangan_dosen_pa,
      "PNG",
      xImagePosition,
      yImagePosition,
      width,
      height
    );

    // Menambahkan nama dosen (di bawah gambar)
    const ttdY = yImagePosition + height + 4; // Jarak di bawah gambar
    doc.text(`( ${laporanData.nama_dosen_pa} )`, 170, ttdY, {
      align: "center",
    });

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

  const getDataDosenPAById = async () => {
    try {
      const dataDosenPA = await axios.get(`${API_BASE_URL}/api/datadosenpa`);
      const dosen = dataDosenPA.data.find(
        (data: any) => data.email === dataUser.email
      );

      if (!dosen) {
        return;
      }

      setUserProfile({
        nama: dosen.nama,
        email: dosen.email,
        hp: dosen.hp,
      });
    } catch (error) {
      throw error;
    }
  };

  const getDataBimbinganByDosenPaId = async () => {
    try {
      const dataDosenPa = await axios.get(`${API_BASE_URL}/api/datadosenpa`);
      const dosenPa = dataDosenPa.data.find(
        (data: any) => data.nim === dataUser.nim
      );

      if (!dosenPa) {
        throw new Error("Dosen PA tidak ditemukan");
      }

      const dosenpaid = dosenPa.id;

      const dataBimbingan = await axios.get(`${API_BASE_URL}/api/bimbingan`);
      const userbimbingan = dataBimbingan.data.filter(
        (data: any) => data.pengajuan_bimbingan.dosen_pa_id === dosenpaid
      );
      const bimbingan = userbimbingan.filter(
        (data: any) => data.status_pengesahan_kehadiran === "Sah"
      );

      setDataBimbingan(bimbingan);
      setFilteredBimbingan(bimbingan);
    } catch (error) {
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
        setImagePreviews((prev: any) => [...prev, reader.result as string]); // Tambahkan preview baru ke state
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    e.preventDefault();
    setImagePreviews((prev: any) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_: any, i: any) => i !== index);
    });
  };

  const formatTanggal = (jadwal: any) => {
    // Memisahkan string berdasarkan spasi
    const parts = jadwal.split(" ");

    // Mengambil bagian tanggal (indeks 1 dan 2)
    const tanggal = `${parts[1]} ${parts[2]}`; // "20 Januari"
    const tahun = parts[3]; // "2025"

    // Menggabungkan kembali menjadi format yang diinginkan
    return `${tanggal} ${tahun}`; // "20 Januari 2025"
  };

  useEffect(() => {
    const selectedSet = new Set(selectedBimbingan.map((data: any) => data.id));

    const filteredSelectedBimbingan = selectedBimbingan.filter(
      (data: any) => data.permasalahan !== null
    );

    const formattedData = filteredSelectedBimbingan.map((data: any) => ({
      id: generateUniqueId(),
      tanggal: formatTanggal(data.pengajuan_bimbingan.jadwal_bimbingan),
      nim: data.pengajuan_bimbingan.nim,
      nama: data.pengajuan_bimbingan.nama_lengkap,
      permasalahan: data.permasalahan,
      solusi: data.solusi,
      ttd_mhs: data.ttd_kehadiran,
    }));

    const filteredData = dataKonsultasiMahasiswa.filter((item: any) =>
      selectedSet.has(item.id)
    );

    const newData = [
      ...filteredData,
      ...formattedData.filter(
        (newItem: any) =>
          !filteredData.some(
            (oldItem: any) =>
              oldItem.tanggal === newItem.tanggal &&
              oldItem.nim === newItem.nim &&
              oldItem.nama === newItem.nama &&
              oldItem.permasalahan === newItem.permasalahan &&
              oldItem.solusi === newItem.solusi &&
              oldItem.ttd_mhs === newItem.ttd_mhs
          )
      ),
    ];

    setDataKonsultasiMahasiswa(newData);
  }, [selectedBimbingan]);

  useEffect(() => {
    const selectedData = selectedBimbingan
      .filter((data) =>
        data.pengajuan_bimbingan.jenis_bimbingan.startsWith("Perwalian")
      )
      .find(
        (data) =>
          data.pengajuan_bimbingan.nama_lengkap ===
          dataSelectedNamaMahasiswaAddKonsultasiBimbinganModal
      );

    setSelectedDataBimbinganAddDataKonsultasiMahasiswaModal(selectedData);
  }, [selectedBimbingan, dataSelectedNamaMahasiswaAddKonsultasiBimbinganModal]);

  useEffect(() => {
    const perwalianBimbingan = selectedBimbingan.filter((data) =>
      data.pengajuan_bimbingan.jenis_bimbingan.startsWith("Perwalian")
    );
    const mahasiswaIds = perwalianBimbingan.map(
      (data) => data.pengajuan_bimbingan.mahasiswa_id
    );

    // Mencari data mahasiswa yang ID-nya ada di mahasiswaIds
    const dataPesertaBimbingan = dataMahasiswa.filter((data) =>
      mahasiswaIds.includes(data.id)
    );

    const ipkCounts = dataPesertaBimbingan.reduce(
      (acc, mahasiswa) => {
        const ipk = parseFloat(mahasiswa.ipk);

        // Cek apakah hasil konversi valid (bukan NaN)
        if (isNaN(ipk)) {
          console.warn(
            `IPK tidak valid untuk mahasiswa dengan ID: ${mahasiswa.id}`
          );
          return acc; // Lewati mahasiswa ini
        }

        if (ipk >= 3.5) {
          acc.A += 1;
        } else if (ipk >= 3 && ipk < 3.5) {
          acc.B += 1;
        } else if (ipk >= 2.5 && ipk < 3) {
          acc.C += 1;
        } else if (ipk >= 2 && ipk < 2.5) {
          acc.D += 1;
        } else if (ipk < 2) {
          acc.E += 1;
        }

        return acc;
      },
      { A: 0, B: 0, C: 0, D: 0, E: 0 }
    );

    // Mengatur state dengan jumlah mahasiswa berdasarkan kategori IPK
    setJumlahMahasiswaIpkAPrestasiAkademikMahasiswaForm(ipkCounts.A);
    setJumlahMahasiswaIpkBPrestasiAkademikMahasiswaForm(ipkCounts.B);
    setJumlahMahasiswaIpkCPrestasiAkademikMahasiswaForm(ipkCounts.C);
    setJumlahMahasiswaIpkDPrestasiAkademikMahasiswaForm(ipkCounts.D);
    setJumlahMahasiswaIpkEPrestasiAkademikMahasiswaForm(ipkCounts.E);
  }, [selectedBimbingan]);

  useEffect(() => {
    setSelectedBimbingan([]);
  }, [jenisBimbinganFilter, jadwalFilter, jurusanFilter]);

  useEffect(() => {
    getDataTahunAJaran();
  }, []);

  useEffect(() => {
    if (dataKaprodi.length > 0) {
      const formattedOptions = dataKaprodi.map((data: any) => {
        return {
          value: data.nama,
          label: `${data.nama} (Kaprodi ${data.kaprodi_jurusan})`,
        };
      });

      setOptionsKaprodi(formattedOptions);
    }
  }, [dataKaprodi]);

  useEffect(() => {
    if (dataUser && dataUser.email) {
      getDataDosenPAById();
    }
  }, [dataUser]);

  useEffect(() => {
    if (dataKaprodi.length > 0) {
      const data = dataKaprodi.find(
        (data: any) => data.nama === selectedKaprodi
      );
      setDataSelectedKaprodi(data || null);
    }
  }, [selectedKaprodi]);

  useEffect(() => {
    if (userProfile && userProfile.nama) {
      getDataBimbinganByDosenPaId();
    }
  }, [userProfile]);
  useEffect(() => {
    const dataFindKaprodi = dataKaprodi.find(
      (data: any) => data.kaprodi_jurusan === jurusanFilter
    );

    if (dataFindKaprodi) {
      setSelectedKaprodi(dataFindKaprodi.nama);
    }
  }, [jurusanFilter]);

  const userData = useMemo(() => {
    if (!dataUser) return null;

    if (roleUser === "Mahasiswa" && statusDataMahasiswa === "succeeded") {
      return dataMahasiswa.find((data) => data.nim === dataUser?.nim) || null;
    }
    if (roleUser === "Dosen PA" && statusDataDosenPA === "succeeded") {
      return dataDosenPA.find((data) => data.email === dataUser?.email) || null;
    }
    if (roleUser === "Kaprodi" && statusDataKaprodi === "succeeded") {
      return dataKaprodi.find((data) => data.email === dataUser?.email) || null;
    }
    return null;
  }, [
    roleUser,
    dataUser,
    dataMahasiswa,
    dataDosenPA,
    dataKaprodi,
    statusDataMahasiswa,
    statusDataDosenPA,
    statusDataKaprodi,
  ]);

  const isLoading = selectIsLoadingGlobal({
    dataUser,
    dataMahasiswaUser: dataMahasiswa,
    dataDosenPA,
    dataKaprodi,
    optionsTahunAjaran: tahunAjaranOptions, // pastikan state-nya sesuai
    dataTahunAjaran,
    roleUser,
  });

  return (
    <>
      {isLoading && <Spinner />}
      <div>
        <NavbarUser roleUser={roleUser} dataUser={userData} />
        <div className="pt-20 md:pt-[100px]">
          <div className="mt-4 mb-20 md:mb-[280px] mx-2 md:mx-[130px] border rounded-lg">
            <form
              className="flex flex-col gap-4 px-2 py-4 md:p-8"
              onSubmit={handleAddLaporanBimbingan}
            >
              {dataBimbingan.filter(
                (data: any) => data.laporan_bimbingan_id === null
              ).length === 0 ? (
                <div className="flex flex-col items-center p-4">
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
                    Saat ini tidak ada bimbingan yang perlu dilaporkan.
                  </p>
                  <p className="text-center text-gray-600">
                    Semua bimbingan yang telah Anda lakukan telah dilaporkan,
                    atau belum ada bimbingan yang baru dilaksanakan. Jika Anda
                    telah melakukan bimbingan, pastikan absensi mahasiswa telah
                    diverifikasi agar dapat dilaporkan dengan status yang sah.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex gap-4">
                    <div className="relative max-w-[30%] md:max-w[100%]">
                      <select
                        value={tahunAjaranFilter}
                        onChange={(e) => setTahunAjaranFilter(e.target.value)}
                        className="block w-full px-4 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-500 appearance-none"
                      >
                        <option disabled value="">
                          Pilih Tahun Ajaran
                        </option>
                        {tahunAjaranOptions.map(
                          (tahun_ajaran: any, index: any) => (
                            <option key={index} value={tahun_ajaran}>
                              {tahun_ajaran}
                            </option>
                          )
                        )}
                      </select>
                      <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-black"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </span>
                    </div>
                    {tahunAjaranFilter !== "" && (
                      <div className="relative max-w-[30%] md:max-w[100%]">
                        <select
                          value={semesterFilter}
                          onChange={(e) => setSemesterFilter(e.target.value)}
                          className="block w-full px-4 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-500 appearance-none"
                        >
                          <option disabled value="">
                            Pilih Semester
                          </option>
                          {optionsSemester.map((semester: any, index: any) => (
                            <option key={index} value={semester}>
                              {semester}
                            </option>
                          ))}
                        </select>
                        <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-black"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </span>
                      </div>
                    )}
                    {tahunAjaranFilter !== "" && semesterFilter !== "" && (
                      <div className="relative max-w-[30%] md:max-w[100%]">
                        <select
                          value={periodePengajuanFilter}
                          onChange={(e) =>
                            setPeriodePengajuanFilter(e.target.value)
                          }
                          className="block w-full px-4 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-500 appearance-none"
                        >
                          <option disabled value="">
                            Pilih Periode Pengajuan Bimbingan
                          </option>
                          {optionsPeriodePengajuan.map(
                            (periode: any, index: any) => (
                              <option key={index} value={periode}>
                                {periode}
                              </option>
                            )
                          )}
                        </select>
                        <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-black"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </span>
                      </div>
                    )}
                    {tahunAjaranFilter !== "" &&
                      semesterFilter !== "" &&
                      periodePengajuanFilter !== "" && (
                        <div className="relative max-w-[30%] md:max-w[100%]">
                          <select
                            disabled={
                              periodePengajuanFilter === "" ? true : false
                            }
                            value={jurusanFilter}
                            onChange={(e) => setJurusanFilter(e.target.value)}
                            className="block w-full py-2 px-4 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-500 appearance-none"
                          >
                            <option disabled value="">
                              Pilih Jurusan
                            </option>
                            {jurusanOptions.map((jurusan: any, index: any) => (
                              <option key={index} value={jurusan}>
                                {jurusan}
                              </option>
                            ))}
                          </select>
                          <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-black"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </span>
                        </div>
                      )}
                  </div>
                  <div>
                    {tahunAjaranFilter &&
                    semesterFilter &&
                    dataBimbingan
                      .filter((data: any) => data.laporan_bimbingan_id === null)
                      .filter(
                        (data: any) =>
                          data.pengajuan_bimbingan.tahun_ajaran ===
                          tahunAjaranFilter
                      )
                      .filter(
                        (data: any) =>
                          data.pengajuan_bimbingan.semester === semesterFilter
                      ).length === 0 ? (
                      <div className="flex flex-col items-center">
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
                          Saat ini tidak ada bimbingan {tahunAjaranFilter}{" "}
                          {semesterFilter} yang perlu dilaporkan.
                        </p>
                        <p className="text-center text-gray-600">
                          Semua bimbingan tahun ajaran {tahunAjaranFilter}{" "}
                          {semesterFilter} yang telah Anda lakukan telah
                          dilaporkan, atau belum ada bimbingan tahun ajaran{" "}
                          {tahunAjaranFilter} {semesterFilter} yang baru
                          dilaksanakan. Jika Anda telah melakukan bimbingan
                          tahun ajaran {tahunAjaranFilter} {semesterFilter},
                          pastikan absensi mahasiswa telah diverifikasi agar
                          dapat dilaporkan dengan status yang sah.
                        </p>
                      </div>
                    ) : tahunAjaranFilter &&
                      semesterFilter &&
                      periodePengajuanFilter &&
                      dataBimbingan
                        .filter(
                          (data: any) => data.laporan_bimbingan_id === null
                        )
                        .filter(
                          (data: any) =>
                            data.pengajuan_bimbingan.periode_pengajuan ===
                            periodePengajuanFilter
                        ).length === 0 ? (
                      <div className="flex flex-col items-center">
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
                          Saat ini tidak ada bimbingan ${jenisBimbinganFilter}{" "}
                          yang perlu dilaporkan.
                        </p>
                        <p className="text-center text-gray-600">
                          Semua bimbingan ${jenisBimbinganFilter} yang telah
                          Anda lakukan telah dilaporkan, atau belum ada
                          bimbingan ${jenisBimbinganFilter} yang baru
                          dilaksanakan. Jika Anda telah melakukan bimbingan $
                          {jenisBimbinganFilter}, pastikan absensi mahasiswa
                          telah diverifikasi agar dapat dilaporkan dengan status
                          yang sah.
                        </p>
                      </div>
                    ) : tahunAjaranFilter === "" ? (
                      <div className="border rounded-lg p-10 mt-6 flex flex-col items-center">
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
                          Anda belum memilih tahun ajaran.
                        </p>
                        <p className="text-center text-gray-600">
                          Mohon untuk memilih tahun ajaran yang akan dilaporkan.
                        </p>
                      </div>
                    ) : semesterFilter === "" ? (
                      <div className="border rounded-lg p-10 mt-6 flex flex-col items-center">
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
                          Anda belum memilih semester.
                        </p>
                        <p className="text-center text-gray-600">
                          Mohon untuk memilih semester yang ingin dilaporkan.
                        </p>
                      </div>
                    ) : periodePengajuanFilter === "" ? (
                      <div className="border rounded-lg p-10 mt-6 flex flex-col items-center">
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
                          Anda belum memilih periode bimbingan.
                        </p>
                        <p className="text-center text-gray-600">
                          Mohon untuk memilih periode bimbingan yang akan
                          dilaporkan.
                        </p>
                      </div>
                    ) : jurusanFilter === "" ? (
                      <div className="border rounded-lg p-10 mt-6 flex flex-col items-center">
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
                          Anda belum memilih jurusan.
                        </p>
                        <p className="text-center text-gray-600">
                          Mohon untuk memilih jurusan dari peserta bimbingan
                          yang akan dilaporkan. Laporan ini akan diteruskan
                          kepada Kaprodi sesuai dengan jurusan terkait.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div>
                          <div className="flex mt-6 mb-4 justify-between items-center">
                            <p className="font-medium">
                              Pilih Bimbingan ({selectedBimbingan.length}) :
                            </p>
                            <div className="flex items-center">
                              <label className="font-medium">
                                Select All ({filteredBimbingan.length})
                              </label>
                              <input
                                type="checkbox"
                                checked={
                                  selectedBimbingan.length ===
                                    filteredBimbingan.length &&
                                  filteredBimbingan.length > 0
                                }
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    const allFilteredBimbingan =
                                      filteredBimbingan.map(
                                        (data: any) => data
                                      );

                                    setSelectedBimbingan(allFilteredBimbingan);

                                    allFilteredBimbingan.map((data: any) =>
                                      setImagePreviews((prev: any) => [
                                        ...prev,
                                        data.dokumentasi_kehadiran,
                                      ])
                                    );
                                  } else {
                                    // Deselect all
                                    setSelectedBimbingan([]);
                                    setImagePreviews([]);
                                  }
                                }}
                                className="ml-2 size-4 cursor-pointer"
                              />
                            </div>
                          </div>

                          <div className="overflow-x-auto mt-2">
                            <div className="flex space-x-4 pb-4">
                              {filteredBimbingan.map((data: any) => (
                                <div
                                  className={`border rounded-lg min-w-[70%] md:min-w-[30%] flex flex-col gap-1 text-[15px] cursor-pointer ${
                                    selectedBimbingan.some(
                                      (bimbingan: any) =>
                                        bimbingan.id === data.id
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
                                          {
                                            data.pengajuan_bimbingan
                                              .nama_lengkap
                                          }
                                        </p>
                                        <p>
                                          {data.pengajuan_bimbingan.jurusan}
                                        </p>
                                        {(() => {
                                          const jadwal =
                                            data.pengajuan_bimbingan
                                              .jadwal_bimbingan;
                                          const parts = jadwal.split(" ");

                                          if (parts.length === 5) {
                                            const [
                                              day,
                                              date,
                                              month,
                                              year,
                                              timeRange,
                                            ] = parts;
                                            const formattedDay = day.replace(
                                              ",",
                                              ""
                                            );
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
                                        <p>
                                          {data.pengajuan_bimbingan
                                            .jenis_bimbingan === "Pribadi"
                                            ? `${data.pengajuan_bimbingan.jenis_bimbingan} (Topik : ${data.pengajuan_bimbingan.topik_bimbingan})`
                                            : data.pengajuan_bimbingan.jenis_bimbingan.startsWith(
                                                  "Perwalian"
                                                )
                                              ? data.pengajuan_bimbingan
                                                  .jenis_bimbingan
                                              : ""}
                                        </p>
                                        <p>
                                          {
                                            data.pengajuan_bimbingan
                                              .sistem_bimbingan
                                          }
                                        </p>
                                      </div>
                                      <input
                                        type="checkbox"
                                        checked={selectedBimbingan.some(
                                          (bimbingan: any) =>
                                            bimbingan.id === data.id
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
                        {selectedBimbingan.length > 0 ? (
                          [
                            "Sebelum Perwalian KRS",
                            "Setelah Perwalian KRS - Sebelum Perwalian UTS",
                            "Setelah Perwalian UTS - Sebelum Perwalian UAS",
                          ].includes(periodePengajuanFilter) ? (
                            <div className="flex flex-col gap-4 mt-6 border py-2 px-4 md:p-8 rounded-lg">
                              <h1 className="text-center font-bold text-[20px] mb-2">
                                LAPORAN PERWALIAN DOSEN PEMBIMBING AKADEMIK
                                FAKULTAS ILMU KOMPUTER UPN “VETERAN” JAKARTA
                              </h1>
                              <SelectField
                                options={optionsKaprodi}
                                disabled
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
                                <p className="font-bold">
                                  B. HASIL KONSULTASI PEMBIMBINGAN
                                </p>
                                <div className="p-6 flex flex-col gap-4 border rounded-lg ">
                                  <div className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                      <p className="font-medium">
                                        Prestasi Akademik Mahasiswa
                                      </p>
                                      <button
                                        onClick={(e: any) =>
                                          togglePrestasiAkademikMahasiswaForm(e)
                                        }
                                        className="flex items-center px-3 py-2"
                                      >
                                        {showPrestasiAkademikMahasiswaForm ? (
                                          <FontAwesomeIcon icon={faChevronUp} />
                                        ) : (
                                          <FontAwesomeIcon
                                            icon={faChevronDown}
                                          />
                                        )}
                                      </button>
                                    </div>

                                    {showPrestasiAkademikMahasiswaForm && (
                                      <div className="mt-2 flex flex-col gap-4 p-4">
                                        <div className="flex items-center">
                                          <label className="w-1/2 md:w-1/6">
                                            IPK &ge; 3.5
                                          </label>
                                          <InputField
                                            disabled
                                            type="number"
                                            placeholder="Jumlah Mahasiswa"
                                            onChange={(e: any) =>
                                              setJumlahMahasiswaIpkAPrestasiAkademikMahasiswaForm(
                                                parseInt(e.target.value, 10)
                                              )
                                            }
                                            value={
                                              jumlahMahasiswaIpkAPrestasiAkademikMahasiswaForm
                                            }
                                            className="px-3 py-2 w-5/6 text-[15px] border rounded-lg"
                                          />
                                        </div>
                                        <div className="flex items-center">
                                          <label className="w-1/2 md:w-1/6">
                                            3 &le; IPK &lt; 3.5
                                          </label>
                                          <InputField
                                            disabled
                                            type="number"
                                            placeholder="Jumlah Mahasiswa"
                                            onChange={(e: any) =>
                                              setJumlahMahasiswaIpkBPrestasiAkademikMahasiswaForm(
                                                parseInt(e.target.value, 10)
                                              )
                                            }
                                            value={
                                              jumlahMahasiswaIpkBPrestasiAkademikMahasiswaForm
                                            }
                                            className="px-3 py-2 w-5/6 text-[15px] border rounded-lg"
                                          />
                                        </div>
                                        <div className="flex items-center">
                                          <label className="w-1/2 md:w-1/6">
                                            2.5 &le; IPK &lt; 3
                                          </label>
                                          <InputField
                                            disabled
                                            type="number"
                                            placeholder="Jumlah Mahasiswa"
                                            onChange={(e: any) =>
                                              setJumlahMahasiswaIpkCPrestasiAkademikMahasiswaForm(
                                                parseInt(e.target.value, 10)
                                              )
                                            }
                                            value={
                                              jumlahMahasiswaIpkCPrestasiAkademikMahasiswaForm
                                            }
                                            className="px-3 py-2 w-5/6 text-[15px] border rounded-lg"
                                          />
                                        </div>
                                        <div className="flex items-center">
                                          <label className="w-1/2 md:w-1/6">
                                            2 &le; IPK &lt; 2.5
                                          </label>
                                          <InputField
                                            disabled
                                            type="number"
                                            placeholder="Jumlah Mahasiswa"
                                            onChange={(e: any) =>
                                              setJumlahMahasiswaIpkDPrestasiAkademikMahasiswaForm(
                                                parseInt(e.target.value, 10)
                                              )
                                            }
                                            value={
                                              jumlahMahasiswaIpkDPrestasiAkademikMahasiswaForm
                                            }
                                            className="px-3 py-2 w-5/6 text-[15px] border rounded-lg"
                                          />
                                        </div>
                                        <div className="flex items-center">
                                          <label className="w-1/2 md:w-1/6">
                                            IPK &lt; 2
                                          </label>
                                          <InputField
                                            disabled
                                            type="number"
                                            placeholder="Jumlah Mahasiswa"
                                            onChange={(e: any) =>
                                              setJumlahMahasiswaIpkEPrestasiAkademikMahasiswaForm(
                                                parseInt(e.target.value, 10)
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
                                      <p className="font-medium">
                                        Prestasi Ilmiah Mahasiswa
                                      </p>
                                      <button
                                        onClick={(e) =>
                                          togglePrestasiIlmiahMahasiswaForm(e)
                                        }
                                        className="flex items-center px-3 py-2"
                                      >
                                        {showPrestasiIlmiahMahasiswaForm ? (
                                          <FontAwesomeIcon icon={faChevronUp} />
                                        ) : (
                                          <FontAwesomeIcon
                                            icon={faChevronDown}
                                          />
                                        )}
                                      </button>
                                    </div>

                                    {showPrestasiIlmiahMahasiswaForm && (
                                      <div className="mt-2 flex flex-col p-4">
                                        <>
                                          <button
                                            className="flex px-3 py-2 bg-orange-500 items-center gap-2 rounded-lg ml-auto hover:bg-orange-600"
                                            onClick={(e) => {
                                              openAddPrestasiIlmiahMahasiswaModal(
                                                e
                                              );
                                            }}
                                          >
                                            <Image
                                              src={plusIcon}
                                              alt="Plus Icon"
                                            />
                                            <p className="text-white text-[10px] md:text-[14px]">
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
                                                  <th className="px-4 py-2 w-[15%]">
                                                    NIM
                                                  </th>
                                                  <th className="px-4 py-2 w-[15%]">
                                                    Nama
                                                  </th>
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
                                                          Silahkan Tambah
                                                          Prestasi Ilmiah
                                                          Mahasiswa
                                                        </h2>
                                                        <p className="text-gray-500 mt-2">
                                                          Saat ini belum ada
                                                          data prestasi ilmiah
                                                          yang dimasukkan. Klik
                                                          tombol tambah prestasi
                                                          ilmiah mahasiswa untuk
                                                          menambahkannya.
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
                                                          {
                                                            data.tingkat_prestasi
                                                          }
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
                                                              onClick={(
                                                                e: any
                                                              ) => {
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
                                                              onClick={(
                                                                e: any
                                                              ) => {
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
                                          isOpen={
                                            isModalAddPrestasiIlmiahMahasiswaOpen
                                          }
                                          onClose={
                                            closeAddPrestasiIlmiahMahasiswaModal
                                          }
                                          onAdd={
                                            handleAddPrestasiIlmiahMahasiswa
                                          }
                                          modalType="Tambah"
                                          title="Tambah Prestasi Akademik Mahasiswa"
                                        >
                                          <form className="max-h-[400px] flex flex-col gap-2 pr-4 overflow-y-auto">
                                            <InputField
                                              type="text"
                                              placeholder="Masukkan Bidang Prestasi"
                                              onChange={(e: any) =>
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
                                              onChange={(e: any) =>
                                                setNimAddPrestasiIlmiahMahasiswaModal(
                                                  e.target.value
                                                )
                                              }
                                              value={
                                                nimAddPrestasiIlmiahMahasiswaModal
                                              }
                                              className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                                            />
                                            <InputField
                                              type="text"
                                              placeholder="Masukkan Nama Lengkap"
                                              onChange={(e: any) =>
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
                                              <option value="">
                                                Pilih Tingkat Prestasi
                                              </option>
                                              <option value="Lokal">
                                                Lokal
                                              </option>
                                              <option value="Nasional">
                                                Nasional
                                              </option>
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
                                          isOpen={
                                            isModalEditPrestasiIlmiahMahasiswaOpen
                                          }
                                          onClose={
                                            closeEditPrestasiIlmiahMahasiswaModal
                                          }
                                          onEdit={
                                            handleEditPrestasiIlmiahMahasiswa
                                          }
                                          modalType="Edit"
                                          title="Tambah Prestasi Akademik Mahasiswa"
                                        >
                                          <form className="max-h-[400px] flex flex-col gap-2 pr-4 overflow-y-auto">
                                            <InputField
                                              type="text"
                                              placeholder="Masukkan Bidang Prestasi"
                                              onChange={(e: any) =>
                                                setDataSelectedPrestasiIlmiahMahasiswaEditModal(
                                                  {
                                                    ...dataSelectedPrestasiIlmiahMahasiswaEditModal,
                                                    bidang_prestasi:
                                                      e.target.value,
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
                                              onChange={(e: any) =>
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
                                              onChange={(e: any) =>
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
                                                    tingkat_prestasi:
                                                      e.target.value,
                                                  }
                                                )
                                              }
                                              className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                                            >
                                              <option value="">
                                                Pilih Tingkat Prestasi
                                              </option>
                                              <option value="Lokal">
                                                Lokal
                                              </option>
                                              <option value="Nasional">
                                                Nasional
                                              </option>
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
                                              src={
                                                previewUrlEditPrestasiIlmiahMahasiswaModal
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
                                            isModalDeletePrestasiIlmiahMahasiswaOpen
                                          }
                                          onClose={
                                            closeDeletePrestasiIlmiahMahasiswaModal
                                          }
                                          onDelete={
                                            handleDeletePrestasiIlmiahMahasiswa
                                          }
                                          modalType="Delete"
                                          title="Hapus Prestasi Ilmiah Mahasiswa"
                                        >
                                          <p>
                                            Apakah Anda yakin ingin menghapus
                                            Prestasi Ilmiah Mahasiswa ini?
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
                                          togglePrestasiMahasiswaMendapatkanBeasiswaForm(
                                            e
                                          )
                                        }
                                        className="flex items-center px-3 py-2"
                                      >
                                        {showPrestasiMahasiswaMendapatkanBeasiswaForm ? (
                                          <FontAwesomeIcon icon={faChevronUp} />
                                        ) : (
                                          <FontAwesomeIcon
                                            icon={faChevronDown}
                                          />
                                        )}
                                      </button>
                                    </div>

                                    {showPrestasiMahasiswaMendapatkanBeasiswaForm && (
                                      <div className="mt-2 flex flex-col gap-4 p-4">
                                        <div className="flex items-center">
                                          <label className="w-2/3 md:w-1/6">
                                            BBM
                                          </label>
                                          <InputField
                                            disabled={false}
                                            type="number"
                                            placeholder="Jumlah Mahasiswa"
                                            onChange={(e: any) =>
                                              setJumlahMahasiswaBeasiswaBBMPrestasiMahasiswaMendapatkanBeasiswaForm(
                                                parseInt(e.target.value, 10)
                                              )
                                            }
                                            value={
                                              jumlahMahasiswaBeasiswaBBMPrestasiMahasiswaMendapatkanBeasiswaForm
                                            }
                                            className="px-3 py-2 w-5/6 text-[15px] border rounded-lg"
                                          />
                                        </div>
                                        <div className="flex items-center">
                                          <label className="w-2/3 md:w-1/6">
                                            Pegadaian
                                          </label>
                                          <InputField
                                            disabled={false}
                                            type="number"
                                            placeholder="Jumlah Mahasiswa"
                                            onChange={(e: any) =>
                                              setJumlahMahasiswaBeasiswaPegadaianPrestasiMahasiswaMendapatkanBeasiswaForm(
                                                parseInt(e.target.value, 10)
                                              )
                                            }
                                            value={
                                              jumlahMahasiswaBeasiswaPegadaianPrestasiMahasiswaMendapatkanBeasiswaForm
                                            }
                                            className="px-3 py-2 w-5/6 text-[15px] border rounded-lg"
                                          />
                                        </div>
                                        <div className="flex items-center">
                                          <label className="w-2/3 md:w-1/6">
                                            Supersemar
                                          </label>
                                          <InputField
                                            disabled={false}
                                            type="number"
                                            placeholder="Jumlah Mahasiswa"
                                            onChange={(e: any) =>
                                              setJumlahMahasiswaBeasiswaSupersemarPrestasiMahasiswaMendapatkanBeasiswaForm(
                                                parseInt(e.target.value, 10)
                                              )
                                            }
                                            value={
                                              jumlahMahasiswaBeasiswaSupersemarPrestasiMahasiswaMendapatkanBeasiswaForm
                                            }
                                            className="px-3 py-2 w-5/6 text-[15px] border rounded-lg"
                                          />
                                        </div>
                                        <div className="flex items-center">
                                          <label className="w-2/3 md:w-1/6">
                                            PPA
                                          </label>
                                          <InputField
                                            disabled={false}
                                            type="number"
                                            placeholder="Jumlah Mahasiswa"
                                            onChange={(e: any) =>
                                              setJumlahMahasiswaBeasiswaPPAPrestasiMahasiswaMendapatkanBeasiswaForm(
                                                parseInt(e.target.value, 10)
                                              )
                                            }
                                            value={
                                              jumlahMahasiswaBeasiswaPPAPrestasiMahasiswaMendapatkanBeasiswaForm
                                            }
                                            className="px-3 py-2 w-5/6 text-[15px] border rounded-lg"
                                          />
                                        </div>
                                        <div className="flex items-center">
                                          <label className="w-2/3 md:w-1/6">
                                            YKL
                                          </label>
                                          <InputField
                                            disabled={false}
                                            type="number"
                                            placeholder="Jumlah Mahasiswa"
                                            onChange={(e: any) =>
                                              setJumlahMahasiswaBeasiswaYKLPrestasiMahasiswaMendapatkanBeasiswaForm(
                                                parseInt(e.target.value, 10)
                                              )
                                            }
                                            value={
                                              jumlahMahasiswaBeasiswaYKLPrestasiMahasiswaMendapatkanBeasiswaForm
                                            }
                                            className="px-3 py-2 w-5/6 text-[15px] border rounded-lg"
                                          />
                                        </div>
                                        <div className="flex items-center">
                                          <label className="w-2/3 md:w-1/6">
                                            Dan lain-lain
                                          </label>
                                          <InputField
                                            disabled={false}
                                            type="number"
                                            placeholder="Jumlah Mahasiswa"
                                            onChange={(e: any) =>
                                              setJumlahMahasiswaBeasiswaDllPrestasiMahasiswaMendapatkanBeasiswaForm(
                                                parseInt(e.target.value, 10)
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
                                          togglePrestasiMahasiswaMengikutiPorseniForm(
                                            e
                                          )
                                        }
                                        className="flex items-center px-3 py-2"
                                      >
                                        {showPrestasiMahasiswaMengikutiPorseniForm ? (
                                          <FontAwesomeIcon icon={faChevronUp} />
                                        ) : (
                                          <FontAwesomeIcon
                                            icon={faChevronDown}
                                          />
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
                                            <Image
                                              src={plusIcon}
                                              alt="Plus Icon"
                                            />
                                            <p className="text-white text-[10px] md:text-[14px]">
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
                                                  <th className="px-4 py-2 w-[15%]">
                                                    NIM
                                                  </th>
                                                  <th className="px-4 py-2 w-[15%]">
                                                    Nama
                                                  </th>
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
                                                          Silahkan Tambah
                                                          Prestasi Porseni
                                                          Mahasiswa
                                                        </h2>
                                                        <p className="text-gray-500 mt-2">
                                                          Saat ini belum ada
                                                          data prestasi porseni
                                                          yang dimasukkan. Klik
                                                          tombol tambah prestasi
                                                          porseni mahasiswa
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
                                                          {
                                                            data.tingkat_prestasi
                                                          }
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
                                                              onClick={(
                                                                e: any
                                                              ) => {
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
                                                              onClick={(
                                                                e: any
                                                              ) => {
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
                                          onAdd={
                                            handleAddPrestasiMahasiswaMengikutiPorseni
                                          }
                                          modalType="Tambah"
                                          title="Tambah Prestasi PORSENI Mahasiswa"
                                        >
                                          <form className="max-h-[400px] flex flex-col gap-2 pr-4 overflow-y-auto">
                                            <InputField
                                              type="text"
                                              placeholder="Masukkan Jenis Kegiatan"
                                              onChange={(e: any) =>
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
                                              onChange={(e: any) =>
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
                                              onChange={(e: any) =>
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
                                              <option value="">
                                                Pilih Tingkat Prestasi
                                              </option>
                                              <option value="Lokal">
                                                Lokal
                                              </option>
                                              <option value="Nasional">
                                                Nasional
                                              </option>
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
                                          onEdit={
                                            handleEditPrestasiMahasiswaMengikutiPorseni
                                          }
                                          modalType="Edit"
                                          title="Edit Prestasi PORSENI Mahasiswa"
                                        >
                                          <form className="max-h-[400px] flex flex-col gap-2 pr-4 overflow-y-auto">
                                            <InputField
                                              type="text"
                                              placeholder="Masukkan Jenis Kegiatan"
                                              onChange={(e: any) =>
                                                setDataSelectedPrestasiMahasiswaMengikutiPorseniEditModal(
                                                  {
                                                    ...dataSelectedPrestasiMahasiswaMengikutiPorseniEditModal,
                                                    jenis_kegiatan:
                                                      e.target.value,
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
                                              onChange={(e: any) =>
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
                                              onChange={(e: any) =>
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
                                                    tingkat_prestasi:
                                                      e.target.value,
                                                  }
                                                )
                                              }
                                              className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                                            >
                                              <option value="">
                                                Pilih Tingkat Prestasi
                                              </option>
                                              <option value="Lokal">
                                                Lokal
                                              </option>
                                              <option value="Nasional">
                                                Nasional
                                              </option>
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
                                            Apakah Anda yakin ingin menghapus
                                            Prestasi Porseni Mahasiswa ini?
                                          </p>
                                        </Modal>
                                      </div>
                                    )}
                                  </div>
                                  <div className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                      <p className="font-medium">
                                        Data Status Mahasiswa
                                      </p>
                                      <button
                                        onClick={(e) =>
                                          toggleDataStatusMahasiswaForm(e)
                                        }
                                        className="flex items-center px-3 py-2"
                                      >
                                        {showDataStatusMahasiswaForm ? (
                                          <FontAwesomeIcon icon={faChevronUp} />
                                        ) : (
                                          <FontAwesomeIcon
                                            icon={faChevronDown}
                                          />
                                        )}
                                      </button>
                                    </div>

                                    {showDataStatusMahasiswaForm && (
                                      <div className="mt-2 flex flex-col p-4">
                                        <>
                                          <button
                                            className="flex px-3 py-2 bg-orange-500 items-center gap-2 rounded-lg ml-auto hover:bg-orange-600"
                                            onClick={(e) => {
                                              openAddDataStatusMahasiswaModal(
                                                e
                                              );
                                            }}
                                          >
                                            <Image
                                              src={plusIcon}
                                              alt="Plus Icon"
                                            />
                                            <p className="text-white text-[10px] md:text-[14px]">
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
                                                  <th className="px-4 py-2 w-[15%]">
                                                    Nama
                                                  </th>
                                                  <th className="px-4 py-2 w-[20%]">
                                                    Status
                                                  </th>
                                                  <th className="px-4 py-2 w-[25%] rounded-tr-lg rounded-br-lg">
                                                    Action
                                                  </th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {dataStatusMahasiswaFormValue.length ===
                                                0 ? (
                                                  <tr>
                                                    <td
                                                      colSpan={4}
                                                      className="text-center py-4"
                                                    >
                                                      <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                                                        <h2 className="text-xl font-semibold text-gray-700">
                                                          Silahkan Tambah Data
                                                          Status Mahasiswa
                                                        </h2>
                                                        <p className="text-gray-500 mt-2">
                                                          Saat ini belum ada
                                                          data status yang
                                                          dimasukkan. Klik
                                                          tombol tambah data
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
                                                              onClick={(
                                                                e: any
                                                              ) => {
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
                                                              onClick={(
                                                                e: any
                                                              ) => {
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
                                          isOpen={
                                            isModalAddDataStatusMahasiswaOpen
                                          }
                                          onClose={
                                            closeAddDataStatusMahasiswaModal
                                          }
                                          onAdd={handleAddDataStatusMahasiswa}
                                          modalType="Tambah"
                                          title="Tambah Data Status Mahasiswa"
                                        >
                                          <form className="max-h-[400px] flex flex-col gap-2 pr-4 overflow-y-auto">
                                            <InputField
                                              type="text"
                                              placeholder="Masukkan NIM"
                                              onChange={(e: any) =>
                                                setNimAddDataStatusMahasiswaModal(
                                                  e.target.value
                                                )
                                              }
                                              value={
                                                nimAddDataStatusMahasiswaModal
                                              }
                                              className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                                            />
                                            <InputField
                                              type="text"
                                              placeholder="Masukkan Nama Lengkap"
                                              onChange={(e: any) =>
                                                setNamaLengkapAddDataStatusMahasiswaModal(
                                                  e.target.value
                                                )
                                              }
                                              value={
                                                namaLengkapAddDataStatusMahasiswaModal
                                              }
                                              className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                                            />
                                            <select
                                              value={
                                                statusAddDataStatusMahasiswaModal
                                              }
                                              onChange={(e) =>
                                                setStatusAddDataStatusMahasiswaModal(
                                                  e.target.value
                                                )
                                              }
                                              className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                                            >
                                              <option value="">
                                                Pilih Status
                                              </option>
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
                                          isOpen={
                                            isModalEditDataStatusMahasiswaOpen
                                          }
                                          onClose={
                                            closeEditDataStatusMahasiswaModal
                                          }
                                          onEdit={handleEditDataStatusMahasiswa}
                                          modalType="Edit"
                                          title="Edit Data Status Mahasiswa"
                                        >
                                          <form className="max-h-[400px] flex flex-col gap-2 pr-4 overflow-y-auto">
                                            <InputField
                                              type="text"
                                              placeholder="Masukkan NIM"
                                              onChange={(e: any) =>
                                                setDataSelectedDataStatusMahasiswaEditModal(
                                                  {
                                                    ...dataSelectedDataStatusMahasiswaEditModal,
                                                    nim: e.target.value,
                                                  }
                                                )
                                              }
                                              value={
                                                dataSelectedDataStatusMahasiswaEditModal.nim
                                              }
                                              className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                                            />
                                            <InputField
                                              type="text"
                                              placeholder="Masukkan Nama Lengkap"
                                              onChange={(e: any) =>
                                                setDataSelectedDataStatusMahasiswaEditModal(
                                                  {
                                                    ...dataSelectedDataStatusMahasiswaEditModal,
                                                    nama: e.target.value,
                                                  }
                                                )
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
                                                setDataSelectedDataStatusMahasiswaEditModal(
                                                  {
                                                    ...dataSelectedDataStatusMahasiswaEditModal,
                                                    status: e.target.value,
                                                  }
                                                )
                                              }
                                              className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                                            >
                                              <option value="">
                                                Pilih Status
                                              </option>
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
                                          isOpen={
                                            isModalDeleteDataStatusMahasiswaOpen
                                          }
                                          onClose={
                                            closeDeleteDataStatusMahasiswaModal
                                          }
                                          onDelete={
                                            handleDeleteDataStatusMahasiswa
                                          }
                                          modalType="Delete"
                                          title="Hapus Data Status Mahasiswa"
                                        >
                                          <p>
                                            Apakah Anda yakin ingin menghapus
                                            Data Status Mahasiswa ini?
                                          </p>
                                        </Modal>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="mt-4 border rounded-lg">
                                  <div className="flex flex-col gap-8">
                                    <p className="font-bold mx-auto mt-8">
                                      Data Konsultasi Mahasiswa
                                    </p>
                                    <button
                                      className="flex mr-8 px-3 py-2 bg-orange-500 items-center gap-2 rounded-lg ml-auto hover:bg-orange-600"
                                      onClick={(e) => {
                                        openAddDataKonsultasiMahasiswaModal(e);
                                      }}
                                    >
                                      <Image src={plusIcon} alt="Plus Icon" />
                                      <p className="text-white text-[10px] md:text-[14px]">
                                        Tambah Data Konsultasi Mahasiswa
                                      </p>
                                    </button>
                                    <div className="flex flex-col px-8 mb-10">
                                      <div className="overflow-x-auto">
                                        <table className="min-w-full text-[14px] border-collapse table-fixed">
                                          <thead>
                                            <tr className="bg-gray-100 text-center">
                                              <th className="px-2 py-2 w-[5%] rounded-tl-lg rounded-bl-lg">
                                                No
                                              </th>
                                              <th className="px-2 py-2 w-[5%]">
                                                Tanggal
                                              </th>
                                              <th className="px-2 py-2 w-[10%]">
                                                NIM
                                              </th>
                                              <th className="px-2 py-2 w-[10%]">
                                                Nama
                                              </th>
                                              <th className="px-2 py-2 w-[20%]">
                                                Permasalahan
                                              </th>
                                              <th className="px-2 py-2 w-[25%]">
                                                Solusi
                                              </th>
                                              <th className="px-2 py-2 w-[10%]">
                                                TTD MHS
                                              </th>
                                              <th className="px-4 py-2 w-[15%] rounded-tr-lg rounded-br-lg">
                                                Action
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {dataKonsultasiMahasiswa.length ===
                                            0 ? (
                                              <tr>
                                                <td
                                                  colSpan={8}
                                                  className="text-center py-4"
                                                >
                                                  <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                                                    <p className="text-gray-500 text-[14px] mt-2">
                                                      Saat ini belum ada data
                                                      konsultasi.
                                                    </p>
                                                  </div>
                                                </td>
                                              </tr>
                                            ) : (
                                              dataKonsultasiMahasiswa.map(
                                                (data: any, index: any) => (
                                                  <DataRowKonsultasiMahasiswa
                                                    key={index}
                                                    data={data}
                                                    index={index}
                                                  />
                                                )
                                              )
                                            )}
                                          </tbody>
                                        </table>
                                      </div>
                                      <Modal
                                        isOpen={
                                          isModalAddDataKonsultasiMahasiswaOpen
                                        }
                                        onClose={
                                          closeAddDataKonsultasiMahasiswaModal
                                        }
                                        onAdd={handleAddDataKonsultasiMahasiswa}
                                        modalType="Tambah"
                                        title="Tambah Data Konsultasi Mahasiswa"
                                      >
                                        <form className="max-h-[400px] flex flex-col gap-2 pr-4 overflow-y-auto">
                                          <select
                                            value={
                                              dataSelectedNamaMahasiswaAddKonsultasiBimbinganModal
                                            }
                                            onChange={(e) =>
                                              setDataSelectedNamaMahasiswaAddKonsultasiBimbinganModal(
                                                e.target.value
                                              )
                                            }
                                            className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                                          >
                                            <option value="">
                                              Pilih Peserta Perwalian
                                            </option>
                                            {selectedBimbingan
                                              .filter((data) =>
                                                data.pengajuan_bimbingan.jenis_bimbingan.startsWith(
                                                  "Perwalian"
                                                )
                                              )
                                              .map((data, index) => (
                                                <option
                                                  key={index}
                                                  value={
                                                    data.pengajuan_bimbingan
                                                      .nama_lengkap
                                                  }
                                                >
                                                  {
                                                    data.pengajuan_bimbingan
                                                      .nama_lengkap
                                                  }
                                                </option>
                                              ))}
                                          </select>
                                          {dataSelectedNamaMahasiswaAddKonsultasiBimbinganModal !==
                                            "" &&
                                          selectedDataBimbinganAddDataKonsultasiMahasiswaModal ? (
                                            <div>
                                              <InputField
                                                type="text"
                                                disabled
                                                placeholder="Masukkan NIM"
                                                value={
                                                  selectedDataBimbinganAddDataKonsultasiMahasiswaModal
                                                    .pengajuan_bimbingan.nim
                                                }
                                                className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                                              />
                                              <InputField
                                                type="text"
                                                disabled
                                                placeholder="Masukkan Tanggal Bimbingan"
                                                value={formatTanggal(
                                                  selectedDataBimbinganAddDataKonsultasiMahasiswaModal
                                                    .pengajuan_bimbingan
                                                    .jadwal_bimbingan
                                                )}
                                                className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                                              />
                                              <p className="text-sm font-medium text-gray-700 mt-2">
                                                Permasalahan
                                              </p>
                                              <textarea
                                                placeholder="Permasalahan"
                                                value={
                                                  permasalahanAddDataKonsultasiMahasiswaModal
                                                }
                                                onChange={(e) => {
                                                  setPermasalahanAddDataKonsultasiMahasiswaModal(
                                                    e.target.value
                                                  );
                                                }}
                                                className="border mt-2 focus:outline-none text-sm rounded-lg px-3 py-2 w-full h-24"
                                              />
                                              <p className="text-sm font-medium text-gray-700 mt-2">
                                                Solusi
                                              </p>
                                              <textarea
                                                placeholder="Solusi"
                                                value={
                                                  solusiAddDataKonsultasiMahasiswaModal
                                                }
                                                onChange={(e) => {
                                                  setSolusiAddDataKonsultasiMahasiswaModal(
                                                    e.target.value
                                                  );
                                                }}
                                                className="border mt-2 focus:outline-none text-sm rounded-lg px-3 py-2 w-full h-24"
                                              />
                                              <p className="text-sm font-medium text-gray-700 mt-2">
                                                Ttd Mahasiswa
                                              </p>
                                              <img
                                                alt="ttd absensi"
                                                className="border rounded-lg mt-2 p-4 w-[100px]"
                                                src={
                                                  selectedDataBimbinganAddDataKonsultasiMahasiswaModal.ttd_kehadiran
                                                }
                                              />
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                        </form>
                                      </Modal>
                                      <Modal
                                        isOpen={
                                          isModalEditDataKonsultasiMahasiswaOpen
                                        }
                                        onClose={
                                          closeEditDataKonsultasiMahasiswaModal
                                        }
                                        onEdit={
                                          handleEditDataKonsultasiMahasiswa
                                        }
                                        modalType="Edit"
                                        title="Edit Data Konsultasi Mahasiswa"
                                      >
                                        <form className="max-h-[400px] flex flex-col gap-2 pr-4 overflow-y-auto">
                                          <div>
                                            <InputField
                                              type="text"
                                              disabled
                                              placeholder="Masukkan NIM"
                                              value={
                                                dataSelectedDataKonsultasiMahasiswaEditModal.nim
                                              }
                                              className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                                            />
                                            <InputField
                                              type="text"
                                              disabled
                                              placeholder="Masukkan Tanggal Bimbingan"
                                              value={
                                                dataSelectedDataKonsultasiMahasiswaEditModal.tanggal
                                              }
                                              className="px-3 py-2 text-[15px] w-full focus:outline-none border rounded-lg mb-3"
                                            />
                                            <p className="text-sm font-medium text-gray-700 mt-2">
                                              Permasalahan
                                            </p>
                                            <textarea
                                              placeholder="Permasalahan"
                                              value={
                                                dataSelectedDataKonsultasiMahasiswaEditModal.permasalahan
                                              }
                                              onChange={(e) => {
                                                setDataSelectedDataKonsultasiMahasiswaEditModal(
                                                  {
                                                    ...dataSelectedDataKonsultasiMahasiswaEditModal,
                                                    permasalahan:
                                                      e.target.value,
                                                  }
                                                );
                                              }}
                                              className="border mt-2 focus:outline-none text-sm rounded-lg px-3 py-2 w-full h-24"
                                            />
                                            <p className="text-sm font-medium text-gray-700 mt-2">
                                              Solusi
                                            </p>
                                            <textarea
                                              placeholder="Solusi"
                                              value={
                                                dataSelectedDataKonsultasiMahasiswaEditModal.solusi
                                              }
                                              onChange={(e) => {
                                                setDataSelectedDataKonsultasiMahasiswaEditModal(
                                                  {
                                                    ...dataSelectedDataKonsultasiMahasiswaEditModal,
                                                    solusi: e.target.value,
                                                  }
                                                );
                                              }}
                                              className="border mt-2 focus:outline-none text-sm rounded-lg px-3 py-2 w-full h-24"
                                            />
                                            <p className="text-sm font-medium text-gray-700 mt-2">
                                              Ttd Mahasiswa
                                            </p>
                                          </div>
                                          <img
                                            alt="ttd absensi"
                                            className="border rounded-lg mt-2 p-4 w-[100px]"
                                            src={
                                              dataSelectedDataKonsultasiMahasiswaEditModal.ttd_mhs
                                            }
                                          />
                                        </form>
                                      </Modal>
                                      <Modal
                                        isOpen={
                                          isModalDeleteDataKonsultasiMahasiswaOpen
                                        }
                                        onClose={
                                          closeDeleteDataKonsultasiMahasiswaModal
                                        }
                                        onDelete={
                                          handleDeleteDataKonsultasiMahasiswa
                                        }
                                        modalType="Delete"
                                        title="Hapus Data Konsultasi Mahasiswa"
                                      >
                                        <p>
                                          Apakah Anda yakin ingin menghapus Data
                                          Konsultasi Mahasiswa ini?
                                        </p>
                                      </Modal>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-4 border rounded-lg">
                                  <div className="flex flex-col gap-8">
                                    <p className="font-bold mx-auto mt-8">
                                      Data Absensi Perwalian
                                    </p>
                                    <div className="flex flex-col px-8 mb-10">
                                      <div className="overflow-x-auto">
                                        <table className="min-w-full text-[14px] border-collapse table-fixed">
                                          <thead>
                                            <tr className="bg-gray-100 text-center">
                                              <th className="px-2 py-2 w-[10%] rounded-tl-lg rounded-bl-lg">
                                                No
                                              </th>
                                              <th className="px-2 py-2 w-[25%]">
                                                NIM
                                              </th>
                                              <th className="px-2 py-2 w-[40%]">
                                                Nama
                                              </th>
                                              <th className="px-2 py-2 w-[25%] rounded-tr-lg rounded-br-lg">
                                                TTD MHS
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {selectedBimbingan.filter((data) =>
                                              data.pengajuan_bimbingan.jenis_bimbingan.startsWith(
                                                "Perwalian"
                                              )
                                            ).length === 0 ? (
                                              <tr>
                                                <td
                                                  colSpan={7}
                                                  className="text-center py-4"
                                                >
                                                  <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                                                    <p className="text-gray-500 text-[14px] mt-2">
                                                      Saat ini belum ada data
                                                      Absensi.
                                                    </p>
                                                  </div>
                                                </td>
                                              </tr>
                                            ) : (
                                              selectedBimbingan
                                                .filter((data) =>
                                                  data.pengajuan_bimbingan.jenis_bimbingan.startsWith(
                                                    "Perwalian"
                                                  )
                                                )
                                                .map(
                                                  (data: any, index: any) => (
                                                    <DataRowAbsensiMahasiswa
                                                      key={index}
                                                      data={data}
                                                      index={index}
                                                    />
                                                  )
                                                )
                                            )}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col gap-4">
                                <p className="font-bold">
                                  C. KESIMPULAN DAN SARAN
                                </p>
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
                                    {imagePreviews.map(
                                      (src: any, index: any) => (
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
                                            onClick={(e) =>
                                              handleDeleteImage(e, index)
                                            }
                                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold"
                                          >
                                            <Image
                                              src={cancelIcon}
                                              alt={`cancelicon`}
                                              className="p-2"
                                            />
                                          </button>
                                        </div>
                                      )
                                    )}
                                    <label className="cursor-pointer flex justify-center items-center border-dashed border-2 border-gray-300 rounded-lg h-[200px] w-full col-span-3">
                                      <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                      />
                                      <div className="flex justify-center items-center">
                                        <Image
                                          src={ImagePlus}
                                          alt="imagePlus"
                                        />
                                      </div>
                                    </label>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-col gap-2 h-[300px] px-3 py-2 text-[15px] border rounded-lg">
                                  <label className="text-neutral-400">
                                    Dokumentasi
                                  </label>
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
                              <div className="flex flex-col w-full md:w-1/2 mx-auto gap-2 my-4">
                                <p className="text-center font-medium">
                                  Silahkan Tanda Tangan Laporan Perwalian
                                </p>
                                <div className="flex flex-col">
                                  <SignatureCanvas
                                    ref={sigCanvas}
                                    penColor="black"
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
                                  onClick={(e: any) =>
                                    handlePreviewPDFPerwalian(e)
                                  }
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
                          )
                        ) : (
                          <div className="border mt-6 rounded-lg p-10 flex flex-col items-center">
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
                              Anda belum memilih bimbingan yang akan dilaporkan.
                            </p>
                            <p className="text-center text-gray-600">
                              Pilih bimbingan yang akan dilaporkan terlebih
                              dahulu.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </form>
            <ToastContainer />
          </div>
        </div>

        <div className="border hidden md:block">
          <p className="text-center my-8 text-[16px]">
            Hak cipta &copy; 2025 Bimbingan Akademik Mahasiswa FIK UPNVJ
          </p>
        </div>
      </div>
    </>
  );
}

const RichTextPendahuluan: React.FC<{ value: any; onChange: any }> = ({
  value,
  onChange,
}) => {
  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const handleChange = (newValue: Descendant[]) => {
    onChange(newValue); // Call the onChange prop to notify parent
  };
  return (
    <Slate editor={editor} onChange={handleChange} initialValue={initialValue}>
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
const RichTextKesimpulan: React.FC<{ value: any; onChange: any }> = ({
  value,
  onChange,
}) => {
  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const handleChange = (newValue: Descendant[]) => {
    onChange(newValue); // Call the onChange prop to notify parent
  };

  return (
    <Slate editor={editor} onChange={handleChange} initialValue={initialValue}>
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

const toggleBlock = (editor: any, format: any) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
  );

  Transforms.unwrapNodes(editor, {
    match: (n: any) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });
  let newProperties: any;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      type: isActive ? "paragraph" : format,
    };
  }
  Transforms.setNodes<SlateElement>(editor, newProperties);
};

const toggleMark = (editor: any, format: any) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor: any, format: any, blockType: any = "type") => {
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
