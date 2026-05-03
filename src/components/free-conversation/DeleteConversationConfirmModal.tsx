import type { ConversationSummary } from "../../types/freeConversationType";
import ModalBackdrop from "../ModalBackdrop";

type DeleteConversationConfirmModalProps = {
  conversation: ConversationSummary | null;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const DeleteConversationConfirmModal = ({
  conversation,
  isSubmitting,
  onClose,
  onConfirm,
}: DeleteConversationConfirmModalProps) => {
  if (!conversation) {
    return null;
  }

  return (
    <ModalBackdrop onClose={onClose}>
      <h3 className="text-lg font-extrabold text-slate-900">대화를 삭제할까요?</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        "{conversation.title}" 대화를 삭제하면 해당 메시지와 피드백도 함께 삭제되며 복구할 수
        없습니다.
      </p>
      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          취소
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isSubmitting}
          className="rounded-lg bg-rose-500 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-rose-300"
        >
          {isSubmitting ? "삭제 중" : "삭제"}
        </button>
      </div>
    </ModalBackdrop>
  );
};

export default DeleteConversationConfirmModal;
