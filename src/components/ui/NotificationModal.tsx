"use client";
import React, { useEffect, useRef } from "react";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import { format, formatDate } from "date-fns";
import { useRouter } from "next/navigation";
import axios from "axios";

const NotificationModal: React.FC<any> = ({
  dataUser,
  onClose,
  className,
  dataNotifikasi,
  roleUser,
  onRead,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

  const patchReadNotifikasiMahasiswa = async (selectedNotification) => {
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
      throw error;
    }
  };
  const patchReadNotifikasiDosenPA = async (selectedNotification) => {
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
      throw error;
    }
  };
  const patchReadNotifikasiKaprodi = async (selectedNotification) => {
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
      throw error;
    }
  };
  const handleMarkAllAsRead = () => {
    const patchTasks = dataNotifikasi
      .filter((data) => data.read === false)
      .map((data) => {
        if (roleUser === "Mahasiswa") {
          return patchReadNotifikasiMahasiswa(data);
        } else if (roleUser === "Dosen PA") {
          return patchReadNotifikasiDosenPA(data);
        } else if (roleUser === "Kaprodi") {
          return patchReadNotifikasiKaprodi(data);
        }
      });

    Promise.all(patchTasks).then(() => {
      if (onRead) {
        onRead(); // Refresh notifikasi kalau fungsi tersedia
      }
    });
  };

  const handleNotificationClick = (data) => {
    if (!data.read) {
      if (roleUser === "Mahasiswa") {
        patchReadNotifikasiMahasiswa(data);
      } else if (roleUser === "Dosen PA") {
        patchReadNotifikasiDosenPA(data);
      } else if (roleUser === "Kaprodi") {
        patchReadNotifikasiKaprodi(data);
      }
    }

    let submenu = "";
    if (
      data.isi === "Pengajuan bimbinganmu berhasil diterima!" ||
      data.isi.startsWith("Pengajuan bimbinganmu direschedule") ||
      data.isi.startsWith("Jadwal bimbingan ")
    ) {
      submenu = "Riwayat%20Pengajuan%20Bimbingan";
    } else if (
      data.isi.startsWith("Ada pengajuan bimbingan baru") ||
      data.isi.startsWith("Mahasiswa bimbingan Anda ")
    ) {
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
    onRead();
    router.push(`/dashboard?submenu=${submenu}`);
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
        <div className="flex flex-col max-h-[300px] mb-6 overflow-y-auto px-4">
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
