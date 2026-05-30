import { RefreshCw } from "lucide-react";

interface ReportSectionErrorProps {
  message?: string;
  onRetry: () => void;
}

const ReportSectionError = ({
  message = "레포트를 불러오지 못했어요. 잠시 후 다시 시도해주세요.",
  onRetry,
}: ReportSectionErrorProps) => {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[14px] border border-rose-100 bg-rose-50 px-4 py-3">
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

export default ReportSectionError;
