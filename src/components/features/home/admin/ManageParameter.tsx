"use client";

import SelectField from "@/components/ui/SelectField";
import saveIcon from "../../../../assets/images/save-icon.png";
import plusIcon from "../../../../assets/images/plus.png";
import cancelIcon from "../../../../assets/images/cancel-icon.png";
import dragIcon from "../../../../assets/images/drag-table-icon.png";
import { useEffect, useState } from "react";
import Image from "next/image";
import EditButton from "@/components/ui/EditButton";
import TrashButton from "@/components/ui/TrashButton";
import axios from "axios";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Modal from "../Modal";
import InputField from "@/components/ui/InputField";
import { env } from "process";

interface ManageParameterProps {
  activeNavbar: string;
}
const ManageParameter: React.FC<ManageParameterProps> = ({ activeNavbar }) => {
  const [isModalOpen, setIsModalOpen] = useState<any>(false);
  const [isEditOrder, setIsEditOrder] = useState<any>(false);
  const [isLoading, setIsLoading] = useState<any>(false);
  const [modalType, setModalType] = useState<any>("");
  const [selectedParameter, setSelectedParameter] = useState<any>("");
  const [dataJurusan, setDataJurusan] = useState<any>([]);
  const [afterOrderEditDataJurusan, setAfterOrderEditDataJurusan] =
    useState<any>([]);
  const [dataPeminatan, setDataPeminatan] = useState<any>([]);
  const [afterOrderEditDataPeminatan, setAfterOrderEditDataPeminatan] =
    useState<any>([]);
  const [dataJenisBimbingan, setDataJenisBimbingan] = useState<any>([]);
  const [dataTopikBimbinganPribadi, setDataTopikBimbinganPribadi] =
    useState<any>([]);
  const [
    afterOrderEditDataJenisBimbingan,
    setAfterOrderEditDataJenisBimbingan,
  ] = useState<any>([]);
  const [
    afterOrderEditDataTopikBimbinganPribadi,
    setAfterOrderEditDataTopikBimbinganPribadi,
  ] = useState<any>([]);
  const [dataSistemBimbingan, setDataSistemBimbingan] = useState<any>([]);
  const [
    afterOrderEditDataSistemBimbingan,
    setAfterOrderEditDataSistemBimbingan,
  ] = useState<any>([]);
  const [selectedJurusan, setSelectedJurusan] = useState<any>("");
  const [optionsJurusan, setOptionsJurusan] = useState<any>([]);
  const [valueJurusanAddModal, setValueJurusanAddModal] = useState<any>("");
  const [valueJurusanEditModal, setValueJurusanEditModal] = useState<any>("");
  const [valuePeminatanAddModal, setValuePeminatanAddModal] = useState<any>("");
  const [valuePeminatanEditModal, setValuePeminatanEditModal] =
    useState<any>("");
  const [selectedPeminatanEditModal, setSelectedPeminatanEditModal] =
    useState<any>({});
  const [selectedPeminatanDeleteModal, setSelectedPeminatanDeleteModal] =
    useState<any>({});
  const [valueJenisBimbinganAddModal, setValueJenisBimbinganAddModal] =
    useState<any>("");
  const [valueJenisBimbinganEditModal, setValueJenisBimbinganEditModal] =
    useState<any>("");
  const [selectedJenisBimbinganEditModal, setSelectedJenisBimbinganEditModal] =
    useState<any>({});
  const [
    selectedJenisBimbinganDeleteModal,
    setSelectedJenisBimbinganDeleteModal,
  ] = useState<any>({});
  const [
    valueTopikBimbinganPribadiAddModal,
    setValueTopikBimbinganPribadiAddModal,
  ] = useState<any>("");
  const [
    valueTopikBimbinganPribadiEditModal,
    setValueTopikBimbinganPribadiEditModal,
  ] = useState<any>("");
  const [
    selectedTopikBimbinganPribadiEditModal,
    setSelectedTopikBimbinganPribadiEditModal,
  ] = useState<any>({});
  const [
    selectedTopikBimbinganPribadiDeleteModal,
    setSelectedTopikBimbinganPribadiDeleteModal,
  ] = useState<any>({});
  const [valueSistemBimbinganAddModal, setValueSistemBimbinganAddModal] =
    useState<any>("");
  const [valueSistemBimbinganEditModal, setValueSistemBimbinganEditModal] =
    useState<any>("");
  const [
    selectedSistemBimbinganEditModal,
    setSelectedSistemBimbinganEditModal,
  ] = useState<any>({});
  const [
    selectedSistemBimbinganDeleteModal,
    setSelectedSistemBimbinganDeleteModal,
  ] = useState<any>({});

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

  const openModal = (type: any, data = null) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setValuePeminatanAddModal("");
    setValuePeminatanEditModal("");
    setValueJenisBimbinganAddModal("");
    setValueJenisBimbinganEditModal("");
    setValueTopikBimbinganPribadiAddModal("");
    setValueTopikBimbinganPribadiEditModal("");
    setValueSistemBimbinganAddModal("");
    setValueSistemBimbinganEditModal("");
  };

  const handleDragEndPeminatan = (event: any) => {
    const { active, over } = event;

    if (!over) {
      setAfterOrderEditDataPeminatan([...dataPeminatan]);
      return;
    }

    if (!over) {
      setAfterOrderEditDataPeminatan([...dataPeminatan]);
      return;
    }

    if (over !== null) {
      const oldIndex = afterOrderEditDataPeminatan.findIndex(
        (item: any) => item.id === +active.id
      );
      const newIndex = afterOrderEditDataPeminatan.findIndex(
        (item: any) => item.id === +over.id
      );
      if (oldIndex !== -1 && newIndex !== -1) {
        // Salin array dataPeminatan
        const newDataPeminatan = [...afterOrderEditDataPeminatan];

        // Perbarui properti order di dalam dataPeminatan
        const updatedData = newDataPeminatan.map((item, index) => {
          if (index === oldIndex) {
            return { ...item, order: newIndex + 1 }; // Set order ke posisi baru
          }
          if (index === newIndex) {
            return { ...item, order: oldIndex + 1 }; // Set order ke posisi lama
          }
          return item; // Tidak ubah item lainnya
        });
        const sortedDataPeminatan = updatedData.sort(
          (a, b) => a.order - b.order
        );
        setAfterOrderEditDataPeminatan(sortedDataPeminatan);
        setIsEditOrder(true);
      }
    }
  };

  const handleDragEndJenisBimbingan = (event: any) => {
    const { active, over } = event;

    if (!over) {
      setAfterOrderEditDataJenisBimbingan([...dataJenisBimbingan]);
      return;
    }

    if (!over) {
      setAfterOrderEditDataJenisBimbingan([...dataJenisBimbingan]);
      return;
    }

    if (over !== null) {
      const oldIndex = afterOrderEditDataJenisBimbingan.findIndex(
        (item: any) => item.id === +active.id
      );
      const newIndex = afterOrderEditDataJenisBimbingan.findIndex(
        (item: any) => item.id === +over.id
      );
      if (oldIndex !== -1 && newIndex !== -1) {
        // Salin array dataJenisBimbingan
        const newDataJenisBimbingan = [...afterOrderEditDataJenisBimbingan];

        // Perbarui properti order di dalam dataJenisBimbingan
        const updatedData = newDataJenisBimbingan.map((item, index) => {
          if (index === oldIndex) {
            return { ...item, order: newIndex + 1 }; // Set order ke posisi baru
          }
          if (index === newIndex) {
            return { ...item, order: oldIndex + 1 }; // Set order ke posisi lama
          }
          return item; // Tidak ubah item lainnya
        });
        const sortedDataJenisBimbingan = updatedData.sort(
          (a, b) => a.order - b.order
        );
        setAfterOrderEditDataJenisBimbingan(sortedDataJenisBimbingan);
        setIsEditOrder(true);
      }
    }
  };
  const handleDragEndTopikBimbinganPribadi = (event: any) => {
    const { active, over } = event;

    if (!over) {
      setAfterOrderEditDataTopikBimbinganPribadi([
        ...dataTopikBimbinganPribadi,
      ]);
      return;
    }

    if (!over) {
      setAfterOrderEditDataTopikBimbinganPribadi([
        ...dataTopikBimbinganPribadi,
      ]);
      return;
    }

    if (over !== null) {
      const oldIndex = afterOrderEditDataTopikBimbinganPribadi.findIndex(
        (item: any) => item.id === +active.id
      );
      const newIndex = afterOrderEditDataTopikBimbinganPribadi.findIndex(
        (item: any) => item.id === +over.id
      );
      if (oldIndex !== -1 && newIndex !== -1) {
        // Salin array dataTopikBimbinganPribadi
        const newDataTopikBimbinganPribadi = [
          ...afterOrderEditDataTopikBimbinganPribadi,
        ];

        // Perbarui properti order di dalam dataTopikBimbinganPribadi
        const updatedData = newDataTopikBimbinganPribadi.map((item, index) => {
          if (index === oldIndex) {
            return { ...item, order: newIndex + 1 }; // Set order ke posisi baru
          }
          if (index === newIndex) {
            return { ...item, order: oldIndex + 1 }; // Set order ke posisi lama
          }
          return item; // Tidak ubah item lainnya
        });
        const sortedDataTopikBimbinganPribadi = updatedData.sort(
          (a, b) => a.order - b.order
        );
        setAfterOrderEditDataTopikBimbinganPribadi(
          sortedDataTopikBimbinganPribadi
        );
        setIsEditOrder(true);
      }
    }
  };

  const handleDragEndSistemBimbingan = (event: any) => {
    const { active, over } = event;

    if (!over) {
      setAfterOrderEditDataSistemBimbingan([...dataSistemBimbingan]);
      return;
    }

    if (!over) {
      setAfterOrderEditDataSistemBimbingan([...dataSistemBimbingan]);
      return;
    }

    if (over !== null) {
      const oldIndex = afterOrderEditDataSistemBimbingan.findIndex(
        (item: any) => item.id === +active.id
      );
      const newIndex = afterOrderEditDataSistemBimbingan.findIndex(
        (item: any) => item.id === +over.id
      );
      if (oldIndex !== -1 && newIndex !== -1) {
        // Salin array dataSistemBimbingan
        const newDataSistemBimbingan = [...afterOrderEditDataSistemBimbingan];

        // Perbarui properti order di dalam dataSistemBimbingan
        const updatedData = newDataSistemBimbingan.map((item, index) => {
          if (index === oldIndex) {
            return { ...item, order: newIndex + 1 }; // Set order ke posisi baru
          }
          if (index === newIndex) {
            return { ...item, order: oldIndex + 1 }; // Set order ke posisi lama
          }
          return item; // Tidak ubah item lainnya
        });
        const sortedDataSistemBimbingan = updatedData.sort(
          (a, b) => a.order - b.order
        );
        setAfterOrderEditDataSistemBimbingan(sortedDataSistemBimbingan);
        setIsEditOrder(true);
      }
    }
  };

  const areArraysEqual = (arr1: any, arr2: any) => {
    if (arr1.length !== arr2.length) return false;
    return arr1.every(
      (item: any, index: any) =>
        JSON.stringify(item) === JSON.stringify(arr2[index])
    );
  };

  const patchPeminatanOrder = async (updatedOrder: any) => {
    try {
      const dataJurusan = await axios.post(`${API_BASE_URL}/api/datajurusan`);

      const jurusan = dataJurusan.data.find(
        (data: any) => data.nama_program_studi === selectedJurusan
      );

      if (!jurusan) {
        throw new Error("Jurusan tidak ditemukan");
      }

      const jurusanid = jurusan.id;

      const response = await axios.patch(
        `${API_BASE_URL}/api/datapeminatan/${jurusanid}/updateorder`,
        {
          ...updatedOrder,
        }
      );
      getDataPeminatanByJurusan(selectedJurusan);
      setIsEditOrder(false);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const patchJenisBimbinganOrder = async (updatedOrder: any) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/datajenisbimbingan/updateorder`,
        {
          ...updatedOrder,
        }
      );

      getDataJenisBimbingan();
      setIsEditOrder(false);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  const patchTopikBimbinganPribadiOrder = async (updatedOrder: any) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/datatopikbimbinganpribadi/updateorder`,
        {
          ...updatedOrder,
        }
      );

      getDataTopikBimbinganPribadi();
      setIsEditOrder(false);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const patchSistemBimbinganOrder = async (updatedOrder: any) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/datasistembimbingan/updateorder`,
        {
          ...updatedOrder,
        }
      );

      getDataSistemBimbingan();
      setIsEditOrder(false);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleSavePeminatanOrder = async () => {
    try {
      const result = await patchPeminatanOrder(afterOrderEditDataPeminatan);
    } catch (error) {}
  };

  const handleSaveJenisBimbinganOrder = async () => {
    try {
      const result = await patchJenisBimbinganOrder(
        afterOrderEditDataJenisBimbingan
      );
    } catch (error) {}
  };

  const handleSaveTopikBimbinganPribadiOrder = async () => {
    try {
      const result = await patchTopikBimbinganPribadiOrder(
        afterOrderEditDataTopikBimbinganPribadi
      );
    } catch (error) {}
  };

  const handleSaveSistemBimbinganOrder = async () => {
    try {
      const result = await patchSistemBimbinganOrder(
        afterOrderEditDataSistemBimbingan
      );
    } catch (error) {}
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

  const getDataPeminatanByJurusan = async (selectedJurusan: any) => {
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
      if (data.length === 0) {
        setAfterOrderEditDataPeminatan([]);
      }
    } catch (error) {
      throw error;
    }
  };

  const getDataJenisBimbingan = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/datajenisbimbingan`
      );

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      const sortedDataJenisBimbingan = data.sort(
        (a: any, b: any) => a.order - b.order
      );
      setDataJenisBimbingan(sortedDataJenisBimbingan);
      if (data.length === 0) {
        setAfterOrderEditDataJenisBimbingan([]);
      }
    } catch (error) {
      throw error;
    }
  };

  const getDataTopikBimbinganPribadi = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/datatopikbimbinganpribadi`
      );

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      const sortedDataTopikBimbinganPribadi = data.sort(
        (a: any, b: any) => a.order - b.order
      );
      setDataTopikBimbinganPribadi(sortedDataTopikBimbinganPribadi);
      if (data.length === 0) {
        setAfterOrderEditDataTopikBimbinganPribadi([]);
      }
    } catch (error) {
      throw error;
    }
  };

  const getDataSistemBimbingan = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/datasistembimbingan`
      );

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      const sortedDataSistemBimbingan = data.sort(
        (a: any, b: any) => a.order - b.order
      );
      setDataSistemBimbingan(sortedDataSistemBimbingan);
      if (data.length === 0) {
        setAfterOrderEditDataSistemBimbingan([]);
      }
    } catch (error) {
      throw error;
    }
  };

  function DraggableRow({ id, index, data, parameter }: any) {
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

    if (parameter === "Peminatan") {
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
          <td className="border-b border-gray-200 px-4 w-1/2 py-2">
            {data.peminatan}
          </td>
          <td className="border-b border-gray-200 px-4 py-4">
            <div className="flex gap-2 items-center justify-center">
              <EditButton
                onClick={() => {
                  setValuePeminatanEditModal(data.peminatan);
                  setSelectedPeminatanEditModal(data);
                  openModal("Edit");
                }}
                className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
              />
              <TrashButton
                onClick={() => {
                  setSelectedPeminatanDeleteModal(data);
                  openModal("Delete");
                }}
                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
              />
            </div>
          </td>
          <DragOverlay>
            {isDragging ? (
              <>
                <table className="min-w-full text-[16px] border-collapse table-fixed bg-white bg-opacity-10 backdrop-blur-sm rounded-lg">
                  <thead className="hidden">
                    <tr className="bg-gray-100 text-center">
                      <th className="px-4 py-2 pl-10 w-1/4 rounded-tl-lg rounded-bl-lg">
                        No
                      </th>
                      <th className="px-4 py-2 w-1/2">Peminatan</th>
                      <th className="px-4 py-2 w-1/4 rounded-tr-lg rounded-br-lg">
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
                      <td className="px-4 py-2 w-1/2">{data.peminatan}</td>
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
              </>
            ) : null}
          </DragOverlay>
        </tr>
      );
    } else if (parameter === "Jenis Bimbingan") {
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
          <td className="border-b border-gray-200 px-4 w-1/2 py-2">
            {data.jenis_bimbingan}
          </td>
          <td className="border-b border-gray-200 px-4 py-4">
            <div className="flex gap-2 items-center justify-center">
              <EditButton
                onClick={() => {
                  setValueJenisBimbinganEditModal(data.jenis_bimbingan);
                  setSelectedJenisBimbinganEditModal(data);
                  openModal("Edit");
                }}
                className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
              />
              <TrashButton
                onClick={() => {
                  setSelectedJenisBimbinganDeleteModal(data);
                  openModal("Delete");
                }}
                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
              />
            </div>
          </td>
          <DragOverlay>
            {isDragging ? (
              <>
                <table className="min-w-full text-[16px] border-collapse table-fixed bg-white bg-opacity-10 backdrop-blur-sm rounded-lg">
                  <thead className="hidden">
                    <tr className="bg-gray-100 text-center">
                      <th className="px-4 py-2 pl-10 w-1/4 rounded-tl-lg rounded-bl-lg">
                        No
                      </th>
                      <th className="px-4 py-2 w-1/2">Jenis Bimbingan</th>
                      <th className="px-4 py-2 w-1/4 rounded-tr-lg rounded-br-lg">
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
                      <td className="px-4 py-2 w-1/2">
                        {data.jenis_bimbingan}
                      </td>
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
              </>
            ) : null}
          </DragOverlay>
        </tr>
      );
    } else if (parameter === "Topik Bimbingan Pribadi") {
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
          <td className="border-b border-gray-200 px-4 w-1/2 py-2">
            {data.topik_bimbingan}
          </td>
          <td className="border-b border-gray-200 px-4 py-4">
            <div className="flex gap-2 items-center justify-center">
              <EditButton
                onClick={() => {
                  setValueTopikBimbinganPribadiEditModal(data.topik_bimbingan);
                  setSelectedTopikBimbinganPribadiEditModal(data);
                  openModal("Edit");
                }}
                className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
              />
              <TrashButton
                onClick={() => {
                  setSelectedTopikBimbinganPribadiDeleteModal(data);
                  openModal("Delete");
                }}
                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
              />
            </div>
          </td>
          <DragOverlay>
            {isDragging ? (
              <>
                <table className="min-w-full text-[16px] border-collapse table-fixed bg-white bg-opacity-10 backdrop-blur-sm rounded-lg">
                  <thead className="hidden">
                    <tr className="bg-gray-100 text-center">
                      <th className="px-4 py-2 pl-10 w-1/4 rounded-tl-lg rounded-bl-lg">
                        No
                      </th>
                      <th className="px-4 py-2 w-1/2">Topik Bimbingan</th>
                      <th className="px-4 py-2 w-1/4 rounded-tr-lg rounded-br-lg">
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
                      <td className="px-4 py-2 w-1/2">
                        {data.topik_bimbingan}
                      </td>
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
              </>
            ) : null}
          </DragOverlay>
        </tr>
      );
    } else if (parameter === "Sistem Bimbingan") {
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
          <td className="border-b border-gray-200 px-4 w-1/2 py-2">
            {data.sistem_bimbingan}
          </td>
          <td className="border-b border-gray-200 px-4 py-4">
            <div className="flex gap-2 items-center justify-center">
              <EditButton
                onClick={() => {
                  setValueSistemBimbinganEditModal(data.sistem_bimbingan);
                  setSelectedSistemBimbinganEditModal(data);
                  openModal("Edit");
                }}
                className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
              />
              <TrashButton
                onClick={() => {
                  setSelectedSistemBimbinganDeleteModal(data);
                  openModal("Delete");
                }}
                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
              />
            </div>
          </td>
          <DragOverlay>
            {isDragging ? (
              <>
                <table className="min-w-full text-[16px] border-collapse table-fixed bg-white bg-opacity-10 backdrop-blur-sm rounded-lg">
                  <thead className="hidden">
                    <tr className="bg-gray-100 text-center">
                      <th className="px-4 py-2 pl-10 w-1/4 rounded-tl-lg rounded-bl-lg">
                        No
                      </th>
                      <th className="px-4 py-2 w-1/2">Sistem Bimbingan</th>
                      <th className="px-4 py-2 w-1/4 rounded-tr-lg rounded-br-lg">
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
                      <td className="px-4 py-2 w-1/2">
                        {data.sistem_bimbingan}
                      </td>
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
              </>
            ) : null}
          </DragOverlay>
        </tr>
      );
    }
  }

  const addPeminatan = async (newData: any) => {
    try {
      const dataJurusan = await axios.post(`${API_BASE_URL}/api/datajurusan`);

      const jurusan = dataJurusan.data.find(
        (data: any) => data.nama_program_studi === selectedJurusan
      );

      if (!jurusan) {
        throw new Error("Jurusan tidak ditemukan");
      }

      const jurusanid = jurusan.id_program_studi;

      const response = await axios.post(
        `${API_BASE_URL}/api/datapeminatan/${jurusanid}`,
        newData
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const patchPeminatan = async (updatedData: any) => {
    try {
      const dataJurusan = await axios.post(`${API_BASE_URL}/api/datajurusan`);

      const jurusan = dataJurusan.data.find(
        (data: any) => data.jurusan === selectedJurusan
      );

      if (!jurusan) {
        throw new Error("Jurusan tidak ditemukan");
      }

      const jurusanid = jurusan.id;

      const response = await axios.patch(
        `${API_BASE_URL}/api/datapeminatan/${jurusanid}`,
        updatedData
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const deletePeminatan = async (deletedData: any) => {
    try {
      const dataJurusan = await axios.post(`${API_BASE_URL}/api/datajurusan`);

      const jurusan = dataJurusan.data.find(
        (data: any) => data.jurusan === selectedJurusan
      );

      if (!jurusan) {
        throw new Error("Jurusan tidak ditemukan");
      }

      const jurusanid = jurusan.id;

      const response = await axios.delete(
        `${API_BASE_URL}/api/datapeminatan/${jurusanid}`,
        { data: deletedData }
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleAddPeminatan = async (e: any) => {
    e.preventDefault();

    try {
      let peminatanValue = {
        peminatan: valuePeminatanAddModal,
        order: dataPeminatan.length + 1,
      };

      const result = await addPeminatan(peminatanValue);

      getDataPeminatanByJurusan(selectedJurusan);
      setIsEditOrder(false);
      closeModal();
    } catch (error) {}
  };

  const handleEditPeminatan = async (id: any) => {
    try {
      let peminatanValue = {
        id,
        peminatan: valuePeminatanEditModal,
      };

      const result = await patchPeminatan(peminatanValue);
      getDataPeminatanByJurusan(selectedJurusan);
      setIsEditOrder(false);
      closeModal();
    } catch (error) {}
  };

  const handleDeletePeminatan = async (id: any) => {
    try {
      let peminatanValue = {
        id,
      };

      const result = await deletePeminatan(peminatanValue);
      getDataPeminatanByJurusan(selectedJurusan);
      closeModal();
    } catch (error) {}
  };

  const addJenisBimbingan = async (newData: any) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/datajenisbimbingan`,
        newData
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const addTopikBimbinganPribadi = async (newData: any) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/datatopikbimbinganpribadi`,
        newData
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const patchJenisBimbingan = async (updatedData: any) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/datajenisbimbingan`,
        updatedData
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const patchTopikBimbinganPribadi = async (updatedData: any) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/datatopikbimbinganpribadi`,
        updatedData
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteJenisBimbingan = async (deletedData: any) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/datajenisbimbingan`,
        { data: deletedData }
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteTopikBimbinganPribadi = async (deletedData: any) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/datatopikbimbinganpribadi`,
        { data: deletedData }
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleAddJenisBimbingan = async (e: any) => {
    e.preventDefault();

    try {
      let jenisBimbinganValue = {
        jenis_bimbingan: valueJenisBimbinganAddModal,
        order: dataJenisBimbingan.length + 1,
      };

      const result = await addJenisBimbingan(jenisBimbinganValue);

      getDataJenisBimbingan();
      setIsEditOrder(false);
      closeModal();
    } catch (error) {}
  };

  const handleEditJenisBimbingan = async (id: any) => {
    try {
      let jenisBimbinganValue = {
        id,
        jenis_bimbingan: valueJenisBimbinganEditModal,
      };

      const result = await patchJenisBimbingan(jenisBimbinganValue);
      getDataJenisBimbingan();
      setIsEditOrder(false);
      closeModal();
    } catch (error) {}
  };

  const handleDeleteJenisBimbingan = async (id: any) => {
    try {
      let jenisBimbinganValue = {
        id,
      };

      const result = await deleteJenisBimbingan(jenisBimbinganValue);
      getDataJenisBimbingan();
      closeModal();
    } catch (error) {}
  };

  const handleAddTopikBimbinganPribadi = async (e: any) => {
    e.preventDefault();

    try {
      let topikBimbinganPribadiValue = {
        topik_bimbingan: valueTopikBimbinganPribadiAddModal,
        order: dataTopikBimbinganPribadi.length + 1,
      };

      const result = await addTopikBimbinganPribadi(topikBimbinganPribadiValue);

      getDataTopikBimbinganPribadi();
      setIsEditOrder(false);
      closeModal();
    } catch (error) {}
  };

  const handleEditTopikBimbinganPribadi = async (id: any) => {
    try {
      let topikBimbinganPribadiValue = {
        id,
        topik_bimbingan: valueTopikBimbinganPribadiEditModal,
      };

      const result = await patchTopikBimbinganPribadi(
        topikBimbinganPribadiValue
      );
      getDataTopikBimbinganPribadi();
      setIsEditOrder(false);
      closeModal();
    } catch (error) {}
  };

  const handleDeleteTopikBimbinganPribadi = async (id: any) => {
    try {
      let topikBimbinganPribadiValue = {
        id,
      };

      const result = await deleteTopikBimbinganPribadi(
        topikBimbinganPribadiValue
      );
      getDataTopikBimbinganPribadi();
      closeModal();
    } catch (error) {}
  };

  const addSistemBimbingan = async (newData: any) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/datasistembimbingan`,
        newData
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const patchSistemBimbingan = async (updatedData: any) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/datasistembimbingan`,
        updatedData
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteSistemBimbingan = async (deletedData: any) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/datasistembimbingan`,
        { data: deletedData }
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleAddSistemBimbingan = async (e: any) => {
    e.preventDefault();

    try {
      let sistemBimbinganValue = {
        sistem_bimbingan: valueSistemBimbinganAddModal,
        order: dataSistemBimbingan.length + 1,
      };

      const result = await addSistemBimbingan(sistemBimbinganValue);

      getDataSistemBimbingan();
      setIsEditOrder(false);
      closeModal();
    } catch (error) {}
  };

  const handleEditSistemBimbingan = async (id: any) => {
    try {
      let sistemBimbinganValue = {
        id,
        sistem_bimbingan: valueSistemBimbinganEditModal,
      };

      const result = await patchSistemBimbingan(sistemBimbinganValue);
      getDataSistemBimbingan();
      setIsEditOrder(false);
      closeModal();
    } catch (error) {}
  };

  const handleDeleteSistemBimbingan = async (id: any) => {
    try {
      let sistemBimbinganValue = {
        id,
      };

      const result = await deleteSistemBimbingan(sistemBimbinganValue);
      getDataSistemBimbingan();
      closeModal();
    } catch (error) {}
  };

  useEffect(() => {
    if (dataJurusan.length > 0) {
      const formattedOptions = dataJurusan.map((data: any) => {
        return {
          value: data.nama_program_studi,
          label: data.nama_program_studi,
        };
      });

      setOptionsJurusan(formattedOptions);

      const afterOrder = dataJurusan.map((data: any) => {
        return {
          ...data,
        };
      });
      setAfterOrderEditDataJurusan(afterOrder);
    }
  }, [dataJurusan]);

  useEffect(() => {
    if (dataPeminatan.length > 0) {
      const afterOrder = dataPeminatan.map((data: any) => {
        return {
          ...data,
        };
      });
      setAfterOrderEditDataPeminatan(afterOrder);
    }
  }, [dataPeminatan]);

  useEffect(() => {
    if (dataJenisBimbingan.length > 0) {
      const afterOrder = dataJenisBimbingan.map((data: any) => {
        return {
          ...data,
        };
      });
      setAfterOrderEditDataJenisBimbingan(afterOrder);
    }
  }, [dataJenisBimbingan]);

  useEffect(() => {
    if (dataTopikBimbinganPribadi.length > 0) {
      const afterOrder = dataTopikBimbinganPribadi.map((data: any) => {
        return {
          ...data,
        };
      });
      setAfterOrderEditDataTopikBimbinganPribadi(afterOrder);
    }
  }, [dataTopikBimbinganPribadi]);

  useEffect(() => {
    if (dataSistemBimbingan.length > 0) {
      const afterOrder = dataSistemBimbingan.map((data: any) => {
        return {
          ...data,
        };
      });
      setAfterOrderEditDataSistemBimbingan(afterOrder);
    }
  }, [dataSistemBimbingan]);

  useEffect(() => {
    if (selectedJurusan !== "") {
      setIsEditOrder(false);
      setAfterOrderEditDataPeminatan([]);
      getDataPeminatanByJurusan(selectedJurusan);
    }
  }, [selectedJurusan]);

  useEffect(() => {
    setSelectedJurusan("");
  }, [selectedParameter]);

  useEffect(() => {
    setSelectedParameter("");
  }, [activeNavbar]);

  useEffect(() => {
    if (selectedParameter === "Peminatan" && selectedJurusan !== "") {
      if (afterOrderEditDataPeminatan.length === 0) {
        setIsLoading(true);
        const timeout = setTimeout(() => {
          setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timeout);
      }
    } else if (selectedParameter === "Jenis Bimbingan") {
      if (afterOrderEditDataJenisBimbingan.length === 0) {
        setIsLoading(true);
        const timeout = setTimeout(() => {
          setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timeout);
      }
    } else if (selectedParameter === "Topik Bimbingan Pribadi") {
      if (afterOrderEditDataTopikBimbinganPribadi.length === 0) {
        setIsLoading(true);
        const timeout = setTimeout(() => {
          setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timeout);
      }
    } else if (selectedParameter === "Sistem Bimbingan") {
      if (afterOrderEditDataSistemBimbingan.length === 0) {
        setIsLoading(true);
        const timeout = setTimeout(() => {
          setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timeout);
      }
    }
  }, [
    afterOrderEditDataPeminatan,
    afterOrderEditDataJenisBimbingan,
    afterOrderEditDataTopikBimbinganPribadi,
    afterOrderEditDataSistemBimbingan,
    selectedParameter,
    selectedJurusan,
  ]);

  useEffect(() => {
    getDataJurusan();
    getDataJenisBimbingan();
    getDataTopikBimbinganPribadi();
    getDataSistemBimbingan();
  }, [activeNavbar]);

  return (
    <div className="p-8 h-[1000px] border">
      <div className="flex">
        <SelectField
          options={[
            { value: "Peminatan", label: "Peminatan" },
            { value: "Jenis Bimbingan", label: "Jenis Bimbingan" },
            {
              value: "Topik Bimbingan Pribadi",
              label: "Topik Bimbingan Pribadi",
            },
            { value: "Sistem Bimbingan", label: "Sistem Bimbingan" },
          ]}
          onChange={(e) => setSelectedParameter(e.target.value)}
          value={selectedParameter}
          placeholder="Pilih Parameter"
          className={`px-3 py-2 text-[14px] border rounded-lg focus:outline-none appearance-none w-[200px]`}
        />
      </div>
      <div
        className={`border rounded-lg mt-8 p-6 ${selectedParameter === "" && "hidden"}`}
      >
        {selectedParameter === "Peminatan" && (
          <div className="flex">
            <SelectField
              options={optionsJurusan}
              onChange={(e) => setSelectedJurusan(e.target.value)}
              value={selectedJurusan}
              placeholder="Pilih Jurusan"
              className={`px-3 ml-2 mt-2 py-2 text-[14px] border rounded-lg focus:outline-none appearance-none w-[200px]`}
            />
          </div>
        )}
        <p className="text-[18px] font-semibold">
          {selectedParameter !== "Peminatan" ? `List ${selectedParameter}` : ""}
        </p>
        {selectedParameter === "Peminatan" && selectedJurusan !== "" && (
          <p className="text-[18px] mt-4 ml-4 font-semibold">
            {`List ${selectedParameter}`}
          </p>
        )}
        {selectedParameter === "Peminatan" && selectedJurusan !== "" && (
          <div className="mt-4">
            {afterOrderEditDataPeminatan.length === 0 ? (
              <>
                <button
                  onClick={() => {
                    openModal("Tambah");
                  }}
                  className="flex px-3 mr-4 py-2 bg-orange-500 items-center gap-2 rounded-lg ml-auto hover:bg-orange-600"
                >
                  <Image src={plusIcon} alt="Plus Icon" />
                  <p className="text-white text-[14px]">Tambah Peminatan</p>
                </button>
                <div className="overflow-x-auto mt-6 mb-6">
                  <DndContext onDragEnd={handleDragEndPeminatan}>
                    <SortableContext
                      items={afterOrderEditDataPeminatan.map(
                        (item: any) => item.id
                      )}
                    >
                      <table className="min-w-full text-[16px] border-collapse table-fixed">
                        <thead>
                          <tr className="bg-gray-100 text-center">
                            <th className="px-4 py-2 pl-10 rounded-tl-lg rounded-bl-lg ">
                              No
                            </th>
                            <th className="px-4 py-2 w-1/2">Peminatan</th>
                            <th className="px-4 py-2 w-1/4 rounded-tr-lg rounded-br-lg ">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
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
                          </tr>
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
                  <p className="text-white text-[14px]">Tambah Peminatan</p>
                </button>
                <div className="overflow-x-auto mt-6 mb-6">
                  <DndContext onDragEnd={handleDragEndPeminatan}>
                    <SortableContext
                      items={afterOrderEditDataPeminatan.map(
                        (item: any) => item.id
                      )}
                    >
                      <table className="min-w-full text-[16px] border-collapse table-fixed">
                        <thead>
                          <tr className="bg-gray-100 text-center">
                            <th className="px-4 py-2 pl-10 w-1/4 rounded-tl-lg rounded-bl-lg">
                              No
                            </th>
                            <th className="px-4 py-2 w-1/2">Peminatan</th>
                            <th className="px-4 py-2 rounded-tr-lg w-1/4 rounded-br-lg">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {afterOrderEditDataPeminatan.map(
                            (data: any, index: any) => (
                              <DraggableRow
                                key={data.id}
                                id={data.id.toString()}
                                index={index}
                                data={data}
                                parameter="Peminatan"
                              />
                            )
                          )}
                        </tbody>
                      </table>
                    </SortableContext>
                  </DndContext>
                </div>
                <div className="flex ml-auto mt-6 justify-end gap-4">
                  <button
                    className={`flex px-3 py-2 w-[90px] justify-center bg-green-500 items-center gap-2 rounded-lg hover:bg-green-600 ${areArraysEqual(dataPeminatan, afterOrderEditDataPeminatan) || !isEditOrder ? "hidden" : ""}`}
                    onClick={() => handleSavePeminatanOrder()}
                  >
                    <p className="text-white text-[14px]">Save</p>
                    <Image src={saveIcon} className="size-4" alt="Save Icon" />
                  </button>
                  <button
                    className={`flex px-3 py-2 bg-red-500 w-[90px] justify-center items-center gap-2 rounded-lg hover:bg-red-600 ${areArraysEqual(dataPeminatan, afterOrderEditDataPeminatan) || !isEditOrder ? "hidden" : ""}`}
                    onClick={() => {
                      const afterOrder = dataPeminatan.map((data: any) => {
                        return {
                          ...data,
                        };
                      });
                      setIsEditOrder(false);
                      setAfterOrderEditDataPeminatan(afterOrder);
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
              onAdd={handleAddPeminatan}
              onEdit={handleEditPeminatan}
              onDelete={handleDeletePeminatan}
              title={`${modalType === "Delete" ? "Konfirmasi Penghapusan Peminatan" : `${modalType} Peminatan`}`}
              modalType={modalType}
              initialData={
                modalType === "Delete"
                  ? selectedPeminatanDeleteModal
                  : modalType === "Edit"
                    ? selectedPeminatanEditModal
                    : null
              }
            >
              {modalType === "Tambah" && (
                <form>
                  <InputField
                    type="text"
                    placeholder="Masukkan peminatan"
                    onChange={(e) => {
                      setValuePeminatanAddModal(e.target.value);
                    }}
                    disabled={false}
                    value={valuePeminatanAddModal}
                    className="px-3 py-2 text-[15px] w-1/2 focus:outline-none border rounded-lg"
                  />
                </form>
              )}
              {modalType === "Edit" && (
                <form>
                  <InputField
                    type="text"
                    placeholder="Masukkan peminatan"
                    onChange={(e) => {
                      setValuePeminatanEditModal(e.target.value);
                    }}
                    disabled={false}
                    value={valuePeminatanEditModal}
                    className="px-3 py-2 text-[15px] w-1/2 focus:outline-none border rounded-lg"
                  />
                </form>
              )}
              {modalType === "Delete" && (
                <p>
                  Apakah Anda yakin ingin menghapus peminatan [
                  {selectedPeminatanDeleteModal.peminatan}] ?
                </p>
              )}
            </Modal>
          </div>
        )}
        {selectedParameter === "Jenis Bimbingan" && (
          <div className="mt-6">
            {afterOrderEditDataJenisBimbingan.length === 0 ? (
              <>
                <button
                  onClick={() => {
                    openModal("Tambah");
                  }}
                  className="flex px-3 mr-4 py-2 bg-orange-500 items-center gap-2 rounded-lg ml-auto hover:bg-orange-600"
                >
                  <Image src={plusIcon} alt="Plus Icon" />
                  <p className="text-white text-[14px]">
                    Tambah Jenis Bimbingan
                  </p>
                </button>
                <div className="overflow-x-auto mt-6 mb-6">
                  <DndContext onDragEnd={handleDragEndJenisBimbingan}>
                    <SortableContext
                      items={afterOrderEditDataJenisBimbingan.map(
                        (item: any) => item.id
                      )}
                    >
                      <table className="min-w-full text-[16px] border-collapse table-fixed">
                        <thead>
                          <tr className="bg-gray-100 text-center">
                            <th className="px-4 py-2 pl-10 rounded-tl-lg rounded-bl-lg ">
                              No
                            </th>
                            <th className="px-4 py-2 w-1/2">Jenis Bimbingan</th>
                            <th className="px-4 py-2 w-1/4 rounded-tr-lg rounded-br-lg ">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
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
                          </tr>
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
                  <p className="text-white text-[14px]">
                    Tambah Jenis Bimbingan
                  </p>
                </button>
                <div className="overflow-x-auto mt-6 mb-6">
                  <DndContext onDragEnd={handleDragEndJenisBimbingan}>
                    <SortableContext
                      items={afterOrderEditDataJenisBimbingan.map(
                        (item: any) => item.id
                      )}
                    >
                      <table className="min-w-full text-[16px] border-collapse table-fixed">
                        <thead>
                          <tr className="bg-gray-100 text-center">
                            <th className="px-4 py-2 pl-10 w-1/4 rounded-tl-lg rounded-bl-lg">
                              No
                            </th>
                            <th className="px-4 py-2 w-1/2">Jenis Bimbingan</th>
                            <th className="px-4 py-2 w-1/4 rounded-tr-lg rounded-br-lg">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {afterOrderEditDataJenisBimbingan.map(
                            (data: any, index: any) => (
                              <DraggableRow
                                key={data.id}
                                id={data.id.toString()}
                                index={index}
                                data={data}
                                parameter="Jenis Bimbingan"
                              />
                            )
                          )}
                        </tbody>
                      </table>
                    </SortableContext>
                  </DndContext>
                </div>
                <div className="flex ml-auto my-8 justify-end gap-4">
                  <button
                    className={`flex px-3 py-2 w-[90px] justify-center bg-green-500 items-center gap-2 rounded-lg hover:bg-green-600 ${areArraysEqual(dataJenisBimbingan, afterOrderEditDataJenisBimbingan) || !isEditOrder ? "hidden" : ""}`}
                    onClick={() => handleSaveJenisBimbinganOrder()}
                  >
                    <p className="text-white text-[14px]">Save</p>
                    <Image src={saveIcon} className="size-4" alt="Save Icon" />
                  </button>
                  <button
                    className={`flex px-3 py-2 bg-red-500 w-[90px] justify-center items-center gap-2 rounded-lg hover:bg-red-600 ${areArraysEqual(dataJenisBimbingan, afterOrderEditDataJenisBimbingan) || !isEditOrder ? "hidden" : ""}`}
                    onClick={() => {
                      const afterOrder = dataJenisBimbingan.map((data: any) => {
                        return {
                          ...data,
                        };
                      });
                      setAfterOrderEditDataJenisBimbingan(afterOrder);
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
              onAdd={handleAddJenisBimbingan}
              onEdit={handleEditJenisBimbingan}
              onDelete={handleDeleteJenisBimbingan}
              title={`${modalType === "Delete" ? "Konfirmasi Penghapusan Jenis Bimbingan" : `${modalType} Jenis Bimbingan`}`}
              modalType={modalType}
              initialData={
                modalType === "Delete"
                  ? selectedJenisBimbinganDeleteModal
                  : modalType === "Edit"
                    ? selectedJenisBimbinganEditModal
                    : null
              }
            >
              {modalType === "Tambah" && (
                <form>
                  <InputField
                    type="text"
                    placeholder="Masukkan jenis bimbingan"
                    onChange={(e) => {
                      setValueJenisBimbinganAddModal(e.target.value);
                    }}
                    disabled={false}
                    value={valueJenisBimbinganAddModal}
                    className="px-3 py-2 text-[15px] w-2/3 focus:outline-none border rounded-lg"
                  />
                </form>
              )}
              {modalType === "Edit" && (
                <form>
                  <InputField
                    type="text"
                    placeholder="Masukkan jenis bimbingan"
                    onChange={(e) => {
                      setValueJenisBimbinganEditModal(e.target.value);
                    }}
                    disabled={false}
                    value={valueJenisBimbinganEditModal}
                    className="px-3 py-2 text-[15px] w-2/3 focus:outline-none border rounded-lg"
                  />
                </form>
              )}
              {modalType === "Delete" && (
                <p>
                  Apakah Anda yakin ingin menghapus jenis bimbingan [
                  {selectedJenisBimbinganDeleteModal.jenis_bimbingan}] ?
                </p>
              )}
            </Modal>
          </div>
        )}
        {selectedParameter === "Topik Bimbingan Pribadi" && (
          <div className="mt-6">
            {afterOrderEditDataTopikBimbinganPribadi.length === 0 ? (
              <>
                <button
                  onClick={() => {
                    openModal("Tambah");
                  }}
                  className="flex px-3 mr-4 py-2 bg-orange-500 items-center gap-2 rounded-lg ml-auto hover:bg-orange-600"
                >
                  <Image src={plusIcon} alt="Plus Icon" />
                  <p className="text-white text-[14px]">
                    Tambah Topik Bimbingan
                  </p>
                </button>
                <div className="overflow-x-auto mt-6 mb-6">
                  <DndContext onDragEnd={handleDragEndTopikBimbinganPribadi}>
                    <SortableContext
                      items={afterOrderEditDataTopikBimbinganPribadi.map(
                        (item: any) => item.id
                      )}
                    >
                      <table className="min-w-full text-[16px] border-collapse table-fixed">
                        <thead>
                          <tr className="bg-gray-100 text-center">
                            <th className="px-4 py-2 pl-10 rounded-tl-lg rounded-bl-lg ">
                              No
                            </th>
                            <th className="px-4 py-2 w-1/2">Topik Bimbingan</th>
                            <th className="px-4 py-2 w-1/4 rounded-tr-lg rounded-br-lg ">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
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
                          </tr>
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
                  <p className="text-white text-[14px]">
                    Tambah Topik Bimbingan
                  </p>
                </button>
                <div className="overflow-x-auto mt-6 mb-6">
                  <DndContext onDragEnd={handleDragEndTopikBimbinganPribadi}>
                    <SortableContext
                      items={afterOrderEditDataTopikBimbinganPribadi.map(
                        (item: any) => item.id
                      )}
                    >
                      <table className="min-w-full text-[16px] border-collapse table-fixed">
                        <thead>
                          <tr className="bg-gray-100 text-center">
                            <th className="px-4 py-2 pl-10 w-1/4 rounded-tl-lg rounded-bl-lg">
                              No
                            </th>
                            <th className="px-4 py-2 w-1/2">Topik Bimbingan</th>
                            <th className="px-4 py-2 w-1/4 rounded-tr-lg rounded-br-lg">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {afterOrderEditDataTopikBimbinganPribadi.map(
                            (data: any, index: any) => (
                              <DraggableRow
                                key={data.id}
                                id={data.id.toString()}
                                index={index}
                                data={data}
                                parameter="Topik Bimbingan Pribadi"
                              />
                            )
                          )}
                        </tbody>
                      </table>
                    </SortableContext>
                  </DndContext>
                </div>
                <div className="flex ml-auto my-8 justify-end gap-4">
                  <button
                    className={`flex px-3 py-2 w-[90px] justify-center bg-green-500 items-center gap-2 rounded-lg hover:bg-green-600 ${areArraysEqual(dataTopikBimbinganPribadi, afterOrderEditDataTopikBimbinganPribadi) || !isEditOrder ? "hidden" : ""}`}
                    onClick={() => handleSaveTopikBimbinganPribadiOrder()}
                  >
                    <p className="text-white text-[14px]">Save</p>
                    <Image src={saveIcon} className="size-4" alt="Save Icon" />
                  </button>
                  <button
                    className={`flex px-3 py-2 bg-red-500 w-[90px] justify-center items-center gap-2 rounded-lg hover:bg-red-600 ${areArraysEqual(dataTopikBimbinganPribadi, afterOrderEditDataTopikBimbinganPribadi) || !isEditOrder ? "hidden" : ""}`}
                    onClick={() => {
                      const afterOrder = dataTopikBimbinganPribadi.map(
                        (data: any) => {
                          return {
                            ...data,
                          };
                        }
                      );
                      setAfterOrderEditDataTopikBimbinganPribadi(afterOrder);
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
              onAdd={handleAddTopikBimbinganPribadi}
              onEdit={handleEditTopikBimbinganPribadi}
              onDelete={handleDeleteTopikBimbinganPribadi}
              title={`${modalType === "Delete" ? "Konfirmasi Penghapusan Topik Bimbingan" : `${modalType} Topik Bimbingan`}`}
              modalType={modalType}
              initialData={
                modalType === "Delete"
                  ? selectedTopikBimbinganPribadiDeleteModal
                  : modalType === "Edit"
                    ? selectedTopikBimbinganPribadiEditModal
                    : null
              }
            >
              {modalType === "Tambah" && (
                <form>
                  <InputField
                    type="text"
                    placeholder="Masukkan topik bimbingan"
                    onChange={(e) => {
                      setValueTopikBimbinganPribadiAddModal(e.target.value);
                    }}
                    disabled={false}
                    value={valueTopikBimbinganPribadiAddModal}
                    className="px-3 py-2 text-[15px] w-2/3 focus:outline-none border rounded-lg"
                  />
                </form>
              )}
              {modalType === "Edit" && (
                <form>
                  <InputField
                    type="text"
                    placeholder="Masukkan topik bimbingan"
                    onChange={(e) => {
                      setValueTopikBimbinganPribadiEditModal(e.target.value);
                    }}
                    disabled={false}
                    value={valueTopikBimbinganPribadiEditModal}
                    className="px-3 py-2 text-[15px] w-2/3 focus:outline-none border rounded-lg"
                  />
                </form>
              )}
              {modalType === "Delete" && (
                <p>
                  Apakah Anda yakin ingin menghapus topik bimbingan [
                  {selectedTopikBimbinganPribadiDeleteModal.topik_bimbingan}] ?
                </p>
              )}
            </Modal>
          </div>
        )}
        {selectedParameter === "Sistem Bimbingan" && (
          <div className="mt-6">
            {afterOrderEditDataSistemBimbingan.length === 0 ? (
              <>
                <button
                  onClick={() => {
                    openModal("Tambah");
                  }}
                  className="flex px-3 mr-4 py-2 bg-orange-500 items-center gap-2 rounded-lg ml-auto hover:bg-orange-600"
                >
                  <Image src={plusIcon} alt="Plus Icon" />
                  <p className="text-white text-[14px]">
                    Tambah Sistem Bimbingan
                  </p>
                </button>
                <div className="overflow-x-auto mt-6 mb-6">
                  <DndContext onDragEnd={handleDragEndSistemBimbingan}>
                    <SortableContext
                      items={afterOrderEditDataSistemBimbingan.map(
                        (item: any) => item.id
                      )}
                    >
                      <table className="min-w-full text-[16px] border-collapse table-fixed">
                        <thead>
                          <tr className="bg-gray-100 text-center">
                            <th className="px-4 py-2 pl-10 rounded-tl-lg rounded-bl-lg ">
                              No
                            </th>
                            <th className="px-4 py-2 w-1/2">
                              Sistem Bimbingan
                            </th>
                            <th className="px-4 py-2 w-1/4 rounded-tr-lg rounded-br-lg ">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
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
                          </tr>
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
                  <p className="text-white text-[14px]">
                    Tambah Sistem Bimbingan
                  </p>
                </button>
                <div className="overflow-x-auto mt-6 mb-6">
                  <DndContext onDragEnd={handleDragEndSistemBimbingan}>
                    <SortableContext
                      items={afterOrderEditDataSistemBimbingan.map(
                        (item: any) => item.id
                      )}
                    >
                      <table className="min-w-full text-[16px] border-collapse table-fixed">
                        <thead>
                          <tr className="bg-gray-100 text-center">
                            <th className="px-4 py-2 pl-10 w-1/4 rounded-tl-lg rounded-bl-lg">
                              No
                            </th>
                            <th className="px-4 py-2 w-1/2">
                              Sistem Bimbingan
                            </th>
                            <th className="px-4 py-2 w-1/4 rounded-tr-lg rounded-br-lg">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {afterOrderEditDataSistemBimbingan.map(
                            (data: any, index: any) => (
                              <DraggableRow
                                key={data.id}
                                id={data.id.toString()}
                                index={index}
                                data={data}
                                parameter="Sistem Bimbingan"
                              />
                            )
                          )}
                        </tbody>
                      </table>
                    </SortableContext>
                  </DndContext>
                </div>
                <div className="flex ml-auto my-8 justify-end gap-4">
                  <button
                    className={`flex px-3 py-2 w-[90px] justify-center bg-green-500 items-center gap-2 rounded-lg hover:bg-green-600 ${areArraysEqual(dataSistemBimbingan, afterOrderEditDataSistemBimbingan) || !isEditOrder ? "hidden" : ""}`}
                    onClick={() => handleSaveSistemBimbinganOrder()}
                  >
                    <p className="text-white text-[14px]">Save</p>
                    <Image src={saveIcon} className="size-4" alt="Save Icon" />
                  </button>
                  <button
                    className={`flex px-3 py-2 bg-red-500 w-[90px] justify-center items-center gap-2 rounded-lg hover:bg-red-600 ${areArraysEqual(dataSistemBimbingan, afterOrderEditDataSistemBimbingan) || !isEditOrder ? "hidden" : ""}`}
                    onClick={() => {
                      const afterOrder = dataSistemBimbingan.map(
                        (data: any) => {
                          return {
                            ...data,
                          };
                        }
                      );
                      setAfterOrderEditDataSistemBimbingan(afterOrder);
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
              onAdd={handleAddSistemBimbingan}
              onEdit={handleEditSistemBimbingan}
              onDelete={handleDeleteSistemBimbingan}
              title={`${modalType === "Delete" ? "Konfirmasi Penghapusan Sistem Bimbingan" : `${modalType} Sistem Bimbingan`}`}
              modalType={modalType}
              initialData={
                modalType === "Delete"
                  ? selectedSistemBimbinganDeleteModal
                  : modalType === "Edit"
                    ? selectedSistemBimbinganEditModal
                    : null
              }
            >
              {modalType === "Tambah" && (
                <form>
                  <InputField
                    type="text"
                    placeholder="Masukkan sistem bimbingan"
                    onChange={(e) => {
                      setValueSistemBimbinganAddModal(e.target.value);
                    }}
                    disabled={false}
                    value={valueSistemBimbinganAddModal}
                    className="px-3 py-2 text-[15px] w-2/3 focus:outline-none border rounded-lg"
                  />
                </form>
              )}
              {modalType === "Edit" && (
                <form>
                  <InputField
                    type="text"
                    placeholder="Masukkan sistem bimbingan"
                    onChange={(e) => {
                      setValueSistemBimbinganEditModal(e.target.value);
                    }}
                    disabled={false}
                    value={valueSistemBimbinganEditModal}
                    className="px-3 py-2 text-[15px] w-2/3 focus:outline-none border rounded-lg"
                  />
                </form>
              )}
              {modalType === "Delete" && (
                <p>
                  Apakah Anda yakin ingin menghapus sistem bimbingan [
                  {selectedSistemBimbinganDeleteModal.sistem_bimbingan}] ?
                </p>
              )}
            </Modal>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageParameter;
