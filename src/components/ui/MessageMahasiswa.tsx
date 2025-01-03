import React from "react";
import { UserRound } from "lucide-react";

export default function MessageMahasiswa({ namaMahasiswa, time, isRead }: any) {
  return (
    <div
      className={`flex px-[32px] py-4 shadow-md justify-between items-center rounded-lg cursor-pointer ${isRead ? "bg-white" : "bg-orange-400"}`}
    >
      <div className="flex gap-4">
        <div className="p-1 rounded-full bg-orange-200">
          <UserRound />
        </div>
        <p className="text-[18px]">{namaMahasiswa}</p>
      </div>
      <p>{time}</p>
    </div>
  );
}
