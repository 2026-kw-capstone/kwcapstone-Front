import type { FormEvent } from "react";
import { X } from "lucide-react";
import ModalBackdrop from "../ModalBackdrop";

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
    <ModalBackdrop onClose={onClose}>
      <div className="relative pr-9">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-0 top-0 inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          aria-label="모달 닫기"
        >
          <X size={18} />
        </button>
        <h3 className="text-base font-extrabold tracking-tight text-slate-900">시나리오 추가</h3>
        <p className="mt-1 text-[13px] leading-5 text-slate-500">
          시나리오가 생성되어 나만의 시나리오에 추가됩니다
        </p>
      </div>

      <form className="mt-4 space-y-4" onSubmit={onSubmit}>
        <label className="block">
          <span className="mb-1.5 ml-1 block text-[13px] font-semibold text-slate-700">
            상황 이름
          </span>
          <input
            required
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            placeholder="예: 은행 계좌 개설 문의"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 ml-1 block text-[13px] font-semibold text-slate-700">
            간단한 상황 설명
          </span>
          <textarea
            rows={3}
            value={description}
            onChange={(event) => onDescriptionChange(event.target.value)}
            placeholder="연습하고 싶은 대화 상황을 적어주세요."
            className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white"
          />
        </label>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isCreating || !title.trim()}
            className="w-full rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition enabled:hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-300 disabled:text-emerald-50 disabled:opacity-70 disabled:shadow-none"
          >
            {isCreating ? "추가 중..." : "시나리오 추가"}
          </button>
        </div>
      </form>
    </ModalBackdrop>
  );
};

export default ScenarioCreateModal;
