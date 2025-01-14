import React from "react";
import { UserRound } from "lucide-react";
import ProfileImage from "../ProfileImage";
import Image from "next/image";

export default function ChatMahasiswaHeader({ data }: any) {
  return (
    <div className="flex gap-4 p-4 items-center">
      <div className="rounded-full size-12 bg-orange-200">
        {data.mahasiswa?.profile_image ? (
          <img
            src={`../${data.mahasiswa.profile_image}`}
            alt="Profile"
            className="rounded-full size-12 cursor-pointer"
          />
        ) : (
          <ProfileImage onClick={() => {}} className="size-12 cursor-pointer" />
        )}
      </div>
      <p className="text-[18px]">{data.mahasiswa?.nama}</p>
    </div>
  );
}
