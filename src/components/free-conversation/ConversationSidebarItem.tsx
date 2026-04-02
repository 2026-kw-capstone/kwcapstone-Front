import { Check, MessageCircle, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { ConversationSummary } from "../../types/freeConversationType";

type ConversationSidebarItemProps = {
  conversation: ConversationSummary;
  isSelected: boolean;
  isEditing: boolean;
  isSubmittingThisConversation: boolean;
  isEditSubmitting: boolean;
  onSelectConversation: (conversationId: number) => void;
  onSubmitEditConversation: (conversationId: number, title: string) => Promise<void>;
  onStartEditing: (conversationId: number) => void;
  onFinishEditing: () => void;
  onDeleteConversation: (conversationId: number) => void;
};

const ConversationSidebarItem = ({
  conversation,
  isSelected,
  isEditing,
  isSubmittingThisConversation,
  isEditSubmitting,
  onSelectConversation,
  onSubmitEditConversation,
  onStartEditing,
  onFinishEditing,
  onDeleteConversation,
}: ConversationSidebarItemProps) => {
  const [editingTitle, setEditingTitle] = useState("");
  const [originalTitle, setOriginalTitle] = useState("");

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    setEditingTitle(conversation.title);
    setOriginalTitle(conversation.title);
  }, [conversation.title, isEditing]);

  const cancelEditing = () => {
    setEditingTitle(originalTitle);
    onFinishEditing();
  };

  const submitEditing = async () => {
    if (!isEditing || isEditSubmitting) {
      return;
    }

    const nextTitle = editingTitle.trim();
    const previousTitle = originalTitle.trim();

    if (!nextTitle || nextTitle === previousTitle) {
      cancelEditing();
      return;
    }

    try {
      await onSubmitEditConversation(conversation.conversationId, nextTitle);
    } finally {
      onFinishEditing();
    }
  };

  return (
    <div
      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[13px] transition ${
        isSelected
          ? "bg-emerald-50 font-semibold text-emerald-700"
          : "text-slate-700 hover:bg-slate-100"
      }`}
    >
      <button
        type="button"
        onClick={() => onSelectConversation(conversation.conversationId)}
        disabled={isEditing}
        className="flex min-w-0 flex-1 items-center gap-2 text-left disabled:cursor-not-allowed"
      >
        <MessageCircle size={14} className="shrink-0" />
        {isEditing ? (
          <input
            autoFocus
            value={editingTitle}
            onChange={(event) => setEditingTitle(event.target.value)}
            onBlur={() => {
              // 저장 요청이 이미 진행 중이면 blur 취소 처리 생략
              if (isSubmittingThisConversation) {
                return;
              }
              cancelEditing();
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void submitEditing();
              }

              if (event.key === "Escape") {
                event.preventDefault();
                cancelEditing();
              }
            }}
            disabled={isSubmittingThisConversation}
            className="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-700 outline-none ring-emerald-200 focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-100"
          />
        ) : (
          <span className="truncate">{conversation.title}</span>
        )}
      </button>

      <span className="ml-1 inline-flex items-center gap-0.5">
        {isEditing ? (
          <button
            type="button"
            className="inline-flex h-6 items-center justify-center gap-0.5 rounded-md bg-emerald-100 px-2 text-[11px] font-semibold text-emerald-700 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:bg-emerald-50 disabled:text-emerald-400"
            onMouseDown={(event) => {
              // blur가 먼저 일어나 취소되는 것을 막고 click 저장만 실행되게 함
              event.preventDefault();
            }}
            onClick={() => void submitEditing()}
            disabled={isSubmittingThisConversation}
          >
            <Check size={11} />
            {isSubmittingThisConversation ? "저장 중" : "완료"}
          </button>
        ) : (
          <button
            type="button"
            className="inline-flex h-6 w-6 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-200 hover:text-slate-700 disabled:cursor-not-allowed disabled:text-slate-300"
            aria-label={`${conversation.title} 제목 수정`}
            onClick={() => onStartEditing(conversation.conversationId)}
            disabled={isEditSubmitting}
          >
            <Pencil size={13} />
          </button>
        )}
        <button
          type="button"
          className="inline-flex h-6 w-6 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-200 hover:text-rose-600 disabled:cursor-not-allowed disabled:text-slate-300"
          aria-label={`${conversation.title} 삭제`}
          onClick={() => onDeleteConversation(conversation.conversationId)}
          disabled={isEditSubmitting}
        >
          <Trash2 size={13} />
        </button>
      </span>
    </div>
  );
};

export default ConversationSidebarItem;
