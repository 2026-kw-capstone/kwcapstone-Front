import { Trash2, X } from "lucide-react";
import type { ScenarioItem } from "../../types/scenarioType";

interface ScenarioDeleteConfirmModalProps {
  scenario: ScenarioItem | null;
  onClose: () => void;
  onDelete: () => void;
}

const ScenarioDeleteConfirmModal = ({
  scenario,
  onClose,
  onDelete,
}: ScenarioDeleteConfirmModalProps) => {
  if (!scenario) {
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
        <div className="mb-8 flex items-center justify-between">
          <h3 className="text-[22px] font-black text-slate-900">
            시나리오 삭제
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="모달 닫기"
          >
            <X size={22} />
          </button>
        </div>

        <div className="mb-10 text-center">
          <div className="mx-auto mb-7 flex h-[84px] w-[84px] items-center justify-center rounded-full bg-rose-50 text-rose-500">
            <Trash2 size={34} />
          </div>
          <p className="mb-5 text-[20px] font-black text-slate-900">
            정말 삭제하시겠습니까?
          </p>
          <p className="break-keep text-[16px] font-semibold leading-8 text-slate-500">
            '{scenario.title}' 시나리오와 저장된 분석 데이터가 영구적으로
            삭제됩니다.
          </p>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="h-[80px] flex-1 rounded-[22px] bg-[#F8F9FD] text-[18px] font-extrabold text-slate-600 transition hover:bg-slate-100 active:scale-95"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="h-[80px] flex-1 rounded-[22px] bg-rose-500 text-[18px] font-extrabold text-white shadow-[0_10px_20px_rgba(244,63,94,0.25)] transition hover:bg-rose-600 active:scale-95"
          >
            삭제하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScenarioDeleteConfirmModal;
