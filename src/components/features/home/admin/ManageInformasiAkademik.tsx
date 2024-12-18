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
import { useEffect, useState } from "react";
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

interface ManageInformasiAkademikProps {}
const ManageInformasiAkademik: React.FC<
  ManageInformasiAkademikProps
> = ({}) => {
  const [selectedBab, setSelectedBab] = useState("");
  const [activeTab, setActiveTab] = useState("Bab");
  const tabs = ["Bab", "Sub Bab"];
  const [afterOrderEditDataBab, setAfterOrderEditDataBab] = useState([]);
  const [afterOrderEditDataSubBab, setAfterOrderEditDataSubBab] = useState([]);
  const [modalType, setModalType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOrder, setIsEditOrder] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataBab, setDataBab] = useState([]);
  const [valueBabAddModal, setValueBabAddModal] = useState("");
  const [valueBabEditModal, setValueBabEditModal] = useState("");
  const [selectedBabEditModal, setSelectedBabEditModal] = useState({});
  const [selectedBabDeleteModal, setSelectedBabDeleteModal] = useState({});
  const [dataSubBab, setDataSubBab] = useState([]);
  const [valueSubBabAddModal, setValueSubBabAddModal] = useState("");
  const [valueSubBabEditModal, setValueSubBabEditModal] = useState("");
  const [valueIsiSubBabAddModal, setValueIsiSubBabAddModal] = useState("");
  const [valueIsiSubBabEditModal, setValueIsiSubBabEditModal] = useState("");
  const [selectedSubBabEditModal, setSelectedSubBabEditModal] = useState({});
  const [selectedSubBabDeleteModal, setSelectedSubBabDeleteModal] = useState(
    {}
  );
  const [optionsBab, setOptionsBab] = useState([]);

  const areArraysEqual = (arr1, arr2) => {
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
    setValueIsiSubBabAddModal("");
    setValueIsiSubBabEditModal("");
  };

  function DraggableRow({ id, index, data, tab }) {
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

    if (tab === "Bab") {
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
          <td className="border-b border-gray-200 px-4 py-4">
            <div className="flex gap-2 items-center justify-center">
              <EditButton
                onClick={() => {
                  setValueBabEditModal(data.nama);
                  setSelectedBabEditModal(data);
                  openModal("Edit");
                }}
                className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
              />
              <TrashButton
                onClick={() => {
                  setSelectedBabDeleteModal(data);
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
                      <th className="px-4 py-2">Bab</th>
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
                      <td className="px-4 py-2 w-1/2">{data.nama}</td>
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
    } else if (tab === "Sub Bab") {
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
          <td className="border-b border-gray-200 px-4 w-1/4 py-2">
            {data.nama}
          </td>
          <td className="border-b border-gray-200 px-4 w-1/4 py-2">
            {data.isi}
          </td>
          <td className="border-b border-gray-200 px-4 py-4">
            <div className="flex gap-2 items-center justify-center">
              <EditButton
                onClick={() => {
                  setValueSubBabEditModal(data.nama);
                  setValueIsiSubBabEditModal(data.isi);
                  setSelectedSubBabEditModal(data);
                  openModal("Edit");
                }}
                className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
              />
              <TrashButton
                onClick={() => {
                  setSelectedSubBabDeleteModal(data);
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
                      <th className="px-4 py-2 w-1/4">Sub Bab</th>
                      <th className="px-4 py-2 w-1/4">Isi</th>
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
                      <td className="px-4 py-2 w-1/4">{data.nama}</td>
                      <td className="px-4 py-2 w-1/4">{data.isi}</td>
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

  const openModal = (type, data = null) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleClickTab = (tab) => {
    setActiveTab(tab);
    setSelectedBab("");
  };

  const handleDragEndBab = (event) => {
    const { active, over } = event;

    if (!over) {
      setAfterOrderEditDataBab([...dataBab]);
      return;
    }

    if (!over) {
      setAfterOrderEditDataBab([...dataBab]);
      return;
    }

    if (over !== null) {
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
    }
  };

  const handleDragEndSubBab = (event) => {
    const { active, over } = event;

    if (!over) {
      setAfterOrderEditDataSubBab([...dataSubBab]);
      return;
    }

    if (!over) {
      setAfterOrderEditDataSubBab([...dataSubBab]);
      return;
    }

    if (over !== null) {
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
    }
  };

  const addBab = async (newData) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/databab",
        newData
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const patchBab = async (updatedData) => {
    console.log(updatedData);
    try {
      const response = await axios.patch(
        "http://localhost:3000/api/databab",
        updatedData
      );
      console.log("Bab updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  };

  const deleteBab = async (deletedData) => {
    try {
      const response = await axios.delete("http://localhost:3000/api/databab", {
        data: deletedData,
      });
      console.log("Bab updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  };

  const handleAddBab = async (e) => {
    e.preventDefault();

    try {
      let babValue = {
        nama: valueBabAddModal,
        order: dataBab.length + 1,
      };

      const result = await addBab(babValue);

      console.log(result);

      getDataBab();
      setIsEditOrder(false);
      closeModal();
    } catch (error) {
      console.error("Registration error:", error.message);
    }
  };

  const handleEditBab = async (id) => {
    try {
      let babValue = {
        id,
        nama: valueBabEditModal,
      };

      const result = await patchBab(babValue);
      getDataBab();
      setIsEditOrder(false);
      closeModal();
      console.log("Response from backend:", result);
    } catch (error) {
      console.error("Failed to save the updated order.");
    }
  };

  const handleDeleteBab = async (id) => {
    try {
      let babValue = {
        id,
      };

      const result = await deleteBab(babValue);
      closeModal();
      getDataBab();
      console.log("Response from backend:", result);
    } catch (error) {
      console.error("Failed to save the updated order.");
    }
  };

  const patchBabOrder = async (updatedOrder) => {
    try {
      const response = await axios.patch(
        "http://localhost:3000/api/databab/updateorder",
        {
          ...updatedOrder,
        }
      );
      console.log("Order updated successfully:", response.data);
      getDataBab();
      setIsEditOrder(false);
      return response.data;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  };

  const handleSaveBabOrder = async () => {
    try {
      const result = await patchBabOrder(afterOrderEditDataBab);
      console.log("Response from backend:", result);
    } catch (error) {
      console.error("Failed to save the updated order.");
    }
  };

  const getDataBab = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/databab");

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      const sortedDataBab = data.sort((a, b) => a.order - b.order);
      setDataBab(sortedDataBab);
      if (data.length === 0) {
        setAfterOrderEditDataBab([]);
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const addSubBab = async (newData) => {
    try {
      const dataBab = await axios.get("http://localhost:3000/api/databab");

      const bab = dataBab.data.find((data) => data.nama === selectedBab);

      if (!bab) {
        throw new Error("Bab tidak ditemukan");
      }

      const babid = bab.id;

      const response = await axios.post(
        `http://localhost:3000/api/datasubbab/${babid}`,
        newData
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const patchSubBab = async (updatedData) => {
    console.log(updatedData);
    try {
      const dataBab = await axios.get("http://localhost:3000/api/databab");

      const bab = dataBab.data.find((data) => data.nama === selectedBab);

      if (!bab) {
        throw new Error("Bab tidak ditemukan");
      }

      const babid = bab.id;
      console.log(updatedData);

      const response = await axios.patch(
        `http://localhost:3000/api/datasubbab/${babid}`,
        updatedData
      );
      console.log("Sub bab updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  };

  const deleteSubBab = async (deletedData) => {
    try {
      const dataBab = await axios.get("http://localhost:3000/api/databab");

      const bab = dataBab.data.find((data) => data.nama === selectedBab);

      if (!bab) {
        throw new Error("Bab tidak ditemukan");
      }

      const babid = bab.id;

      const response = await axios.delete(
        `http://localhost:3000/api/datasubbab/${babid}`,
        { data: deletedData }
      );
      console.log("Sub bab updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  };

  const handleAddSubBab = async (e) => {
    e.preventDefault();

    try {
      let subBabValue = {
        nama: valueSubBabAddModal,
        isi: valueIsiSubBabAddModal,
        order: dataSubBab.length + 1,
      };

      const result = await addSubBab(subBabValue);

      console.log(result);

      getDataSubBabByBab(selectedBab);
      setIsEditOrder(false);
      closeModal();
    } catch (error) {
      console.error("Registration error:", error.message);
    }
  };

  const handleEditSubBab = async (id) => {
    try {
      let subBabValue = {
        id,

        nama: valueSubBabEditModal,
        isi: valueIsiSubBabEditModal,
      };

      const result = await patchSubBab(subBabValue);
      getDataSubBabByBab(selectedBab);
      setIsEditOrder(false);
      closeModal();
      console.log("Response from backend:", result);
    } catch (error) {
      console.error("Failed to save the updated order.");
    }
  };

  const handleDeleteSubBab = async (id) => {
    try {
      let subBabValue = {
        id,
      };

      const result = await deleteSubBab(subBabValue);
      getDataSubBabByBab(selectedBab);
      closeModal();
      console.log("Response from backend:", result);
    } catch (error) {
      console.error("Failed to save the updated order.");
    }
  };

  const patchSubBabOrder = async (updatedOrder) => {
    try {
      const dataBab = await axios.get("http://localhost:3000/api/databab");

      const bab = dataBab.data.find((data) => data.nama === selectedBab);

      if (!bab) {
        throw new Error("Bab tidak ditemukan");
      }

      const babid = bab.id;

      const response = await axios.patch(
        `http://localhost:3000/api/datasubbab/${babid}/updateorder`,
        {
          ...updatedOrder,
        }
      );
      getDataSubBabByBab(selectedBab);
      setIsEditOrder(false);
      return response.data;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  };

  const handleSaveSubBabOrder = async () => {
    try {
      const result = await patchSubBabOrder(afterOrderEditDataSubBab);
      console.log("Response from backend:", result);
    } catch (error) {
      console.error("Failed to save the updated order.");
    }
  };

  const getDataSubBabByBab = async (selectedBab) => {
    try {
      const dataBab = await axios.get("http://localhost:3000/api/databab");

      const bab = dataBab.data.find((data) => data.nama === selectedBab);

      if (!bab) {
        throw new Error("Bab tidak ditemukan");
      }

      const babid = bab.id;

      const response = await axios.get(
        `http://localhost:3000/api/datasubbab/${babid}`
      );

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      const sortedDataSubBab = data.sort((a, b) => a.order - b.order);
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
                    strategy={sortableKeyboardCoordinates}
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
                    strategy={sortableKeyboardCoordinates}
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
                {selectedBabDeleteModal.nama}] ?
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
                    strategy={sortableKeyboardCoordinates}
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
                    strategy={sortableKeyboardCoordinates}
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
                  <textarea
                    placeholder="Masukkan isi"
                    className="px-3 py-2 text-[15px] h-[300px] focus:outline-none border rounded-lg"
                    onChange={(e) => {
                      setValueIsiSubBabAddModal(e.target.value);
                    }}
                    value={valueIsiSubBabAddModal}
                  />
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
                  <textarea
                    placeholder="Masukkan isi"
                    className="px-3 py-2 text-[15px] h-[300px] focus:outline-none border rounded-lg"
                    onChange={(e) => {
                      setValueIsiSubBabEditModal(e.target.value);
                    }}
                    value={valueIsiSubBabEditModal}
                  />
                </div>
              </form>
            )}
            {modalType === "Delete" && (
              <p>
                Apakah Anda yakin ingin menghapus sub bab [
                {selectedSubBabDeleteModal.nama}] ?
              </p>
            )}
          </Modal>
        </div>
      )}
    </div>
  );
};
export default ManageInformasiAkademik;
