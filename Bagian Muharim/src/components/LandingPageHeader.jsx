import React from "react";
import Menu from "./Menu";
import { Info, MessageSquareText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingPageHeader = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col  gap-4">
      <div className="flex flex-col gap-4">
        <p className="font-bold text-[48px]">Halo!</p>
        <p className="font-bold text-[32px]">
          Ada yang bisa saya bantu seputar informasi perkuliahan Anda?
        </p>
      </div>
      <div className="flex gap-[48px]">
        <button className="w-full" onClick={() => navigate("/chatmahasiswa")}>
          <Menu
            icon={MessageSquareText}
            content="Kirim pesan langsung kepada dosen pembimbing akademik"
          />
        </button>
        <Menu
          icon={Info}
          content="Informasi jadwal kosong dosen pembimbing akademik"
        />
      </div>
    </div>
  );
};

export default LandingPageHeader;
