import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Fragment, ReactNode } from "react";
import saveIcon from "../../../assets/images/save-icon.png";
import addIcon from "../../../assets/images/add-data-icon.png";
import cancelIcon from "../../../assets/images/cancel-icon.png";
import trashIcon from "../../../assets/images/trash-icon.png";
import Image from "next/image";

interface ModalProps {
  isOpen: boolean;
  onClose: any;
  onAdd?: any;
  onEdit?: any;
  onDelete?: any;
  modalType?: any;
  title: string;
  children: ReactNode;
  initialData?: any;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  onEdit,
  onDelete,
  modalType,
  title,
  children,
  initialData,
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[1000]" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="scale-95 opacity-0"
              enterTo="scale-100 opacity-100"
              leave="ease-in duration-200"
              leaveFrom="scale-100 opacity-100"
              leaveTo="scale-95 opacity-0"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {title}
                </DialogTitle>
                <div className="mt-4">{children}</div>
                <div className="flex ml-auto mt-6 justify-end gap-4">
                  <button
                    className="flex px-3 py-2 bg-gray-200 w-[100px] justify-center items-center gap-2 rounded-lg hover:bg-gray-300"
                    onClick={onClose}
                  >
                    <p className="text-gray-800 font-medium text-[14px]">
                      Batal
                    </p>
                  </button>
                  <button
                    className={`flex px-3 py-2 w-[100px] justify-center ${
                      modalType === "Delete"
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    } items-center gap-2 rounded-lg`}
                    onClick={
                      modalType === "Tambah"
                        ? onAdd
                        : modalType === "Edit"
                          ? () => onEdit?.(initialData?.id!)
                          : modalType === "Delete"
                            ? () => onDelete?.(initialData?.id!)
                            : undefined
                    }
                  >
                    {modalType === "Tambah" ? (
                      <Image
                        src={addIcon}
                        className="size-[18px]"
                        alt="Add Icon"
                      />
                    ) : modalType === "Edit" ? (
                      <Image
                        src={saveIcon}
                        className="size-[18px]"
                        alt="Save Icon"
                      />
                    ) : modalType === "Delete" ? (
                      <Image
                        src={trashIcon}
                        className="size-[18px]"
                        alt="Trash Icon"
                      />
                    ) : null}
                    <p className="text-white font-medium text-[14px]">
                      {modalType === "Tambah"
                        ? "Tambah"
                        : modalType === "Edit"
                          ? "Simpan"
                          : modalType === "Delete"
                            ? "Hapus"
                            : ""}
                    </p>
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
