"use client";

import searchIcon from "../../../../assets/images/search-icon.png";
import TrashButton from "@/components/ui/TrashButton";
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import EditButton from "@/components/ui/EditButton";
import { env } from "process";

interface ManageJadwalDosenPAProps {}

interface TahunAjaran {
  tahun_ajaran: string;
  order: number;
}

interface Dosen {
  id: number;
  nama_lengkap: string;
}

interface JadwalDosenPA {
  dosen_pa_id: number;
  dosen_pa: {
    dosen_id: number;
  };
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
}

const ManageJadwalDosenPA: React.FC<ManageJadwalDosenPAProps> = () => {
  const [dataTahunAjaran, setDataTahunAjaran] = useState<TahunAjaran[]>([]);
  const [dataJadwalDosenPA, setDataJadwalDosenPA] = useState<JadwalDosenPA[]>(
    []
  );
  const [groupedSchedules, setGroupedSchedules] = useState<
    Record<string, Record<string, string[]>>
  >({});
  const [dataDosen, setDataDosen] = useState<Dosen[]>([]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

  const getDataTahunAjaran = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/datatahunajaran`);

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      const sortedDataJurusan = data.sort(
        (a: TahunAjaran, b: TahunAjaran) => a.order - b.order
      );
      setDataTahunAjaran(sortedDataJurusan);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataJadwalDosenPa = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/datajadwaldosenpa`);

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      setDataJadwalDosenPA(data);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataDosen = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/datadosen`);

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      setDataDosen(data);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const groupSchedules = (schedules: JadwalDosenPA[]) => {
    const grouped: Record<string, Record<string, string[]>> = {};

    schedules.forEach(
      ({ dosen_pa_id, dosen_pa, hari, jam_mulai, jam_selesai }) => {
        const dosen = dataDosen.find((data) => data.id === dosen_pa.dosen_id);
        const dosenName = dosen ? dosen.nama_lengkap : `Dosen ${dosen_pa_id}`; // Default jika nama tidak ditemukan
        if (!grouped[dosenName]) {
          grouped[dosenName] = {
            Senin: [],
            Selasa: [],
            Rabu: [],
            Kamis: [],
            Jumat: [],
          };
        }
        grouped[dosenName][hari].push(`${jam_mulai} - ${jam_selesai}`);
      }
    );

    return grouped;
  };

  useEffect(() => {
    getDataTahunAjaran();
    getDataJadwalDosenPa();
    getDataDosen();
  }, []);

  useEffect(() => {
    const grouped = groupSchedules(dataJadwalDosenPA);
    setGroupedSchedules(grouped);
  }, [dataDosen, dataJadwalDosenPA]);

  return (
    <div className="m-8">
      <div className="flex px-3 py-2 bg-[#F8FAFC] items-center gap-3 mr-6 rounded-lg ml-auto w-[20%]">
        <Image src={searchIcon} alt="Search Icon" className="size-4" />
        <input
          className="text-[#525252] bg-[#F8FAFC] text-[14px] focus:outline-none w-[80%]"
          placeholder="Cari"
        />
      </div>
      <div className="mt-8 px-6">
        <div className="overflow-x-auto mt-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="px-4 py-2 rounded-tl-lg rounded-bl-lg">No</th>
                <th className="px-4 py-2">Nama Dosen PA</th>
                <th className="px-4 py-2">Senin</th>
                <th className="px-4 py-2">Selasa</th>
                <th className="px-4 py-2">Rabu</th>
                <th className="px-4 py-2">Kamis</th>
                <th className="px-4 py-2">Jumat</th>
                <th className="px-4 py-2 rounded-tr-lg rounded-br-lg">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupedSchedules).map(
                ([dosenName, schedule], index) => (
                  <tr key={index} className="text-center">
                    <td className="border-b border-gray-200 px-4 py-6">
                      {index + 1}
                    </td>
                    <td className="border-b border-gray-200 px-4 py-6">
                      {dosenName}
                    </td>
                    {["Senin", "Selasa", "Rabu", "Kamis", "Jumat"].map(
                      (day) => (
                        <td
                          key={day}
                          className="items-center align-top px-4 py-6 border-b border-gray-200"
                        >
                          {schedule[day].length > 0 ? (
                            <ul>
                              {schedule[day].map((time, i) => (
                                <li key={i}>{time}</li>
                              ))}
                            </ul>
                          ) : (
                            <span>-</span>
                          )}
                        </td>
                      )
                    )}
                    <td className="border-b border-gray-200 px-4 py-6">
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
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageJadwalDosenPA;
