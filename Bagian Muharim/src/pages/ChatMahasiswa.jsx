import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TextInput from "../components/TextInput";
import Header from "../components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import ChatBubble from "../components/ChatBubble";

export default function ChatMahasiswa() {
  const data = [
    {
      bulan: "Januari",
      topikChatbot: ["Penjadwalan", "Konsultasi Akademik"],
    },
    {
      bulan: "Februari",
      topikChatbot: ["Informasi Matakuliah", "Konsultasi Skripsi"],
    },
    {
      bulan: "Maret",
      topikChatbot: ["Pengumpulan Tugas", "Penjadwalan"],
    },
    {
      bulan: "Januari",
      topikChatbot: ["Penjadwalan", "Konsultasi Akademik"],
    },
    {
      bulan: "Februari",
      topikChatbot: ["Informasi Matakuliah", "Konsultasi Skripsi"],
    },
    {
      bulan: "Januari",
      topikChatbot: ["Penjadwalan", "Konsultasi Akademik"],
    },
    {
      bulan: "Februari",
      topikChatbot: ["Informasi Matakuliah", "Konsultasi Skripsi"],
    },
  ];

  const location = useLocation();

  useEffect(() => {
    console.log(location.state);
    if (location.state) {
      setChatData((prev) => [...prev, location.state]);
    }
  }, []);

  const [chatData, setChatData] = useState([]);

  const onSubmitHandler = (newMessage) => {
    setChatData((prev) => [...prev, newMessage]);
  };

  const messageEndRef = useRef(null);

  // Gunakan useEffect untuk scroll ke elemen terakhir setiap kali ada pesan baru
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatData]); // Mengawasi perubahan pada chatData

  return (
    <>
      <div className="h-full">
        <Navbar />
        <div className="flex">
          <Sidebar data={data} />
          <div className="flex flex-col pb-8 h-screen gap-8 w-full pt-[88px] ">
            <Header />
            <div className="h-full overflow-y-scroll flex flex-col px-[120px] w-full  justify-between gap-8">
              <div
                id="message-container"
                className="pesan flex-1 flex flex-col gap-3 overflow-y-auto"
              >
                {chatData.map((chat, index) => {
                  return (
                    <ChatBubble
                      key={index + " message"}
                      role={chat.role}
                      message={chat.message}
                    />
                  );
                })}

                <div ref={messageEndRef} />
              </div>
              <div className="">
                <TextInput onSubmitHandler={onSubmitHandler} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
