import React, { useState } from "react";
import { SendHorizontal } from "lucide-react";

export default function TextInputPesanDosenPA({
  handleAddChatDosenPA = (newMessage) => {},
}) {
  const [text, setText] = useState("");
  return (
    <div className="flex gap-4 w-full">
      <input
        type="text"
        id="textInput"
        placeholder="Ketik pesan atau pertanyaan Anda di sini..."
        className="flex-grow text-black placeholder:text-textField-2 p-4 rounded stroke-textField-1 border border-gray-300"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
      <button
        onClick={() => {
          handleAddChatDosenPA({
            pesan: text,
            role: "Dosen PA",
            waktu_kirim: new Date(),
          });
          setText("");
        }}
        className="p-4 bg-orange-400 rounded hover:bg-orange-300"
      >
        <SendHorizontal />
      </button>
    </div>
  );
}
