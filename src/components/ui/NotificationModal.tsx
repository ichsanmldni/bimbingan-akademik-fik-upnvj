import React, { useEffect, useRef } from "react";

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
      <div ref={modalRef} className="bg-white border-2 rounded-lg w-80">
        <h2 className="text-lg font-semibold p-6">Notifikasi</h2>
        <div className="flex flex-col max-h-[200px] overflow-y-auto">
          {dataNotifikasi
            .slice()
            .reverse()
            .map((data: any, index: any) => (
              <div
                key={index}
                className="bg-orange-200 border-b border-gray-400 p-6"
              >
                <p>{new Date(data.waktu).toLocaleString()}</p>
                <p className="mt-2">{data.isi}</p>
              </div>
            ))}
        </div>
        <button
          onClick={onClose}
          className="mt-4 mx-6 mb-6 bg-orange-500 px-4 py-2 rounded text-white"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};

export default NotificationModal;
