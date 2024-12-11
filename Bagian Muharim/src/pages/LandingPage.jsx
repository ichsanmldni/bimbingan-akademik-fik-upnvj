import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TextInput from "../components/TextInput";
import { useLocation, useNavigate } from "react-router-dom";
import LandingPageHeader from "../components/LandingPageHeader";
import { v4 as uuidv4 } from "uuid";

export default function LandingPage() {
  const id = uuidv4(); // Generate unique ID

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

  function generateUniqueId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  }

  const navigate = useNavigate();

  const onSubmitHandler = (newMessage) => {
    const uniqueId = generateUniqueId();
    navigate("/chatbot/" + uniqueId, { state: newMessage });
  };

  return (
    <>
      <div className="h-full">
        <Navbar />
        <div className="flex">
          <Sidebar data={data} />
          <div className="flex flex-col pb-8 h-screen gap-8 w-full pt-[88px] ">
            <div className="pt-8 px-[120px]">
              <LandingPageHeader />
            </div>

            <div className="h-full overflow-y-scroll flex flex-col px-[120px] w-full  justify-between gap-8">
              <div
                id="message-container"
                className="pesan flex-1 flex flex-col gap-3 overflow-y-auto"
              ></div>
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
