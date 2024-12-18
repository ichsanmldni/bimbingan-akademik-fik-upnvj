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
import ManageInformasiAkademik from "./ManageInformasiAkademik";

interface AdminPageProps {
  activeNavbar: string;
}

const AdminPage: React.FC<AdminPageProps> = ({ activeNavbar }) => {
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
        <ManageInformasiAkademik />
      )}
    </div>
  );
};

export default AdminPage;
