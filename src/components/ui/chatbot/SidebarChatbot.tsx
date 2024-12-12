"use client";

import React, { useEffect, useState } from "react";

export default function SidebarChatbot({
  data,
  activeSesiChatbotMahasiswa,
  setActiveSesiChatbotMahasiswa,
}) {
  const [grouped, setGrouped] = useState([]);

  const groupDataByDate = (data) => {
    const grouped = {};

    data.forEach((item) => {
      const itemDate = new Date(item.waktu_mulai).toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
        day: "numeric",
        month: "numeric",
        year: "numeric",
      });

      const today = new Date().toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
        day: "numeric",
        month: "numeric",
        year: "numeric",
      });

      const itemDateKey = new Intl.DateTimeFormat("id-ID", {
        timeZone: "Asia/Jakarta",
        month: "long",
        year: "numeric",
      }).format(new Date(item.waktu_mulai));

      if (
        new Date(itemDate).toLocaleDateString("id-ID") ===
        new Date(today).toLocaleDateString("id-ID")
      ) {
        if (!grouped["Hari Ini"]) grouped["Hari Ini"] = [];
        grouped["Hari Ini"].push(item);
      } else {
        if (!grouped[itemDateKey]) grouped[itemDateKey] = [];
        grouped[itemDateKey].push(item);
      }
    });

    // Urutkan data di dalam setiap grup berdasarkan waktu_mulai (terbaru di atas)
    Object.keys(grouped).forEach((key) => {
      grouped[key].sort(
        (a, b) => new Date(b.waktu_mulai) - new Date(a.waktu_mulai)
      );
    });

    setGrouped(grouped);
  };

  useEffect(() => {
    groupDataByDate(data);
  }, [data]);

  return (
    <div className="flex flex-col items-start pt-[80px] px-6 pb-8 bg-white shadow-md w-[320px] gap-4 overflow-y-scroll h-screen">
      <p className="font-semibold text-[16px] px-1 py-2">Riwayat Chatbot</p>
      <div className="flex flex-col w-full">
        <button
          onClick={() => setActiveSesiChatbotMahasiswa("New Session")}
          className={`mb-1 text-[14px] text-left py-2 px-3 shadow-sm hover:bg-gray-50 rounded-lg ${
            activeSesiChatbotMahasiswa === "New Session"
              ? "bg-gray-50 shadow-md"
              : ""
          }`}
        >
          New Chat
        </button>

        {/* Render berdasarkan kelompok */}
        {Object.keys(grouped)
          .sort((a, b) => {
            // Pastikan "Hari Ini" berada di urutan pertama
            if (a === "Hari Ini") return -1;
            if (b === "Hari Ini") return 1;
            return a.localeCompare(b, "id-ID", { sensitivity: "base" }); // Urutkan secara alfabet untuk bulan/tahun
          })
          .map((group, groupIndex) => (
            <div key={groupIndex} className="w-full mt-2">
              <p className="font-bold text-[14px] text-gray-600 my-2">
                {group}
              </p>
              {grouped[group].map((item, index) => (
                <button
                  onClick={() => setActiveSesiChatbotMahasiswa(item.id)}
                  key={index}
                  className={`mb-1 text-[14px] w-full text-left py-2 px-3 rounded-lg hover:shadow-sm ${
                    activeSesiChatbotMahasiswa === item.id
                      ? "shadow-sm bg-gray-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {item.pesan_pertama.slice(0, 24) +
                    (item.pesan_pertama.length > 24 ? "..." : "")}
                </button>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}
