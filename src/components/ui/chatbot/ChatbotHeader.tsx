import React from "react";
import Menu from "./Menu";
import { Info, MessageSquareText } from "lucide-react";
import Link from "next/link";

const ChatbotHeader = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <p className="font-bold text-[24px] md:text-[48px]">Halo!</p>
        <p className="font-bold text=[16px] md:text-[32px]">
          Ada yang bisa saya bantu seputar informasi perkuliahan Anda?
        </p>
      </div>
      <div className="flex gap-[24px] md:gap-[48px]">
        <Link href="/chatpribadi" className="w-1/2">
          <Menu
            icon={MessageSquareText}
            content="Kirim pesan langsung kepada dosen pembimbing akademik"
          />
        </Link>
        <Link
          href={`/dashboard?submenu=${encodeURIComponent("Jadwal Kosong Dosen PA Role Mahasiswa")}`}
          className="w-1/2"
        >
          <Menu
            icon={Info}
            content="Informasi jadwal kosong dosen pembimbing akademik"
          />
        </Link>
      </div>
    </div>
  );
};

export default ChatbotHeader;
