import React from "react";
import { UserRound } from "lucide-react";
import ProfileImage from "../ProfileImage";
import Image from "next/image";

export default function MessageMahasiswa({ data, onClick }: any) {
  const date = new Date(data.waktu_pesan_terakhir);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // Format waktu dalam UTC+7
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Format AM/PM
    timeZone: "Asia/Jakarta", // Menggunakan zona waktu UTC+7
  });

  // Gabungkan tanggal dan waktu
  const formattedDateTime = `${formattedDate} ${formattedTime}`;

  return (
    <div
      onClick={() => onClick(data.id)}
      className={`flex px-4 md:px-[32px] rounded-xl mx-8 py-4 border justify-between items-center cursor-pointer`}
    >
      <div className="flex gap-4">
        <div className="rounded-full min-w-[12px] size-12 bg-orange-200">
          {data.mahasiswa?.profile_image ? (
            <img
              src={`../${data.mahasiswa.profile_image}`}
              alt="Profile"
              className="rounded-full min-w-[12px] size-12 cursor-pointer"
            />
          ) : (
            <ProfileImage
              onClick={() => {}}
              className="size-12 cursor-pointer"
            />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <p className={`${data.isRead ? "" : ""} text-[14px] md:text-[18px]`}>
            {data.mahasiswa.nama}
          </p>
          <p
            className={`text-[14px] md:text-[16px] ${data.is_dosenpa_pesan_terakhir_read || data.pengirim_pesan_terakhir === "Dosen PA" ? "" : "font-semibold"}`}
          >
            {data.pengirim_pesan_terakhir === "Dosen PA" && <span>Anda: </span>}
            {data.pesan_terakhir}
          </p>
        </div>
      </div>
      <div
        className={`${data.is_dosenpa_pesan_terakhir_read || data.pengirim_pesan_terakhir === "Dosen PA" ? "text-[14px] md:text-[16px]  pb-8" : "text-[14px] md:text-[16px]  flex flex-col gap-2"}`}
      >
        <p
          className={`${data.is_dosenpa_pesan_terakhir_read || data.pengirim_pesan_terakhir === "Dosen PA" ? "text-[14px] md:text-[16px] " : "text-[14px] md:text-[16px] font-semibold text-orange-500"}`}
        >
          {formattedDateTime}
        </p>
        <p
          className={`${data.is_dosenpa_pesan_terakhir_read || data.pengirim_pesan_terakhir === "Dosen PA" ? "hidden" : "text-[14px] md:text-[16px] font-semibold"}`}
        >
          Belum Dibaca!
        </p>
      </div>
    </div>
  );
}
