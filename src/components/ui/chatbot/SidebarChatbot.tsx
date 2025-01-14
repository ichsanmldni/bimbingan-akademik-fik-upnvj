"use client";

import React, { useEffect, useState } from "react";

interface ChatbotSession {
  id: number;
  waktu_mulai: string; // Assuming this is a date string
  pesan_pertama: string;
}

interface SidebarChatbotProps {
  data: ChatbotSession[];
  activeSesiChatbotMahasiswa: number | string; // Assuming it can be a number or string
  setActiveSesiChatbotMahasiswa: (id: number) => void;
}

const SidebarChatbot: React.FC<SidebarChatbotProps> = ({
  data,
  activeSesiChatbotMahasiswa,
  setActiveSesiChatbotMahasiswa,
}) => {
  const [grouped, setGrouped] = useState<Record<string, ChatbotSession[]>>({});

  const groupDataByDate = (data: ChatbotSession[]) => {
    const grouped: Record<string, ChatbotSession[]> = {};

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

    // Sort data within each group by waktu_mulai (latest on top)
    Object.keys(grouped).forEach((key) => {
      grouped[key].sort(
        (a, b) =>
          new Date(b.waktu_mulai).getTime() - new Date(a.waktu_mulai).getTime()
      );
    });

    setGrouped(grouped);
  };

  useEffect(() => {
    groupDataByDate(data);
  }, [data]);

  return (
    <div className="h-full flex flex-col items-start pt-[80px] px-6 pb-8 bg-white shadow-md w-[200px] md:w-[320px] gap-4 overflow-y-scroll">
      <p className="font-semibold text-[16px] px-1 py-2">Riwayat Chatbot</p>
      <div className="flex flex-col w-full">
        <button
          onClick={() => setActiveSesiChatbotMahasiswa(0)}
          className={`mb-1 text-[14px] text-left outline-none py-2 px-3 shadow-sm hover:bg-gray-50 rounded-lg ${
            activeSesiChatbotMahasiswa === 0 ? "bg-gray-50 shadow-md" : ""
          }`}
        >
          New Chat
        </button>

        {/* Render based on groups */}
        {Object.keys(grouped)
          .sort((a, b) => {
            // Ensure "Hari Ini" is first
            if (a === "Hari Ini") return -1;
            if (b === "Hari Ini") return 1;
            return a.localeCompare(b, "id-ID", { sensitivity: "base" }); // Sort alphabetically for month/year
          })
          .map((group, groupIndex) => (
            <div key={groupIndex} className="w-full mt-2">
              <p className="font-bold text-[14px] text-gray-600 my-2">
                {group}
              </p>
              {grouped[group].map((item) => (
                <button
                  onClick={() => setActiveSesiChatbotMahasiswa(item.id)}
                  key={item.id} // Use item.id as the key for better performance
                  className={`mb-1 outline-none text-[14px] w-full text-left py-2 px-3 rounded-lg hover:shadow-sm ${
                    activeSesiChatbotMahasiswa === item.id
                      ? "shadow-sm bg-gray-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {item.pesan_pertama.slice(0, 22) +
                    (item.pesan_pertama.length > 22 ? "..." : "")}
                </button>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
};

export default SidebarChatbot;
