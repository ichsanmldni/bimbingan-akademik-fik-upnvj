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
  setIsOpen: (value: boolean) => void;
}

const SidebarChatbot: React.FC<SidebarChatbotProps> = ({
  data,
  activeSesiChatbotMahasiswa,
  setActiveSesiChatbotMahasiswa,
  setIsOpen,
}) => {
  const [grouped, setGrouped] = useState<Record<string, ChatbotSession[]>>({});

  const groupDataByDate = (data: ChatbotSession[]) => {
    const grouped: Record<string, ChatbotSession[]> = {};

    // Dapatkan waktu sekarang dalam UTC dan sesuaikan ke GMT+8
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    data.forEach((item) => {
      const itemDate = new Date(item.waktu_mulai);
      const itemDay = new Date(itemDate.setHours(0, 0, 0, 0));

      if (itemDay.getTime() === today.getTime()) {
        if (!grouped["Hari Ini"]) grouped["Hari Ini"] = [];
        grouped["Hari Ini"].push(item);
      } else if (itemDay.getTime() === yesterday.getTime()) {
        if (!grouped["Kemarin"]) grouped["Kemarin"] = [];
        grouped["Kemarin"].push(item);
      } else if (itemDay.getTime() > sevenDaysAgo.getTime()) {
        if (!grouped["7 Hari Terakhir"]) grouped["7 Hari Terakhir"] = [];
        grouped["7 Hari Terakhir"].push(item);
      } else if (itemDay.getTime() > thirtyDaysAgo.getTime()) {
        if (!grouped["30 Hari Terakhir"]) grouped["30 Hari Terakhir"] = [];
        grouped["30 Hari Terakhir"].push(item);
      } else {
        if (!grouped["Lebih Lama"]) grouped["Lebih Lama"] = [];
        grouped["Lebih Lama"].push(item);
      }
    });

    // Urutkan setiap grup berdasarkan `waktu_mulai` (paling baru di atas)
    Object.keys(grouped).forEach((key) => {
      grouped[key].sort(
        (a, b) =>
          new Date(b.waktu_mulai).getTime() - new Date(a.waktu_mulai).getTime()
      );
    });

    setGrouped(grouped);
  };

  useEffect(() => {
    if (data.length === 0) {
      setGrouped({
        "Hari Ini": [
          {
            id: 0,
            waktu_mulai: new Date().toISOString(),
            pesan_pertama: "New Chat",
          },
        ],
      });
    } else {
      groupDataByDate(data);
    }
  }, [data]);

  return (
    <div className="h-screen flex flex-col items-start pt-4 md:pt-[80px] pl-6 pr-2 pb-8 bg-white shadow-md w-[200px] md:w-[270px]">
      <p className="text-[#FE6500] font-bold text-[16px] px-1 py-2 mb-2">
        Riwayat Chatbot
      </p>
      <div className="flex flex-col w-full mb-4">
        <button
          onClick={() => setActiveSesiChatbotMahasiswa(0)}
          className={`text-[14px] text-left outline-none py-2 px-3 bg-gray-100 shadow-sm rounded-lg ${
            activeSesiChatbotMahasiswa === 0
              ? "bg-[#FE6500] text-white"
              : "hover:bg-[#FE6500] hover:text-white"
          }`}
        >
          New Chat
        </button>
      </div>
      <div className="overflow-y-auto w-full mt-2 pb-2 custom-scrollbar flex flex-col gap-4">
        {/* Render berdasarkan grup */}
        {Object.keys(grouped)
          .sort((a, b) => {
            const order = [
              "Hari Ini",
              "Kemarin",
              "7 Hari Terakhir",
              "30 Hari Terakhir",
              "Lebih Lama",
            ];

            const aIndex = order.indexOf(a);
            const bIndex = order.indexOf(b);

            if (aIndex !== -1 && bIndex !== -1) {
              return aIndex - bIndex;
            }

            return 0; // Tidak perlu sorting bulan/tahun karena sudah digantikan dengan "Lebih Lama"
          })
          .map((group) => (
            <div key={group}>
              <p className="text-[#FE6500] font-bold ml-2 mb-2">{group}</p>
              <div className="flex flex-col gap-1 mr-4">
                {grouped[group].map((item) => (
                  <button
                    onClick={() => {
                      setActiveSesiChatbotMahasiswa(item.id);
                    }}
                    key={item.id}
                    className={`outline-none text-[15px] w-full text-left py-2 px-3 rounded-lg hover:bg-[#FE6500] hover:text-white ${
                      activeSesiChatbotMahasiswa === item.id
                        ? "bg-[#FE6500] text-white"
                        : ""
                    }`}
                  >
                    <div>
                      <span className="block md:hidden">
                        {item.pesan_pertama.length > 13
                          ? item.pesan_pertama.slice(0, 13) + "..."
                          : item.pesan_pertama}
                      </span>
                      <span className="hidden md:block">
                        {item.pesan_pertama.length > 20
                          ? item.pesan_pertama.slice(0, 20) + "..."
                          : item.pesan_pertama}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px; /* Lebar scrollbar */
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1; /* Warna latar scrollbar */
          border-radius: 4px; /* Sudut pembulatan thumb */
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #fe6500; /* Warna thumb scrollbar */
          border-radius: 4px; /* Sudut pembulatan thumb */
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #e55b00; /* Warna thumb saat dihover */
        }
      `}</style>
    </div>
  );
};

export default SidebarChatbot;
