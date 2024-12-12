import React from "react";
import { UserRound } from "lucide-react";

export default function MessageMahasiswa({ data, onClick }) {
  const date = new Date(data.waktu_pesan_terakhir);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // AM/PM format
    timeZone: "UTC", // Menggunakan zona waktu UTC
  });

  const formattedDateTime = `${formattedDate} ${formattedTime}`;
  console.log(data);
  return (
    <div
      onClick={() => onClick(data.id)}
      className={`flex px-[32px] rounded-lg mt-4 mx-8 py-4 border justify-between items-center cursor-pointer`}
    >
      <div className="flex gap-4">
        <div className="rounded-full size-12 bg-orange-200">
          <UserRound className="size-12 p-2 text-center" />
        </div>
        <div className="flex flex-col gap-2">
          <p className={`${data.isRead ? "" : ""} text-[18px]`}>
            {data.mahasiswa.nama_lengkap}
          </p>
          <p
            className={`${data.is_pesan_terakhir_read || data.pengirim_pesan_terakhir === "Dosen PA" ? "" : "font-semibold"}`}
          >
            {data.pesan_terakhir}
          </p>
        </div>
      </div>
      <div
        className={`${data.is_pesan_terakhir_read || data.pengirim_pesan_terakhir === "Dosen PA" ? "pb-8" : "flex flex-col gap-2"}`}
      >
        <p
          className={`${data.is_pesan_terakhir_read || data.pengirim_pesan_terakhir === "Dosen PA" ? "" : "font-semibold text-orange-500"}`}
        >
          {formattedDateTime}
        </p>
        <p
          className={`${data.is_pesan_terakhir_read || data.pengirim_pesan_terakhir === "Dosen PA" ? "hidden" : "font-semibold"}`}
        >
          Belum Dibaca!
        </p>
      </div>
    </div>
  );
}
