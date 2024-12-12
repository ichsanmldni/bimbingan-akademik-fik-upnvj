import React from "react";
import { UserRound } from "lucide-react";

export default function ChatDosenHeader({ namaDosenPA }) {
  return (
    <div className="flex gap-4 p-4 items-center">
      <div className="p-1 rounded-full bg-orange-200">
        <UserRound className="" />
      </div>
      <p className="text-[18px]">{namaDosenPA}</p>
    </div>
  );
}
