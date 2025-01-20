import HeaderAdmin from "@/components/ui/HeaderAdmin";
import SelectField from "@/components/ui/SelectField";
import plusIcon from "../../../../assets/images/plus.png";
import searchIcon from "../../../../assets/images/search-icon.png";
import { useEffect, useState } from "react";
import Image from "next/image";
import EditButton from "@/components/ui/EditButton";
import TrashButton from "@/components/ui/TrashButton";
import ManageParameter from "./ManageParameter";
import ManageInformasiAkademik from "./ManageInformasiAkademik";
import ManageCustomContexChatbot from "./ManageCustomContextChatbot.";

interface AdminPageProps {
  activeNavbar: string;
}

const AdminPage: React.FC<AdminPageProps> = ({ activeNavbar }) => {
  return (
    <div className="w-[80%] h-screen">
      <HeaderAdmin activeNavbar={activeNavbar} />
      {activeNavbar === "Manage Parameter" && (
        <ManageParameter activeNavbar={activeNavbar} />
      )}
      {activeNavbar === "Manage Informasi Akademik" && (
        <ManageInformasiAkademik />
      )}
      {activeNavbar === "Manage Custom Context Chatbot" && (
        <ManageCustomContexChatbot />
      )}
    </div>
  );
};

export default AdminPage;
