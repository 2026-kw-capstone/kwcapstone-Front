import { Mic, Play, Volume2 } from "lucide-react";
import type { BasicSpeakCardItem } from "../../../types/basicSpeakType";

interface BasicSpeakStudyCardProps {
  card: BasicSpeakCardItem;
  hasRecording: boolean;
  isRecording?: boolean;
  isPlayingGuideAudio?: boolean;
  isPlayingUserAudio?: boolean;
  onPlayGuideAudio: () => void;
  onRecord: () => void;
  onPlayRecordedAudio: () => void;
}

const BasicSpeakStudyCard = ({
  card,
  hasRecording,
  isRecording = false,
  isPlayingGuideAudio = false,
  isPlayingUserAudio = false,
  onPlayGuideAudio,
  onRecord,
  onPlayRecordedAudio,
}: BasicSpeakStudyCardProps) => {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <h2 className="text-lg font-bold text-slate-900">학습</h2>
      </div>

      <div className="rounded-[20px] border border-dashed border-emerald-200 bg-emerald-50/30 p-5">
        <div className="flex min-h-[240px] flex-col items-center justify-center text-center min-[380px]:min-h-[320px]">
          <p className="text-sm font-semibold text-emerald-600">{card.category}</p>

          <div className="mt-5 text-[56px] font-extrabold leading-none tracking-tight text-emerald-600 min-[380px]:text-[72px]">
            {card.title}
          </div>

          <p className="mt-4 text-xl font-semibold text-slate-500 min-[380px]:text-2xl">
            {card.subtitle}
          </p>

          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500">
            {card.guideText ?? card.description}
          </p>

          <div className="mt-8 flex w-full max-w-xl flex-col gap-3">
            <button
              type="button"
              onClick={onPlayGuideAudio}
              className="inline-flex min-h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50"
            >
              <Volume2 size={18} />
              {isPlayingGuideAudio ? "재생 중..." : "가이드 듣기"}
            </button>

            <button
              type="button"
              onClick={onRecord}
              className="inline-flex min-h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              <Mic size={18} />
              {isRecording ? "녹음 중..." : hasRecording ? "다시 녹음" : "녹음"}
            </button>

            <button
              type="button"
              onClick={onPlayRecordedAudio}
              disabled={!hasRecording}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
            >
              <Play size={18} />
              {isPlayingUserAudio ? "재생 중..." : "재생하기"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BasicSpeakStudyCard;
