import { RefreshCw } from "lucide-react";

interface HomeSectionErrorProps {
  message: string;
  onRetry: () => void;
}

const HomeSectionError = ({ message, onRetry }: HomeSectionErrorProps) => {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[16px] border border-rose-100 bg-rose-50 px-4 py-3">
      <p className="min-w-0 text-[12.5px] font-bold leading-snug text-rose-500">
        {message}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-[12px] font-bold text-rose-500 shadow-sm transition-colors hover:bg-rose-100"
      >
        <RefreshCw size={13} />
        다시 시도
      </button>
    </div>
  );
};

export default HomeSectionError;
