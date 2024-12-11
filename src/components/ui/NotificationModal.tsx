import React, { useEffect, useRef } from "react";

interface ModalProps {
  onClose: () => void;
  className: string;
}

const NotificationModal: React.FC<ModalProps> = ({ onClose, className }) => {
  const modalRef = useRef<HTMLDivElement>(null);

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
      <div ref={modalRef} className="bg-white border-2 p-6 rounded-lg w-80">
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
