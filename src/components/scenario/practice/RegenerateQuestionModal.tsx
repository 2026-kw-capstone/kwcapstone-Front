import { RefreshCw, X } from "lucide-react";

interface RegenerateQuestionModalProps {
  onClose: () => void;
}

const RegenerateQuestionModal = ({ onClose }: RegenerateQuestionModalProps) => (
  <div
    className="absolute inset-0 z-50 flex items-end justify-center bg-slate-900/40"
    onClick={onClose}
  >
    <div
      className="w-full rounded-t-[32px] bg-white p-6 pb-8 shadow-[0_-8px_30px_rgba(15,23,42,0.16)] animate-slide-up"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-extrabold text-slate-900">질문 재생성</h3>
        <button
          type="button"
          onClick={onClose}
          className="p-2 text-slate-400 transition-colors hover:text-slate-600"
          aria-label="닫기"
        >
          <X size={20} />
        </button>
      </div>

      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-[#278DFD]">
          <RefreshCw size={24} />
        </div>
        <p className="mb-2 text-[17px] font-extrabold text-slate-800">
          시나리오를 재생성 하시겠습니까?
        </p>
        <p className="break-keep text-[13.5px] font-medium leading-relaxed text-slate-500">
          현재 시점 이후의 모든 스텝이 재생성 됩니다.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 h-[54px] rounded-[18px] bg-[#F8F9FD] text-[15px] font-bold text-slate-600 transition-transform active:scale-95 hover:bg-slate-100"
        >
          취소
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 h-[54px] rounded-[18px] bg-[#278DFD] text-[15px] font-bold text-white shadow-md shadow-blue-200 transition-transform active:scale-95"
        >
          재생성하기
        </button>
      </div>
    </div>
  </div>
);

export default RegenerateQuestionModal;
