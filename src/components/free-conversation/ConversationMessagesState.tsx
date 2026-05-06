import { AlertCircle } from "lucide-react";

type ConversationMessagesErrorStateProps = {
  errorMessage?: string;
  onRetry: () => void;
};

export const ConversationMessagesLoadingState = () => (
  <div className="space-y-4 py-1">
    {Array.from({ length: 6 }).map((_, index) => (
      <div
        key={`message-skeleton-${index}`}
        className={`h-14 animate-pulse rounded-[22px] ${
          index % 2 === 0 ? "mr-16 bg-white" : "ml-16 bg-blue-100"
        }`}
      />
    ))}
  </div>
);

export const ConversationMessagesErrorState = ({
  errorMessage,
  onRetry,
}: ConversationMessagesErrorStateProps) => (
  <div className="flex h-full items-center justify-center">
    <div className="w-full rounded-[24px] border border-rose-100 bg-white px-5 py-6 shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
          <AlertCircle size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-rose-600">
            {errorMessage ?? "대화 내용을 불러오지 못했어요."}
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-xs font-extrabold text-rose-500 transition hover:bg-rose-100"
          >
            다시 시도
          </button>
        </div>
      </div>
    </div>
  </div>
);
