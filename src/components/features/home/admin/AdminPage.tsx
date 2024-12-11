import HeaderAdmin from "@/components/ui/HeaderAdmin";
import SelectField from "@/components/ui/SelectField";
import plusIcon from "../../../../assets/images/plus.png";
import searchIcon from "../../../../assets/images/search-icon.png";
import { useEffect, useState } from "react";
import Image from "next/image";
import EditButton from "@/components/ui/EditButton";
import TrashButton from "@/components/ui/TrashButton";
import ManageParameter from "./ManageParameter";
import Dashboard from "./Dashboard";
import ManageLaporanBimbingan from "./ManageLaporanBimbingan";
import ManageJadwalDosenPA from "./ManageJadwalDosenPA";
import ManageUser from "./ManageUser";

interface AdminPageProps {
  activeNavbar: string;
}

const AdminPage: React.FC<AdminPageProps> = ({ activeNavbar }) => {
  const [selectedTahunAjaran, setSelectedTahunAjaran] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedBab, setSelectedBab] = useState("");
  const [selectedSubBab, setSelectedSubBab] = useState("");
  const [activeTab, setActiveTab] = useState("Bab");
  const tabs = ["Bab", "Sub Bab", "Isi"];

  const handleClickTab = (tab) => {
    setActiveTab(tab);
    setSelectedBab("");
    setSelectedSubBab("");
  };

  useEffect(() => {
    setSelectedSubBab("");
  }, [selectedBab]);

  return (
    <div className="w-[80%] h-screen">
      <HeaderAdmin activeNavbar={activeNavbar} />
      {activeNavbar === "Dashboard" && <Dashboard />}
      {activeNavbar === "Manage Parameter" && (
        <ManageParameter activeNavbar={activeNavbar} />
      )}
      {activeNavbar === "Manage Laporan Bimbingan" && (
        <ManageLaporanBimbingan />
      )}
      {activeNavbar === "Manage Jadwal Dosen PA" && <ManageJadwalDosenPA />}
      {activeNavbar === "Manage User" && <ManageUser />}
      {activeNavbar === "Manage Informasi Akademik" && (
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
            <div className="border rounded-tr-lg rounded-br-lg rounded-bl-lg p-8">
              <div className="flex gap-8 justify-end px-4 h-[39px]">
                <button className="flex px-3 py-2 bg-orange-500 items-center gap-2 rounded-lg hover:bg-orange-600">
                  <Image src={plusIcon} alt="Plus Icon" />
                  <p className="text-white text-[14px]">Tambah Konten</p>
                </button>
                <div className="flex px-3 py-2 bg-[#F8FAFC] items-center gap-3 rounded-lg">
                  <Image
                    src={searchIcon}
                    alt="Search Icon"
                    className="size-4"
                  />
                  <input
                    className="text-[#525252] bg-[#F8FAFC] text-[14px] focus:outline-none w-[80%]"
                    placeholder="Cari"
                  />
                </div>
              </div>
              <div className="rounded-lg mt-6 px-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100 text-center">
                        <th className="px-4 py-2 rounded-tl-lg rounded-bl-lg">
                          Urutan
                        </th>
                        <th className="px-4 py-2">Bab</th>
                        <th className="px-4 py-2 rounded-tr-lg rounded-br-lg">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="text-center">
                        <td className="border-b border-gray-200 px-4 py-6">
                          1
                        </td>
                        <td className="border-b border-gray-200 px-4 py-6">
                          Profil Fakultas: Ilmu Komputer Universitas Pembangunan
                          Nasional Veteran Jakarta
                        </td>
                        <td className="border-b border-gray-200 px-4 py-6">
                          <div className="flex gap-2 items-center justify-center">
                            <EditButton className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 size-8" />
                            <TrashButton className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 size-8" />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Sub Bab" && (
            <div className="border rounded-lg p-8">
              <div className="flex justify-between gap-8 px-4">
                <div className="flex gap-4">
                  <SelectField
                    options={[
                      { value: "Mahasiswa", label: "Mahasiswa" },
                      { value: "Dosen PA", label: "Dosen PA" },
                      { value: "Kaprodi", label: "Kaprodi" },
                      { value: "Admin", label: "Admin" },
                    ]}
                    onChange={(e) => setSelectedBab(e.target.value)}
                    value={selectedBab}
                    placeholder="Pilih Bab"
                    className={`px-3 py-2 text-[14px] border rounded-lg appearance-none w-[200px]`}
                  />
                </div>
                <div className={`flex gap-8 ${selectedBab === "" && "hidden"}`}>
                  <button className="flex px-3 py-2 bg-orange-500 items-center gap-2 rounded-lg hover:bg-orange-600">
                    <Image src={plusIcon} alt="Plus Icon" />
                    <p className="text-white text-[14px]">Tambah Konten</p>
                  </button>
                  <div className="flex px-3 py-2 bg-[#F8FAFC] items-center gap-3 rounded-lg">
                    <Image
                      src={searchIcon}
                      alt="Search Icon"
                      className="size-4"
                    />
                    <input
                      className="text-[#525252] bg-[#F8FAFC] text-[14px] focus:outline-none w-[80%]"
                      placeholder="Cari"
                    />
                  </div>
                </div>
              </div>
              <div
                className={`rounded-lg mt-6 px-4 ${selectedBab === "" && "hidden"}`}
              >
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100 text-center">
                        <th className="px-4 py-2 rounded-tl-lg rounded-bl-lg">
                          Urutan
                        </th>
                        <th className="px-4 py-2">Sub Bab</th>
                        <th className="px-4 py-2 rounded-tr-lg rounded-br-lg">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="text-center">
                        <td className="border-b border-gray-200 px-4 py-6">
                          1
                        </td>
                        <td className="border-b border-gray-200 px-4 py-6">
                          Profil Fakultas: Ilmu Komputer Universitas Pembangunan
                          Nasional Veteran Jakarta
                        </td>
                        <td className="border-b border-gray-200 px-4 py-6">
                          <div className="flex gap-2 items-center justify-center">
                            <EditButton className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 size-8" />
                            <TrashButton className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 size-8" />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Isi" && (
            <div className="border rounded-lg p-8">
              <div className="flex justify-between gap-8 px-4">
                <div className="flex gap-4">
                  <SelectField
                    options={[
                      { value: "Mahasiswa", label: "Mahasiswa" },
                      { value: "Dosen PA", label: "Dosen PA" },
                      { value: "Kaprodi", label: "Kaprodi" },
                      { value: "Admin", label: "Admin" },
                    ]}
                    onChange={(e) => setSelectedBab(e.target.value)}
                    value={selectedBab}
                    placeholder="Pilih Bab"
                    className={`px-3 py-2 text-[14px] border rounded-lg appearance-none w-[200px]`}
                  />
                  <SelectField
                    options={[
                      { value: "Mahasiswa", label: "Mahasiswa" },
                      { value: "Dosen PA", label: "Dosen PA" },
                      { value: "Kaprodi", label: "Kaprodi" },
                      { value: "Admin", label: "Admin" },
                    ]}
                    onChange={(e) => setSelectedSubBab(e.target.value)}
                    value={selectedSubBab}
                    disabled={selectedBab === ""}
                    placeholder="Pilih Sub Bab"
                    className={`px-3 py-2 text-[14px] border rounded-lg appearance-none w-[200px] ${selectedBab === "" && "hidden"}`}
                  />
                </div>
                <div
                  className={`flex gap-8 ${selectedSubBab === "" && "hidden"}`}
                >
                  <button className="flex px-3 py-2 bg-orange-500 items-center gap-2 rounded-lg hover:bg-orange-600">
                    <Image src={plusIcon} alt="Plus Icon" />
                    <p className="text-white text-[14px]">Tambah Konten</p>
                  </button>
                  <div className="flex px-3 py-2 bg-[#F8FAFC] items-center gap-3 rounded-lg">
                    <Image
                      src={searchIcon}
                      alt="Search Icon"
                      className="size-4"
                    />
                    <input
                      className="text-[#525252] bg-[#F8FAFC] text-[14px] focus:outline-none w-[80%]"
                      placeholder="Cari"
                    />
                  </div>
                </div>
              </div>
              <div
                className={`rounded-lg mt-6 px-4 ${selectedSubBab === "" && "hidden"}`}
              >
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100 text-center">
                        <th className="px-4 py-2 rounded-tl-lg rounded-bl-lg">
                          Urutan
                        </th>
                        <th className="px-4 py-2">Isi</th>
                        <th className="px-4 py-2 rounded-tr-lg rounded-br-lg">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="text-center">
                        <td className="border-b border-gray-200 px-4 py-6">
                          1
                        </td>
                        <td className="border-b border-gray-200 px-4 py-6">
                          Profil Fakultas: Ilmu Komputer Universitas Pembangunan
                          Nasional Veteran Jakarta
                        </td>
                        <td className="border-b border-gray-200 px-4 py-6">
                          <div className="flex gap-2 items-center justify-center">
                            <EditButton className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 size-8" />
                            <TrashButton className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 size-8" />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
