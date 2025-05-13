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

interface ManageDataDosenTetapProps {}

interface DataDosenTetap {
  id: number;
  nama_lengkap: string;
  jurusan: string;
  order: number;
  email: string;
  isKaprodi: boolean;
}

const ManageDataDosenTetap: React.FC<ManageDataDosenTetapProps> = () => {
  const [activeTab, setActiveTab] = useState<string>("Dosen S1 Informatika");
  const tabs = [
    "Dosen S1 Informatika",
    "Dosen S1 Sistem Informasi",
    "Dosen S1 Sains Data",
    "Dosen D3 Sistem Informasi",
  ];
  const [afterOrderEditDataDosenTetap, setAfterOrderEditDataDosenTetap] =
    useState<DataDosenTetap[]>([]);
  const [activeTabKaprodi, setActiveTabKaprodi] = useState("");
  const [modalType, setModalType] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditOrder, setIsEditOrder] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataDosenTetap, setDataDosenTetap] = useState<DataDosenTetap[]>([]);
  const [valueDosenTetapAddModal, setValueDosenTetapAddModal] =
    useState<string>("");
  const [valueDosenTetapEditModal, setValueDosenTetapEditModal] =
    useState<string>("");
  const [valueEmailDosenTetapAddModal, setValueEmailDosenTetapAddModal] =
    useState<string>("");
  const [valueEmailDosenTetapEditModal, setValueEmailDosenTetapEditModal] =
    useState<string>("");
  const [selectedDosenTetapEditModal, setSelectedDosenTetapEditModal] =
    useState<DataDosenTetap | null>(null);
  const [selectedDosenTetapDeleteModal, setSelectedDosenTetapDeleteModal] =
    useState<DataDosenTetap | null>(null);
  const [optionsDosenTetap, setOptionsDosenTetap] = useState<
    { value: string; label: string }[]
  >([]);

  const [isEditKaprodiOpen, setIsEditKaprodiOpen] = useState(false);
  const [selectedKaprodi, setSelectedKaprodi] = useState<any>(""); // ID dosen

  const handleOpenEditKaprodi = () => {
    setIsEditKaprodiOpen(true);
    const currentKaprodi = afterOrderEditDataDosenTetap.find(
      (dosen) => dosen.isKaprodi
    );
    setSelectedKaprodi(currentKaprodi?.id || "");
  };

  const handleSaveKaprodi = async () => {
    try {
      // Cari dosen yang saat ini jadi kaprodi (jika ada)
      const currentKaprodi = afterOrderEditDataDosenTetap.find(
        (d) => d.isKaprodi
      );
      const newKaprodi = afterOrderEditDataDosenTetap.find(
        (d) => d.id === parseInt(selectedKaprodi)
      );

      if (!newKaprodi) {
        throw new Error("Dosen yang dipilih tidak ditemukan.");
      }

      // PATCH 1: Nonaktifkan kaprodi lama jika ada dan berbeda dari yang dipilih
      if (currentKaprodi && currentKaprodi.id !== selectedKaprodi) {
        await axios.patch(`${API_BASE_URL}/api/datadosentetap`, {
          id: currentKaprodi.id,
          nama_lengkap: currentKaprodi.nama_lengkap,
          jurusan: currentKaprodi.jurusan,
          email: currentKaprodi.email,
          isKaprodi: false,
        });
      }

      // PATCH 2: Aktifkan kaprodi baru (selalu dikirim)
      await axios.patch(`${API_BASE_URL}/api/datadosentetap`, {
        id: newKaprodi.id,
        nama_lengkap: newKaprodi.nama_lengkap,
        jurusan: newKaprodi.jurusan,
        email: newKaprodi.email,
        isKaprodi: true,
      });

      // Update state lokal
      const updatedList = afterOrderEditDataDosenTetap.map((dosen) => ({
        ...dosen,
        isKaprodi: dosen.id === selectedKaprodi,
      }));

      setActiveTabKaprodi(newKaprodi.nama_lengkap);
      getDataDosenTetap();
      setAfterOrderEditDataDosenTetap(updatedList);
      setIsEditKaprodiOpen(false);
    } catch (error) {
      // optional: tampilkan notifikasi error ke user
    }
  };

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

  const areArraysEqual = (arr1: any[], arr2: any[]) => {
    if (arr1.length !== arr2.length) return false;
    return arr1.every(
      (item, index) => JSON.stringify(item) === JSON.stringify(arr2[index])
    );
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setValueDosenTetapAddModal("");
    setValueDosenTetapEditModal("");
    setValueEmailDosenTetapAddModal("");
    setValueEmailDosenTetapEditModal("");
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
        <td className="border-b border-gray-200 px-4 py-2">
          {data.nama_lengkap}
        </td>
        <td className="border-b border-gray-200 px-4 py-2">
          {data.email !== null ? data.email : "-"}
        </td>
        <td className="border-b border-gray-200 px-4 py-4">
          <div className="flex gap-2 items-center justify-center">
            <EditButton
              onClick={() => {
                setValueDosenTetapEditModal(data.nama_lengkap);
                setValueEmailDosenTetapEditModal(data.email);
                setSelectedDosenTetapEditModal(data as DataDosenTetap);
                openModal("Edit");
              }}
              className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
            />
            <TrashButton
              onClick={() => {
                setSelectedDosenTetapDeleteModal(data as DataDosenTetap);
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
                  <th className="px-4 py-2">Nama Dosen</th>
                  <th className="px-4 py-2">Email</th>
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
                  <td className={`px-4 py-2 w-[30%]`}>{data.nama_lengkap}</td>
                  <td className={`px-4 py-2 w-[20%]`}>
                    {data.email !== null ? data.email : "-"}
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
  };

  const handleDragEndDosenTetap = (event: any) => {
    const { active, over } = event;

    if (!over) {
      setAfterOrderEditDataDosenTetap([...dataDosenTetap]);
      return;
    }

    const oldIndex = afterOrderEditDataDosenTetap.findIndex(
      (item) => item.id === +active.id
    );
    const newIndex = afterOrderEditDataDosenTetap.findIndex(
      (item) => item.id === +over.id
    );
    if (oldIndex !== -1 && newIndex !== -1) {
      const newDataDosenTetap = [...afterOrderEditDataDosenTetap];

      const updatedData = newDataDosenTetap.map((item, index) => {
        if (index === oldIndex) {
          return { ...item, order: newIndex + 1 }; // Set order ke posisi baru
        }
        if (index === newIndex) {
          return { ...item, order: oldIndex + 1 }; // Set order ke posisi lama
        }
        return item; // Tidak ubah item lainnya
      });
      const sortedDataDosenTetap = updatedData.sort(
        (a, b) => a.order - b.order
      );
      setAfterOrderEditDataDosenTetap(sortedDataDosenTetap);
      setIsEditOrder(true);
    }
  };

  const addDosenTetap = async (newData: DataDosenTetap) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/datadosentetap`,
        newData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const patchDosenTetap = async (updatedData: DataDosenTetap) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/datadosentetap`,
        updatedData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteDosenTetap = async (deletedData: DataDosenTetap) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/datadosentetap`,
        {
          data: deletedData,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleAddDosenTetap = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let dosenTetapValue: any = {
        nama_lengkap: valueDosenTetapAddModal,
        order: dataDosenTetap.length + 1,
        email: valueEmailDosenTetapAddModal,
        jurusan: activeTab.replace("Dosen ", ""),
        isKaprodi: false,
      };

      const result = await addDosenTetap(dosenTetapValue);
      getDataDosenTetap();
      setIsEditOrder(false);
      closeModal();
    } catch (error) {}
  };

  const handleEditDosenTetap = async (id: number) => {
    try {
      let dosenTetapValue: any = {
        id,
        nama_lengkap: valueDosenTetapEditModal,
        email: valueEmailDosenTetapEditModal,
        jurusan: activeTab.replace("Dosen ", ""),
      };

      const result = await patchDosenTetap(dosenTetapValue);
      getDataDosenTetap();
      setIsEditOrder(false);
      closeModal();
    } catch (error) {}
  };

  const handleDeleteDosenTetap = async (id: number) => {
    try {
      let dosenTetapValue: any = {
        id,
      };

      const result = await deleteDosenTetap(dosenTetapValue);
      closeModal();
      getDataDosenTetap();
    } catch (error) {}
  };

  const patchDosenTetapOrder = async (updatedOrder: DataDosenTetap[]) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/datadosentetap/updateorder`,
        {
          ...updatedOrder,
        }
      );
      getDataDosenTetap();
      setIsEditOrder(false);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleSaveDosenTetapOrder = async () => {
    try {
      const result = await patchDosenTetapOrder(afterOrderEditDataDosenTetap);
    } catch (error) {}
  };

  const getDataDosenTetap = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/datadosentetap`);

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      const jurusan = activeTab.replace("Dosen ", ""); // hilangkan kata "Dosen "
      const sortedDataDosenTetap = data
        .filter((item) => item.jurusan === jurusan)
        .sort((a: DataDosenTetap, b: DataDosenTetap) => a.order - b.order);
      setDataDosenTetap(sortedDataDosenTetap);
      if (data.length === 0) {
        setAfterOrderEditDataDosenTetap([]);
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    const dataKaprodi = afterOrderEditDataDosenTetap.find(
      (data) => data.isKaprodi === true
    );
    if (dataKaprodi) {
      setActiveTabKaprodi(dataKaprodi.nama_lengkap);
    } else {
      setActiveTabKaprodi("-");
    }
  }, [afterOrderEditDataDosenTetap]);

  useEffect(() => {
    if (dataDosenTetap.length > 0) {
      const formattedOptions = dataDosenTetap.map((data) => {
        return {
          value: data.nama_lengkap,
          label: data.nama_lengkap,
        };
      });

      setOptionsDosenTetap(formattedOptions);

      const afterOrder = dataDosenTetap.map((data) => {
        return {
          ...data,
        };
      });
      setAfterOrderEditDataDosenTetap(afterOrder);
    }
  }, [dataDosenTetap]);

  useEffect(() => {
    getDataDosenTetap();
  }, []);

  useEffect(() => {
    getDataDosenTetap();
  }, [activeTab]);

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

      <div className="mt-6">
        {afterOrderEditDataDosenTetap.length === 0 ? (
          <>
            <div className="justify-between flex">
              <button
                onClick={() => {
                  openModal("Tambah");
                }}
                className="flex px-3 mr-4 py-2 bg-orange-500 items-center gap-2 rounded-lg hover:bg-orange-600"
              >
                <Image src={plusIcon} alt="Plus Icon" />
                <p className="text-white text-[14px]">Tambah Dosen Tetap</p>
              </button>
              <button
                onClick={() => {
                  openModal("Tambah");
                }}
                className="flex px-3 mr-4 py-2 bg-orange-500 items-center gap-2 rounded-lg hover:bg-orange-600"
              >
                <Image src={plusIcon} alt="Plus Icon" />
                <p className="text-white text-[14px]">Tambah Dosen Tetap</p>
              </button>
            </div>
            <div className="overflow-x-auto mt-6 mb-6">
              <DndContext onDragEnd={handleDragEndDosenTetap}>
                <SortableContext
                  items={afterOrderEditDataDosenTetap.map((item) => item.id)}
                >
                  <table className="min-w-full text-[16px] border-collapse table-fixed">
                    <thead>
                      <tr className="bg-gray-100 text-center">
                        <th className="px-4 py-2 pl-10 rounded-tl-lg rounded-bl-lg ">
                          No
                        </th>
                        <td className={`px-4 py-2 w-[30%]`}>Nama Dosen</td>
                        <td className={`px-4 py-2 w-[20%]`}>Email</td>
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
            <div className="justify-between flex">
              <div className="flex gap-4 items-center">
                <p className="text-sm font-semibold">
                  Kaprodi : {activeTabKaprodi}
                </p>
                <EditButton
                  onClick={handleOpenEditKaprodi}
                  className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
                />
              </div>
              <button
                onClick={() => {
                  openModal("Tambah");
                }}
                className="flex px-3 mr-4 py-2 bg-orange-500 items-center gap-2 rounded-lg hover:bg-orange-600"
              >
                <Image src={plusIcon} alt="Plus Icon" />
                <p className="text-white text-[14px]">Tambah Dosen Tetap</p>
              </button>
            </div>
            <div className="overflow-x-auto mt-6 pb-12">
              <DndContext onDragEnd={handleDragEndDosenTetap}>
                <SortableContext
                  items={afterOrderEditDataDosenTetap.map((item) => item.id)}
                >
                  <table className="min-w-full text-[16px] border-collapse table-fixed">
                    <thead>
                      <tr className="bg-gray-100 text-center">
                        <th className="px-4 py-2 pl-10 w-1/4 rounded-tl-lg rounded-bl-lg">
                          No
                        </th>
                        <th className="px-4 py-2 w-[30%]">Nama Dosen</th>
                        <th className="px-4 py-2 w-[20%]">Email</th>
                        <th className="px-4 py-2 w-1/4 rounded-tr-lg rounded-br-lg">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {afterOrderEditDataDosenTetap.map((data, index) => (
                        <DraggableRow
                          key={data.id}
                          id={data.id.toString()}
                          index={index}
                          data={data}
                          tab="DosenTetap"
                        />
                      ))}
                    </tbody>
                  </table>
                </SortableContext>
              </DndContext>
            </div>
            <div
              className={`fixed bottom-6 right-6 z-50 flex flex-col gap-3 p-4 rounded-xl backdrop-blur-md bg-white/10 border border-white/30 shadow-xl transition-all duration-300 ${
                areArraysEqual(dataDosenTetap, afterOrderEditDataDosenTetap) ||
                !isEditOrder
                  ? "opacity-0 pointer-events-none"
                  : "opacity-100"
              }`}
            >
              <p className="text-sm font-semibold">
                Simpan urutan yang sudah diubah?
              </p>

              <div className="flex gap-4">
                <button
                  className="flex px-3 py-2 w-[90px] justify-center bg-green-500 items-center gap-2 rounded-lg hover:bg-green-600"
                  onClick={() => handleSaveDosenTetapOrder()}
                >
                  <p className="text-white text-[14px]">Save</p>
                  <Image src={saveIcon} className="size-4" alt="Save Icon" />
                </button>
                <button
                  className="flex px-3 py-2 bg-red-500 w-[90px] justify-center items-center gap-2 rounded-lg hover:bg-red-600"
                  onClick={() => {
                    const afterOrder = dataDosenTetap.map((data) => ({
                      ...data,
                    }));
                    setAfterOrderEditDataDosenTetap(afterOrder);
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
            </div>
          </>
        )}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          onAdd={handleAddDosenTetap}
          onEdit={handleEditDosenTetap}
          onDelete={handleDeleteDosenTetap}
          title={`${modalType === "Delete" ? "Konfirmasi Penghapusan DosenTetap" : `${modalType} DosenTetap`}`}
          modalType={modalType}
          initialData={
            modalType === "Delete"
              ? selectedDosenTetapDeleteModal
              : modalType === "Edit"
                ? selectedDosenTetapEditModal
                : null
          }
        >
          {modalType === "Tambah" && (
            <form className="flex flex-col gap-5">
              <InputField
                type="text"
                placeholder="Masukkan nama dosen"
                onChange={(e) => {
                  setValueDosenTetapAddModal(e.target.value);
                }}
                disabled={false}
                value={valueDosenTetapAddModal}
                className="px-3 py-2 text-[15px] focus:outline-none border rounded-lg"
              />
              <InputField
                type="text"
                placeholder="Masukkan email dosen"
                onChange={(e) => {
                  setValueEmailDosenTetapAddModal(e.target.value);
                }}
                disabled={false}
                value={valueEmailDosenTetapAddModal}
                className="px-3 py-2 text-[15px] focus:outline-none border rounded-lg"
              />
            </form>
          )}
          {modalType === "Edit" && (
            <form className="flex flex-col gap-5">
              <InputField
                type="text"
                placeholder="Masukkan nama dosen"
                onChange={(e) => {
                  setValueDosenTetapEditModal(e.target.value);
                }}
                disabled={false}
                value={valueDosenTetapEditModal}
                className="px-3 py-2 text-[15px] focus:outline-none border rounded-lg"
              />
              <InputField
                type="text"
                placeholder="Masukkan email dosen"
                onChange={(e) => {
                  setValueEmailDosenTetapEditModal(e.target.value);
                }}
                disabled={false}
                value={valueEmailDosenTetapEditModal}
                className="px-3 py-2 text-[15px] focus:outline-none border rounded-lg"
              />
            </form>
          )}
          {modalType === "Delete" && (
            <p>
              Apakah Anda yakin ingin menghapus dosen tetap [
              {selectedDosenTetapDeleteModal?.nama_lengkap}] ?
            </p>
          )}
        </Modal>
        <Modal
          isOpen={isEditKaprodiOpen}
          onClose={() => setIsEditKaprodiOpen(false)}
          onEdit={handleSaveKaprodi}
          title="Ubah Kaprodi"
          modalType="Edit"
        >
          <div className="flex flex-col gap-4">
            <label className="text-sm font-medium">Pilih Kaprodi Baru:</label>
            <select
              value={selectedKaprodi}
              onChange={(e) => setSelectedKaprodi(e.target.value)}
              className="px-3 py-2 border rounded-lg text-[15px]"
            >
              <option value="" disabled>
                -- Pilih Dosen --
              </option>
              {afterOrderEditDataDosenTetap.map((dosen) => (
                <option key={dosen.id} value={dosen.id}>
                  {dosen.nama_lengkap}
                </option>
              ))}
            </select>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ManageDataDosenTetap;
