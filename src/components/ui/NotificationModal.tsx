"use client";
import React, { useEffect, useRef } from "react";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import { format, formatDate } from "date-fns";
import { useRouter } from "next/navigation";

interface ModalProps {
  onClose: () => void;
  className: string;
  dataNotifikasi: any;
}

const NotificationModal: React.FC<ModalProps> = ({
  onClose,
  className,
  dataNotifikasi,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const handleNotificationClick = (data) => {
    let submenu;
    if (data.isi === "Pengajuan bimbinganmu berhasil diterima!") {
      submenu = "Riwayat%20Pengajuan%20Bimbingan";
    } else if (data.isi.startsWith("Ada pengajuan bimbingan baru")) {
      submenu = "Pengajuan%20Bimbingan%20Akademik%20Mahasiswa";
    } else if (data.isi.startsWith("Ada absensi bimbingan baru dari")) {
      submenu = "Pengesahan%20Absensi%20Bimbingan";
    } else if (data.isi.startsWith("Absensi bimbinganmu")) {
      submenu = "Absensi Bimbingan";
    }
    const targetUrl = `/dashboard?submenu=${submenu}`;
    router.push(targetUrl);
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

    const handleScroll = () => {
      onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [onClose]);

  return (
    <div className={className}>
      <style>
        {`  
          /* Custom scrollbar styles */  
          .scrollbar {  
            scrollbar-width: thin; /* For Firefox */  
            scrollbar-color: #d1d5db #f9fafb; /* For Firefox: thumb color and track color */  
          }  
  
          /* For WebKit browsers (Chrome, Safari) */  
          .scrollbar::-webkit-scrollbar {  
            width: 8px; /* Width of the scrollbar */  
          }  
  
          .scrollbar::-webkit-scrollbar-track {  
            background: #f9fafb; /* Track color */  
            border-radius: 10px; /* Rounded corners for the track */  
          }  
  
          .scrollbar::-webkit-scrollbar-thumb {  
            background-color: #d1d5db; /* Thumb color */  
            border-radius: 10px; /* Rounded corners for the thumb */  
          }  
  
          .scrollbar::-webkit-scrollbar-thumb:hover {  
            background-color: #a1a1a1; /* Thumb color on hover */  
          }  
        `}
      </style>
      <div
        ref={modalRef}
        className="bg-white bg-opacity-30 backdrop-blur-md border border-gray-200 rounded-lg shadow-2xl w-80"
      >
        <h2 className="text-lg font-semibold px-6 pt-4 pb-4 text-gray-800">
          Notifikasi
        </h2>
        <div className="flex flex-col max-h-[300px] mb-6 overflow-y-auto px-4 scrollbar">
          {dataNotifikasi.length > 0 ? (
            dataNotifikasi
              .slice()
              .reverse()
              .map((data: any, index: any) => (
                <div
                  key={index}
                  onClick={() => handleNotificationClick(data)}
                  className={`backdrop-blur-sm border border-gray-200 rounded-lg p-3 mb-2 mx-2 hover:cursor-pointer shadow-sm transition-transform transform hover:scale-[101%] ${data.read ? "bg-white bg-opacity-60" : "bg-orange-200 bg-opacity-60"}`}
                >
                  <div className="flex items-center">
                    {/* Icon to indicate unread status */}
                    {!data.read && (
                      <FiberNewIcon className="text-orange-500 mr-2" />
                    )}
                    <p
                      className={`text-xs ${data.read ? "text-gray-500" : "font-semibold text-gray-800"}`}
                    >
                      {format(new Date(data.waktu), "d/M/yyyy, hh:mm a")}
                    </p>
                  </div>
                  <p
                    className={`mt-1 text-[14px] ${data.read ? "text-gray-700" : "font-medium text-gray-900"}`}
                  >
                    {data.isi}
                  </p>
                </div>
              ))
          ) : (
            <p className="text-center text-gray-400">Belum ada notifikasi</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
