import React from "react";
import { UserRound } from "lucide-react";
import ProfileImage from "../ProfileImage";

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
      className={`flex px-[32px] rounded-xl mx-8 py-4 border justify-between items-center cursor-pointer`}
    >
      <div className="flex gap-4">
        <div className="rounded-full size-12 bg-orange-200">
          {data.mahasiswa?.profile_image ? (
            <img
              src={`../${data.mahasiswa.profile_image}`}
              alt="Profile"
              className="rounded-full size-12 cursor-pointer"
            />
          ) : (
            <ProfileImage className="size-12 cursor-pointer" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <p className={`${data.isRead ? "" : ""} text-[18px]`}>
            {data.mahasiswa.nama}
          </p>
          <p
            className={`${data.is_dosenpa_pesan_terakhir_read || data.pengirim_pesan_terakhir === "Dosen PA" ? "" : "font-semibold"}`}
          >
            {data.pengirim_pesan_terakhir === "Dosen PA" && <span>Anda: </span>}
            {data.pesan_terakhir}
          </p>
        </div>
      </div>
      <div
        className={`${data.is_dosenpa_pesan_terakhir_read || data.pengirim_pesan_terakhir === "Dosen PA" ? "pb-8" : "flex flex-col gap-2"}`}
      >
        <p
          className={`${data.is_dosenpa_pesan_terakhir_read || data.pengirim_pesan_terakhir === "Dosen PA" ? "" : "font-semibold text-orange-500"}`}
        >
          {formattedDateTime}
        </p>
        <p
          className={`${data.is_dosenpa_pesan_terakhir_read || data.pengirim_pesan_terakhir === "Dosen PA" ? "hidden" : "font-semibold"}`}
        >
          Belum Dibaca!
        </p>
      </div>
    </div>
  );
}
