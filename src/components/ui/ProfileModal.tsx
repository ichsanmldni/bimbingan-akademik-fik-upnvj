import React, { useEffect, useRef } from "react";
import dashboardIcon from "@/assets/images/dashboard.png";
import logoutIcon from "@/assets/images/logout.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ModalProps {
  onClose: () => void;
}

const ProfileModal: React.FC<ModalProps> = ({ onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const dashboardHandle = () => {
    router.push("/dashboard");
  };

  const logoutHandle = () => {
    document.cookie = "authToken=; max-age=0; path=/;";
    window.location.reload();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-start mt-[70px] mr-[130px] justify-end z-50">
      <div
        ref={modalRef}
        className="flex flex-col gap-8 bg-white border-2 p-4 rounded-lg w-40"
      >
        <div className="flex gap-2 cursor-pointer" onClick={dashboardHandle}>
          <Image src={dashboardIcon} alt="dashboardIcon" />
          <p>Dashboard</p>
        </div>
        <div className="flex gap-2 cursor-pointer" onClick={logoutHandle}>
          <Image src={logoutIcon} alt="logoutIcon" />
          <p className="text-[#EF4444]">Keluar</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
