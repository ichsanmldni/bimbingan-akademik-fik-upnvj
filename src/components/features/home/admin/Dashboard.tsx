"use client";

import DonutChart from "@/components/ui/DonutChart";
import FilterField from "@/components/ui/FilterField";
import SelectField from "@/components/ui/SelectField";
import TabelDashboardAdmin from "@/components/ui/TabelDashboardAdmin";
import TabelStatistikLaporan from "@/components/ui/TabelStatistikLaporan";
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

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

  const getDataTahunAjaran = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/datatahunajaran`);

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data: TahunAjaran[] = await response.data.data;
      setDataTahunAjaran(data);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (dataTahunAjaran.length > 0) {
      const uniqueYears = new Set();
      dataTahunAjaran.forEach((data) => {
        const year = data.nama_periode.split(" ")[0];
        uniqueYears.add(year); // Menambahkan tahun ke Set
      });

      const formattedOptions = Array.from(uniqueYears).map((year) => ({
        value: year,
        label: year,
      }));
      setOptionsTahunAjaran(formattedOptions);
    }
  }, [dataTahunAjaran]);

  useEffect(() => {
    getDataTahunAjaran();
  }, []);

  return (
    <div className="px-[30px] py-[30px]">
      <div className="border px-[30px] py-[30px] rounded-lg">
        <div className="flex flex-col gap-4">
          <div className="flex gap-5">
            <SelectField
              options={optionsTahunAjaran}
              onChange={(e) => setSelectedTahunAjaran(e.target.value)}
              value={selectedTahunAjaran}
              placeholder="Semua Tahun Ajaran"
              className={`px-3 py-2 text-[15px] border rounded-lg appearance-none w-[240px]`}
            />
            <SelectField
              options={[
                { value: "Ganjil", label: "Genap" },
                { value: "Genap", label: "Genap" },
              ]}
              onChange={(e) => setSelectedSemester(e.target.value)}
              value={selectedSemester}
              placeholder="Semua Semester"
              className={`px-3 py-2 text-[15px] border rounded-lg appearance-none w-[200px]`}
            />
          </div>
          <div className="border py-6 rounded-lg font-semibold text-[18px]">
            <h1 className="px-6 mb-6">Persentase Sebaran</h1>
            <div className="w-full mt-4 mx-auto max-w-[320px]">
              <DonutChart />
            </div>
          </div>
          <TabelDashboardAdmin />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
