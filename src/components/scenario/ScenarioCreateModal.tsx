import type { FormEvent } from "react";
import { X } from "lucide-react";

interface ScenarioCreateModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  isCreating: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

const ScenarioCreateModal = ({
  isOpen,
  title,
  description,
  isCreating,
  onClose,
  onSubmit,
  onTitleChange,
  onDescriptionChange,
}: ScenarioCreateModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-900/40 px-3 pb-3 pt-14"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[430px] rounded-[28px] bg-white p-5 shadow-2xl animate-slide-up"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[20px] font-black text-slate-900">
              새로운 상황 만들기
            </h3>
            <p className="mt-1 text-[13px] font-medium leading-5 text-slate-500">
              연습하고 싶은 대화 상황을 직접 추가해보세요.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="모달 닫기"
          >
            <X size={20} />
          </button>
        </div>

        <form className="w-full space-y-5" onSubmit={onSubmit}>
          <label className="block">
            <span className="mb-2 ml-1 block text-[13px] font-extrabold text-slate-700">
              상황 제목
            </span>
            <input
              required
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
              placeholder="예: 해외 여행 식당에서 주문하기"
              className="h-[56px] w-full rounded-[18px] border border-slate-100 bg-[#F8F9FD] px-5 text-[15.5px] font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-[#278DFD] focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <label className="block">
            <span className="mb-2 ml-1 block text-[13px] font-extrabold text-slate-700">
              상세 설명
            </span>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(event) => onDescriptionChange(event.target.value)}
              placeholder="어떤 대화를 연습하고 싶은지 적어주세요."
              className="w-full resize-none rounded-[18px] border border-slate-100 bg-[#F8F9FD] p-5 text-[15.5px] font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-[#278DFD] focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <button
            type="submit"
            disabled={isCreating || !title.trim() || !description.trim()}
            className="h-[56px] w-full rounded-[18px] bg-[#278DFD] text-[16.5px] font-bold text-white shadow-[0_8px_20px_rgba(39,141,253,0.3)] transition-all active:scale-95 disabled:cursor-not-allowed disabled:bg-blue-300 disabled:shadow-none"
          >
            {isCreating ? "추가 중..." : "추가하기"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScenarioCreateModal;
