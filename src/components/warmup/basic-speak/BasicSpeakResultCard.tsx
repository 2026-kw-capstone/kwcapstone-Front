import { Activity, Lightbulb, Play, Volume2 } from "lucide-react";

interface BasicSpeakResult {
  accuracyScore: number;
  feedback: string;
}

interface BasicSpeakResultCardProps {
  result: BasicSpeakResult;
  isPlayingModelAudio?: boolean;
  isPlayingUserAudio?: boolean;
  isInteractionLocked?: boolean;
  onPlayModelAudio: () => void;
  onPlayRecordedAudio: () => void;
}

const BasicSpeakResultCard = ({
  result,
  isPlayingModelAudio = false,
  isPlayingUserAudio = false,
  isInteractionLocked = false,
  onPlayModelAudio,
  onPlayRecordedAudio,
}: BasicSpeakResultCardProps) => {
  return (
    <section className="animate-slide-up rounded-[28px] border border-slate-50 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
      <h2 className="mb-5 flex items-center gap-2 text-[16px] font-extrabold text-slate-900">
        <Activity size={20} className="text-indigo-500" />
        분석 결과
      </h2>

      <div className="mb-6 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onPlayRecordedAudio}
          disabled={isInteractionLocked}
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-transparent bg-indigo-50 text-[14px] font-bold text-indigo-600 transition-colors hover:bg-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
        >
          <Play size={16} fill="currentColor" />
          {isPlayingUserAudio ? "재생 중..." : "내 녹음 듣기"}
        </button>

        <button
          type="button"
          onClick={onPlayModelAudio}
          disabled={isInteractionLocked}
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-transparent bg-slate-50 text-[14px] font-bold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
        >
          <Volume2 size={16} />
          {isPlayingModelAudio ? "재생 중..." : "모범 발음 듣기"}
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between rounded-[20px] border border-slate-100 bg-[#F8F9FD] p-5">
          <span className="text-[15px] font-extrabold text-slate-700">
            발음 정확도
          </span>
          <span className="text-[28px] font-black text-indigo-500">
            {Math.round(result.accuracyScore)}
            <span className="ml-1 text-[16px] font-bold text-indigo-400">%</span>
          </span>
        </div>

        <div className="rounded-[20px] border border-indigo-100 bg-indigo-50 p-5">
          <p className="mb-1.5 flex items-center gap-1.5 text-[13px] font-black text-indigo-600">
            <Lightbulb size={16} />
            AI 피드백
          </p>
          <p className="text-[14.5px] font-bold leading-relaxed text-slate-800 break-keep">
            {result.feedback}
          </p>
        </div>
      </div>
    </section>
  );
};

export default BasicSpeakResultCard;
