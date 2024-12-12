"use client";
import React, { useState } from "react";
import { Bell, MessageSquareText } from "lucide-react";
import Notification from "./NotificationChatbot";
import upnvjLogo from "../../../assets/images/LOGO-UPNVJ.png";
import Image from "next/image";
import Logo from "@/components/ui/LogoUPNVJ";
import Link from "next/link";
import backIcon from "../../../assets/images/back-icon-black.png";

export default function NavbarChatbot({ isPathChatbot }) {
  const [showNotification, setShowNotification] = useState(false);

  const handleShowNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000); // Menutup notifikasi setelah 3 detik
  };

  return (
    <div
      className="flex w-full h-[70px] items-center justify-between shadow-sm px-8 bg-white fixed top-0 left-0 z-50"
      style={{ zIndex: 50 }}
    >
      <div className="flex gap-2">
        <a
          href="/"
          className={`flex items-center ${!isPathChatbot ? "hidden" : ""}`}
        >
          <Image src={backIcon} alt="back-icon" />
        </a>
        <a href="/chatbot" className="flex items-center">
          <Logo className="size-[40px]" />
          <p className="font-semibold text-[20px] ml-4">
            Chatbot Bimbingan Konseling FIK
          </p>
        </a>
      </div>
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
