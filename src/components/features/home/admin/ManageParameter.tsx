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
import { after } from "node:test";

interface ManageParameterProps {
  activeNavbar: string;
}
const ManageParameter: React.FC<ManageParameterProps> = ({ activeNavbar }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOrder, setIsEditOrder] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedData, setSelectedData] = useState(null);
  const [selectedParameter, setSelectedParameter] = useState("");
  const [dataTahunAjaran, setDataTahunAjaran] = useState([]);
  const [afterOrderEditDataTahunAjaran, setAfterOrderEditDataTahunAjaran] =
    useState([]);
  const [dataJurusan, setDataJurusan] = useState([]);
  const [afterOrderEditDataJurusan, setAfterOrderEditDataJurusan] = useState(
    []
  );
  const [dataPeminatan, setDataPeminatan] = useState([]);
  const [afterOrderEditDataPeminatan, setAfterOrderEditDataPeminatan] =
    useState([]);
  const [dataJenisBimbingan, setDataJenisBimbingan] = useState([]);
  const [
    afterOrderEditDataJenisBimbingan,
    setAfterOrderEditDataJenisBimbingan,
  ] = useState([]);
  const [dataSistemBimbingan, setDataSistemBimbingan] = useState([]);
  const [
    afterOrderEditDataSistemBimbingan,
    setAfterOrderEditDataSistemBimbingan,
  ] = useState([]);
  const [selectedJurusan, setSelectedJurusan] = useState("");
  const [optionsJurusan, setOptionsJurusan] = useState([]);
  const [valueTahunAjaranAddModal, setValueTahunAjaranAddModal] = useState("");
  const [valueTahunAjaranEditModal, setValueTahunAjaranEditModal] =
    useState("");
  const [selectedTahunAjaranEditModal, setSelectedTahunAjaranEditModal] =
    useState();

  const openModal = (type, data = null) => {
    setModalType(type);
    setSelectedData(data);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedData(null);
  };

  const handleDragEndJurusan = (event) => {
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
        (item) => item.id === +active.id
      );
      const newIndex = afterOrderEditDataJurusan.findIndex(
        (item) => item.id === +over.id
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

  const handleDragEndTahunAjaran = (event) => {
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
        (item) => item.id === +active.id
      );
      const newIndex = afterOrderEditDataTahunAjaran.findIndex(
        (item) => item.id === +over.id
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

  const handleDragEndPeminatan = (event) => {
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
        (item) => item.id === +active.id
      );
      const newIndex = afterOrderEditDataPeminatan.findIndex(
        (item) => item.id === +over.id
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

  const handleDragEndJenisBimbingan = (event) => {
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
        (item) => item.id === +active.id
      );
      const newIndex = afterOrderEditDataJenisBimbingan.findIndex(
        (item) => item.id === +over.id
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

  const handleDragEndSistemBimbingan = (event) => {
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
        (item) => item.id === +active.id
      );
      const newIndex = afterOrderEditDataSistemBimbingan.findIndex(
        (item) => item.id === +over.id
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

  const areArraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    return arr1.every(
      (item, index) => JSON.stringify(item) === JSON.stringify(arr2[index])
    );
  };

  const patchJurusanOrder = async (updatedOrder) => {
    try {
      const response = await axios.patch(
        "http://localhost:3000/api/datajurusan/updateorder",
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

  const patchTahunAjaranOrder = async (updatedOrder) => {
    try {
      const response = await axios.patch(
        "http://localhost:3000/api/datatahunajaran/updateorder",
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

  const patchPeminatanOrder = async (updatedOrder) => {
    try {
      const dataJurusan = await axios.get(
        "http://localhost:3000/api/datajurusan"
      );

      const jurusan = dataJurusan.data.find(
        (data) => data.jurusan === selectedJurusan
      );

      if (!jurusan) {
        throw new Error("Jurusan tidak ditemukan");
      }

      const jurusanid = jurusan.id;

      const response = await axios.patch(
        `http://localhost:3000/api/datapeminatan/${jurusanid}/updateorder`,
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

  const patchJenisBimbinganOrder = async (updatedOrder) => {
    try {
      const response = await axios.patch(
        "http://localhost:3000/api/datajenisbimbingan/updateorder",
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

  const patchSistemBimbinganOrder = async (updatedOrder) => {
    try {
      const response = await axios.patch(
        "http://localhost:3000/api/datasistembimbingan/updateorder",
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
      const response = await axios.get(
        "http://localhost:3000/api/datatahunajaran"
      );

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      const sortedDataJurusan = data.sort((a, b) => a.order - b.order);
      setDataTahunAjaran(sortedDataJurusan);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataJurusan = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/datajurusan");

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      const sortedDataJurusan = data.sort((a, b) => a.order - b.order);
      setDataJurusan(sortedDataJurusan);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataPeminatanByJurusan = async (selectedJurusan) => {
    try {
      const dataJurusan = await axios.get(
        "http://localhost:3000/api/datajurusan"
      );

      const jurusan = dataJurusan.data.find(
        (data) => data.jurusan === selectedJurusan
      );

      if (!jurusan) {
        throw new Error("Jurusan tidak ditemukan");
      }

      const jurusanid = jurusan.id;

      const response = await axios.get(
        `http://localhost:3000/api/datapeminatan/${jurusanid}`
      );

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      const sortedDataPeminatan = data.sort((a, b) => a.order - b.order);
      setDataPeminatan(sortedDataPeminatan);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataJenisBimbingan = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/datajenisbimbingan"
      );

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      const sortedDataJenisBimbingan = data.sort((a, b) => a.order - b.order);
      setDataJenisBimbingan(sortedDataJenisBimbingan);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataSistemBimbingan = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/datasistembimbingan"
      );

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      const sortedDataSistemBimbingan = data.sort((a, b) => a.order - b.order);
      setDataSistemBimbingan(sortedDataSistemBimbingan);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  function DraggableRow({ id, index, data, parameter }) {
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
              <EditButton className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600" />
              <TrashButton className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600" />
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
                      <td className="px-4 py-2">{data.jurusan}</td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2 items-center justify-center">
                          <EditButton className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600" />
                          <TrashButton className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600" />
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
                      <td className="px-4 py-2 w-1/2">{data.tahunAjaran}</td>
                      <td className="px-4 py-4 w-1/4">
                        <div className="flex gap-2 items-center justify-center">
                          <EditButton className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600" />
                          <TrashButton className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600" />
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
              <EditButton className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600" />
              <TrashButton className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600" />
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
                          <EditButton className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600" />
                          <TrashButton className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600" />
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
              <EditButton className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600" />
              <TrashButton className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600" />
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
                          <EditButton className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600" />
                          <TrashButton className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600" />
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
              <EditButton className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600" />
              <TrashButton className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600" />
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
                          <EditButton className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600" />
                          <TrashButton className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600" />
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

  const addTahunAjaran = async (newData) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/datatahunajaran",
        newData
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const patchTahunAjaran = async (updatedData) => {
    console.log(updatedData);
    try {
      const response = await axios.patch(
        "http://localhost:3000/api/datatahunajaran",
        updatedData
      );
      console.log(response);
      console.log("Tahun Ajaran updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  };

  const handleAddTahunAjaran = async (e) => {
    e.preventDefault();

    try {
      let tahunAjaranValue = {
        tahun_ajaran: valueTahunAjaranAddModal,
        order: dataTahunAjaran.length + 1,
      };

      const result = await addTahunAjaran(tahunAjaranValue);

      console.log(result);

      getDataTahunAjaran();
      closeModal();
    } catch (error) {
      console.error("Registration error:", error.message);
    }
  };

  const handleEditTahunAjaran = async (id) => {
    try {
      let tahunAjaranValue = {
        id,
        tahun_ajaran: valueTahunAjaranEditModal,
      };

      const result = await patchTahunAjaran(tahunAjaranValue);
      getDataTahunAjaran();
      closeModal();
      console.log("Response from backend:", result);
    } catch (error) {
      console.error("Failed to save the updated order.");
    }
  };

  useEffect(() => {
    if (dataJurusan.length > 0) {
      const formattedOptions = dataJurusan.map((data) => {
        return {
          value: data.jurusan,
          label: data.jurusan,
        };
      });

      setOptionsJurusan(formattedOptions);

      if (afterOrderEditDataJurusan.length === 0) {
        const afterOrder = dataJurusan.map((data) => {
          return {
            ...data,
          };
        });
        setAfterOrderEditDataJurusan(afterOrder);
      }
    }
  }, [dataJurusan]);

  useEffect(() => {
    if (dataTahunAjaran.length > 0) {
      const afterOrder = dataTahunAjaran.map((data) => {
        return {
          ...data,
        };
      });
      setAfterOrderEditDataTahunAjaran(afterOrder);
    }
  }, [dataTahunAjaran]);

  useEffect(() => {
    if (dataPeminatan.length > 0) {
      if (afterOrderEditDataPeminatan.length === 0) {
        const afterOrder = dataPeminatan.map((data) => {
          return {
            ...data,
          };
        });
        setAfterOrderEditDataPeminatan(afterOrder);
      }
    }
  }, [dataPeminatan]);

  useEffect(() => {
    if (dataJenisBimbingan.length > 0) {
      if (afterOrderEditDataJenisBimbingan.length === 0) {
        const afterOrder = dataJenisBimbingan.map((data) => {
          return {
            ...data,
          };
        });
        setAfterOrderEditDataJenisBimbingan(afterOrder);
      }
    }
  }, [dataJenisBimbingan]);

  useEffect(() => {
    if (dataSistemBimbingan.length > 0) {
      if (afterOrderEditDataSistemBimbingan.length === 0) {
        const afterOrder = dataSistemBimbingan.map((data) => {
          return {
            ...data,
          };
        });
        setAfterOrderEditDataSistemBimbingan(afterOrder);
      }
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
    <div className="p-8 h-[1000px] border rounded-lg">
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
                        (item) => item.id
                      )}
                      strategy={sortableKeyboardCoordinates}
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
                        (item) => item.id
                      )}
                      strategy={sortableKeyboardCoordinates}
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
                          {afterOrderEditDataTahunAjaran.map((data, index) => (
                            <DraggableRow
                              key={data.id}
                              id={data.id.toString()}
                              index={index}
                              data={data}
                              parameter="Tahun Ajaran"
                            />
                          ))}
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
                    <p className="text-white text-[14px]">Save</p>
                    <Image src={saveIcon} className="size-4" alt="Save Icon" />
                  </button>
                  <button
                    className={`flex  py-2 bg-red-500 w-[88px] justify-center items-center gap-2 rounded-lg hover:bg-red-600 ${areArraysEqual(dataTahunAjaran, afterOrderEditDataTahunAjaran) || !isEditOrder ? "hidden" : ""}`}
                    onClick={() => {
                      const afterOrder = dataTahunAjaran.map((data) => {
                        return {
                          ...data,
                        };
                      });
                      setAfterOrderEditDataTahunAjaran(afterOrder);
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
              onAdd={handleAddTahunAjaran}
              onEdit={handleEditTahunAjaran}
              title={`${modalType} Tahun Ajaran`}
              modalType={modalType}
              initialData={selectedTahunAjaranEditModal}
            >
              {modalType === "Tambah" && (
                <form>
                  <InputField
                    type="text"
                    placeholder="Tahun Ajaran"
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
                    placeholder="Tahun Ajaran"
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
                  Apakah Anda yakin ingin menghapus {selectedData?.tahunAjaran}?
                </p>
              )}
            </Modal>
          </div>
        )}
        {selectedParameter === "Jurusan" && (
          <div className="mt-6">
            {afterOrderEditDataJurusan.length === 0 ? (
              <>
                <button className="flex px-3 mr-4 py-2 bg-orange-500 items-center gap-2 rounded-lg ml-auto hover:bg-orange-600">
                  <Image src={plusIcon} alt="Plus Icon" />
                  <p className="text-white text-[14px]">Tambah Jurusan</p>
                </button>
                <div className="overflow-x-auto mt-6 mb-6">
                  <DndContext onDragEnd={handleDragEndJurusan}>
                    <SortableContext
                      items={afterOrderEditDataJurusan.map((item) => item.id)}
                      strategy={sortableKeyboardCoordinates}
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
                <button className="flex px-3 py-2 bg-orange-500 items-center gap-2 rounded-lg ml-auto hover:bg-orange-600">
                  <Image src={plusIcon} alt="Plus Icon" />
                  <p className="text-white text-[14px]">Tambah Jurusan</p>
                </button>
                <div className="overflow-x-auto mt-6 mb-6">
                  <DndContext onDragEnd={handleDragEndJurusan}>
                    <SortableContext
                      items={afterOrderEditDataJurusan.map((item) => item.id)}
                      strategy={sortableKeyboardCoordinates}
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
                          {afterOrderEditDataJurusan.map((data, index) => (
                            <DraggableRow
                              key={data.id}
                              id={data.id.toString()}
                              index={index}
                              data={data}
                              parameter="Jurusan"
                            />
                          ))}
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
                      const afterOrder = dataJurusan.map((data) => {
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
                <button className="flex px-3 mr-4 py-2 bg-orange-500 items-center gap-2 rounded-lg ml-auto hover:bg-orange-600">
                  <Image src={plusIcon} alt="Plus Icon" />
                  <p className="text-white text-[14px]">Tambah Peminatan</p>
                </button>
                <div className="overflow-x-auto mt-6 mb-6">
                  <DndContext onDragEnd={handleDragEndPeminatan}>
                    <SortableContext
                      items={afterOrderEditDataPeminatan.map((item) => item.id)}
                      strategy={sortableKeyboardCoordinates}
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
                <button className="flex px-3 mr-4 py-2 bg-orange-500 items-center gap-2 rounded-lg ml-auto hover:bg-orange-600">
                  <Image src={plusIcon} alt="Plus Icon" />
                  <p className="text-white text-[14px]">Tambah Peminatan</p>
                </button>
                <div className="overflow-x-auto mt-6 mb-6">
                  <DndContext onDragEnd={handleDragEndPeminatan}>
                    <SortableContext
                      items={afterOrderEditDataPeminatan.map((item) => item.id)}
                      strategy={sortableKeyboardCoordinates}
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
                          {afterOrderEditDataPeminatan.map((data, index) => (
                            <DraggableRow
                              key={data.id}
                              id={data.id.toString()}
                              index={index}
                              data={data}
                              parameter="Peminatan"
                            />
                          ))}
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
                      const afterOrder = dataPeminatan.map((data) => {
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
          </div>
        )}
        {selectedParameter === "Jenis Bimbingan" && (
          <div className="mt-6">
            {afterOrderEditDataJenisBimbingan.length === 0 ? (
              <>
                <button className="flex px-3 mr-4 py-2 bg-orange-500 items-center gap-2 rounded-lg ml-auto hover:bg-orange-600">
                  <Image src={plusIcon} alt="Plus Icon" />
                  <p className="text-white text-[14px]">
                    Tambah Jenis Bimbingan
                  </p>
                </button>
                <div className="overflow-x-auto mt-6 mb-6">
                  <DndContext onDragEnd={handleDragEndJenisBimbingan}>
                    <SortableContext
                      items={afterOrderEditDataJenisBimbingan.map(
                        (item) => item.id
                      )}
                      strategy={sortableKeyboardCoordinates}
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
                <button className="flex px-3 py-2 bg-orange-500 items-center gap-2 rounded-lg ml-auto hover:bg-orange-600">
                  <Image src={plusIcon} alt="Plus Icon" />
                  <p className="text-white text-[14px]">
                    Tambah Jenis Bimbingan
                  </p>
                </button>
                <div className="overflow-x-auto mt-6 mb-6">
                  <DndContext onDragEnd={handleDragEndJenisBimbingan}>
                    <SortableContext
                      items={afterOrderEditDataJenisBimbingan.map(
                        (item) => item.id
                      )}
                      strategy={sortableKeyboardCoordinates}
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
                            (data, index) => (
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
                      const afterOrder = dataJenisBimbingan.map((data) => {
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
          </div>
        )}
        {selectedParameter === "Sistem Bimbingan" && (
          <div className="mt-6">
            {afterOrderEditDataSistemBimbingan.length === 0 ? (
              <>
                <button className="flex px-3 mr-4 py-2 bg-orange-500 items-center gap-2 rounded-lg ml-auto hover:bg-orange-600">
                  <Image src={plusIcon} alt="Plus Icon" />
                  <p className="text-white text-[14px]">
                    Tambah Jenis Bimbingan
                  </p>
                </button>
                <div className="overflow-x-auto mt-6 mb-6">
                  <DndContext onDragEnd={handleDragEndSistemBimbingan}>
                    <SortableContext
                      items={afterOrderEditDataSistemBimbingan.map(
                        (item) => item.id
                      )}
                      strategy={sortableKeyboardCoordinates}
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
                <button className="flex px-3 py-2 bg-orange-500 items-center gap-2 rounded-lg ml-auto hover:bg-orange-600">
                  <Image src={plusIcon} alt="Plus Icon" />
                  <p className="text-white text-[14px]">
                    Tambah Jenis Bimbingan
                  </p>
                </button>
                <div className="overflow-x-auto mt-6 mb-6">
                  <DndContext onDragEnd={handleDragEndSistemBimbingan}>
                    <SortableContext
                      items={afterOrderEditDataSistemBimbingan.map(
                        (item) => item.id
                      )}
                      strategy={sortableKeyboardCoordinates}
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
                            (data, index) => (
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
                      const afterOrder = dataSistemBimbingan.map((data) => {
                        return {
                          ...data,
                        };
                      });
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageParameter;
