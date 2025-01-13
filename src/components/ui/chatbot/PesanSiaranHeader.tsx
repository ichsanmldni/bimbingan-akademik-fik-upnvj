import React from "react";
import { UserRound } from "lucide-react";
import ProfileImage from "../ProfileImage";
import broadcastIcon from "../../../assets/images/broadcast-icon.png";
import Image from "next/image";

export default function PesanSiaranHeader(data) {
  return (
    <div className="flex gap-4 p-4 items-center">
      <div className="rounded-full size-12 bg-orange-200">
        <Image src={broadcastIcon} className="size-12 rounded-full" alt="" />
      </div>
      <p className="text-[18px]">Pesan Siaran Mahasiswa Bimbingan {}</p>
    </div>
  );
}
