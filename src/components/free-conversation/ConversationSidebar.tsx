import { Plus } from "lucide-react";
import { useState } from "react";
import type { ConversationSummary } from "../../types/freeConversationType";
import ConversationSidebarItem from "./ConversationSidebarItem";
import DeleteConversationConfirmModal from "./DeleteConversationConfirmModal";

type ConversationSidebarProps = {
  conversations: ConversationSummary[];
  selectedConversationId: number | null;
  isMobileOpen: boolean;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onNewConversation: () => void;
  onRetry: () => void;
  onSelectConversation: (conversationId: number) => void;
  onSubmitEditConversation: (conversationId: number, title: string) => Promise<void>;
  isEditSubmitting: boolean;
  editingSubmitConversationId: number | null;
  onDeleteConversation: (conversationId: number) => Promise<void>;
  isDeleteSubmitting: boolean;
  deletingSubmitConversationId: number | null;
};

const ConversationSidebar = ({
  conversations,
  selectedConversationId,
  isMobileOpen,
  isLoading,
  isError,
  errorMessage,
  onNewConversation,
  onRetry,
  onSelectConversation,
  onSubmitEditConversation,
  isEditSubmitting,
  editingSubmitConversationId,
  onDeleteConversation,
  isDeleteSubmitting,
  deletingSubmitConversationId,
}: ConversationSidebarProps) => {
  const [editingConversationId, setEditingConversationId] = useState<number | null>(null);
  const [deleteTargetConversation, setDeleteTargetConversation] =
    useState<ConversationSummary | null>(null);
  const isEmpty = conversations.length === 0;

  const finishEditing = () => {
    setEditingConversationId(null);
  };

  const startEditing = (conversationId: number) => {
    if (isEditSubmitting || isDeleteSubmitting) {
      return;
    }

    setEditingConversationId(conversationId);
  };

  const openDeleteModal = (conversationId: number) => {
    if (isEditSubmitting || isDeleteSubmitting) {
      return;
    }

    const targetConversation = conversations.find(
      (conversation) => conversation.conversationId === conversationId
    );

    if (!targetConversation) {
      return;
    }

    setDeleteTargetConversation(targetConversation);
  };

  const closeDeleteModal = () => {
    if (isDeleteSubmitting) {
      return;
    }

    setDeleteTargetConversation(null);
  };

  const confirmDelete = async () => {
    if (!deleteTargetConversation || isDeleteSubmitting) {
      return;
    }

    try {
      await onDeleteConversation(deleteTargetConversation.conversationId);
      setDeleteTargetConversation(null);
    } catch {
      // Error message is handled by page-level mutation caller.
    }
  };

  return (
    <>
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
                conversations.map((conversation) => (
                  <ConversationSidebarItem
                    key={conversation.conversationId}
                    conversation={conversation}
                    isSelected={conversation.conversationId === selectedConversationId}
                    isEditing={conversation.conversationId === editingConversationId}
                    isSubmittingThisConversation={
                      isEditSubmitting &&
                      conversation.conversationId === editingSubmitConversationId
                    }
                    isEditSubmitting={isEditSubmitting}
                    isDeletingThisConversation={
                      isDeleteSubmitting &&
                      conversation.conversationId === deletingSubmitConversationId
                    }
                    isDeleteSubmitting={isDeleteSubmitting}
                    onSelectConversation={onSelectConversation}
                    onSubmitEditConversation={onSubmitEditConversation}
                    onStartEditing={startEditing}
                    onFinishEditing={finishEditing}
                    onDeleteConversation={openDeleteModal}
                  />
                ))}
            </div>
          </div>
        </div>
      </aside>

      <DeleteConversationConfirmModal
        conversation={deleteTargetConversation}
        isSubmitting={isDeleteSubmitting}
        onClose={closeDeleteModal}
        onConfirm={() => void confirmDelete()}
      />
    </>
  );
};

export default ConversationSidebar;
