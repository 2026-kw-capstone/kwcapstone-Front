import type { ReactNode } from "react";

interface ModalBackdropProps {
  onClose: () => void;
  children: ReactNode;
}

const ModalBackdrop = ({ onClose, children }: ModalBackdropProps) => {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center pointer-events-none">
      <div
        className="relative h-[100dvh] w-full max-w-[430px] overflow-hidden bg-slate-900/40 pointer-events-auto sm:h-[850px] sm:max-h-[100dvh] sm:rounded-[36px]"
        onClick={onClose}
      >
        <div className="mx-auto flex h-full w-full items-end overflow-y-auto px-3 pb-3 pt-14 sm:items-center sm:p-4">
          <div
            className="max-h-[calc(100dvh-24px)] w-full overflow-y-auto rounded-[24px] bg-white p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalBackdrop;
