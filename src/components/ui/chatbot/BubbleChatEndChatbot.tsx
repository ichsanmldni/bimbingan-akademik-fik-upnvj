import React from "react";

const BubbleChatEndChatbot = ({ data }: any) => {
  const formattedTime = new Date(data.waktu_kirim).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Jakarta",
  });

  const gradientBubbleChatUserStyle = {
    background: "linear-gradient(200deg, #FFCFB0 0%,  #FF9D5C 66%)",
  };

  return (
    <div className="self-end mt-4 max-w-[75%]">
      <p
        className="px-4 py-3 rounded-xl rounded-br-none whitespace-pre-wrap break-words"
        style={gradientBubbleChatUserStyle}
      >
        {data.pesan}
      </p>
    </div>
  );
};

export default BubbleChatEndChatbot;
