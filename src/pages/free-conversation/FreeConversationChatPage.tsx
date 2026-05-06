import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ConversationInput from "../../components/free-conversation/ConversationInput";
import ConversationMessages from "../../components/free-conversation/ConversationMessages";
import { useFreeConversationController } from "../../hooks/useFreeConversationController";

const FreeConversationChatPage = () => {
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const initialConversationId = useMemo(() => {
    if (!conversationId) {
      return null;
    }

    const parsedConversationId = Number(conversationId);

    return Number.isFinite(parsedConversationId) ? parsedConversationId : null;
  }, [conversationId]);

  const {
    selectedConversationId,
    messages,
    recordErrorMessage,
    isMessageBusy,
    isVoiceBusy,
    isRecording,
    detailState,
    actions,
  } = useFreeConversationController({
    initialConversationId,
    onConversationCreated: (createdConversationId) => {
      navigate(`/ai-practice/free-conversation/chat/${createdConversationId}`, {
        replace: true,
      });
    },
  });

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#F4F6F8]">
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-5 hide-scrollbar">
        <ConversationMessages
          conversationId={selectedConversationId}
          messages={messages}
          isLoading={detailState.isLoading}
          isError={detailState.isError}
          errorMessage={detailState.errorMessage}
          onRetry={detailState.onRetry}
        />
      </div>

      {recordErrorMessage ? (
        <p className="px-5 pb-2 text-xs font-bold text-rose-500">
          {recordErrorMessage}
        </p>
      ) : null}

      <ConversationInput
        isRecording={isRecording}
        isTextBusy={isMessageBusy}
        isVoiceBusy={isVoiceBusy}
        onToggleVoiceRecord={actions.handleToggleVoiceRecord}
        onSubmitText={actions.handleSubmitTextMessage}
      />
    </div>
  );
};

export default FreeConversationChatPage;
