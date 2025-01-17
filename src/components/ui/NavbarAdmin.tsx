"use client";

import Logo from "./LogoUPNVJ";
import { useState } from "react";

interface NavbarAdminProps {
  activeNavbar: string;
  setActiveNavbar: (navbar: string) => void;
}

const NavbarAdmin: React.FC<NavbarAdminProps> = ({
  activeNavbar,
  setActiveNavbar,
}) => {
  return (
    <div className="w-[20%] p-5 border h-[1000px]">
      <div className="flex gap-2 items-center ">
        <Logo className="min-w-[56px] size-[56px] " />
        <a href="/" className="font-bold">
          Bimbingan Akademik Mahasiswa FIK
        </a>
      </div>
      <div className="flex flex-col py-6 gap-1">
        <button
          onClick={() => setActiveNavbar("Dashboard")}
          className={`text-start px-3 py-2 rounded-xl text-[14px] ${activeNavbar === "Dashboard" ? "bg-orange-500 font-medium text-white" : ""}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveNavbar("Manage Parameter")}
          className={`text-start px-3 py-2 rounded-xl text-[14px] ${activeNavbar === "Manage Parameter" ? "bg-orange-500 font-medium text-white" : ""}`}
        >
          Manage Parameter
        </button>
        <button
          onClick={() => setActiveNavbar("Manage Informasi Akademik")}
          className={`text-start px-3 py-2 rounded-xl text-[14px] ${activeNavbar === "Manage Informasi Akademik" ? "bg-orange-500 font-medium text-white" : ""}`}
        >
          Manage Informasi Akademik
        </button>
      </div>
    </div>
  );
};

export default NavbarAdmin;
