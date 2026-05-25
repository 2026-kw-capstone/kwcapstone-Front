import { RefreshCw, X } from "lucide-react";

interface RegenerateQuestionModalProps {
  isPending: boolean;
  errorMessage: string;
  onClose: () => void;
  onConfirm: () => void;
}

const RegenerateQuestionModal = ({
  isPending,
  errorMessage,
  onClose,
  onConfirm,
}: RegenerateQuestionModalProps) => {
  const handleClose = () => {
    if (isPending) return;
    onClose();
  };

  return (
    <div
      className="absolute inset-0 z-50 flex items-end justify-center bg-slate-900/40"
      onClick={handleClose}
    >
      <div
        className="w-full rounded-t-[32px] bg-white p-6 pb-8 shadow-[0_-8px_30px_rgba(15,23,42,0.16)] animate-slide-up"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-slate-900">질문 재생성</h3>
          <button
            type="button"
            onClick={handleClose}
            disabled={isPending}
            className="p-2 text-slate-400 transition-colors hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="닫기"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-[#278DFD]">
            <RefreshCw
              size={24}
              className={isPending ? "animate-spin" : undefined}
            />
          </div>
          <p className="mb-2 text-[17px] font-extrabold text-slate-800">
            시나리오를 재생성하시겠습니까?
          </p>
          <p className="break-keep text-[13.5px] font-medium leading-relaxed text-slate-500">
            현재 시점 이후의 모든 단계가 재생성됩니다.
          </p>
          {errorMessage ? (
            <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-500">
              {errorMessage}
            </p>
          ) : null}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isPending}
            className="h-[54px] flex-1 rounded-[18px] bg-[#F8F9FD] text-[15px] font-bold text-slate-600 transition-transform hover:bg-slate-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="h-[54px] flex-1 rounded-[18px] bg-[#278DFD] text-[15px] font-bold text-white shadow-md shadow-blue-200 transition-transform active:scale-95 disabled:cursor-wait disabled:opacity-80"
          >
            {isPending ? "재생성 중..." : "재생성하기"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegenerateQuestionModal;
