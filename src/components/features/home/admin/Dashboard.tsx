"use client";

import FilterField from "@/components/ui/FilterField";
import axios from "axios";
import { env } from "process";
import { useEffect, useState } from "react";

interface TahunAjaran {
  tahun_ajaran: string;
  order: number;
}

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  const [selectedTahunAjaran, setSelectedTahunAjaran] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [dataTahunAjaran, setDataTahunAjaran] = useState<TahunAjaran[]>([]);
  const [optionsTahunAjaran, setOptionsTahunAjaran] = useState<
    { value: string; label: string }[]
  >([]);

  const API_BASE_URL = env.API_BASE_URL as string;

  const getDataTahunAjaran = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/datatahunajaran`);

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data: TahunAjaran[] = await response.data;
      const sortedDataJurusan = data.sort((a, b) => a.order - b.order);
      setDataTahunAjaran(sortedDataJurusan);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (dataTahunAjaran.length > 0) {
      const formattedOptions = dataTahunAjaran.map((data) => ({
        value: data.tahun_ajaran,
        label: data.tahun_ajaran,
      }));

      setOptionsTahunAjaran(formattedOptions);
    }
  }, [dataTahunAjaran]);

  useEffect(() => {
    getDataTahunAjaran();
  }, []);

  return (
    <div className="m-8">
      <div className="flex gap-6">
        <FilterField
          options={optionsTahunAjaran}
          onChange={(e) => setSelectedTahunAjaran(e.target.value)}
          value={selectedTahunAjaran}
          placeholder="All Tahun Ajaran"
          className={`px-3 py-2 text-[15px] border rounded-lg focus:outline-none appearance-none w-[250px]`}
        />
        <FilterField
          options={[
            {
              value: "Ganjil",
              label: "Ganjil",
            },
            {
              value: "Genap",
              label: "Genap",
            },
          ]}
          onChange={(e) => setSelectedSemester(e.target.value)}
          value={selectedSemester}
          placeholder="All Semester"
          disabled={selectedTahunAjaran === ""}
          className={`px-3 py-2 text-[15px] border rounded-lg focus:outline-none ${selectedTahunAjaran === "" && "hidden"} appearance-none w-[150px]`}
        />
      </div>
      <div className="mt-8 p-4 border rounded-lg">
        <p className="text-[18px] font-semibold">Persentase Persebaran</p>
      </div>
      <div className="mt-8 p-4 border rounded-lg">
        <p className="text-[18px] font-semibold">
          Total Laporan Bimbingan Dosen PA
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
