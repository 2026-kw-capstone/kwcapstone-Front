import { MessageCircle, Pencil, Plus, Trash2 } from "lucide-react";
import type { ConversationSummary } from "../../types/freeConversationType";

type ConversationSidebarProps = {
  conversations: ConversationSummary[];
  selectedConversationId: number | null;
  isMobileOpen: boolean;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  isEmpty: boolean;
  onNewConversation: () => void;
  onRetry: () => void;
  onSelectConversation: (conversationId: number) => void;
  onEditConversation: (conversationId: number) => void;
  onDeleteConversation: (conversationId: number) => void;
};

const ConversationSidebar = ({
  conversations,
  selectedConversationId,
  isMobileOpen,
  isLoading,
  isError,
  errorMessage,
  isEmpty,
  onNewConversation,
  onRetry,
  onSelectConversation,
  onEditConversation,
  onDeleteConversation,
}: ConversationSidebarProps) => {
  return (
    <aside
      className={`
        absolute inset-y-0 left-0 z-50 w-[84%] max-w-[320px] border-r border-slate-200 bg-slate-50 transition-transform duration-200 min-[390px]:w-[78%]
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="flex h-full min-h-0 flex-col px-3 pb-3 pt-[15px]">
        <h2 className="text-xl font-extrabold tracking-tight text-slate-800">
          AI 자유 대화
        </h2>

        <button
          type="button"
          onClick={onNewConversation}
          className="mt-4 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-100 text-sm font-bold text-emerald-700 transition hover:bg-emerald-200"
        >
          <Plus size={16} />
          새 대화
        </button>

        <div className="mt-5 min-h-0 flex-1">
          <p className="text-xs font-semibold text-slate-400">이전 대화</p>
          <div className="mt-2.5 min-h-0 space-y-1 overflow-y-auto pr-1">
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={`conversation-skeleton-${index}`}
                    className="h-9 animate-pulse rounded-lg bg-slate-200"
                  />
                ))}
              </div>
            ) : null}

            {isError ? (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5">
                <p className="text-xs font-semibold text-rose-600">
                  {errorMessage ?? "대화 목록을 불러오지 못했어요."}
                </p>
                <button
                  type="button"
                  onClick={onRetry}
                  className="mt-2 rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
                >
                  다시 시도
                </button>
              </div>
            ) : null}

            {!isLoading && !isError && isEmpty ? (
              <p className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-500">
                아직 대화가 없어요. 새 대화를 시작해보세요.
              </p>
            ) : null}

            {!isLoading &&
              !isError &&
              !isEmpty &&
              conversations.map((conversation) => {
                const isSelected =
                  conversation.conversationId === selectedConversationId;

                return (
                  <div
                    key={conversation.conversationId}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[13px] transition ${
                      isSelected
                        ? "bg-emerald-50 font-semibold text-emerald-700"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onSelectConversation(conversation.conversationId)}
                      className="flex min-w-0 flex-1 items-center gap-2 text-left"
                    >
                      <MessageCircle size={14} className="shrink-0" />
                      <span className="truncate">{conversation.title}</span>
                    </button>

                    <span className="ml-1 inline-flex items-center gap-0.5">
                      <button
                        type="button"
                        className="inline-flex h-6 w-6 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
                        aria-label={`${conversation.title} 제목 수정`}
                        onClick={() => onEditConversation(conversation.conversationId)}
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        type="button"
                        className="inline-flex h-6 w-6 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-200 hover:text-rose-600"
                        aria-label={`${conversation.title} 삭제`}
                        onClick={() => onDeleteConversation(conversation.conversationId)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ConversationSidebar;
