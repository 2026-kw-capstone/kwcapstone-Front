import type { FormEvent } from "react";
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
      <h3 className="text-lg font-extrabold tracking-tight text-slate-900">시나리오 추가</h3>
      <p className="mt-1 text-sm leading-6 text-slate-500">
        시나리오가 생성되어 나만의 시나리오에 추가됩니다
      </p>

      <form className="mt-4 space-y-4" onSubmit={onSubmit}>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">
            시나리오 이름
          </span>
          <input
            required
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            placeholder="예: 은행 계좌 개설 문의"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">
            상황 설명
          </span>
          <textarea
            rows={3}
            value={description}
            onChange={(event) => onDescriptionChange(event.target.value)}
            placeholder="연습하고 싶은 대화 상황을 적어주세요."
            className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white"
          />
        </label>

        <div className="flex flex-col-reverse gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isCreating || !title.trim()}
            className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-300"
          >
            {isCreating ? "추가 중..." : "시나리오 추가"}
          </button>
        </div>
      </form>
    </ModalBackdrop>
  );
};

export default ScenarioCreateModal;

