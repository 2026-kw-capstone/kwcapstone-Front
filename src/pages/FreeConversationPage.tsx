import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadFreeConversationVoice } from "../apis/voicePlaceholder";
import { getRecordErrorMessage } from "../constants/recordingMessage";
import ConversationHeader from "../components/free-conversation/ConversationHeader";
import ConversationInput from "../components/free-conversation/ConversationInput";
import ConversationMessages from "../components/free-conversation/ConversationMessages";
import ConversationSidebar from "../components/free-conversation/ConversationSidebar";
import {
  MOCK_CONVERSATION_LIST,
  MOCK_MESSAGES_BY_CONVERSATION,
} from "../constants/freeConversation";
import { useRecord } from "../contexts/RecordContext";
import { useAudioPlayer } from "../hooks/audio/useAudioPlayer";
import { useRecordUploadFlow } from "../hooks/audio/useRecordUploadFlow";

const FreeConversationPage = () => {
  const navigate = useNavigate();
  const { isRecording, status, lastError, startRecording, stopRecording } =
    useRecord();
  const { audioUrl, isPlaying, setAudioUrl, playAudio } = useAudioPlayer();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    null
  );
  const [isMobileConversationListOpen, setIsMobileConversationListOpen] =
    useState(false);

  const { isUploading, toggleRecordAndUpload } = useRecordUploadFlow({
    isRecording,
    status,
    startRecording,
    stopRecording,
    uploadFn: uploadFreeConversationVoice,
    onUploadSuccess: ({ mp3Url }, blob) => {
      setAudioUrl(mp3Url || URL.createObjectURL(blob));
    },
  });

  const selectedMessages = useMemo(() => {
    if (!selectedConversationId) {
      return [];
    }

    return MOCK_MESSAGES_BY_CONVERSATION[selectedConversationId] ?? [];
  }, [selectedConversationId]);

  const currentConversationTitle = useMemo(() => {
    if (!selectedConversationId) {
      return "새 대화";
    }

    return (
      MOCK_CONVERSATION_LIST.find(
        (conversation) => conversation.id === selectedConversationId
      )?.title ?? "새 대화"
    );
  }, [selectedConversationId]);

  const handleNewConversation = () => {
    setSelectedConversationId(null);
    setIsMobileConversationListOpen(false);
  };

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setIsMobileConversationListOpen(false);
  };

  const handleToggleVoiceRecord = async () => {
    await toggleRecordAndUpload();
  };

  const handlePlayRecordedAudio = async () => {
    if (!audioUrl || isUploading) return;
    await playAudio();
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
          conversations={MOCK_CONVERSATION_LIST}
          selectedConversationId={selectedConversationId}
          isMobileOpen={isMobileConversationListOpen}
          onNewConversation={handleNewConversation}
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
              isVoiceBusy={
                status === "requesting_permission" || status === "stopping" || isUploading
              }
              hasRecordedAudio={!!audioUrl}
              isPlayingRecordedAudio={isPlaying}
              onToggleVoiceRecord={handleToggleVoiceRecord}
              onPlayRecordedAudio={handlePlayRecordedAudio}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default FreeConversationPage;

