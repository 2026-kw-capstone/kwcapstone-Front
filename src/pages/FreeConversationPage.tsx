import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadFreeConversationVoice } from "../apis/voicePlaceholder";
import { getRecordErrorMessage } from "../constants/recordingMessage";
import ConversationHeader from "../components/free-conversation/ConversationHeader";
import ConversationInput from "../components/free-conversation/ConversationInput";
import ConversationMessages from "../components/free-conversation/ConversationMessages";
import ConversationSidebar from "../components/free-conversation/ConversationSidebar";
import { useRecord } from "../contexts/RecordContext";
import { useRecordUploadFlow } from "../hooks/audio/useRecordUploadFlow";
import { useGetConversations } from "../hooks/queries/useGetConversations";

const FreeConversationPage = () => {
  const navigate = useNavigate();
  // 전역 녹음 컨텍스트: 시작/종료와 상태만 담당
  const { isRecording, status, lastError, startRecording, stopRecording } =
    useRecord();
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(
    null
  );
  const [isMobileConversationListOpen, setIsMobileConversationListOpen] =
    useState(false);
  const {
    data: conversations = [],
    isLoading: isConversationListLoading,
    isError: isConversationListError,
    error: conversationListError,
    refetch: refetchConversationList,
  } = useGetConversations();

  // 녹음 종료 시 Blob을 업로드하고, 응답은 추후 사용자 메시지(voiceUrl 포함)로 반영할 예정
  const { isUploading, toggleRecordAndUpload } = useRecordUploadFlow({
    isRecording,
    status,
    startRecording,
    stopRecording,
    uploadFn: uploadFreeConversationVoice,
    // TODO: API 연동 시 mp3Url/voiceUrl을 사용자 메시지에 저장해 ConversationMessages로 전달
  });

  const selectedMessages = useMemo(() => [], []);

  const currentConversationTitle = useMemo(() => {
    if (!selectedConversationId) {
      return "새 대화";
    }

    return (
      conversations.find(
        (conversation) => conversation.conversationId === selectedConversationId
      )?.title ?? "새 대화"
    );
  }, [conversations, selectedConversationId]);

  const handleNewConversation = () => {
    setSelectedConversationId(null);
    setIsMobileConversationListOpen(false);
  };

  const handleSelectConversation = (conversationId: number) => {
    setSelectedConversationId(conversationId);
    setIsMobileConversationListOpen(false);
  };

  const handleToggleVoiceRecord = async () => {
    // 녹음 버튼 재클릭 시 업로드까지 이어지는 공통 흐름
    await toggleRecordAndUpload();
  };

  const recordErrorMessage = getRecordErrorMessage(lastError);

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
          onEditConversation={() => void 0}
          onDeleteConversation={() => void 0}
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
              <ConversationMessages messages={selectedMessages} />
            </div>

            {recordErrorMessage ? (
              <p className="pb-1 text-xs font-semibold text-rose-500">
                {recordErrorMessage}
              </p>
            ) : null}

            <ConversationInput
              isRecording={isRecording}
              // 권한 요청/종료/업로드 중에는 중복 입력을 막아 버튼을 잠급니다.
              isVoiceBusy={
                status === "requesting_permission" || status === "stopping" || isUploading
              }
              onToggleVoiceRecord={handleToggleVoiceRecord}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default FreeConversationPage;
