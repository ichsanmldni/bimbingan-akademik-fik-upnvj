import React, { useState } from "react";
import { SendHorizontal } from "lucide-react";

export default function TextInputPesanMahasiswa({
  handleAddChatMahasiswa = (newMessage: any) => {},
}) {
  const [text, setText] = useState("");

  return (
    <div className="flex gap-4 w-full">
      <input
        autoFocus
        type="text"
        id="textInput"
        placeholder="Ketik pesan atau pertanyaan Anda di sini..."
        className="flex-grow text-black outline-none placeholder:text-textField-2 p-4 rounded stroke-textField-1 border border-gray-300"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault(); // Mencegah perilaku default (misalnya, submit form)
            handleAddChatMahasiswa({
              pesan: text,
              waktu_kirim: new Date().toISOString(),
            });
            setText(""); // Reset input setelah mengirim pesan
          }
        }}
      />
      <button
        onClick={() => {
          handleAddChatMahasiswa({
            pesan: text,
            waktu_kirim: new Date().toISOString(),
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
