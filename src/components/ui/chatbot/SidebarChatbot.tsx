"use client";

import Image from "next/image";
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
  const [isLoading, setIsLoading] = useState(true);

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
    // Simulasi loading, kamu bisa sesuaikan dengan API call / data fetch aslinya
    setIsLoading(true);

    setTimeout(() => {
      if (data.length === 0) {
        setGrouped({});
      } else {
        groupDataByDate(data);
      }
      setIsLoading(false);
    }, 1000); // delay 800ms untuk loading skeleton, bisa diubah
  }, [data]);

  // Skeleton loader sederhana untuk list chat
  const renderSkeleton = () => {
    const skeletonItems = Array(15).fill(0);
    return (
      <div className="flex flex-col gap-2 pr-4">
        {skeletonItems.map((_, i) => (
          <div
            key={i}
            className="h-9 bg-gray-300 rounded-lg animate-pulse w-full"
          />
        ))}
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col items-start pt-4 md:pt-[80px] pl-6 pr-2 pb-8 bg-white shadow-md w-[200px] md:w-[270px]">
      <p className="text-[#FE6500] font-bold text-[16px] px-1 py-2 mb-2">
        Riwayat Chatbot
      </p>
      <div className="flex flex-col w-full mb-4">
        <button
          onClick={() => setActiveSesiChatbotMahasiswa(0)}
          className={`group text-[14px] flex gap-2 text-left outline-none py-2 px-3 mr-6 rounded-lg transition-all duration-200
  ${
    activeSesiChatbotMahasiswa === 0
      ? "bg-[#FE6500] text-white shadow-md" // Aktif → tanpa hover/active effect
      : "bg-white text-black shadow-md hover:shadow-lg active:shadow-inner active:translate-y-[1px] hover:bg-[#FFE5CC]"
  }
`}
        >
          <Image
            src="/edit-icon.png"
            alt="New Chat"
            width={24}
            height={24}
            className={`size-5 transition-colors rounded 
      ${
        activeSesiChatbotMahasiswa === 0 ? "hidden" : "group-hover:bg-[#FFE5CC]"
      }
    `}
          />
          <Image
            src="/edit-icon-white.png"
            alt="New Chat"
            width={24}
            height={24}
            className={`size-5 transition-colors rounded 
      ${activeSesiChatbotMahasiswa === 0 ? "block" : "hidden"}
    `}
          />
          New Chat
        </button>
      </div>
      <div className="overflow-y-auto w-full mt-2 pb-2 custom-scrollbar flex flex-col gap-4">
        {/* Jika loading tampilkan skeleton */}
        {isLoading
          ? renderSkeleton()
          : Object.keys(grouped)
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
                        className={`outline-none text-[15px] w-full text-left py-2 px-3 rounded-lg ${
                          activeSesiChatbotMahasiswa === item.id
                            ? "bg-[#FE6500] text-white"
                            : "hover:bg-[#FFE5CC]"
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
