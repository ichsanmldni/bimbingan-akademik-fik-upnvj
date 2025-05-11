"use client";

import plusIcon from "../../../../assets/images/plus.png";
import FilterField from "@/components/ui/FilterField";
import saveIcon from "../../../../assets/images/save-icon.png";
import cancelIcon from "../../../../assets/images/cancel-icon.png";
import SelectField from "@/components/ui/SelectField";
import searchIcon from "../../../../assets/images/search-icon.png";
import dragIcon from "../../../../assets/images/drag-table-icon.png";
import TrashButton from "@/components/ui/TrashButton";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import EditButton from "@/components/ui/EditButton";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import Modal from "../Modal";
import InputField from "@/components/ui/InputField";
import { CSS } from "@dnd-kit/utilities";
import { env } from "process";

import Logo from "@/components/ui/LogoUPNVJ";
import NavbarUser from "@/components/ui/NavbarUser";
import Link from "next/link";
import ImagePlus from "../../assets/images/image-plus.png";
import { jwtDecode } from "jwt-decode";
import "react-datepicker/dist/react-datepicker.css";
import isHotkey from "is-hotkey";
import SignatureCanvas from "react-signature-canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Editable, withReact, useSlate, Slate } from "slate-react";
import {
  Editor,
  Transforms,
  createEditor,
  Descendant,
  Element as SlateElement,
} from "slate";
import { withHistory } from "slate-history";
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
import FileButton from "@/components/ui/FileButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PDFModal from "@/components/ui/PDFModal";
import { Button, Toolbar } from "./components";

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

interface ManageInformasiAkademikProps {}

interface Bab {
  id: number;
  nama: string;
  order: number;
}

interface SubBab {
  id: number;
  nama: string;
  isi: string;
  order: number;
}

