import React from "react";

export default function Sidebar({ data }: any) {
  return (
    <div className=" flex flex-col items-start pt-[120px] px-6 pb-8 bg-white shadow-md w-[320px] gap-4 overflow-y-scroll  h-screen overflow-y-auto">
      <p className="font-semibold text-[16px] p-2">Riwayat Chatbot</p>
      <div className="flex flex-col w-full">
        {data &&
          data.map((item: any, index: any) => (
            <button key={index} className="mb-4 text-left">
              <p className="font-semibold text-[14px] p-2">{item.bulan}</p>
              <div className="flex flex-col">
                {item.topikChatbot.map((topik: any, idx: any) => (
                  <p
                    key={idx}
                    className="text-[14px] p-2 rounded hover:bg-orange-400"
                  >
                    {topik}
                  </p>
                ))}
              </div>
            </button>
          ))}
      </div>
    </div>
  );
}
