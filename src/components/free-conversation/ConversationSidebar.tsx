import { MessageCircle, Pencil, Plus, Trash2 } from "lucide-react";
import type { ConversationSummary } from "../../types/freeConversationType";

type ConversationSidebarProps = {
  conversations: ConversationSummary[];
  selectedConversationId: string | null;
  isMobileOpen: boolean;
  onNewConversation: () => void;
  onSelectConversation: (conversationId: string) => void;
  onEditConversation: (conversationId: string) => void;
  onDeleteConversation: (conversationId: string) => void;
};

const ConversationSidebar = ({
  conversations,
  selectedConversationId,
  isMobileOpen,
  onNewConversation,
  onSelectConversation,
  onEditConversation,
  onDeleteConversation,
}: ConversationSidebarProps) => {
  return (
    <aside
      className={`
        fixed left-0 top-16 z-50 h-[calc(100vh-64px)] w-[78%] max-w-[280px] border-r border-slate-200 bg-slate-50 transition-transform duration-200
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="h-full px-3 pb-3 pt-4">
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

        <div className="mt-5">
          <p className="text-xs font-semibold text-slate-400">이전 대화</p>
          <div className="mt-2.5 space-y-1">
            {conversations.map((conversation) => {
              const isSelected = conversation.id === selectedConversationId;

              return (
                <div
                  key={conversation.id}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[13px] transition ${
                    isSelected
                      ? "bg-emerald-50 font-semibold text-emerald-700"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelectConversation(conversation.id)}
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
                      onClick={() => onEditConversation(conversation.id)}
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-6 w-6 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-200 hover:text-rose-600"
                      aria-label={`${conversation.title} 삭제`}
                      onClick={() => onDeleteConversation(conversation.id)}
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
