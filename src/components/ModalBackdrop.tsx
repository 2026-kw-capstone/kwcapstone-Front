import type { ReactNode } from "react";

interface ModalBackdropProps {
  onClose: () => void;
  children: ReactNode;
}

const ModalBackdrop = ({ onClose, children }: ModalBackdropProps) => {
  return (
    <div
      className="fixed inset-0 z-[70] bg-slate-900/40"
      onClick={onClose}
    >
      <div className="mx-auto flex h-full w-full max-w-md items-end px-3 pb-3 pt-14 sm:items-center sm:p-4">
        <div
          className="w-full rounded-[24px] bg-white p-5 shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalBackdrop;
