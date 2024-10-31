import React from "react";

interface ModalProps {
  onClose: () => void; // Definisikan tipe onClose sebagai fungsi tanpa parameter dan tanpa return
}

const NotificationModal: React.FC<ModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-start mt-[80px] mr-[180px] justify-end z-50">
      <div className="bg-white border-2 p-6 rounded-lg w-80">
        <h2 className="text-lg font-semibold mb-4">Notifikasi</h2>
        <p>Ini adalah notifikasi terbaru Anda.</p>
        <button
          onClick={onClose}
          className="mt-4 bg-orange-500 px-4 py-2 rounded text-white"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};

export default NotificationModal;
