import { Smile } from "lucide-react";
import type { ConversationMessageGroup } from "../../types/freeConversationType";
import {
  ConversationMessagesErrorState,
  ConversationMessagesLoadingState,
} from "./ConversationMessagesState";

type ConversationMessagesProps = {
  messages: ConversationMessageGroup[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onRetry: () => void;
};

const ConversationMessages = ({
  messages,
  isLoading,
  isError,
  errorMessage,
  onRetry,
}: ConversationMessagesProps) => {
  if (isLoading) {
    return <ConversationMessagesLoadingState />;
  }

  if (isError) {
    return (
      <ConversationMessagesErrorState
        errorMessage={errorMessage}
        onRetry={onRetry}
      />
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center px-1">
        <div className="w-full max-w-[580px] rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-5 shadow-[0_10px_35px_rgba(16,185,129,0.08)]">
          <div className="flex items-start gap-3">
            <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-500 shadow-sm">
              <Smile size={24} />
            </div>
            <div>
              <p className="text-lg font-extrabold text-slate-800">편하게 아무 말이나 해보세요!</p>
              <p className="mt-1 text-sm text-slate-500">
                궁금한 거, 하고 싶은 얘기 편하게 이야기 나눠봐요.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ul className="mx-auto flex w-full flex-col gap-2 py-3">
      {messages.flatMap((group) => {
        const userMessage = group.userMessage;
        const aiMessage = group.aiMessage;
        const feedback = group.feedback;

        return [
          userMessage ? (
            <li key={`message-${userMessage.messageId}`} className="flex justify-end">
              <div className="max-w-[85%] rounded-br-md rounded-xl bg-emerald-500 px-3 py-2.5 text-[13px] leading-5 text-white shadow-[0_10px_25px_rgba(16,185,129,0.28)]">
                {userMessage.inputType === "TEXT" && userMessage.content ? (
                  <p>{userMessage.content}</p>
                ) : null}
                {userMessage.inputType === "VOICE" && userMessage.voiceUrl ? (
                  <audio
                    controls
                    src={userMessage.voiceUrl}
                    className="mt-2 h-9 w-full max-w-[260px] rounded-md bg-white/80"
                  >
                    브라우저가 음성 재생을 지원하지 않습니다.
                  </audio>
                ) : null}
                {userMessage.inputType === "VOICE" && !userMessage.voiceUrl ? (
                  <p className="text-xs text-emerald-50/90">
                    음성 파일을 불러오지 못했어요.
                  </p>
                ) : null}
              </div>
            </li>
          ) : null,
          aiMessage ? (
            <li key={`message-${aiMessage.messageId}`} className="flex justify-start">
              <div className="max-w-[85%] rounded-bl-md rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[13px] leading-5 text-slate-700">
                {aiMessage.content}
              </div>
            </li>
          ) : null,
          feedback ? (
            <li key={`feedback-${feedback.feedbackId}`} className="flex justify-center">
              <div className="max-w-[92%] rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] leading-5 text-amber-800">
                {feedback.content}
              </div>
            </li>
          ) : null,
        ];
      })}
    </ul>
  );
};

export default ConversationMessages;
