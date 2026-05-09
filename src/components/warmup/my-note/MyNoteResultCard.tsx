import { Activity, Lightbulb, Play, Volume2 } from "lucide-react";
import type {
  MyNoteAnalysisResult,
  MyNoteSyllableStatus,
} from "../../../types/myNoteType";

interface MyNoteResultCardProps {
  result: MyNoteAnalysisResult;
  isPlayingTts?: boolean;
  isPlayingUserAudio?: boolean;
  isInteractionLocked?: boolean;
  onPlayTts: () => void;
  onPlayRecordedAudio: () => void;
}

const syllableStatusClassName: Record<MyNoteSyllableStatus, string> = {
  good: "border-emerald-100 bg-emerald-50 text-emerald-600",
  warn: "border-amber-100 bg-amber-50 text-amber-600",
  bad: "border-rose-100 bg-rose-50 text-rose-600",
};

const MetricItem = ({
  label,
  value,
  unit,
  colorClassName,
  highlight = false,
}: {
  label: string;
  value: number;
  unit: string;
  colorClassName: string;
  highlight?: boolean;
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-[16px] border p-3 text-center transition-all ${
        highlight
          ? "border-blue-100 bg-blue-50"
          : "border-slate-100 bg-[#F8F9FD]"
      }`}
    >
      <p
        className={`mb-1 text-[11px] font-semibold ${
          highlight ? "text-blue-500" : "text-slate-500"
        }`}
      >
        {label}
      </p>
      <p className={`text-[18px] font-black ${colorClassName}`}>
        {value}
        <span className="ml-0.5 text-[12px] font-bold">{unit}</span>
      </p>
    </div>
  );
};

const MyNoteResultCard = ({
  result,
  isPlayingTts = false,
  isPlayingUserAudio = false,
  isInteractionLocked = false,
  onPlayTts,
  onPlayRecordedAudio,
}: MyNoteResultCardProps) => {
  const metrics = [
    {
      label: "발음 정확도",
      value: result.pronunciationScore,
      unit: "%",
      colorClassName: "text-[#278DFD]",
      highlight: true,
    },
    {
      label: "발화 속도",
      value: result.speechRate,
      unit: "점",
      colorClassName: "text-slate-800",
      highlight: false,
    },
    {
      label: "침묵 비율",
      value: result.silenceRatio,
      unit: "%",
      colorClassName: "text-slate-800",
      highlight: false,
    },
  ];

  return (
    <section className="animate-slide-up rounded-[24px] border border-slate-100 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
      <h2 className="mb-4 flex items-center gap-2 text-[16px] font-extrabold text-slate-900">
        <Activity className="text-[#278DFD]" size={20} />
        분석 결과
      </h2>

      <div className="mb-6 grid grid-cols-3 gap-2">
        {metrics.map((metric) => (
          <MetricItem key={metric.label} {...metric} />
        ))}
      </div>

      <div className="mb-6 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onPlayRecordedAudio}
          disabled={isInteractionLocked}
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-transparent bg-blue-50 text-[14px] font-bold text-[#278DFD] transition-colors hover:bg-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
        >
          <Play size={16} fill="currentColor" />
          {isPlayingUserAudio ? "재생 중..." : "내 녹음 듣기"}
        </button>

        <button
          type="button"
          onClick={onPlayTts}
          disabled={isInteractionLocked}
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-transparent bg-slate-50 text-[14px] font-bold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
        >
          <Volume2 size={16} />
          {isPlayingTts ? "재생 중..." : "AI 발음 듣기"}
        </button>
      </div>

      <p className="mb-2.5 text-[13px] font-black text-slate-500">
        음절별 상세 피드백
      </p>
      <div className="mb-6 flex gap-1.5 overflow-x-auto pb-2 hide-scrollbar">
        {result.syllableAnalysis.map((syllable, index) => (
          <span
            key={`${syllable.text}-${index}`}
            className={`flex h-[44px] min-w-[40px] shrink-0 items-center justify-center rounded-[12px] border text-[16px] font-extrabold shadow-sm ${
              syllableStatusClassName[syllable.grade]
            }`}
          >
            {syllable.text}
          </span>
        ))}
      </div>

      <div className="relative rounded-[18px] border border-slate-100 bg-[#F8F9FD] p-4">
        <div className="absolute left-4 top-0 flex -translate-y-1/2 items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-extrabold text-[#278DFD] shadow-sm">
          <Lightbulb size={12} />
          AI 피드백
        </div>
        <p className="mt-2 break-keep text-[14px] font-medium leading-relaxed text-slate-700">
          {result.feedback}
        </p>
      </div>
    </section>
  );
};

export default MyNoteResultCard;
