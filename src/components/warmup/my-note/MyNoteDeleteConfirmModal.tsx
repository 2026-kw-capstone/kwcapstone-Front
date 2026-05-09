import type { MyNoteSentenceItem } from "../../../types/myNoteType";
import ModalBackdrop from "../../ModalBackdrop";

interface MyNoteDeleteConfirmModalProps {
  sentence: MyNoteSentenceItem | null;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const MyNoteDeleteConfirmModal = ({
  sentence,
  isSubmitting,
  onClose,
  onConfirm,
}: MyNoteDeleteConfirmModalProps) => {
  if (!sentence) {
    return null;
  }

  return (
    <ModalBackdrop onClose={onClose}>
      <h3 className="text-lg font-extrabold text-slate-900">
        문장을 삭제할까요?
      </h3>
      <p className="mt-2 break-keep text-sm leading-6 text-slate-600">
        "{sentence.sentenceContent}" 문장을 삭제하면 해당 문장에 남아있는
        녹음과 분석 기록들이 전부 사라질 수 있습니다.
      </p>
      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          취소
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isSubmitting}
          className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-rose-300"
        >
          {isSubmitting ? "삭제 중" : "삭제"}
        </button>
      </div>
    </ModalBackdrop>
  );
};

export default MyNoteDeleteConfirmModal;
