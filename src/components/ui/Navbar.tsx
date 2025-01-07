import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // perbaiki import useNavigate
import { Bell, MessageSquareText } from "lucide-react";
import Notification from "./Notification";

export default function Navbar() {
  const [showNotification, setShowNotification] = useState(false);

  const handleShowNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000); // Menutup notifikasi setelah 3 detik
  };

  const navigate = useNavigate(); // perbaiki cara penggunaan useNavigate

  return (
    <div
      className="flex w-full h-[88px] items-center justify-between shadow-md px-8 bg-white fixed top-0 left-0 z-50"
      style={{ zIndex: 50 }} // zIndex memastikan navbar tetap di atas konten lain
    >
      <button onClick={() => navigate("/")} className="flex items-center">
        <img
          src="src\assets\LOGO UPNVJ.png"
          className="h-[40px] w-[40px]"
          alt="Logo UPNVJ"
        />
        <p className="font-semibold text-[20px] ml-4">
          Chatbot Bimbingan Akademik FIK
        </p>
      </button>
      <div className="flex items-center gap-6">
        <button onClick={handleShowNotification}>
          <Bell className="hover:text-[#FB923C] cursor-pointer" />
        </button>
        <button onClick={() => navigate("/chatmahasiswa")}>
          <MessageSquareText className="hover:text-[#FB923C] cursor-pointer" />
        </button>
      </div>
      <Notification
        message="This is a success notification!"
        type="success" // bisa 'success', 'error', 'warning', 'info'
        show={showNotification}
        onClose={() => setShowNotification(false)}
      />
    </div>
  );
}