const ManageInformasiAkademik: React.FC<ManageInformasiAkademikProps> = () => {
  const [selectedBab, setSelectedBab] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("Bab");
  const tabs = ["Bab", "Sub Bab"];
  const [afterOrderEditDataBab, setAfterOrderEditDataBab] = useState<Bab[]>([]);
  const [afterOrderEditDataSubBab, setAfterOrderEditDataSubBab] = useState<
    SubBab[]
  >([]);
  const [modalType, setModalType] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditOrder, setIsEditOrder] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataBab, setDataBab] = useState<Bab[]>([]);
  const [valueBabAddModal, setValueBabAddModal] = useState<string>("");
  const [valueBabEditModal, setValueBabEditModal] = useState<string>("");
  const [selectedBabEditModal, setSelectedBabEditModal] = useState<Bab | null>(
    null
  );
  const [selectedBabDeleteModal, setSelectedBabDeleteModal] =
    useState<Bab | null>(null);
  const [dataSubBab, setDataSubBab] = useState<SubBab[]>([]);
  const [valueSubBabAddModal, setValueSubBabAddModal] = useState<string>("");
  const [valueSubBabEditModal, setValueSubBabEditModal] = useState<string>("");
  const [valueIsiSubBabAddModal, setValueIsiSubBabAddModal] = useState<any>([]);
  const [valueIsiSubBabEditModal, setValueIsiSubBabEditModal] = useState<any>(
    []
  );
  const [selectedSubBabEditModal, setSelectedSubBabEditModal] =
    useState<SubBab | null>(null);
  const [selectedSubBabDeleteModal, setSelectedSubBabDeleteModal] =
    useState<SubBab | null>(null);
  const [optionsBab, setOptionsBab] = useState<
    { value: string; label: string }[]
  >([]);
  const [isShowDetailIsiSubBab, setIsShowDetailIsiSubBab] = useState(false);
  const [selectedDetailIsiSubBab, setSelectedDetailIsiSubBab] = useState([]);
  const [selectedDetailNamaSubBab, setSelectedDetailNamaSubBab] = useState("");

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

  function showDetailIsiSubBab(nama, isi) {
    try {
      setSelectedDetailNamaSubBab(nama);
      const parsed = JSON.parse(isi);
      if (Array.isArray(parsed)) {
        setSelectedDetailIsiSubBab(parsed);
      } else {
        setSelectedDetailIsiSubBab([]);
      }
    } catch (error) {
      setSelectedDetailIsiSubBab([]);
    }
    setIsShowDetailIsiSubBab(true);
  }

  const areArraysEqual = (arr1: any[], arr2: any[]) => {
    if (arr1.length !== arr2.length) return false;
    return arr1.every(
      (item, index) => JSON.stringify(item) === JSON.stringify(arr2[index])
    );
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setValueBabAddModal("");
    setValueBabEditModal("");
    setValueSubBabAddModal("");
    setValueSubBabEditModal("");
    setValueIsiSubBabAddModal([]);
    setValueIsiSubBabEditModal([]);
  };

  function DraggableRow({
    id,
    index,
    data,
    tab,
  }: {
    id: string;
    index: number;
    data: any;
    tab: string;
  }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
      useSortable({
        id,
        data: { index },
      });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition: isDragging ? "none" : "transform 200ms",
      cursor: isDragging ? "grabbing" : "grab",
    };

    return (
      <tr
        ref={setNodeRef}
        className={`text-center ${isDragging ? "cursor-grabbing" : ""}`}
      >
        <td className="border-b border-gray-200 px-4 py-2">
          <div className="flex items-center">
            <div
              {...attributes}
              {...listeners}
              className={`size-4 mr-2 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
            >
              <Image src={dragIcon} alt="Drag Icon" />
            </div>
            <p className="text-center flex-1">{index + 1}</p>
          </div>
        </td>
        <td className="border-b border-gray-200 px-4 py-2">{data.nama}</td>
        {tab === "Bab" ? (
          <td className="border-b border-gray-200 px-4 py-4">
            <div className="flex gap-2 items-center justify-center">
              <EditButton
                onClick={() => {
                  setValueBabEditModal(data.nama);
                  setSelectedBabEditModal(data as Bab);
                  openModal("Edit");
                }}
                className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
              />
              <TrashButton
                onClick={() => {
                  setSelectedBabDeleteModal(data as Bab);
                  openModal("Delete");
                }}
                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
              />
            </div>
          </td>
        ) : (
          <>
            {tab === "Sub Bab" && (
              <td className="px-4 py-2 w-1/4">
                <button
                  onClick={() => showDetailIsiSubBab(data.nama, data.isi)}
                >
                  <p className="text-blue-600 underline hover:text-blue-800">
                    Lihat isi...
                  </p>
                </button>
              </td>
            )}

            <td className="border-b border-gray-200 px-4 py-4">
              <div className="flex gap-2 items-center justify-center">
                <EditButton
                  onClick={() => {
                    setValueSubBabEditModal(data.nama);
                    try {
                      const parsedIsi = JSON.parse(data.isi);
                      if (Array.isArray(parsedIsi)) {
                        setValueIsiSubBabEditModal(parsedIsi);
                      } else {
                        setValueIsiSubBabEditModal([]);
                      }
                    } catch (error) {
                      // Kalau error parsing (berarti string biasa / invalid json), fallback kosong
                      setValueIsiSubBabEditModal([]);
                    }

                    setSelectedSubBabEditModal(data as SubBab);
                    openModal("Edit");
                  }}
                  className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
                />
                <TrashButton
                  onClick={() => {
                    setSelectedSubBabDeleteModal(data as SubBab);
                    openModal("Delete");
                  }}
                  className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                />
              </div>
            </td>
          </>
        )}
        <DragOverlay>
          {isDragging ? (
            <table className="min-w-full text-[16px] border-collapse table-fixed bg-white bg-opacity-10 backdrop-blur-sm rounded-lg">
              <thead className="hidden">
                <tr className="bg-gray-100 text-center">
                  <th className="pr-4 py-2 pl-12 rounded-tl-lg rounded-bl-lg">
                    No
                  </th>
                  <th className="px-4 py-2">
                    {tab === "Bab" ? "Bab" : "Sub Bab"}
                  </th>
                  {tab === "Sub Bab" && <th className="px-4 py-2">Isi</th>}
                  <th className="px-4 py-2 rounded-tr-lg rounded-br-lg">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center">
                  <td className="px-4 py-2">
                    <div className="flex items-center">
                      <Image
                        className="size-4 mr-2"
                        src={dragIcon}
                        alt="Drag Icon"
                      />
                      <p className="text-center flex-1">{index + 1}</p>
                    </div>
                  </td>
                  <td
                    className={`px-4 py-2 ${tab === "Sub Bab" ? "w-1/4" : "w-1/2"}`}
                  >
                    {data.nama}
                  </td>
                  {tab === "Sub Bab" && (
                    <td className="px-4 py-2 w-1/4">
                      <button
                        onClick={() => showDetailIsiSubBab(data.nama, data.isi)}
                      >
                        <p className="text-blue-600 underline hover:text-blue-800">
                          Lihat isi...
                        </p>
                      </button>
                    </td>
                  )}

                  <td className="px-4 py-4 w-1/4">
                    <div className="flex gap-2 items-center justify-center">
                      <EditButton
                        onClick={() => {}}
                        className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
                      />
                      <TrashButton
                        onClick={() => {}}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          ) : null}
        </DragOverlay>
      </tr>
    );
  }

  const openModal = (type: string, data: any = null) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleClickTab = (tab: string) => {
    setActiveTab(tab);
    setSelectedBab("");
  };

  const handleDragEndBab = (event: any) => {
    const { active, over } = event;

    if (!over) {
      setAfterOrderEditDataBab([...dataBab]);
      return;
    }

    const oldIndex = afterOrderEditDataBab.findIndex(
      (item) => item.id === +active.id
    );
    const newIndex = afterOrderEditDataBab.findIndex(
      (item) => item.id === +over.id
    );
    if (oldIndex !== -1 && newIndex !== -1) {
      const newDataBab = [...afterOrderEditDataBab];

      const updatedData = newDataBab.map((item, index) => {
        if (index === oldIndex) {
          return { ...item, order: newIndex + 1 }; // Set order ke posisi baru
        }
        if (index === newIndex) {
          return { ...item, order: oldIndex + 1 }; // Set order ke posisi lama
        }
        return item; // Tidak ubah item lainnya
      });
      const sortedDataBab = updatedData.sort((a, b) => a.order - b.order);
      setAfterOrderEditDataBab(sortedDataBab);
      setIsEditOrder(true);
    }
  };

  const handleDragEndSubBab = (event: any) => {
    const { active, over } = event;

    if (!over) {
      setAfterOrderEditDataSubBab([...dataSubBab]);
      return;
    }

    const oldIndex = afterOrderEditDataSubBab.findIndex(
      (item) => item.id === +active.id
    );
    const newIndex = afterOrderEditDataSubBab.findIndex(
      (item) => item.id === +over.id
    );
    if (oldIndex !== -1 && newIndex !== -1) {
      const newDataSubBab = [...afterOrderEditDataSubBab];

      const updatedData = newDataSubBab.map((item, index) => {
        if (index === oldIndex) {
          return { ...item, order: newIndex + 1 }; // Set order ke posisi baru
        }
        if (index === newIndex) {
          return { ...item, order: oldIndex + 1 }; // Set order ke posisi lama
        }
        return item; // Tidak ubah item lainnya
      });
      const sortedDataSubBab = updatedData.sort((a, b) => a.order - b.order);
      setAfterOrderEditDataSubBab(sortedDataSubBab);
      setIsEditOrder(true);
    }
  };

  const addBab = async (newData: Bab) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/databab`, newData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const patchBab = async (updatedData: Bab) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/databab`,
        updatedData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteBab = async (deletedData: Bab) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/databab`, {
        data: deletedData,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleAddBab = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let babValue: any = {
        nama: valueBabAddModal,
        order: dataBab.length + 1,
      };

      const result = await addBab(babValue);
      getDataBab();
      setIsEditOrder(false);
      closeModal();
    } catch (error) {
      console.error("Registration error:", (error as Error).message);
    }
  };

  const handleEditBab = async (id: number) => {
    try {
      let babValue: any = {
        id,
        nama: valueBabEditModal,
      };

      const result = await patchBab(babValue);
      getDataBab();
      setIsEditOrder(false);
      closeModal();
    } catch (error) {
      console.error("Failed to save the updated order.");
    }
  };

  const handleDeleteBab = async (id: number) => {
    try {
      let babValue: any = {
        id,
      };

      const result = await deleteBab(babValue);
      closeModal();
      getDataBab();
    } catch (error) {
      console.error("Failed to save the updated order.");
    }
  };

  const patchBabOrder = async (updatedOrder: Bab[]) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/databab/updateorder`,
        {
          ...updatedOrder,
        }
      );
      getDataBab();
      setIsEditOrder(false);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleSaveBabOrder = async () => {
    try {
      const result = await patchBabOrder(afterOrderEditDataBab);
    } catch (error) {
      console.error("Failed to save the updated order.");
    }
  };

  const getDataBab = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/databab`);

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      const sortedDataBab = data.sort((a: Bab, b: Bab) => a.order - b.order);
      setDataBab(sortedDataBab);
      if (data.length === 0) {
        setAfterOrderEditDataBab([]);
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const addSubBab = async (newData: SubBab) => {
    try {
      const dataBabResponse = await axios.get(`${API_BASE_URL}/api/databab`);
      const bab = dataBabResponse.data.find(
        (data: Bab) => data.nama === selectedBab
      );

      if (!bab) {
        throw new Error("Bab tidak ditemukan");
      }

      const babid = bab.id;

      const response = await axios.post(
        `${API_BASE_URL}/api/datasubbab/${babid}`,
        newData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const patchSubBab = async (updatedData: SubBab) => {
    try {
      const dataBabResponse = await axios.get(`${API_BASE_URL}/api/databab`);
      const bab = dataBabResponse.data.find(
        (data: Bab) => data.nama === selectedBab
      );

      if (!bab) {
        throw new Error("Bab tidak ditemukan");
      }

      const babid = bab.id;

      const response = await axios.patch(
        `${API_BASE_URL}/api/datasubbab/${babid}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteSubBab = async (deletedData: SubBab) => {
    try {
      const dataBabResponse = await axios.get(`${API_BASE_URL}/api/databab`);
      const bab = dataBabResponse.data.find(
        (data: Bab) => data.nama === selectedBab
      );

      if (!bab) {
        throw new Error("Bab tidak ditemukan");
      }

      const babid = bab.id;

      const response = await axios.delete(
        `${API_BASE_URL}/api/datasubbab/${babid}`,
        { data: deletedData }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleAddSubBab = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let subBabValue: any = {
        nama: valueSubBabAddModal,
        isi: JSON.stringify(valueIsiSubBabAddModal),
        order: dataSubBab.length + 1,
      };

      const result = await addSubBab(subBabValue);
      getDataSubBabByBab(selectedBab);
      setIsEditOrder(false);
      closeModal();
    } catch (error) {
      console.error("Registration error:", (error as Error).message);
    }
  };

  const handleEditSubBab = async (id: number) => {
    try {
      let subBabValue: any = {
        id,
        nama: valueSubBabEditModal,
        isi: JSON.stringify(valueIsiSubBabEditModal),
      };

      const result = await patchSubBab(subBabValue);
      getDataSubBabByBab(selectedBab);
      setIsEditOrder(false);
      closeModal();
    } catch (error) {
      console.error("Failed to save the updated order.");
    }
  };

  const handleDeleteSubBab = async (id: number) => {
    try {
      let subBabValue: any = {
        id,
      };

      const result = await deleteSubBab(subBabValue);
      getDataSubBabByBab(selectedBab);
      closeModal();
    } catch (error) {
      console.error("Failed to save the updated order.");
    }
  };

  const patchSubBabOrder = async (updatedOrder: SubBab[]) => {
    try {
      const dataBabResponse = await axios.get(`${API_BASE_URL}/api/databab`);
      const bab = dataBabResponse.data.find(
        (data: Bab) => data.nama === selectedBab
      );

      if (!bab) {
        throw new Error("Bab tidak ditemukan");
      }

      const babid = bab.id;

      const response = await axios.patch(
        `${API_BASE_URL}/api/datasubbab/${babid}/updateorder`,
        {
          ...updatedOrder,
        }
      );
      getDataSubBabByBab(selectedBab);
      setIsEditOrder(false);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleSaveSubBabOrder = async () => {
    try {
      const result = await patchSubBabOrder(afterOrderEditDataSubBab);
    } catch (error) {
      console.error("Failed to save the updated order.");
    }
  };

  const getDataSubBabByBab = async (selectedBab: string) => {
    try {
      const dataBabResponse = await axios.get(`${API_BASE_URL}/api/databab`);
      const bab = dataBabResponse.data.find(
        (data: Bab) => data.nama === selectedBab
      );

      if (!bab) {
        throw new Error("Bab tidak ditemukan");
      }

      const babid = bab.id;

      const response = await axios.get(
        `${API_BASE_URL}/api/datasubbab/${babid}`
      );

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      const sortedDataSubBab = data.sort(
        (a: SubBab, b: SubBab) => a.order - b.order
      );
      setDataSubBab(sortedDataSubBab);
      if (data.length === 0) {
        setAfterOrderEditDataSubBab([]);
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (dataBab.length > 0) {
      const formattedOptions = dataBab.map((data) => {
        return {
          value: data.nama,
          label: data.nama,
        };
      });

      setOptionsBab(formattedOptions);

      const afterOrder = dataBab.map((data) => {
        return {
          ...data,
        };
      });
      setAfterOrderEditDataBab(afterOrder);
    }
  }, [dataBab]);

  useEffect(() => {
    getDataBab();
  }, []);

  useEffect(() => {
    if (selectedBab !== "") {
      setIsEditOrder(false);
      setAfterOrderEditDataSubBab([]);
      getDataSubBabByBab(selectedBab);
    }
  }, [selectedBab]);

  useEffect(() => {
    if (dataSubBab.length > 0) {
      const afterOrder = dataSubBab.map((data) => {
        return {
          ...data,
        };
      });
      setAfterOrderEditDataSubBab(afterOrder);
    }
  }, [dataSubBab]);

  return (
    <div className="m-8 rounded-lg">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab
                ? "border-b-2 border-orange-500 text-orange-500"
                : "text-gray-600"
            }`}
            onClick={() => handleClickTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Bab" && (
        <div className="mt-6">
          {afterOrderEditDataBab.length === 0 ? (
            <>
              <button
                onClick={() => {
                  openModal("Tambah");
                }}
                className="flex px-3 mr-4 py-2 bg-orange-500 items-center gap-2 rounded-lg ml-auto hover:bg-orange-600"
              >
                <Image src={plusIcon} alt="Plus Icon" />
                <p className="text-white text-[14px]">Tambah Bab</p>
              </button>
              <div className="overflow-x-auto mt-6 mb-6">
                <DndContext onDragEnd={handleDragEndBab}>
                  <SortableContext
                    items={afterOrderEditDataBab.map((item) => item.id)}
                  >
                    <table className="min-w-full text-[16px] border-collapse table-fixed">
                      <thead>
                        <tr className="bg-gray-100 text-center">
                          <th className="px-4 py-2 pl-10 rounded-tl-lg rounded-bl-lg ">
                            No
                          </th>
                          <th className="px-4 py-2 w-1/2">Bab</th>
                          <th className="px-4 py-2 w-1/4 rounded-tr-lg rounded-br-lg ">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <td colSpan={3}>
                          {isLoading ? (
                            <div className="flex justify-center items-center h-20">
                              <div className="loader" />{" "}
                              {/* Tambahkan animasi di CSS */}
                            </div>
                          ) : (
                            <p className="py-8 text-center">
                              No Data, Please add data!
                            </p>
                          )}
                        </td>
                      </tbody>
                    </table>
                  </SortableContext>
                </DndContext>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  openModal("Tambah");
                }}
                className="flex px-3 py-2 bg-orange-500 items-center gap-2 rounded-lg ml-auto hover:bg-orange-600"
              >
                <Image src={plusIcon} alt="Plus Icon" />
                <p className="text-white text-[14px]">Tambah Bab</p>
              </button>
              <div className="overflow-x-auto mt-6 mb-6">
                <DndContext onDragEnd={handleDragEndBab}>
                  <SortableContext
                    items={afterOrderEditDataBab.map((item) => item.id)}
                  >
                    <table className="min-w-full text-[16px] border-collapse table-fixed">
                      <thead>
                        <tr className="bg-gray-100 text-center">
                          <th className="px-4 py-2 pl-10 w-1/4 rounded-tl-lg rounded-bl-lg">
                            No
                          </th>
                          <th className="px-4 py-2 w-1/2">Bab</th>
                          <th className="px-4 py-2 w-1/4 rounded-tr-lg rounded-br-lg">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {afterOrderEditDataBab.map((data, index) => (
                          <DraggableRow
                            key={data.id}
                            id={data.id.toString()}
                            index={index}
                            data={data}
                            tab="Bab"
                          />
                        ))}
                      </tbody>
                    </table>
                  </SortableContext>
                </DndContext>
              </div>
              <div className="flex ml-auto my-8 justify-end gap-4">
                <button
                  className={`flex px-3 py-2 w-[90px] justify-center bg-green-500 items-center gap-2 rounded-lg hover:bg-green-600 ${areArraysEqual(dataBab, afterOrderEditDataBab) || !isEditOrder ? "hidden" : ""}`}
                  onClick={() => handleSaveBabOrder()}
                >
                  <p className="text-white text-[14px]">Save</p>
                  <Image src={saveIcon} className="size-4" alt="Save Icon" />
                </button>
                <button
                  className={`flex px-3 py-2 bg-red-500 w-[90px] justify-center items-center gap-2 rounded-lg hover:bg-red-600 ${areArraysEqual(dataBab, afterOrderEditDataBab) || !isEditOrder ? "hidden" : ""}`}
                  onClick={() => {
                    const afterOrder = dataBab.map((data) => {
                      return {
                        ...data,
                      };
                    });
                    setAfterOrderEditDataBab(afterOrder);
                  }}
                >
                  <p className="text-white text-[14px]">Cancel</p>
                  <Image
                    src={cancelIcon}
                    className="size-2.5"
                    alt="Cancel Icon"
                  />
                </button>
              </div>
            </>
          )}
          <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            onAdd={handleAddBab}
            onEdit={handleEditBab}
            onDelete={handleDeleteBab}
            title={`${modalType === "Delete" ? "Konfirmasi Penghapusan Bab" : `${modalType} Bab`}`}
            modalType={modalType}
            initialData={
              modalType === "Delete"
                ? selectedBabDeleteModal
                : modalType === "Edit"
                  ? selectedBabEditModal
                  : null
            }
          >
            {modalType === "Tambah" && (
              <form>
                <InputField
                  type="text"
                  placeholder="Masukkan bab"
                  onChange={(e) => {
                    setValueBabAddModal(e.target.value);
                  }}
                  disabled={false}
                  value={valueBabAddModal}
                  className="px-3 py-2 text-[15px] w-1/2 focus:outline-none border rounded-lg"
                />
              </form>
            )}
            {modalType === "Edit" && (
              <form>
                <InputField
                  type="text"
                  placeholder="Masukkan bab"
                  onChange={(e) => {
                    setValueBabEditModal(e.target.value);
                  }}
                  disabled={false}
                  value={valueBabEditModal}
                  className="px-3 py-2 text-[15px] w-1/2 focus:outline-none border rounded-lg"
                />
              </form>
            )}
            {modalType === "Delete" && (
              <p>
                Apakah Anda yakin ingin menghapus bab [
                {selectedBabDeleteModal?.nama}] ?
              </p>
            )}
          </Modal>
        </div>
      )}

      {activeTab === "Sub Bab" && (
        <div className="flex">
          <SelectField
            options={optionsBab}
            onChange={(e) => setSelectedBab(e.target.value)}
            value={selectedBab}
            placeholder="Pilih Bab"
            className={`px-3 mt-4 py-2 text-[14px] border rounded-lg focus:outline-none appearance-none w-[200px]`}
          />
        </div>
      )}

      {activeTab === "Sub Bab" && selectedBab !== "" && (
        <div className="mt-4">
          {afterOrderEditDataSubBab.length === 0 ? (
            <>
              <button
                onClick={() => {
                  openModal("Tambah");
                }}
                className="flex px-3 mr-4 py-2 bg-orange-500 items-center gap-2 rounded-lg ml-auto hover:bg-orange-600"
              >
                <Image src={plusIcon} alt="Plus Icon" />
                <p className="text-white text-[14px]">Tambah Sub Bab</p>
              </button>
              <div className="overflow-x-auto mt-6 mb-6">
                <DndContext onDragEnd={handleDragEndSubBab}>
                  <SortableContext
                    items={afterOrderEditDataSubBab.map((item) => item.id)}
                  >
                    <table className="min-w-full text-[16px] border-collapse table-fixed">
                      <thead>
                        <tr className="bg-gray-100 text-center">
                          <th className="px-4 py-2 pl-10 rounded-tl-lg rounded-bl-lg ">
                            No
                          </th>
                          <th className="px-4 py-2 w-1/4">Sub Bab</th>
                          <th className="px-4 py-2 w-1/4">Isi</th>
                          <th className="px-4 py-2 w-1/4 rounded-tr-lg rounded-br-lg ">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <td colSpan={4}>
                          {isLoading ? (
                            <div className="flex justify-center items-center h-20">
                              <div className="loader" />{" "}
                              {/* Tambahkan animasi di CSS */}
                            </div>
                          ) : (
                            <p className="py-8 text-center">
                              No Data, Please add data!
                            </p>
                          )}
                        </td>
                      </tbody>
                    </table>
                  </SortableContext>
                </DndContext>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  openModal("Tambah");
                }}
                className="flex px-3 mr-4 py-2 bg-orange-500 items-center gap-2 rounded-lg ml-auto hover:bg-orange-600"
              >
                <Image src={plusIcon} alt="Plus Icon" />
                <p className="text-white text-[14px]">Tambah Sub Bab</p>
              </button>
              <div className="overflow-x-auto mt-6 mb-6">
                <DndContext onDragEnd={handleDragEndSubBab}>
                  <SortableContext
                    items={afterOrderEditDataSubBab.map((item) => item.id)}
                  >
                    <table className="min-w-full text-[16px] border-collapse table-fixed">
                      <thead>
                        <tr className="bg-gray-100 text-center">
                          <th className="px-4 py-2 pl-10 w-1/4 rounded-tl-lg rounded-bl-lg">
                            No
                          </th>
                          <th className="px-4 py-2 w-1/4">Sub Bab</th>
                          <th className="px-4 py-2 w-1/4">Isi</th>
                          <th className="px-4 py-2 rounded-tr-lg w-1/4 rounded-br-lg">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {afterOrderEditDataSubBab.map((data, index) => (
                          <DraggableRow
                            key={data.id}
                            id={data.id.toString()}
                            index={index}
                            data={data}
                            tab="Sub Bab"
                          />
                        ))}
                      </tbody>
                    </table>
                  </SortableContext>
                </DndContext>
              </div>
              <div className="flex ml-auto mt-6 justify-end gap-4">
                <button
                  className={`flex px-3 py-2 w-[90px] justify-center bg-green-500 items-center gap-2 rounded-lg hover:bg-green-600 ${areArraysEqual(dataSubBab, afterOrderEditDataSubBab) || !isEditOrder ? "hidden" : ""}`}
                  onClick={() => handleSaveSubBabOrder()}
                >
                  <p className="text-white text-[14px]">Save</p>
                  <Image src={saveIcon} className="size-4" alt="Save Icon" />
                </button>
                <button
                  className={`flex px-3 py-2 bg-red-500 w-[90px] justify-center items-center gap-2 rounded-lg hover:bg-red-600 ${areArraysEqual(dataSubBab, afterOrderEditDataSubBab) || !isEditOrder ? "hidden" : ""}`}
                  onClick={() => {
                    const afterOrder = dataSubBab.map((data) => {
                      return {
                        ...data,
                      };
                    });
                    setIsEditOrder(false);
                    setAfterOrderEditDataSubBab(afterOrder);
                  }}
                >
                  <p className="text-white text-[14px]">Cancel</p>
                  <Image
                    src={cancelIcon}
                    className="size-2.5"
                    alt="Cancel Icon"
                  />
                </button>
              </div>
            </>
          )}
          {isShowDetailIsiSubBab && (
            <div
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-25 z-50"
              onClick={() => setIsShowDetailIsiSubBab(false)}
            >
              <div
                className="bg-white rounded-xl pl-8 py-8 pr-4 w-[90%] md:w-[700px] shadow-lg my-10 max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-lg font-semibold mb-4 text-center">
                  {selectedDetailNamaSubBab}
                </h2>

                <div className="overflow-y-auto flex-1 pr-4">
                  {selectedDetailIsiSubBab.length > 0 ? (
                    selectedDetailIsiSubBab
                      .filter((item) =>
                        item.children.some((child) => child.text.trim() !== "")
                      )
                      .map((item, index) => (
                        <p
                          key={index}
                          className="mb-4 text-justify leading-relaxed"
                        >
                          {item.children.map((child, childIndex) => (
                            <span key={childIndex}>{child.text}</span>
                          ))}
                        </p>
                      ))
                  ) : (
                    <p className="text-center">Tidak ada isi.</p>
                  )}
                </div>

                <div className="mt-6 text-right">
                  <button
                    onClick={() => setIsShowDetailIsiSubBab(false)}
                    className="px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}

          <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            onAdd={handleAddSubBab}
            onEdit={handleEditSubBab}
            onDelete={handleDeleteSubBab}
            title={`${modalType === "Delete" ? "Konfirmasi Penghapusan Sub Bab" : `${modalType} Sub Bab`}`}
            modalType={modalType}
            initialData={
              modalType === "Delete"
                ? selectedSubBabDeleteModal
                : modalType === "Edit"
                  ? selectedSubBabEditModal
                  : null
            }
          >
            {modalType === "Tambah" && (
              <form>
                <div className="flex flex-col gap-4">
                  <InputField
                    type="text"
                    placeholder="Masukkan sub bab"
                    onChange={(e) => {
                      setValueSubBabAddModal(e.target.value);
                    }}
                    disabled={false}
                    value={valueSubBabAddModal}
                    className="px-3 py-2 text-[15px] focus:outline-none border rounded-lg"
                  />
                  <div className="p-6 border rounded-lg ">
                    <RichTextSubBabAddModal
                      value={valueIsiSubBabAddModal}
                      onChange={setValueIsiSubBabAddModal}
                    />
                  </div>
                </div>
              </form>
            )}
            {modalType === "Edit" && (
              <form>
                <div className="flex flex-col gap-4">
                  <InputField
                    type="text"
                    placeholder="Masukkan sub bab"
                    onChange={(e) => {
                      setValueSubBabEditModal(e.target.value);
                    }}
                    disabled={false}
                    value={valueSubBabEditModal}
                    className="px-3 py-2 text-[15px] focus:outline-none border rounded-lg"
                  />
                  {/* <textarea
                    placeholder="Masukkan isi"
                    className="px-3 py-2 text-[15px] h-[300px] focus:outline-none border rounded-lg"
                    onChange={(e) => {
                      setValueIsiSubBabEditModal(e.target.value);
                    }}
                    value={valueIsiSubBabEditModal}
                  /> */}
                  <div className="p-6 border rounded-lg ">
                    <RichTextSubBabEditModal
                      value={valueIsiSubBabEditModal}
                      onChange={setValueIsiSubBabEditModal}
                    />
                  </div>
                </div>
              </form>
            )}
            {modalType === "Delete" && (
              <p>
                Apakah Anda yakin ingin menghapus sub bab [
                {selectedSubBabDeleteModal?.nama}] ?
              </p>
            )}
          </Modal>
        </div>
      )}
    </div>
  );
};

const RichTextSubBabAddModal: React.FC<{ value: any; onChange: any }> = ({
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
        placeholder="Masukkan Isi Sub Bab…"
        spellCheck
        style={{ outline: "none", fontSize: "14px" }}
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

const RichTextSubBabEditModal: React.FC<{ value: any; onChange: any }> = ({
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
    <Slate editor={editor} onChange={handleChange} initialValue={value}>
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
        placeholder="Masukkan Isi Sub Bab…"
        spellCheck
        style={{ outline: "none", fontSize: "14px" }}
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

export default ManageInformasiAkademik;
