import { isAxiosError } from "axios";
import { useMemo, useState } from "react";
import { getRecordErrorMessage } from "../constants/recordingMessage";
import { useAuth } from "../contexts/AuthContext";
import { useRecord } from "../contexts/RecordContext";
import { useRecordUploadFlow } from "./audio/useRecordUploadFlow";
import { useDeleteConversation } from "./mutations/useDeleteConversation";
import { usePatchConversationTitle } from "./mutations/usePatchConversationTitle";
import { usePostTextMessage } from "./mutations/usePostTextMessage";
import { usePostVoiceMessage } from "./mutations/usePostVoiceMessage";
import { useGetConversationDetail } from "./queries/useGetConversationDetail"; 
import { useGetConversations } from "./queries/useGetConversations";

// 서버/클라이언트 에러에서 사용자에게 보여줄 문구를 추출한다.
const getApiErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;

    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallbackMessage;
};

export const useFreeConversationController = () => {
  // 인증/녹음 관련 전역 상태
  const { accessToken } = useAuth();
  const { isRecording, status, lastError, startRecording, stopRecording } = useRecord();
  // 현재 선택된 대화와 모바일 사이드바 열림 여부
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(
    null
  );
  const [isMobileConversationListOpen, setIsMobileConversationListOpen] =
    useState(false);

  // 대화 제목 수정/삭제/메시지 전송 mutation
  const patchConversationTitleMutation = usePatchConversationTitle();
  const deleteConversationMutation = useDeleteConversation();
  const postTextMessageMutation = usePostTextMessage({
    onConversationCreated: (conversationId) => {
      setSelectedConversationId(conversationId);
    },
  });
  const postVoiceMessageMutation = usePostVoiceMessage({
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

  // 선택된 대화 상세(메시지 목록) 조회
  const {
    data: selectedConversationDetail,
    isLoading: isConversationDetailLoading,
    isFetching: isConversationDetailFetching,
    isError: isConversationDetailError,
    error: conversationDetailError,
    refetch: refetchConversationDetail,
  } = useGetConversationDetail(selectedConversationId);

  // 녹음 시작/종료 + 종료 시 업로드까지 묶은 플로우
  const { isUploading, toggleRecordAndUpload } = useRecordUploadFlow({
    isRecording,
    status,
    startRecording,
    stopRecording,
    uploadFn: (blob) =>
      postVoiceMessageMutation.sendVoiceMessage({
        conversationId: selectedConversationId,
        voiceFile: blob,
      }),
  });

  const currentConversationTitle = useMemo(() => {
    if (!selectedConversationId) {
      return "New conversation";
    }

    if (selectedConversationDetail?.title) {
      return selectedConversationDetail.title;
    }

    return (
      conversations.find(
        (conversation) => conversation.conversationId === selectedConversationId
      )?.title ?? "New conversation"
    );
  }, [conversations, selectedConversationDetail, selectedConversationId]);

  // "새 대화" 임시 메시지 큐를 초기화
  const clearPendingNewConversationMessages = () => {
    postTextMessageMutation.clearPendingNewConversationMessages();
    postVoiceMessageMutation.clearPendingNewConversationMessages();
  };

  // 새 대화 버튼: 선택 해제 + 임시 메시지 정리
  const handleNewConversation = () => {
    setSelectedConversationId(null);
    setIsMobileConversationListOpen(false);
    clearPendingNewConversationMessages();
  };

  // 기존 대화 선택: 대화 전환 + 임시 메시지 정리
  const handleSelectConversation = (conversationId: number) => {
    setSelectedConversationId(conversationId);
    setIsMobileConversationListOpen(false);
    clearPendingNewConversationMessages();
  };

  // 녹음 토글 및 업로드 에러 처리
  const handleToggleVoiceRecord = async () => {
    try {
      await toggleRecordAndUpload();
    } catch (error) {
      alert(getApiErrorMessage(error, "Failed to send voice message."));
    }
  };

  // 텍스트 메시지 전송 및 에러 처리
  const handleSubmitTextMessage = async (content: string) => {
    try {
      await postTextMessageMutation.sendTextMessage({
        conversationId: selectedConversationId,
        content,
      });
    } catch (error) {
      alert(getApiErrorMessage(error, "Failed to send message."));
      throw error;
    }
  };

  // 대화 제목 수정
  const handleSubmitEditConversation = async (
    conversationId: number,
    title: string
  ) => {
    await patchConversationTitleMutation.mutateAsync({
      conversationId,
      title,
    });
  };

  // 대화 삭제(선택된 대화 삭제 시 선택 상태 복구 처리 포함)
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

      alert(getApiErrorMessage(error, "Failed to delete conversation."));
      throw error;
    }
  };

  // 상세 화면 로딩 중 여부(토큰/선택 상태 포함)
  const isConversationDetailLoadingState =
    selectedConversationId !== null &&
    !!accessToken &&
    (isConversationDetailLoading ||
      (isConversationDetailFetching && !selectedConversationDetail));

  // 새 대화(null 선택) 상태에서는 텍스트/음성 임시 메시지를 합쳐서 보여준다.
  const messages =
    selectedConversationId !== null
      ? selectedConversationDetail?.messages ?? []
      : [
          ...postTextMessageMutation.pendingNewConversationMessages,
          ...postVoiceMessageMutation.pendingNewConversationMessages,
        ].sort((a, b) => {
          const aTime = a.userMessage ? new Date(a.userMessage.createdAt).getTime() : 0;
          const bTime = b.userMessage ? new Date(b.userMessage.createdAt).getTime() : 0;
          return aTime - bTime;
        });

  return {
    // 화면 표시/상태
    selectedConversationId,
    isMobileConversationListOpen,
    setIsMobileConversationListOpen,
    currentConversationTitle,
    messages,
    recordErrorMessage: getRecordErrorMessage(lastError),
    isMessageBusy:
      postTextMessageMutation.isPending || postVoiceMessageMutation.isPending,
    isVoiceBusy:
      status === "requesting_permission" || status === "stopping" || isUploading,
    isRecording,
    // 사이드바(목록) UI에 필요한 상태 묶음
    listState: {
      conversations,
      isLoading: isConversationListLoading,
      isError: isConversationListError,
      errorMessage:
        conversationListError instanceof Error
          ? conversationListError.message
          : "Failed to load conversation list.",
      onRetry: () => void refetchConversationList(),
    },
    // 메시지 영역(상세) UI에 필요한 상태 묶음
    detailState: {
      isLoading: isConversationDetailLoadingState,
      isError: isConversationDetailError,
      errorMessage:
        conversationDetailError instanceof Error
          ? conversationDetailError.message
          : "Failed to load conversation details.",
      onRetry: () => void refetchConversationDetail(),
    },
    // 사이드바에서 사용하는 제출/삭제 진행 상태
    sidebarMutationState: {
      isEditSubmitting: patchConversationTitleMutation.isPending,
      editingSubmitConversationId:
        patchConversationTitleMutation.variables?.conversationId ?? null,
      isDeleteSubmitting: deleteConversationMutation.isPending,
      deletingSubmitConversationId:
        deleteConversationMutation.variables?.conversationId ?? null,
    },
    // 페이지에서 바인딩할 액션 핸들러
    actions: {
      handleNewConversation,
      handleSelectConversation,
      handleToggleVoiceRecord,
      handleSubmitTextMessage,
      handleSubmitEditConversation,
      handleDeleteConversation,
    },
  };
};
