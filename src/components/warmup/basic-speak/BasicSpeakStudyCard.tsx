import { Mic, MicOff } from "lucide-react";
import type { BasicSpeakCardItem } from "../../../types/basicSpeakType";

interface BasicSpeakStudyCardProps {
  card: BasicSpeakCardItem;
  hasResult: boolean;
  isRecording?: boolean;
  isInteractionLocked?: boolean;
  onRecord: () => void;
}

const BasicSpeakStudyCard = ({
  card,
  hasResult,
  isRecording = false,
  isInteractionLocked = false,
  onRecord,
}: BasicSpeakStudyCardProps) => {
  const recordLabel = isRecording
    ? "소리를 길게 내보세요..."
    : hasResult
      ? "다시 녹음하려면 버튼을 누르세요"
      : "마이크를 눌러 시작";

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-slate-50 bg-white p-8 text-center shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
      <div className="absolute left-0 top-0 h-2 w-full bg-gradient-to-r from-indigo-400 to-indigo-500" />

      <p className="mb-8 mt-2 inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-3.5 py-1.5 text-[13px] font-extrabold text-indigo-500">
        {card.category}
      </p>

      <div className="mb-4 text-[90px] font-black leading-none text-slate-800">
        {card.title}
      </div>

      <p className="mb-10 px-4 text-[17px] font-extrabold text-slate-500 break-keep">
        {card.subtitle}
      </p>

      <button
        type="button"
        onClick={onRecord}
        disabled={isInteractionLocked}
        className={`inline-flex h-[88px] w-[88px] items-center justify-center rounded-full text-white shadow-xl transition-all disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none ${
          isRecording
            ? "scale-110 animate-pulse bg-rose-500 shadow-rose-200/50"
            : "bg-indigo-500 shadow-indigo-300/50 active:scale-95"
        }`}
        aria-label={isRecording ? "녹음 중" : hasResult ? "다시 녹음" : "녹음 시작"}
      >
        {isRecording ? <MicOff size={36} /> : <Mic size={36} />}
      </button>

      <p className="mt-5 text-[14px] font-bold text-slate-400">{recordLabel}</p>
    </section>
  );
};

export default BasicSpeakStudyCard;
