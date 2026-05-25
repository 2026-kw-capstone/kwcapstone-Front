import { useQueryClient } from "@tanstack/react-query";
import { Lightbulb, Play, Smile, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { getConversationVoiceAudio } from "../../apis/conversation";
import { AUDIO_URL_TTL_MS } from "../../constants/audio";
import { QUERY_KEY } from "../../constants/key";
import { useAudioPlayer } from "../../hooks/audio/useAudioPlayer";
import type {
  ConversationMessageGroup,
  ConversationVoiceAudioResult,
} from "../../types/freeConversationType";
import {
  ConversationMessagesErrorState,
  ConversationMessagesLoadingState,
} from "./ConversationMessagesState";

type ConversationMessagesProps = {
  conversationId: number | null;
  messages: ConversationMessageGroup[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onRetry: () => void;
};

const getConversationVoiceAudioQueryKey = (messageId: number) =>
  [QUERY_KEY.conversationVoiceAudio, messageId] as const;

const ConversationMessages = ({
  conversationId,
  messages,
  isLoading,
  isError,
  errorMessage,
  onRetry,
}: ConversationMessagesProps) => {
  const queryClient = useQueryClient();
  const { playAudio } = useAudioPlayer();
  const bottomRef = useRef<HTMLLIElement | null>(null);
  const prevConversationIdRef = useRef<number | null>(conversationId);
  const shouldScrollOnConversationChangeRef = useRef(false);
  const [playingMessageId, setPlayingMessageId] = useState<number | null>(null);
  const [preparingMessageId, setPreparingMessageId] = useState<number | null>(null);

  const voiceMessageIds = useMemo(
    () =>
      messages.flatMap((group) => {
        const message = group.userMessage;

        return message?.inputType === "VOICE" && message.messageId > 0
          ? [message.messageId]
          : [];
      }),
    [messages]
  );

  useEffect(() => {
    for (const messageId of voiceMessageIds) {
      void queryClient.prefetchQuery({
        queryKey: getConversationVoiceAudioQueryKey(messageId),
        queryFn: () => getConversationVoiceAudio(messageId),
        staleTime: AUDIO_URL_TTL_MS,
      });
    }
  }, [queryClient, voiceMessageIds]);

  useEffect(() => {
    if (prevConversationIdRef.current !== conversationId) {
      prevConversationIdRef.current = conversationId;
      shouldScrollOnConversationChangeRef.current = true;
    }
  }, [conversationId]);

  useEffect(() => {
    if (!shouldScrollOnConversationChangeRef.current || isLoading) {
      return;
    }

    bottomRef.current?.scrollIntoView({ block: "end" });
    shouldScrollOnConversationChangeRef.current = false;
  }, [isLoading, messages.length]);

  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      bottomRef.current?.scrollIntoView({ block: "end" });
    }
  }, [isLoading, messages.length]);

  const handlePlayVoiceMessage = async (messageId: number, localVoiceUrl: string | null) => {
    setPreparingMessageId(messageId);
    setPlayingMessageId(messageId);

    try {
      if (messageId < 0 && localVoiceUrl) {
        setPreparingMessageId(null);
        await playAudio(localVoiceUrl);
        return;
      }

      const voiceAudio = await queryClient.fetchQuery<ConversationVoiceAudioResult>({
        queryKey: getConversationVoiceAudioQueryKey(messageId),
        queryFn: () => getConversationVoiceAudio(messageId),
        staleTime: AUDIO_URL_TTL_MS,
      });

      setPreparingMessageId(null);
      await playAudio(voiceAudio.voiceUrl || localVoiceUrl);
    } finally {
      setPreparingMessageId(null);
      setPlayingMessageId(null);
    }
  };

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
      <div className="flex h-full flex-col items-center justify-center px-6 text-center animate-fade-in">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white text-[#278DFD] shadow-md">
          <Smile size={40} />
        </div>
        <p className="mb-3 text-[19px] font-black leading-tight text-slate-800">
          아무 말이나 편하게
          <br />
          이야기해볼까요?
        </p>
        <p className="text-[14.5px] font-medium leading-relaxed text-slate-500">
          음성 또는 텍스트로 자유롭게 대화해보세요.
          <br />
          AI가 자연스럽게 응답하고 피드백을 드립니다.
        </p>
      </div>
    );
  }

  return (
    <ul className="flex w-full flex-col gap-4">
      {messages.flatMap((group) => {
        const userMessage = group.userMessage;
        const aiMessage = group.aiMessage;
        const feedback = group.feedback;

        return [
          userMessage ? (
            <li key={`message-${userMessage.messageId}`} className="flex justify-end">
              <div className="max-w-[78%] rounded-[22px] rounded-br-md bg-[#278DFD] px-4 py-3 text-sm font-semibold leading-6 text-white shadow-[0_12px_28px_rgba(39,141,253,0.24)]">
                {userMessage.inputType === "TEXT" && userMessage.content ? (
                  <p>{userMessage.content}</p>
                ) : null}
                {userMessage.inputType === "VOICE" ? (
                  <div className="flex flex-col gap-2">
                    <p className="break-keep text-white/95">
                      {userMessage.content || "음성을 분석하고 있어요..."}
                    </p>
                    <button
                    type="button"
                    onClick={() =>
                      void handlePlayVoiceMessage(
                        userMessage.messageId,
                        userMessage.voiceUrl
                      )
                    }
                    disabled={
                      preparingMessageId !== null || playingMessageId !== null
                    }
                    className="flex h-10 min-w-[132px] items-center justify-center gap-2 rounded-xl bg-white/95 px-3 text-[13px] font-extrabold text-[#278DFD] transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:bg-white/70 disabled:text-slate-400"
                  >
                    <Play size={15} fill="currentColor" />
                    {preparingMessageId === userMessage.messageId
                      ? "준비 중..."
                      : playingMessageId === userMessage.messageId
                        ? "재생 중..."
                        : "내 음성 듣기"}
                    </button>
                  </div>
                ) : null}
              </div>
            </li>
          ) : null,
          aiMessage ? (
            <li key={`message-${aiMessage.messageId}`} className="flex justify-start">
              <div className="flex max-w-[84%] items-start gap-2.5">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white shadow-[0_10px_20px_rgba(15,23,42,0.16)]">
                  <Sparkles size={17} />
                </div>
                <div className="rounded-[22px] rounded-bl-md bg-white px-4 py-3 text-sm font-semibold leading-6 text-slate-800 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
                  {aiMessage.content}
                </div>
              </div>
            </li>
          ) : (
            <li key={`message-skeleton-${group.clientRequestId}`} className="flex justify-start">
              <div className="flex w-[82%] items-start gap-2.5">
                <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-slate-200" />
                <div className="h-14 flex-1 animate-pulse rounded-[22px] bg-white" />
              </div>
            </li>
          ),
          feedback ? (
            <li key={`feedback-${feedback.feedbackId}`} className="flex justify-start">
              <div className="ml-11 max-w-[80%] rounded-[20px] border border-amber-100 bg-amber-50 px-4 py-3 text-sm leading-6 text-slate-700">
                <div className="mb-1 flex items-center gap-1.5 text-xs font-extrabold text-amber-600">
                  <Lightbulb size={15} />
                  AI 피드백
                </div>
                {feedback.content}
              </div>
            </li>
          ) : (
            <li
              key={`feedback-skeleton-${group.clientRequestId}`}
              className="flex justify-start"
            >
              <div className="ml-11 h-12 w-[70%] animate-pulse rounded-[20px] bg-amber-50" />
            </li>
          ),
        ];
      })}
      <li ref={bottomRef} aria-hidden="true" />
    </ul>
  );
};

export default ConversationMessages;
