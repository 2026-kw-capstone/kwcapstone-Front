import {
  Check,
  ChevronRight,
  MessageCircleMore,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import type { KeyboardEvent } from "react";
import type { ConversationSummary } from "../../types/freeConversationType";

type ConversationListCardProps = {
  conversation: ConversationSummary;
  isEditing: boolean;
  editingTitle: string;
  isEditSubmitting: boolean;
  isDeleteSubmitting: boolean;
  onOpen: () => void;
  onStartEdit: () => void;
  onChangeEditingTitle: (title: string) => void;
  onCancelEdit: () => void;
  onSubmitEdit: () => void;
  onDelete: () => void;
};

const formatLastMessageTime = (lastMessageAt: string) => {
  const date = new Date(lastMessageAt);

  if (Number.isNaN(date.getTime())) {
    return "최근 대화";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const ConversationListCard = ({
  conversation,
  isEditing,
  editingTitle,
  isEditSubmitting,
  isDeleteSubmitting,
  onOpen,
  onStartEdit,
  onChangeEditingTitle,
  onCancelEdit,
  onSubmitEdit,
  onDelete,
}: ConversationListCardProps) => {
  const handleEditKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSubmitEdit();
    }

    if (event.key === "Escape") {
      onCancelEdit();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={isEditing ? undefined : onOpen}
      onKeyDown={(event) => {
        if (!isEditing && (event.key === "Enter" || event.key === " ")) {
          onOpen();
        }
      }}
      className="group rounded-[22px] border border-slate-100 bg-white p-4 text-left shadow-[0_12px_32px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-[0_16px_36px_rgba(39,141,253,0.12)]"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
          <MessageCircleMore size={24} />
        </div>

        <div className="min-w-0 flex-1">
          {isEditing ? (
            <input
              value={editingTitle}
              onClick={(event) => event.stopPropagation()}
              onChange={(event) => onChangeEditingTitle(event.target.value)}
              onKeyDown={handleEditKeyDown}
              className="h-10 w-full rounded-xl border border-blue-200 bg-blue-50/60 px-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-400 focus:bg-white"
              autoFocus
            />
          ) : (
            <>
              <p className="truncate text-base font-extrabold text-slate-900">
                {conversation.title}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-400">
                {formatLastMessageTime(conversation.lastMessageAt)}
              </p>
            </>
          )}
        </div>

        {isEditing ? (
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onSubmitEdit();
              }}
              disabled={isEditSubmitting}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-200"
              aria-label="대화 제목 저장"
            >
              <Check size={18} />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onCancelEdit();
              }}
              disabled={isEditSubmitting}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="대화 제목 수정 취소"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onStartEdit();
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="대화 제목 수정"
            >
              <Pencil size={17} />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onDelete();
              }}
              disabled={isDeleteSubmitting}
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-rose-500 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="대화 삭제"
            >
              <Trash2 size={17} />
            </button>
            <ChevronRight
              size={20}
              className="ml-1 text-slate-300 transition group-hover:text-blue-400"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationListCard;
