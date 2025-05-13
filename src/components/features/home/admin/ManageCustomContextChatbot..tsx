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
import { env } from "process";

const ManageCustomContexChatbot = () => {
  const [selectedCustomContext, setSelectedCustomContext] =
    useState<string>("");
  const [afterOrderEditDataCustomContext, setAfterOrderEditDataCustomContext] =
    useState([]);
  const [modalType, setModalType] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditOrder, setIsEditOrder] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataCustomContext, setDataCustomContext] = useState([]);
  const [judulCustomContextAddModal, setJudulCustomContextAddModal] =
    useState<string>("");
  const [isiCustomContextAddModal, setIsiCustomContextAddModal] =
    useState<string>("");
  const [judulCustomContextEditModal, setJudulCustomContextEditModal] =
    useState<string>("");
  const [isiCustomContextEditModal, setIsiCustomContextEditModal] =
    useState<string>("");
  const [selectedCustomContextEditModal, setSelectedCustomContextEditModal] =
    useState(null);
  const [
    selectedCustomContextDeleteModal,
    setSelectedCustomContextDeleteModal,
  ] = useState(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

  const areArraysEqual = (arr1: any[], arr2: any[]) => {
    if (arr1.length !== arr2.length) return false;
    return arr1.every(
      (item, index) => JSON.stringify(item) === JSON.stringify(arr2[index])
    );
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setJudulCustomContextAddModal("");
    setIsiCustomContextAddModal("");
    setJudulCustomContextEditModal("");
    setIsiCustomContextEditModal("");
  };

  function DraggableRow({
    id,
    index,
    data,
  }: {
    id: string;
    index: number;
    data: any;
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
        <td className="border-b border-gray-200 px-4 py-2">{data.judul}</td>
        <td className="border-b border-gray-200 px-4 py-2">{data.isi}</td>
        <td className="border-b border-gray-200 px-4 py-4">
          <div className="flex gap-2 items-center justify-center">
            <EditButton
              onClick={() => {
                setJudulCustomContextEditModal(data.judul);
                setIsiCustomContextEditModal(data.isi);
                setSelectedCustomContextEditModal(data);
                openModal("Edit");
              }}
              className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
            />
            <TrashButton
              onClick={() => {
                setSelectedCustomContextDeleteModal(data);
                openModal("Delete");
              }}
              className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
            />
          </div>
        </td>
        <DragOverlay>
          {isDragging ? (
            <table className="min-w-full text-[16px] border-collapse table-fixed bg-white bg-opacity-10 backdrop-blur-sm rounded-lg">
              <thead className="hidden">
                <tr className="bg-gray-100 text-center">
                  <th className="pr-4 py-2 pl-12 rounded-tl-lg rounded-bl-lg">
                    No
                  </th>
                  <th className="px-4 py-2">Judul</th>
                  <th className="px-4 py-2">Isi</th>
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
                  <td className={"px-4 py-2 w-1/3"}>{data.judul}</td>
                  <td className={"px-4 py-2 w-1/3"}>{data.isi}</td>
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

  const handleDragEndCustomContext = (event: any) => {
    const { active, over } = event;

    if (!over) {
      setAfterOrderEditDataCustomContext([...dataCustomContext]);
      return;
    }

    const oldIndex = afterOrderEditDataCustomContext.findIndex(
      (item) => item.id === +active.id
    );
    const newIndex = afterOrderEditDataCustomContext.findIndex(
      (item) => item.id === +over.id
    );
    if (oldIndex !== -1 && newIndex !== -1) {
      const newDataCustomContext = [...afterOrderEditDataCustomContext];

      const updatedData = newDataCustomContext.map((item, index) => {
        if (index === oldIndex) {
          return { ...item, order: newIndex + 1 }; // Set order ke posisi baru
        }
        if (index === newIndex) {
          return { ...item, order: oldIndex + 1 }; // Set order ke posisi lama
        }
        return item; // Tidak ubah item lainnya
      });
      const sortedDataCustomContext = updatedData.sort(
        (a, b) => a.order - b.order
      );
      setAfterOrderEditDataCustomContext(sortedDataCustomContext);
      setIsEditOrder(true);
    }
  };

  const addCustomContext = async (newData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/datacustomcontext`,
        newData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const patchCustomContext = async (updatedData) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/datacustomcontext`,
        updatedData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteCustomContext = async (deletedData) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/datacustomcontext`,
        {
          data: deletedData,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleAddCustomContext = async (e) => {
    e.preventDefault();

    try {
      let customContextValue: any = {
        judul: judulCustomContextAddModal,
        isi: isiCustomContextAddModal,
        order: dataCustomContext.length + 1,
      };

      const result = await addCustomContext(customContextValue);
      getDataCustomContext();
      setIsEditOrder(false);
      closeModal();
    } catch (error) {}
  };

  const handleEditCustomContext = async (id: number) => {
    try {
      let customContextValue: any = {
        id,
        judul: judulCustomContextEditModal,
        isi: isiCustomContextEditModal,
      };

      const result = await patchCustomContext(customContextValue);
      getDataCustomContext();
      setIsEditOrder(false);
      closeModal();
    } catch (error) {}
  };

  const handleDeleteCustomContext = async (id: number) => {
    try {
      let customContextValue: any = {
        id,
      };

      const result = await deleteCustomContext(customContextValue);
      closeModal();
      getDataCustomContext();
    } catch (error) {}
  };

  const patchCustomContextOrder = async (updatedOrder) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/datacustomcontext/updateorder`,
        {
          ...updatedOrder,
        }
      );
      getDataCustomContext();
      setIsEditOrder(false);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleSaveCustomContextOrder = async () => {
    try {
      const result = await patchCustomContextOrder(
        afterOrderEditDataCustomContext
      );
    } catch (error) {}
  };

  const getDataCustomContext = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/datacustomcontext`);

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      const sortedDataCustomContext = data.sort((a, b) => a.order - b.order);
      setDataCustomContext(sortedDataCustomContext);
      if (data.length === 0) {
        setAfterOrderEditDataCustomContext([]);
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (dataCustomContext.length > 0) {
      const afterOrder = dataCustomContext.map((data) => {
        return {
          ...data,
        };
      });
      setAfterOrderEditDataCustomContext(afterOrder);
    }
  }, [dataCustomContext]);

  useEffect(() => {
    getDataCustomContext();
  }, []);

  useEffect(() => {
    if (selectedCustomContext !== "") {
      setIsEditOrder(false);
    }
  }, [selectedCustomContext]);

  return (
    <div className="m-8 rounded-lg">
      <div className="mt-6">
        {afterOrderEditDataCustomContext.length === 0 ? (
          <>
            <button
              onClick={() => {
                openModal("Tambah");
              }}
              className="flex px-3 mr-4 py-2 bg-orange-500 items-center gap-2 rounded-lg ml-auto hover:bg-orange-600"
            >
              <Image src={plusIcon} alt="Plus Icon" />
              <p className="text-white text-[14px]">Tambah Context</p>
            </button>
            <div className="overflow-x-auto mt-6 mb-6">
              <DndContext onDragEnd={handleDragEndCustomContext}>
                <SortableContext
                  items={afterOrderEditDataCustomContext.map((item) => item.id)}
                >
                  <table className="min-w-full text-[16px] border-collapse table-fixed">
                    <thead>
                      <tr className="bg-gray-100 text-center">
                        <th className="px-4 py-2 pl-10 w-1/4 rounded-tl-lg rounded-bl-lg ">
                          No
                        </th>
                        <th className="px-4 py-2 w-1/4">Judul</th>
                        <th className="px-4 py-2 w-1/3">Isi</th>
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
              className="flex px-3 py-2 bg-orange-500 items-center gap-2 rounded-lg ml-auto hover:bg-orange-600"
            >
              <Image src={plusIcon} alt="Plus Icon" />
              <p className="text-white text-[14px]">Tambah Context</p>
            </button>
            <div className="overflow-x-auto mt-6 mb-6">
              <DndContext onDragEnd={handleDragEndCustomContext}>
                <SortableContext
                  items={afterOrderEditDataCustomContext.map((item) => item.id)}
                >
                  <table className="min-w-full text-[16px] border-collapse table-fixed">
                    <thead>
                      <tr className="bg-gray-100 text-center">
                        <th className="px-4 py-2 pl-10 w-1/4 rounded-tl-lg rounded-bl-lg">
                          No
                        </th>
                        <th className="px-4 py-2 w-1/4">Judul</th>
                        <th className="px-4 py-2 w-1/3">Isi</th>
                        <th className="px-4 py-2 w-1/4 rounded-tr-lg rounded-br-lg">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {afterOrderEditDataCustomContext.map((data, index) => (
                        <DraggableRow
                          key={data.id}
                          id={data.id.toString()}
                          index={index}
                          data={data}
                        />
                      ))}
                    </tbody>
                  </table>
                </SortableContext>
              </DndContext>
            </div>
            <div className="flex ml-auto my-8 justify-end gap-4">
              <button
                className={`flex px-3 py-2 w-[90px] justify-center bg-green-500 items-center gap-2 rounded-lg hover:bg-green-600 ${areArraysEqual(dataCustomContext, afterOrderEditDataCustomContext) || !isEditOrder ? "hidden" : ""}`}
                onClick={() => handleSaveCustomContextOrder()}
              >
                <p className="text-white text-[14px]">Save</p>
                <Image src={saveIcon} className="size-4" alt="Save Icon" />
              </button>
              <button
                className={`flex px-3 py-2 bg-red-500 w-[90px] justify-center items-center gap-2 rounded-lg hover:bg-red-600 ${areArraysEqual(dataCustomContext, afterOrderEditDataCustomContext) || !isEditOrder ? "hidden" : ""}`}
                onClick={() => {
                  const afterOrder = dataCustomContext.map((data) => {
                    return {
                      ...data,
                    };
                  });
                  setAfterOrderEditDataCustomContext(afterOrder);
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
          onAdd={handleAddCustomContext}
          onEdit={handleEditCustomContext}
          onDelete={handleDeleteCustomContext}
          title={`${modalType === "Delete" ? "Konfirmasi Penghapusan Context" : `${modalType} Context`}`}
          modalType={modalType}
          initialData={
            modalType === "Delete"
              ? selectedCustomContextDeleteModal
              : modalType === "Edit"
                ? selectedCustomContextEditModal
                : null
          }
        >
          {modalType === "Tambah" && (
            <form className="flex flex-col gap-4">
              <InputField
                type="text"
                placeholder="Masukkan Judul"
                onChange={(e) => {
                  setJudulCustomContextAddModal(e.target.value);
                }}
                disabled={false}
                value={judulCustomContextAddModal}
                className="px-3 py-2 text-[15px] focus:outline-none border rounded-lg"
              />
              <textarea
                placeholder="Masukkan Isi"
                onChange={(e) => {
                  setIsiCustomContextAddModal(e.target.value);
                }}
                disabled={false}
                value={isiCustomContextAddModal}
                className="px-3 py-2 min-h-[200px] text-[15px] focus:outline-none border rounded-lg"
              />
            </form>
          )}
          {modalType === "Edit" && (
            <form className="flex flex-col gap-4">
              <InputField
                type="text"
                placeholder="Masukkan Judul"
                onChange={(e) => {
                  setJudulCustomContextEditModal(e.target.value);
                }}
                disabled={false}
                value={judulCustomContextEditModal}
                className="px-3 py-2 text-[15px] w-1/2 focus:outline-none border rounded-lg"
              />
              <textarea
                placeholder="Masukkan Isi"
                onChange={(e) => {
                  setIsiCustomContextEditModal(e.target.value);
                }}
                disabled={false}
                value={isiCustomContextEditModal}
                className="px-3 py-2 min-h-[200px] text-[15px] focus:outline-none border rounded-lg"
              />
            </form>
          )}
          {modalType === "Delete" && (
            <p>
              Apakah Anda yakin ingin menghapus Context [
              {selectedCustomContextDeleteModal?.judul}] ?
            </p>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ManageCustomContexChatbot;
