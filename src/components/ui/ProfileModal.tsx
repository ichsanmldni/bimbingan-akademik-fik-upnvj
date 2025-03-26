import React, { useEffect, useRef } from "react";
import dashboardIcon from "@/assets/images/dashboard.png";
import logoutIcon from "@/assets/images/logout.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { resetState as resetUser } from "@/lib/features/authSlice";
import { resetState as resetBab } from "@/lib/features/babSlice";
import { resetState as resetDosenPA } from "@/lib/features/dosenPASlice";
import { resetState as resetKaprodi } from "@/lib/features/kaprodiSlice";
import { resetState as resetSelectedSubMenu } from "@/lib/features/selectedSubMenuSlice";
import { resetState as resetPesanSiaran } from "@/lib/features/pesanSiaranSlice";
import { resetState as resetPesanPribadi } from "@/lib/features/pesanPribadiSlice";
import { resetState as resetNotification } from "@/lib/features/notificationSlice";
import { resetState as resetMahasiswa } from "@/lib/features/mahasiswaSlice";
import { resetState as resetAuth } from "@/lib/features/authSlice";
import { useDispatch } from "react-redux";

interface ModalProps {
  onClose: () => void;
  className: string;
  isAdmin?: boolean;
}

const ProfileModal: React.FC<ModalProps> = ({
  onClose,
  className,
  isAdmin,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const dashboardHandle = () => {
    router.push("/dashboard");
  };

  const logoutHandle = () => {
    document.cookie = "authBMFK=; max-age=0; path=/;";
    dispatch(resetUser());
    dispatch(resetBab());
    dispatch(resetDosenPA());
    dispatch(resetKaprodi());
    dispatch(resetAuth());
    dispatch(resetSelectedSubMenu());
    dispatch(resetPesanSiaran());
    dispatch(resetPesanPribadi());
    dispatch(resetNotification());
    dispatch(resetMahasiswa());
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
    <div className={className}>
      <div
        ref={modalRef}
        className="flex flex-col gap-8 bg-white border-2 p-4 rounded-lg w-40"
      >
        <div
          className={`flex gap-2 cursor-pointer ${isAdmin && "hidden"} `}
          onClick={dashboardHandle}
        >
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
