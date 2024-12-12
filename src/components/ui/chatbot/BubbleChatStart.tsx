import React from "react";

const BubbleChatStart = ({ data }) => {
  const formattedTime = new Date(data.waktu_kirim).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Jakarta",
  });

  return (
    <div className="w-full flex mt-4 justify-start">
      <div className="px-4 py-2 rounded-lg max-w-[800px] border bg-white">
        <p className="pr-4">{data.pesan}</p>
        <p className="text-[10px] mt-[2px] text-end">{formattedTime}</p>
      </div>
    </div>
  );
};

export default BubbleChatStart;
