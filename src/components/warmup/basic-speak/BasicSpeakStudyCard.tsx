import { Mic } from "lucide-react";
import type { BasicSpeakCardItem } from "../../../types/basicSpeakType";

interface BasicSpeakStudyCardProps {
  card: BasicSpeakCardItem;
  hasRecordedAudio: boolean;
  isRecording?: boolean;
  isInteractionLocked?: boolean;
  onRecord: () => void;
}

const BasicSpeakStudyCard = ({
  card,
  hasRecordedAudio,
  isRecording = false,
  isInteractionLocked = false,
  onRecord,
}: BasicSpeakStudyCardProps) => {
  return (
    <section className="rounded-[24px] bg-white/60 p-3">
      <div className="rounded-[24px] bg-white p-5 text-center shadow-sm">
        <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
          {card.category}
        </span>

        <p className="mt-6 text-[50px] font-extrabold leading-none tracking-tight text-slate-800 min-[380px]:text-[62px]">
          {card.title}
        </p>

        <p className="mt-2 text-xl font-bold text-slate-700">{card.subtitle}</p>

        <p className="mx-auto mt-3 max-w-[260px] text-sm leading-6 text-slate-400">
          {card.guideText ?? card.description}
        </p>

        <button
          type="button"
          onClick={onRecord}
          disabled={isInteractionLocked}
          className="mt-8 inline-flex h-20 w-20 cursor-pointer items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          aria-label={isRecording ? "녹음 중" : hasRecordedAudio ? "다시 녹음" : "녹음 시작"}
        >
          <Mic size={30} strokeWidth={2.2} />
        </button>

        <p className="mt-4 text-sm font-semibold text-slate-400">
          {isRecording
            ? "녹음 중..."
            : hasRecordedAudio
              ? "다시 녹음하려면 버튼을 누르세요"
              : "마이크를 눌러 시작"}
        </p>
      </div>
    </section>
  );
};

export default BasicSpeakStudyCard;
