import { Smile } from "lucide-react";
import type { ConversationMessage } from "../../types/freeConversationType";

type ConversationMessagesProps = {
  messages: ConversationMessage[];
};

const ConversationMessages = ({ messages }: ConversationMessagesProps) => {
  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center px-1">
        <div className="w-full max-w-[580px] rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-5 shadow-[0_10px_35px_rgba(16,185,129,0.08)] sm:rounded-[28px] sm:px-8 sm:py-7">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-500 shadow-sm sm:h-14 sm:w-14 sm:rounded-2xl">
              <Smile size={24} />
            </div>
            <div>
              <p className="text-lg font-extrabold text-slate-800 sm:text-2xl">편하게 아무 말이나 해보세요!</p>
              <p className="mt-1 text-sm text-slate-500 sm:mt-1.5 sm:text-base">
                궁금한 거, 하고 싶은 얘기 편하게 이야기 나눠봐요.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ul className="mx-auto flex w-full max-w-4xl flex-col gap-2 py-3 sm:gap-3 sm:py-4">
      {messages.map((message) => {
        const isAssistant = message.role === "assistant";

        return (
          <li key={message.id} className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}>
            <div
              className={`max-w-[85%] rounded-xl px-3 py-2.5 text-[13px] leading-5 sm:max-w-[72%] sm:rounded-2xl sm:px-4 sm:py-3 sm:text-base sm:leading-6 ${
                isAssistant
                  ? "rounded-bl-md border border-slate-200 bg-white text-slate-700"
                  : "rounded-br-md bg-emerald-500 text-white shadow-[0_10px_25px_rgba(16,185,129,0.28)]"
              }`}
            >
              {message.content}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default ConversationMessages;
