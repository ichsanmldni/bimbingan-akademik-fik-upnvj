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
  const [dataTahunAjaran, setDataTahunAjaran] = useState<any>([]);
  const [afterOrderEditDataTahunAjaran, setAfterOrderEditDataTahunAjaran] =
    useState<any>([]);
  const [dataJurusan, setDataJurusan] = useState<any>([]);
  const [afterOrderEditDataJurusan, setAfterOrderEditDataJurusan] =
    useState<any>([]);
  const [dataPeminatan, setDataPeminatan] = useState<any>([]);
  const [afterOrderEditDataPeminatan, setAfterOrderEditDataPeminatan] =
    useState<any>([]);
  const [dataJenisBimbingan, setDataJenisBimbingan] = useState<any>([]);
  const [
    afterOrderEditDataJenisBimbingan,
    setAfterOrderEditDataJenisBimbingan,
  ] = useState<any>([]);
  const [dataSistemBimbingan, setDataSistemBimbingan] = useState<any>([]);
  const [
    afterOrderEditDataSistemBimbingan,
    setAfterOrderEditDataSistemBimbingan,
  ] = useState<any>([]);
  const [selectedJurusan, setSelectedJurusan] = useState<any>("");
  const [optionsJurusan, setOptionsJurusan] = useState<any>([]);
  const [valueTahunAjaranAddModal, setValueTahunAjaranAddModal] =
    useState<any>("");
  const [valueTahunAjaranEditModal, setValueTahunAjaranEditModal] =
    useState<any>("");
  const [selectedTahunAjaranEditModal, setSelectedTahunAjaranEditModal] =
    useState<any>({});
  const [selectedTahunAjaranDeleteModal, setSelectedTahunAjaranDeleteModal] =
    useState<any>({});
  const [valueJurusanAddModal, setValueJurusanAddModal] = useState<any>("");
  const [valueJurusanEditModal, setValueJurusanEditModal] = useState<any>("");
  const [selectedJurusanEditModal, setSelectedJurusanEditModal] = useState<any>(
    {}
  );
  const [selectedJurusanDeleteModal, setSelectedJurusanDeleteModal] =
    useState<any>({});
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
    setValueTahunAjaranAddModal("");
    setValueTahunAjaranEditModal("");
    setValueJurusanAddModal("");
    setValueJurusanEditModal("");
    setValuePeminatanAddModal("");
    setValuePeminatanEditModal("");
    setValueJenisBimbinganAddModal("");
    setValueJenisBimbinganEditModal("");
    setValueSistemBimbinganAddModal("");
    setValueSistemBimbinganEditModal("");
  };

  const handleDragEndJurusan = (event: any) => {
    const { active, over } = event;

    if (!over) {
      setAfterOrderEditDataJurusan([...dataJurusan]);
      return;
    }

    if (!over) {
      setAfterOrderEditDataJurusan([...dataJurusan]);
      return;
    }

    if (over !== null) {
      const oldIndex = afterOrderEditDataJurusan.findIndex(
        (item: any) => item.id === +active.id
      );
      const newIndex = afterOrderEditDataJurusan.findIndex(
        (item: any) => item.id === +over.id
      );
      if (oldIndex !== -1 && newIndex !== -1) {
        // Salin array dataJurusan
        const newDataJurusan = [...afterOrderEditDataJurusan];

        // Perbarui properti order di dalam dataJurusan
        const updatedData = newDataJurusan.map((item, index) => {
          if (index === oldIndex) {
            return { ...item, order: newIndex + 1 }; // Set order ke posisi baru
          }
          if (index === newIndex) {
            return { ...item, order: oldIndex + 1 }; // Set order ke posisi lama
          }
          return item; // Tidak ubah item lainnya
        });
        const sortedDataJurusan = updatedData.sort((a, b) => a.order - b.order);
        setAfterOrderEditDataJurusan(sortedDataJurusan);
        setIsEditOrder(true);
      }
    }
  };

  const handleDragEndTahunAjaran = (event: any) => {
    const { active, over } = event;

    if (!over) {
      setAfterOrderEditDataTahunAjaran([...dataTahunAjaran]);
      return;
    }

    if (!over) {
      setAfterOrderEditDataTahunAjaran([...dataTahunAjaran]);
      return;
    }

    if (over !== null) {
      const oldIndex = afterOrderEditDataTahunAjaran.findIndex(
        (item: any) => item.id === +active.id
      );
      const newIndex = afterOrderEditDataTahunAjaran.findIndex(
        (item: any) => item.id === +over.id
      );
      if (oldIndex !== -1 && newIndex !== -1) {
        // Salin array dataTahunAjaran
        const newDataTahunAjaran = [...afterOrderEditDataTahunAjaran];

        // Perbarui properti order di dalam dataTahunAjaran
        const updatedData = newDataTahunAjaran.map((item, index) => {
          if (index === oldIndex) {
            return { ...item, order: newIndex + 1 }; // Set order ke posisi baru
          }
          if (index === newIndex) {
            return { ...item, order: oldIndex + 1 }; // Set order ke posisi lama
          }
          return item; // Tidak ubah item lainnya
        });
        const sortedDataTahunAjaran = updatedData.sort(
          (a, b) => a.order - b.order
        );
        setAfterOrderEditDataTahunAjaran(sortedDataTahunAjaran);
        setIsEditOrder(true);
      }
    }
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

  const patchJurusanOrder = async (updatedOrder: any) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/datajurusan/updateorder`,
        {
          ...updatedOrder,
        }
      );
      console.log("Order updated successfully:", response.data);
      getDataJurusan();
      setIsEditOrder(false);
      return response.data;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  };

  const patchTahunAjaranOrder = async (updatedOrder: any) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/datatahunajaran/updateorder`,
        {
          ...updatedOrder,
        }
      );
      console.log("Order updated successfully:", response.data);
      getDataTahunAjaran();
      setIsEditOrder(false);
      return response.data;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  };

  const patchPeminatanOrder = async (updatedOrder: any) => {
    try {
      const dataJurusan = await axios.get(`${API_BASE_URL}/api/datajurusan`);

      const jurusan = dataJurusan.data.find(
        (data: any) => data.jurusan === selectedJurusan
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
      console.error("Error updating order:", error);
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
      console.log("Order updated successfully:", response.data);
      getDataJenisBimbingan();
      setIsEditOrder(false);
      return response.data;
    } catch (error) {
      console.error("Error updating order:", error);
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
      console.log("Order updated successfully:", response.data);
      getDataSistemBimbingan();
      setIsEditOrder(false);
      return response.data;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  };

  const handleSaveJurusanOrder = async () => {
    try {
      const result = await patchJurusanOrder(afterOrderEditDataJurusan);
      console.log("Response from backend:", result);
    } catch (error) {
      console.error("Failed to save the updated order.");
    }
  };

  const handleSaveTahunAjaranOrder = async () => {
    try {
      const result = await patchTahunAjaranOrder(afterOrderEditDataTahunAjaran);
      console.log("Response from backend:", result);
    } catch (error) {
      console.error("Failed to save the updated order.");
    }
  };

  const handleSavePeminatanOrder = async () => {
    try {
      const result = await patchPeminatanOrder(afterOrderEditDataPeminatan);
      console.log("Response from backend:", result);
    } catch (error) {
      console.error("Failed to save the updated order.");
    }
  };

  const handleSaveJenisBimbinganOrder = async () => {
    try {
      const result = await patchJenisBimbinganOrder(
        afterOrderEditDataJenisBimbingan
      );
      console.log("Response from backend:", result);
    } catch (error) {
      console.error("Failed to save the updated order.");
    }
  };

  const handleSaveSistemBimbinganOrder = async () => {
    try {
      const result = await patchSistemBimbinganOrder(
        afterOrderEditDataSistemBimbingan
      );
      console.log("Response from backend:", result);
    } catch (error) {
      console.error("Failed to save the updated order.");
    }
  };

  const getDataTahunAjaran = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/datatahunajaran`);

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      const sortedDataTahunAjaran = data.sort(
        (a: any, b: any) => a.order - b.order
      );
      setDataTahunAjaran(sortedDataTahunAjaran);
      if (data.length === 0) {
        setAfterOrderEditDataTahunAjaran([]);
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataJurusan = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/datajurusan`);

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      const sortedDataJurusan = data.sort(
        (a: any, b: any) => a.order - b.order
      );
      setDataJurusan(sortedDataJurusan);
      if (data.length === 0) {
        setAfterOrderEditDataJurusan([]);
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataPeminatanByJurusan = async (selectedJurusan: any) => {
    try {
      const dataJurusan = await axios.get(`${API_BASE_URL}/api/datajurusan`);

      const jurusan = dataJurusan.data.find(
        (data: any) => data.jurusan === selectedJurusan
      );

      if (!jurusan) {
        throw new Error("Jurusan tidak ditemukan");
      }

      const jurusanid = jurusan.id;

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
      console.error("Error:", error);
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
      console.error("Error:", error);
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
      console.error("Error:", error);
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

    if (parameter === "Jurusan") {
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
          <td className="border-b border-gray-200 px-4 py-2">{data.jurusan}</td>
          <td className="border-b border-gray-200 px-4 py-4">
            <div className="flex gap-2 items-center justify-center">
              <EditButton
                onClick={() => {
                  setValueJurusanEditModal(data.jurusan);
                  setSelectedJurusanEditModal(data);
                  openModal("Edit");
                }}
                className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
              />
              <TrashButton
                onClick={() => {
                  setSelectedJurusanDeleteModal(data);
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
                      <th className="pr-4 py-2 pl-12 rounded-tl-lg rounded-bl-lg">
                        No
                      </th>
                      <th className="px-4 py-2">Jurusan</th>
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
                      <td className="px-4 py-2 w-1/2">{data.jurusan}</td>
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
    } else if (parameter === "Tahun Ajaran") {
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
          <td className="border-b border-gray-200 px-4 py-2">
            {data.tahun_ajaran}
          </td>
          <td className="border-b border-gray-200 px-4 py-4">
            <div className="flex gap-2 items-center justify-center">
              <EditButton
                className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
                onClick={() => {
                  setValueTahunAjaranEditModal(data.tahun_ajaran);
                  setSelectedTahunAjaranEditModal(data);
                  openModal("Edit");
                }}
              />
              <TrashButton
                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                onClick={() => {
                  setSelectedTahunAjaranDeleteModal(data);
                  openModal("Delete");
                }}
              />
            </div>
          </td>
          <DragOverlay>
            {isDragging ? (
              <>
                <table className="min-w-full text-[16px] border-collapse table-fixed bg-white bg-opacity-10 backdrop-blur-sm rounded-lg">
                  <thead className="hidden">
                    <tr className="bg-gray-100 text-center">
                      <th className="pr-4 py-2 pl-12 rounded-tl-lg rounded-bl-lg">
                        No
                      </th>
                      <th className="px-4 py-2">Tahun Ajaran</th>
                      <th className="px-4 py-2 rounded-tr-lg rounded-br-lg">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-center">
                      <td className="px-4 py-2 w-1/4">
                        <div className="flex items-center">
                          <Image
                            className="size-4 mr-2"
                            src={dragIcon}
                            alt="Drag Icon"
                          />
                          <p className="text-center flex-1">{index + 1}</p>
                        </div>
                      </td>
                      <td className="px-4 py-2 w-1/2">{data.tahun_ajaran}</td>
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
    } else if (parameter === "Peminatan") {
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

  const addTahunAjaran = async (newData: any) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/datatahunajaran`,
        newData
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const patchTahunAjaran = async (updatedData: any) => {
    console.log(updatedData);
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/datatahunajaran`,
        updatedData
      );
      console.log("Tahun Ajaran updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  };

  const deleteTahunAjaran = async (deletedData: any) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/datatahunajaran`,
        { data: deletedData }
      );
      console.log("Tahun Ajaran updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  };

  const handleAddTahunAjaran = async (e: any) => {
    e.preventDefault();

    try {
      let tahunAjaranValue = {
        tahun_ajaran: valueTahunAjaranAddModal,
        order: dataTahunAjaran.length + 1,
      };

      const result = await addTahunAjaran(tahunAjaranValue);

      console.log(result);

      getDataTahunAjaran();
      setIsEditOrder(false);
      closeModal();
    } catch (error) {
      console.error("Registration error:", (error as Error).message);
    }
  };

  const handleEditTahunAjaran = async (id: any) => {
    try {
      let tahunAjaranValue = {
        id,
        tahun_ajaran: valueTahunAjaranEditModal,
      };

      const result = await patchTahunAjaran(tahunAjaranValue);
      getDataTahunAjaran();
      setIsEditOrder(false);
      closeModal();
      console.log("Response from backend:", result);
    } catch (error) {
      console.error("Failed to save the updated order.");
    }
  };

  const handleDeleteTahunAjaran = async (id: any) => {
    try {
      let tahunAjaranValue = {
        id,
      };

      const result = await deleteTahunAjaran(tahunAjaranValue);
      getDataTahunAjaran();
      closeModal();
      console.log("Response from backend:", result);
    } catch (error) {
      console.error("Failed to save the updated order.");
    }
  };

  const addJurusan = async (newData: any) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/datajurusan`,
        newData
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const patchJurusan = async (updatedData: any) => {
    console.log(updatedData);
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/datajurusan`,
        updatedData
      );
      console.log("Jurusan updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  };

  const deleteJurusan = async (deletedData: any) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/datajurusan`, {
        data: deletedData,
      });
      console.log("Jurusan updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  };

  const handleAddJurusan = async (e: any) => {
    e.preventDefault();

    try {
      let jurusanValue = {
        jurusan: valueJurusanAddModal,
        order: dataJurusan.length + 1,
      };

      const result = await addJurusan(jurusanValue);

      console.log(result);

      getDataJurusan();
      setIsEditOrder(false);
      closeModal();
    } catch (error) {
      console.error("Registration error:", (error as Error).message);
    }
  };

  const handleEditJurusan = async (id: any) => {
    try {
      let jurusanValue = {
        id,
        jurusan: valueJurusanEditModal,
      };

      const result = await patchJurusan(jurusanValue);
      getDataJurusan();
      setIsEditOrder(false);
      closeModal();
      console.log("Response from backend:", result);
    } catch (error) {
      console.error("Failed to save the updated order.");
    }
  };

  const handleDeleteJurusan = async (id: any) => {
    try {
      let jurusanValue = {
        id,
      };

      const result = await deleteJurusan(jurusanValue);
      closeModal();
      getDataJurusan();
      console.log("Response from backend:", result);
    } catch (error) {
      console.error("Failed to save the updated order.");
    }
  };

  const addPeminatan = async (newData: any) => {
    try {
      const dataJurusan = await axios.get(`${API_BASE_URL}/api/datajurusan`);

      const jurusan = dataJurusan.data.find(
        (data: any) => data.jurusan === selectedJurusan
      );

      if (!jurusan) {
        throw new Error("Jurusan tidak ditemukan");
      }

      const jurusanid = jurusan.id;

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
    console.log(updatedData);
    try {
      const dataJurusan = await axios.get(`${API_BASE_URL}/api/datajurusan`);

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
      console.log("Peminatan updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  };

  const deletePeminatan = async (deletedData: any) => {
    try {
      const dataJurusan = await axios.get(`${API_BASE_URL}/api/datajurusan`);

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
      console.log("Peminatan updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating order:", error);
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

      console.log(result);

      getDataPeminatanByJurusan(selectedJurusan);
      setIsEditOrder(false);
      closeModal();
    } catch (error) {
      console.error("Registration error:", (error as Error).message);
    }
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
      console.log("Response from backend:", result);
    } catch (error) {
      console.error("Failed to save the updated order.");
    }
  };

  const handleDeletePeminatan = async (id: any) => {
    try {
      let peminatanValue = {
        id,
      };

      const result = await deletePeminatan(peminatanValue);
      getDataPeminatanByJurusan(selectedJurusan);
      closeModal();
      console.log("Response from backend:", result);
    } catch (error) {
      console.error("Failed to save the updated order.");
    }
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

  const patchJenisBimbingan = async (updatedData: any) => {
    console.log(updatedData);
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/datajenisbimbingan`,
        updatedData
      );
      console.log("Jenis Bimbingan updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  };

  const deleteJenisBimbingan = async (deletedData: any) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/datajenisbimbingan`,
        { data: deletedData }
      );
      console.log("Jenis Bimbingan updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating order:", error);
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

      console.log(result);

      getDataJenisBimbingan();
      setIsEditOrder(false);
      closeModal();
    } catch (error) {
      console.error("Registration error:", (error as Error).message);
    }
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
      console.log("Response from backend:", result);
    } catch (error) {
      console.error("Failed to save the updated order.");
    }
  };

  const handleDeleteJenisBimbingan = async (id: any) => {
    try {
      let jenisBimbinganValue = {
        id,
      };

      const result = await deleteJenisBimbingan(jenisBimbinganValue);
      getDataJenisBimbingan();
      closeModal();
      console.log("Response from backend:", result);
    } catch (error) {
      console.error("Failed to save the updated order.");
    }
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
    console.log(updatedData);
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/datasistembimbingan`,
        updatedData
      );
      console.log("Sistem Bimbingan updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  };

  const deleteSistemBimbingan = async (deletedData: any) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/datasistembimbingan`,
        { data: deletedData }
      );
      console.log("Sistem Bimbingan updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating order:", error);
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

      console.log(result);

      getDataSistemBimbingan();
      setIsEditOrder(false);
      closeModal();
    } catch (error) {
      console.error("Registration error:", (error as Error).message);
    }
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
      console.log("Response from backend:", result);
    } catch (error) {
      console.error("Failed to save the updated order.");
    }
  };

  const handleDeleteSistemBimbingan = async (id: any) => {
    try {
      let sistemBimbinganValue = {
        id,
      };

      const result = await deleteSistemBimbingan(sistemBimbinganValue);
      getDataSistemBimbingan();
      closeModal();
      console.log("Response from backend:", result);
    } catch (error) {
      console.error("Failed to save the updated order.");
    }
  };

  useEffect(() => {
    if (dataJurusan.length > 0) {
      const formattedOptions = dataJurusan.map((data: any) => {
        return {
          value: data.jurusan,
          label: data.jurusan,
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
    if (dataTahunAjaran.length > 0) {
      const afterOrder = dataTahunAjaran.map((data: any) => {
        return {
          ...data,
        };
      });
      setAfterOrderEditDataTahunAjaran(afterOrder);
    }
  }, [dataTahunAjaran]);

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
    } else if (selectedParameter === "Tahun Ajaran") {
      if (afterOrderEditDataTahunAjaran.length === 0) {
        setIsLoading(true);
        const timeout = setTimeout(() => {
          setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timeout);
      }
    } else if (selectedParameter === "Jurusan") {
      if (afterOrderEditDataJurusan.length === 0) {
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
    afterOrderEditDataJurusan,
    afterOrderEditDataTahunAjaran,
    afterOrderEditDataJenisBimbingan,
    afterOrderEditDataSistemBimbingan,
    selectedParameter,
    selectedJurusan,
  ]);

  useEffect(() => {
    getDataTahunAjaran();
    getDataJurusan();
    getDataJenisBimbingan();
    getDataSistemBimbingan();
  }, [activeNavbar]);

  return (
    <div className="p-8 h-[1000px] border">
      <div className="flex">
        <SelectField
          options={[
            { value: "Tahun Ajaran", label: "Tahun Ajaran" },
            { value: "Jurusan", label: "Jurusan" },
            { value: "Peminatan", label: "Peminatan" },
            { value: "Jenis Bimbingan", label: "Jenis Bimbingan" },
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
        {selectedParameter === "Tahun Ajaran" && (
          <div className="mt-6">
            {afterOrderEditDataTahunAjaran.length === 0 ? (
              <>
                <button
                  className="flex px-3 mr-4 py-2 bg-orange-500 items-center gap-2 rounded-lg ml-auto hover:bg-orange-600"
                  onClick={() => {
                    openModal("Tambah");
                  }}
                >
                  <Image src={plusIcon} alt="Plus Icon" />
                  <p className="text-white text-[14px]">Tambah Tahun Ajaran</p>
                </button>
                <div className="overflow-x-auto mt-6 mb-6">
                  <DndContext onDragEnd={handleDragEndTahunAjaran}>
                    <SortableContext
                      items={afterOrderEditDataTahunAjaran.map(
                        (item: any) => item.id
                      )}
                    >
                      <table className="min-w-full text-[16px] border-collapse table-fixed">
                        <thead>
                          <tr className="bg-gray-100 text-center">
                            <th className="px-4 py-2 pl-10 rounded-tl-lg rounded-bl-lg ">
                              No
                            </th>
                            <th className="px-4 py-2 w-1/2">Tahun Ajaran</th>
                            <th className="px-4 py-2 w-1/4 rounded-tr-lg rounded-br-lg ">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <td colSpan={3}>
                            {isLoading ? (
                              <div className="flex justify-center items-center h-20">
                                <div className="loader" />
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
                  className="flex px-3 py-2 bg-orange-500 items-center gap-2 rounded-lg ml-auto hover:bg-orange-600"
                  onClick={() => {
                    openModal("Tambah");
                  }}
                >
                  <Image src={plusIcon} alt="Plus Icon" />
                  <p className="text-white text-[14px]">Tambah Tahun Ajaran</p>
                </button>
                <div className="overflow-x-auto mt-6 mb-6">
                  <DndContext onDragEnd={handleDragEndTahunAjaran}>
                    <SortableContext
                      items={afterOrderEditDataTahunAjaran.map(
                        (item: any) => item.id
                      )}
                    >
                      <table className="min-w-full text-[16px] border-collapse table-fixed">
                        <thead>
                          <tr className="bg-gray-100 text-center">
                            <th className="px-4 py-2 pl-10 w-1/4 rounded-tl-lg rounded-bl-lg">
                              No
                            </th>
                            <th className="px-4 py-2 w-1/2">Tahun Ajaran</th>
                            <th className="px-4 py-2 w-1/4 rounded-tr-lg rounded-br-lg">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {afterOrderEditDataTahunAjaran.map(
                            (data: any, index: any) => (
                              <DraggableRow
                                key={data.id}
                                id={data.id.toString()}
                                index={index}
                                data={data}
                                parameter="Tahun Ajaran"
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
                    className={`flex px-2 py-2 w-[88px] justify-center bg-green-500 items-center gap-2 rounded-lg hover:bg-green-600 ${areArraysEqual(dataTahunAjaran, afterOrderEditDataTahunAjaran) || !isEditOrder ? "hidden" : ""}`}
                    onClick={() => handleSaveTahunAjaranOrder()}
                  >
                    <Image src={saveIcon} className="size-4" alt="Save Icon" />
                    <p className="text-white text-[14px]">Save</p>
                  </button>
                  <button
                    className={`flex  py-2 bg-red-500 w-[88px] justify-center items-center gap-2 rounded-lg hover:bg-red-600 ${areArraysEqual(dataTahunAjaran, afterOrderEditDataTahunAjaran) || !isEditOrder ? "hidden" : ""}`}
                    onClick={() => {
                      const afterOrder = dataTahunAjaran.map((data: any) => {
                        return {
                          ...data,
                        };
                      });
                      setAfterOrderEditDataTahunAjaran(afterOrder);
                    }}
                  >
                    <Image
                      src={cancelIcon}
                      className="size-2.5"
                      alt="Cancel Icon"
                    />
                    <p className="text-white text-[14px]">Cancel</p>
                  </button>
                </div>
              </>
            )}
            <Modal
              isOpen={isModalOpen}
              onClose={closeModal}
              onAdd={handleAddTahunAjaran}
              onEdit={handleEditTahunAjaran}
              onDelete={handleDeleteTahunAjaran}
              title={`${modalType === "Delete" ? "Konfirmasi Penghapusan Tahun Ajaran" : `${modalType} Tahun Ajaran`}`}
              modalType={modalType}
              initialData={
                modalType === "Delete"
                  ? selectedTahunAjaranDeleteModal
                  : modalType === "Edit"
                    ? selectedTahunAjaranEditModal
                    : null
              }
            >
              {modalType === "Tambah" && (
                <form>
                  <InputField
                    type="text"
                    placeholder="Masukkan tahun ajaran"
                    onChange={(e) => {
                      setValueTahunAjaranAddModal(e.target.value);
                    }}
                    disabled={false}
                    value={valueTahunAjaranAddModal}
                    className="px-3 py-2 text-[15px] w-1/2 focus:outline-none border rounded-lg"
                  />
                </form>
              )}
              {modalType === "Edit" && (
                <form>
                  <InputField
                    type="text"
                    placeholder="Masukkan tahun ajaran"
                    onChange={(e) => {
                      setValueTahunAjaranEditModal(e.target.value);
                    }}
                    disabled={false}
                    value={valueTahunAjaranEditModal}
                    className="px-3 py-2 text-[15px] w-1/2 focus:outline-none border rounded-lg"
                  />
                </form>
              )}
              {modalType === "Delete" && (
                <p>
                  Apakah Anda yakin ingin menghapus tahun ajaran [
                  {selectedTahunAjaranDeleteModal.tahun_ajaran}] ?
                </p>
              )}
            </Modal>
          </div>
        )}
        {selectedParameter === "Jurusan" && (
          <div className="mt-6">
            {afterOrderEditDataJurusan.length === 0 ? (
              <>
                <button
                  onClick={() => {
                    openModal("Tambah");
                  }}
                  className="flex px-3 mr-4 py-2 bg-orange-500 items-center gap-2 rounded-lg ml-auto hover:bg-orange-600"
                >
                  <Image src={plusIcon} alt="Plus Icon" />
                  <p className="text-white text-[14px]">Tambah Jurusan</p>
                </button>
                <div className="overflow-x-auto mt-6 mb-6">
                  <DndContext onDragEnd={handleDragEndJurusan}>
                    <SortableContext
                      items={afterOrderEditDataJurusan.map(
                        (item: any) => item.id
                      )}
                    >
                      <table className="min-w-full text-[16px] border-collapse table-fixed">
                        <thead>
                          <tr className="bg-gray-100 text-center">
                            <th className="px-4 py-2 pl-10 rounded-tl-lg rounded-bl-lg ">
                              No
                            </th>
                            <th className="px-4 py-2 w-1/2">Jurusan</th>
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
                  <p className="text-white text-[14px]">Tambah Jurusan</p>
                </button>
                <div className="overflow-x-auto mt-6 mb-6">
                  <DndContext onDragEnd={handleDragEndJurusan}>
                    <SortableContext
                      items={afterOrderEditDataJurusan.map(
                        (item: any) => item.id
                      )}
                    >
                      <table className="min-w-full text-[16px] border-collapse table-fixed">
                        <thead>
                          <tr className="bg-gray-100 text-center">
                            <th className="px-4 py-2 pl-10 w-1/4 rounded-tl-lg rounded-bl-lg">
                              No
                            </th>
                            <th className="px-4 py-2 w-1/2">Jurusan</th>
                            <th className="px-4 py-2 w-1/4 rounded-tr-lg rounded-br-lg">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {afterOrderEditDataJurusan.map(
                            (data: any, index: any) => (
                              <DraggableRow
                                key={data.id}
                                id={data.id.toString()}
                                index={index}
                                data={data}
                                parameter="Jurusan"
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
                    className={`flex px-3 py-2 w-[90px] justify-center bg-green-500 items-center gap-2 rounded-lg hover:bg-green-600 ${areArraysEqual(dataJurusan, afterOrderEditDataJurusan) || !isEditOrder ? "hidden" : ""}`}
                    onClick={() => handleSaveJurusanOrder()}
                  >
                    <p className="text-white text-[14px]">Save</p>
                    <Image src={saveIcon} className="size-4" alt="Save Icon" />
                  </button>
                  <button
                    className={`flex px-3 py-2 bg-red-500 w-[90px] justify-center items-center gap-2 rounded-lg hover:bg-red-600 ${areArraysEqual(dataJurusan, afterOrderEditDataJurusan) || !isEditOrder ? "hidden" : ""}`}
                    onClick={() => {
                      const afterOrder = dataJurusan.map((data: any) => {
                        return {
                          ...data,
                        };
                      });
                      setAfterOrderEditDataJurusan(afterOrder);
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
              onAdd={handleAddJurusan}
              onEdit={handleEditJurusan}
              onDelete={handleDeleteJurusan}
              title={`${modalType === "Delete" ? "Konfirmasi Penghapusan Jurusan" : `${modalType} Jurusan`}`}
              modalType={modalType}
              initialData={
                modalType === "Delete"
                  ? selectedJurusanDeleteModal
                  : modalType === "Edit"
                    ? selectedJurusanEditModal
                    : null
              }
            >
              {modalType === "Tambah" && (
                <form>
                  <InputField
                    type="text"
                    placeholder="Masukkan jurusan"
                    onChange={(e) => {
                      setValueJurusanAddModal(e.target.value);
                    }}
                    disabled={false}
                    value={valueJurusanAddModal}
                    className="px-3 py-2 text-[15px] w-1/2 focus:outline-none border rounded-lg"
                  />
                </form>
              )}
              {modalType === "Edit" && (
                <form>
                  <InputField
                    type="text"
                    placeholder="Masukkan jurusan"
                    onChange={(e) => {
                      setValueJurusanEditModal(e.target.value);
                    }}
                    disabled={false}
                    value={valueJurusanEditModal}
                    className="px-3 py-2 text-[15px] w-1/2 focus:outline-none border rounded-lg"
                  />
                </form>
              )}
              {modalType === "Delete" && (
                <p>
                  Apakah Anda yakin ingin menghapus jurusan [
                  {selectedJurusanDeleteModal.jurusan}] ?
                </p>
              )}
            </Modal>
          </div>
        )}
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
                  <p className="text-white text-[14px]">
                    Tambah Jenis Bimbingan
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
