import { AlertCircle } from "lucide-react";

type ConversationMessagesErrorStateProps = {
  errorMessage?: string;
  onRetry: () => void;
};

export const ConversationMessagesLoadingState = () => (
  <div className="space-y-2 px-1 py-3">
    {Array.from({ length: 6 }).map((_, index) => (
      <div
        key={`message-skeleton-${index}`}
        className={`h-12 animate-pulse rounded-xl ${
          index % 2 === 0 ? "mr-14 bg-slate-200" : "ml-14 bg-emerald-100"
        }`}
      />
    ))}
  </div>
);

export const ConversationMessagesErrorState = ({
  errorMessage,
  onRetry,
}: ConversationMessagesErrorStateProps) => (
  <div className="flex h-full items-center justify-center px-1">
    <div className="w-full max-w-[580px] rounded-2xl border border-rose-200 bg-rose-50 px-4 py-5">
      <div className="flex items-start gap-3">
        <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-rose-500">
          <AlertCircle size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-rose-700">
            {errorMessage ?? "대화 내용을 불러오지 못했어요."}
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
          >
            다시 시도
          </button>
        </div>
      </div>
    </div>
  </div>
);
