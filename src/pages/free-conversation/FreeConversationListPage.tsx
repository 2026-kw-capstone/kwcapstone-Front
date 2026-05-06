import { History, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConversationListCard from "../../components/free-conversation/ConversationListCard";
import DeleteConversationConfirmModal from "../../components/free-conversation/DeleteConversationConfirmModal";
import { useDeleteConversation } from "../../hooks/mutations/useDeleteConversation";
import { usePatchConversationTitle } from "../../hooks/mutations/usePatchConversationTitle";
import { useGetConversations } from "../../hooks/queries/useGetConversations";
import type { ConversationSummary } from "../../types/freeConversationType";

const FreeConversationListPage = () => {
  const navigate = useNavigate();
  const {
    data: conversations = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetConversations();
  const patchConversationTitleMutation = usePatchConversationTitle();
  const deleteConversationMutation = useDeleteConversation();
  const [editingConversationId, setEditingConversationId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<ConversationSummary | null>(null);

  const handleStartEdit = (conversation: ConversationSummary) => {
    setEditingConversationId(conversation.conversationId);
    setEditingTitle(conversation.title);
  };

  const handleSubmitEdit = async () => {
    if (editingConversationId === null) {
      return;
    }

    const title = editingTitle.trim();

    if (!title) {
      return;
    }

    await patchConversationTitleMutation.mutateAsync({
      conversationId: editingConversationId,
      title,
    });
    setEditingConversationId(null);
    setEditingTitle("");
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    await deleteConversationMutation.mutateAsync({
      conversationId: deleteTarget.conversationId,
      selectedConversationId: null,
    });
    setDeleteTarget(null);
  };

  return (
    <div className="flex min-h-full flex-col bg-[#F4F6F8] px-5 py-5 pb-24 animate-fade-in">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="mb-1 px-1 text-[13px] font-bold text-slate-500">
            자유 대화
          </p>
          <h1 className="px-1 text-[24px] font-extrabold leading-tight text-slate-900">
            AI와 자유롭게
            <br />
            이야기해봐요
          </h1>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate("/ai-practice/free-conversation/chat/new")}
        className="mb-8 flex h-[60px] w-full items-center justify-center gap-2 rounded-[20px] bg-gradient-to-r from-blue-600 to-[#278DFD] text-[16px] font-bold text-white shadow-[0_8px_20px_rgba(39,141,253,0.3)] transition-all active:scale-[0.98]"
      >
        <Plus size={20} strokeWidth={2.5} />
        새로운 대화 시작하기
      </button>

      <h2 className="mb-4 flex items-center gap-2 px-1 text-[16px] font-extrabold text-slate-900">
        <History size={18} className="text-slate-400" />
        이전 대화
      </h2>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`conversation-list-loading-${index}`}
              className="h-[82px] animate-pulse rounded-[24px] bg-white"
            />
          ))}
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-[22px] border border-rose-100 bg-white p-5">
          <p className="text-sm font-bold text-rose-500">
            {error instanceof Error
              ? error.message
              : "대화 목록을 불러오지 못했어요."}
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-3 rounded-xl bg-rose-50 px-4 py-2 text-sm font-bold text-rose-500"
          >
            다시 시도
          </button>
        </div>
      ) : null}

      {!isLoading && !isError && conversations.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-slate-200 bg-white/70 px-5 py-8 text-center">
          <p className="text-base font-extrabold text-slate-800">
            아직 저장된 대화가 없어요
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            새로운 대화를 시작하면 이곳에서 다시 이어갈 수 있어요.
          </p>
        </div>
      ) : null}

      {!isLoading && !isError && conversations.length > 0 ? (
        <div className="flex flex-col gap-3">
          {conversations.map((conversation) => (
            <ConversationListCard
              key={conversation.conversationId}
              conversation={conversation}
              isEditing={editingConversationId === conversation.conversationId}
              editingTitle={editingTitle}
              isEditSubmitting={
                patchConversationTitleMutation.isPending &&
                patchConversationTitleMutation.variables?.conversationId ===
                  conversation.conversationId
              }
              isDeleteSubmitting={
                deleteConversationMutation.isPending &&
                deleteConversationMutation.variables?.conversationId ===
                  conversation.conversationId
              }
              onOpen={() =>
                navigate(
                  `/ai-practice/free-conversation/chat/${conversation.conversationId}`
                )
              }
              onStartEdit={() => handleStartEdit(conversation)}
              onChangeEditingTitle={setEditingTitle}
              onCancelEdit={() => {
                setEditingConversationId(null);
                setEditingTitle("");
              }}
              onSubmitEdit={() => void handleSubmitEdit()}
              onDelete={() => setDeleteTarget(conversation)}
            />
          ))}
        </div>
      ) : null}

      <DeleteConversationConfirmModal
        conversation={deleteTarget}
        isSubmitting={deleteConversationMutation.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleConfirmDelete()}
      />
    </div>
  );
};

export default FreeConversationListPage;
