"use client";

import SelectField from "@/components/ui/SelectField";
import searchIcon from "../../../../assets/images/search-icon.png";
import TrashButton from "@/components/ui/TrashButton";
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import EditButton from "@/components/ui/EditButton";

interface TahunAjaran {
  tahun_ajaran: string;
  order: number;
}

interface User {
  id: number;
  nama_lengkap: string;
  nim?: string;
  nip?: string;
  email: string;
  no_whatsapp: string;
  role: string;
}

interface LaporanBimbingan {
  // Define the structure of LaporanBimbingan based on your API response
}

interface ManageUserProps {}

const ManageUser: React.FC<ManageUserProps> = () => {
  const [selectedRoleManageUser, setSelectedRoleManageUser] =
    useState<string>("");
  const [dataTahunAjaran, setDataTahunAjaran] = useState<TahunAjaran[]>([]);
  const [dataUser, setDataUser] = useState<User[]>([]);

  const getDataTahunAjaran = async () => {
    try {
      const response = await axios.get<TahunAjaran[]>(
        "http://localhost:3000/api/datatahunajaran"
      );

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const sortedDataJurusan = response.data.sort((a, b) => a.order - b.order);
      setDataTahunAjaran(sortedDataJurusan);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataUser = async () => {
    try {
      const response = await axios.get<User[]>(
        `http://localhost:3000/api/datauser`
      );

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      setDataUser(response.data);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  useEffect(() => {
    getDataTahunAjaran();
    getDataUser();
  }, []);

  return (
    <div className="m-8">
      <div className="flex justify-end gap-8 mr-6">
        <SelectField
          options={[
            { value: "Mahasiswa", label: "Mahasiswa" },
            { value: "Dosen PA", label: "Dosen PA" },
            { value: "Kaprodi", label: "Kaprodi" },
            { value: "Admin", label: "Admin" },
          ]}
          onChange={(e) => setSelectedRoleManageUser(e.target.value)}
          value={selectedRoleManageUser}
          placeholder="Filter Role"
          className={`px-3 py-2 text-[14px] border rounded-lg appearance-none w-[200px]`}
        />
        <div className="flex px-3 py-2 bg-[#F8FAFC] items-center gap-3 rounded-lg w-[20%]">
          <Image src={searchIcon} alt="Search Icon" className="size-4" />
          <input
            className="text-[#525252] bg-[#F8FAFC] text-[14px] focus:outline-none w-[80%]"
            placeholder="Cari"
          />
        </div>
      </div>
      <div className="mt-8 px-6">
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="px-4 py-2 rounded-tl-lg rounded-bl-lg">No</th>
                <th className="px-4 py-2">Nama</th>
                <th className="px-4 py-2">NIM/NIP</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">No HP</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2 rounded-tr-lg rounded-br-lg">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {dataUser.map((data, index) => (
                <tr key={data.id} className="text-center">
                  <td className="border-b border-gray-200 px-4 py-6">
                    {index + 1}
                  </td>
                  <td className="border-b border-gray-200 px-4 py-6">
                    {data.nama_lengkap}
                  </td>
                  <td className="border-b border-gray-200 px-4 py-6">
                    {data.nim || data.nip}
                  </td>
                  <td className="border-b border-gray-200 px-4 py-6">
                    {data.email}
                  </td>
                  <td className="border-b border-gray-200 px-4 py-6">
                    {data.no_whatsapp}
                  </td>
                  <td className="border-b border-gray-200 px-4 py-6">
                    {data.role === "mahasiswa"
                      ? "Mahasiswa"
                      : data.role === "dosen_pa"
                        ? "Dosen PA"
                        : data.role === "kaprodi"
                          ? "Kaprodi"
                          : ""}
                  </td>
                  <td className="border-b border-gray-200 px-4 py-6">
                    <div className="flex gap-2 items-center justify-center">
                      <EditButton
                        onClick={() => {}}
                        className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 size-8"
                      />
                      <TrashButton
                        onClick={() => {}}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 size-8"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUser;
