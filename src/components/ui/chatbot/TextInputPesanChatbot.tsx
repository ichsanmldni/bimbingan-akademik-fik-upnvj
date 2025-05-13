import React, { useEffect, useRef, useState } from "react";
import { SendHorizontal } from "lucide-react";
import Image from "next/image";
import sendIcon from "../../../assets/images/send-icon.png";

export default function TextInputPesanChatbot({
  handleAddChatChatbotMahasiswa = (newMessage: any) => {},
}) {
  const [message, setMessage] = useState("");
  const textAreaRef = useRef(null); // Referensi untuk textarea

  useEffect(() => {
    textAreaRef.current?.focus(); // Fokuskan ke textarea saat komponen dimuat
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey && message.trim() !== "") {
      event.preventDefault(); // Mencegah newline pada textarea
      if (message.trim() !== "") {
        handleAddChatChatbotMahasiswa({
          pesan: message.trim(), // Menghilangkan spasi di awal & akhir
          waktu_kirim: new Date().toISOString(),
        });
        setMessage(""); // Reset input setelah mengirim
      }
    }
  };

  return (
    <div className="relative flex flex-col border rounded-lg">
      <textarea
        ref={textAreaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Kirim pesan ke Chatbot BIMAFIK..."
        className="p-4 pb-14 focus:outline-none resize-none rounded-lg w-full h-32"
      />

      {/* Tombol kirim melayang */}
      <button
        onClick={() => {
          handleAddChatChatbotMahasiswa({
            pesan: message,
            waktu_kirim: new Date().toISOString(),
          });
          setMessage("");
          textAreaRef.current?.focus();
        }}
        className="absolute bottom-4 right-4 p-2 rounded-full transition duration-200"
      >
        <Image
          src={sendIcon}
          alt="Send Icon"
          width={24}
          height={24}
          className="inline-block"
        />
      </button>
    </div>
  );
}
