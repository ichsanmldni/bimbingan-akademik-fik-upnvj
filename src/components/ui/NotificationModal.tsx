"use client";
import React, { useEffect, useRef } from "react";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import { format, formatDate } from "date-fns";
import { useRouter } from "next/navigation";
import axios from "axios";

const NotificationModal: React.FC<any> = ({
  refreshData,
  dataUser,
  onClose,
  className,
  dataNotifikasi,
  roleUser,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

  const patchReadNotififikasiMahasiswa = async (selectedNotification) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/datanotifikasimahasiswa`,
        {
          id: selectedNotification.id,
          read: false,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error read notification :", error);
      throw error;
    }
  };
  const patchReadNotififikasiDosenPA = async (selectedNotification) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/datanotifikasidosenpa`,
        {
          id: selectedNotification.id,
          read: false,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error read notification :", error);
      throw error;
    }
  };
  const patchReadNotififikasiKaprodi = async (selectedNotification) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/datanotifikasikaprodi`,
        {
          id: selectedNotification.id,
          read: false,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error read notification :", error);
      throw error;
    }
  };

  const handleMarkAllAsRead = () => {
    if (roleUser === "Mahasiswa") {
      dataNotifikasi.map((data) => {
        if (data.read === false) {
          patchReadNotififikasiMahasiswa(data);
        }
      });
      refreshData(dataUser.id);
    }
    if (roleUser === "Dosen PA") {
      dataNotifikasi.map((data) => {
        if (data.read === false) {
          patchReadNotififikasiDosenPA(data);
        }
      });
      refreshData(dataUser.id);
    } else if (roleUser === "Kaprodi") {
      dataNotifikasi.map((data) => {
        if (data.read === false) {
          patchReadNotififikasiKaprodi(data);
        }
      });
      refreshData(dataUser.id);
    }
  };

  const handleNotificationClick = (data) => {
    if (roleUser === "Mahasiswa") {
      if (data.read === false) {
        patchReadNotififikasiMahasiswa(data);
      }
    } else if (roleUser === "Dosen PA") {
      if (data.read === false) {
        patchReadNotififikasiDosenPA(data);
      }
    } else if (roleUser === "Kaprodi") {
      if (data.read === false) {
        patchReadNotififikasiKaprodi(data);
      }
    }
    let submenu;
    if (data.isi === "Pengajuan bimbinganmu berhasil diterima!") {
      submenu = "Riwayat%20Pengajuan%20Bimbingan";
    } else if (data.isi.startsWith("Ada pengajuan bimbingan baru")) {
      submenu = "Pengajuan%20Bimbingan%20Akademik%20Mahasiswa";
    } else if (data.isi.startsWith("Ada absensi bimbingan baru dari")) {
      submenu = "Pengesahan%20Absensi%20Bimbingan";
    } else if (data.isi.startsWith("Absensi bimbinganmu")) {
      submenu = "Absensi%20Bimbingan";
    } else if (data.isi.startsWith("Laporan bimbingan baru dari Dosen")) {
      submenu = "Riwayat%20Laporan%20Bimbingan%20Role%20Kaprodi";
    } else if (
      data.isi.startsWith("Laporan bimbingan Anda yang dilaksanakan pada")
    ) {
      submenu = "Riwayat%20Laporan%20Bimbingan%20Role%20Dosen%20PA";
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
        <div className="flex justify-between px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">Notifikasi</h2>
          {dataNotifikasi.filter((data) => data.read === false).length > 0 && (
            <button
              className={`text-blue-600 underline text-sm ${dataNotifikasi.filter((data) => data.read === false).length > 4 ? "pr-2" : ""}`}
              onClick={handleMarkAllAsRead}
            >
              mark all as read
            </button>
          )}
        </div>
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
