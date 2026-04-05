import { isAxiosError } from "axios";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadFreeConversationVoice } from "../apis/voicePlaceholder";
import ConversationHeader from "../components/free-conversation/ConversationHeader";
import ConversationInput from "../components/free-conversation/ConversationInput";
import ConversationMessages from "../components/free-conversation/ConversationMessages";
import ConversationSidebar from "../components/free-conversation/ConversationSidebar";
import { getRecordErrorMessage } from "../constants/recordingMessage";
import { useAuth } from "../contexts/AuthContext";
import { useRecord } from "../contexts/RecordContext";
import { useRecordUploadFlow } from "../hooks/audio/useRecordUploadFlow";
import { useDeleteConversation } from "../hooks/mutations/useDeleteConversation";
import { usePatchConversationTitle } from "../hooks/mutations/usePatchConversationTitle";
import { usePostTextMessage } from "../hooks/mutations/usePostTextMessage";
import { useGetConversationDetail } from "../hooks/queries/useGetConversationDetail";
import { useGetConversations } from "../hooks/queries/useGetConversations";

const getDeleteErrorMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;

    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "대화 삭제에 실패했습니다.";
};

const getTextMessageErrorMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;

    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "메시지 전송에 실패했습니다.";
};

const FreeConversationPage = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const { isRecording, status, lastError, startRecording, stopRecording } = useRecord();
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(
    null
  );
  const [isMobileConversationListOpen, setIsMobileConversationListOpen] =
    useState(false);

  const patchConversationTitleMutation = usePatchConversationTitle();
  const deleteConversationMutation = useDeleteConversation();
  const postTextMessageMutation = usePostTextMessage({
    onConversationCreated: (conversationId) => {
      setSelectedConversationId(conversationId);
    },
  });

  const {
    data: conversations = [],
    isLoading: isConversationListLoading,
    isError: isConversationListError,
    error: conversationListError,
    refetch: refetchConversationList,
  } = useGetConversations();

  const {
    data: selectedConversationDetail,
    isLoading: isConversationDetailLoading,
    isFetching: isConversationDetailFetching,
    isError: isConversationDetailError,
    error: conversationDetailError,
    refetch: refetchConversationDetail,
  } = useGetConversationDetail(selectedConversationId);

  const { isUploading, toggleRecordAndUpload } = useRecordUploadFlow({
    isRecording,
    status,
    startRecording,
    stopRecording,
    uploadFn: uploadFreeConversationVoice,
  });

  const currentConversationTitle = useMemo(() => {
    if (!selectedConversationId) {
      return "새 대화";
    }

    if (selectedConversationDetail?.title) {
      return selectedConversationDetail.title;
    }

    return (
      conversations.find(
        (conversation) => conversation.conversationId === selectedConversationId
      )?.title ?? "새 대화"
    );
  }, [conversations, selectedConversationDetail, selectedConversationId]);

  const handleNewConversation = () => {
    setSelectedConversationId(null);
    setIsMobileConversationListOpen(false);
    postTextMessageMutation.clearPendingNewConversationMessages();
  };

  const handleSelectConversation = (conversationId: number) => {
    setSelectedConversationId(conversationId);
    setIsMobileConversationListOpen(false);
    postTextMessageMutation.clearPendingNewConversationMessages();
  };

  const handleToggleVoiceRecord = async () => {
    await toggleRecordAndUpload();
  };

  const handleSubmitTextMessage = async (content: string) => {
    try {
      await postTextMessageMutation.sendTextMessage({
        conversationId: selectedConversationId,
        content,
      });
    } catch (error) {
      alert(getTextMessageErrorMessage(error));
      throw error;
    }
  };

  const handleSubmitEditConversation = async (
    conversationId: number,
    title: string
  ) => {
    await patchConversationTitleMutation.mutateAsync({
      conversationId,
      title,
    });
  };

  const handleDeleteConversation = async (conversationId: number) => {
    const currentSelectedConversationId = selectedConversationId;
    const wasSelectedConversation = currentSelectedConversationId === conversationId;

    if (wasSelectedConversation) {
      setSelectedConversationId(null);
    }

    setIsMobileConversationListOpen(false);

    try {
      await deleteConversationMutation.mutateAsync({
        conversationId,
        selectedConversationId: currentSelectedConversationId,
      });
    } catch (error) {
      if (wasSelectedConversation) {
        setSelectedConversationId(conversationId);
      }

      alert(getDeleteErrorMessage(error));
      throw error;
    }
  };

  const recordErrorMessage = getRecordErrorMessage(lastError);

  const isConversationDetailLoadingState =
    selectedConversationId !== null &&
    !!accessToken &&
    (isConversationDetailLoading ||
      (isConversationDetailFetching && !selectedConversationDetail));

  const messages =
    selectedConversationId !== null
      ? selectedConversationDetail?.messages ?? []
      : postTextMessageMutation.pendingNewConversationMessages;

  return (
    <div className="h-full min-h-0 w-full overflow-hidden bg-white">
      <div className="relative mx-auto flex h-full min-h-0 w-full max-w-md flex-col overflow-hidden">
        {isMobileConversationListOpen ? (
          <button
            type="button"
            className="absolute inset-0 z-40 bg-slate-900/35"
            aria-label="대화 목록 닫기"
            onClick={() => setIsMobileConversationListOpen(false)}
          />
        ) : null}

        <ConversationSidebar
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          isMobileOpen={isMobileConversationListOpen}
          isLoading={isConversationListLoading}
          isError={isConversationListError}
          errorMessage={
            conversationListError instanceof Error
              ? conversationListError.message
              : "대화 목록을 불러오지 못했어요."
          }
          isEmpty={conversations.length === 0}
          onNewConversation={handleNewConversation}
          onRetry={() => void refetchConversationList()}
          onSelectConversation={handleSelectConversation}
          onSubmitEditConversation={handleSubmitEditConversation}
          isEditSubmitting={patchConversationTitleMutation.isPending}
          editingSubmitConversationId={
            patchConversationTitleMutation.variables?.conversationId ?? null
          }
          onDeleteConversation={handleDeleteConversation}
          isDeleteSubmitting={deleteConversationMutation.isPending}
          deletingSubmitConversationId={
            deleteConversationMutation.variables?.conversationId ?? null
          }
        />

        <section className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-gradient-to-b from-white via-[#f8fbff] to-[#edf5f3]">
          <ConversationHeader
            onToggleConversationList={() =>
              setIsMobileConversationListOpen((prev) => !prev)
            }
            currentConversationTitle={currentConversationTitle}
            onBackToPractice={() => navigate("/ai-practice")}
          />

          <div className="relative flex min-h-0 flex-1 flex-col px-2 pb-3 pt-2">
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-emerald-100/40 to-transparent" />

            <div className="relative flex-1 overflow-y-auto pr-1">
              <ConversationMessages
                conversationId={selectedConversationId}
                messages={messages}
                isLoading={isConversationDetailLoadingState}
                isError={isConversationDetailError}
                errorMessage={
                  conversationDetailError instanceof Error
                    ? conversationDetailError.message
                    : "대화 내용을 불러오지 못했어요."
                }
                onRetry={() => void refetchConversationDetail()}
              />
            </div>

            {recordErrorMessage ? (
              <p className="pb-1 text-xs font-semibold text-rose-500">
                {recordErrorMessage}
              </p>
            ) : null}

            <ConversationInput
              isRecording={isRecording}
              isTextBusy={postTextMessageMutation.isPending}
              isVoiceBusy={
                status === "requesting_permission" || status === "stopping" || isUploading
              }
              onToggleVoiceRecord={handleToggleVoiceRecord}
              onSubmitText={handleSubmitTextMessage}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default FreeConversationPage;

