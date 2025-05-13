import React from "react";
import botIcon from "../../../assets/images/logo-bot-only.png";
import Image from "next/image";

const BubbleChatStartChatbot = ({ data }: any) => {
  const formattedTime = new Date(data.waktu_kirim).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Jakarta",
  });

  const gradientBubbleChatChatbotStyle = {
    background: "linear-gradient(135deg, #F1F1F1 0%,  #CCCCCC 100%)",
  };

  // Function to make text between ** bold
  const formatText = (text: any) => {
    // Replace **text** with <strong>text</strong>
    return text.split("\n").map((line: any, index: any) => {
      const parts = line.split("**");
      return parts.map((part: any, idx: any) => {
        if (idx % 2 === 1) {
          return <strong key={idx}>{part}</strong>;
        }
        return part;
      });
    });
  };

  const parts = data.pesan.split(/(```[\s\S]*?```)/g); // Pisah berdasarkan blok kode

  return (
    <div className="self-start flex gap-2 mt-4 max-w-[75%]">
      {/* Avatar Bot */}
      <div
        className={`bg-[#FFCFB0] self-start p-1 min-w-8 rounded-full h-8 flex items-center justify-center`}
      >
        <Image
          src={botIcon}
          alt="Bot Icon"
          width={24}
          height={24}
          className="rounded-full"
        />
      </div>
      <div
        className="px-4 py-3 max-w-[75vw] overflow-x-auto rounded-xl rounded-bl-none whitespace-pre-wrap break-words"
        style={gradientBubbleChatChatbotStyle}
      >
        {parts.map((part, index) => {
          if (part.startsWith("```")) {
            const match = part.match(/^```([a-zA-Z]*)\n([\s\S]*?)```$/);
            const language = match ? match[1] : "code";
            const code = match
              ? match[2].trim()
              : part.replace(/```/g, "").trim();

            return (
              <div key={index} className="relative ">
                <div className="bg-gray-800 text-white text-sm px-3 py-2 rounded-t-md flex justify-between items-center">
                  <span>{language || "code"}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(code)}
                    className="text-xs hover:text-gray-300"
                  >
                    Copy
                  </button>
                </div>
                <pre className="bg-gray-900 text-white text-[15px] font-mono custom-scrollbar p-4 rounded-b-md overflow-x-auto">
                  <code>{code}</code>
                </pre>
              </div>
            );
          } else {
            const formattedText = part
              .replace(
                /###\s?(.+)/g,
                '<span class="font-semibold text-lg">$1</span>'
              )
              .replace(
                /\*\*(.+?)\*\*/g,
                '<span class="font-semibold">$1</span>'
              );

            return (
              <span
                key={index}
                dangerouslySetInnerHTML={{ __html: formattedText }}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

export default BubbleChatStartChatbot;
