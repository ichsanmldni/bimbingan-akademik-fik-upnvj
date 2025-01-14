import React from "react";

const BubbleChatStart = ({ data }: any) => {
  const formattedTime = new Date(data.waktu_kirim).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Jakarta",
  });

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

  return (
    <div className="w-full flex mt-4 justify-start">
      <div className="px-4 py-2 rounded-lg max-w-[200px] md:max-w-[800px] border bg-white">
        {data.pesan.split("\n").map((line: any, index: any) => (
          <React.Fragment key={index}>
            {formatText(line)}
            <br />
          </React.Fragment>
        ))}
        <p className="text-[10px] mt-[2px] text-end">{formattedTime}</p>
      </div>
    </div>
  );
};

export default BubbleChatStart;
