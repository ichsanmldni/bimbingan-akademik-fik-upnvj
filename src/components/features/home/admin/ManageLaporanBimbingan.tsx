"use client";

import FilterField from "@/components/ui/FilterField";
import SelectField from "@/components/ui/SelectField";
import searchIcon from "../../../../assets/images/search-icon.png";
import TrashButton from "@/components/ui/TrashButton";
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";

interface ManageLaporanBimbinganProps {}
const ManageLaporanBimbingan: React.FC<ManageLaporanBimbinganProps> = ({}) => {
  const [selectedTahunAjaran, setSelectedTahunAjaran] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [dataTahunAjaran, setDataTahunAjaran] = useState([]);
  const [dataLaporanBimbingan, setDataLaporanBimbingan] = useState([]);
  const [optionsTahunAjaran, setOptionsTahunAjaran] = useState([]);

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

  const getDataLaporanBimbingan = async () => {
    try {
      const dataLaporanBimbingan = await axios.get(
        `http://localhost:3000/api/laporanbimbingan`
      );
      setDataLaporanBimbingan(dataLaporanBimbingan.data);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (dataTahunAjaran.length > 0) {
      const formattedOptions = dataTahunAjaran.map((data) => {
        return {
          value: data.tahun_ajaran,
          label: data.tahun_ajaran,
        };
      });

      setOptionsTahunAjaran(formattedOptions);
    }
  }, [dataTahunAjaran]);

  useEffect(() => {
    getDataTahunAjaran();
    getDataLaporanBimbingan();
  }, []);

  return (
    <div className="m-8">
      <div className="flex px-3 py-2 bg-[#F8FAFC] items-center gap-3 rounded-lg mr-6 ml-auto w-[20%] hover:bg-orange-600]">
        <Image src={searchIcon} alt="Search Icon" className="size-4" />
        <input
          className="text-[#525252] bg-[#F8FAFC] text-[14px] focus:outline-none w-[80%]"
          placeholder="Cari"
        />
      </div>
      <div className="overflow-x-auto m-6">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="px-4 py-2 rounded-tl-lg rounded-bl-lg">No</th>
              <th className="px-4 py-2">Nama Kaprodi</th>
              <th className="px-4 py-2">Nama Dosen PA</th>
              <th className="px-4 py-2">Tanggal</th>
              <th className="px-4 py-2">Sistem Bimbingan</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2 rounded-tr-lg rounded-br-lg">Action</th>
            </tr>
          </thead>
          <tbody>
            {dataLaporanBimbingan.length > 0 ? (
              dataLaporanBimbingan.map((data, index) => (
                <tr key={data.id || index} className="text-center">
                  <td className="border-b border-gray-200 px-4 py-6">1</td>
                  <td className="border-b border-gray-200 px-4 py-6">
                    Widya Cholil
                  </td>
                  <td className="border-b border-gray-200 px-4 py-6">
                    Neny Rosmawarni
                  </td>
                  <td className="border-b border-gray-200 px-4 py-6">
                    8 September 2024
                  </td>
                  <td className="border-b border-gray-200 px-4 py-6">Online</td>
                  <td className="border-b border-gray-200 px-4 py-6">
                    Belum diberi feedback
                  </td>
                  <td className="border-b border-gray-200 px-4 py-6">
                    <div className="flex gap-2 items-center justify-center">
                      <TrashButton className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600" />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="border-b text-center p-8">
                  Belum Ada Data Laporan Bimbingan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ManageLaporanBimbingan;
