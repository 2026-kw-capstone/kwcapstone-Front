import { Mic, Play, RotateCcw, Volume2 } from "lucide-react";

interface MyNoteStudyCardProps {
  selectedSentence: string | null;
  hasRecordedAudio: boolean;
  isRecording?: boolean;
  isPlayingTts?: boolean;
  isPlayingUserAudio?: boolean;
  isInteractionLocked?: boolean;
  onPlayTts: () => void;
  onRecord: () => void;
  onPlayRecordedAudio: () => void;
}

const MyNoteStudyCard = ({
  selectedSentence,
  hasRecordedAudio,
  isRecording = false,
  isPlayingTts = false,
  isPlayingUserAudio = false,
  isInteractionLocked = false,
  onPlayTts,
  onRecord,
  onPlayRecordedAudio,
}: MyNoteStudyCardProps) => {
  const isSentenceSelected = !!selectedSentence;

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
          <Mic size={16} />
        </div>
        <h2 className="font-bold text-slate-900">학습</h2>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex min-h-[96px] items-center justify-center rounded-2xl bg-slate-100 px-4 text-center">
          <p
            className={`text-pretty leading-8 ${
              isSentenceSelected
                ? "font-bold text-slate-800"
                : "font-semibold leading-6 text-slate-400"
            }`}
          >
            {selectedSentence ?? "아래 목록에서 문장을 선택해 주세요."}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onPlayTts}
            disabled={!isSentenceSelected || isInteractionLocked}
            className={`inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 ${
              hasRecordedAudio
                ? "bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50"
                : "bg-slate-100 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 sm:col-span-2"
            }`}
          >
            <Volume2 size={18} />
            {isPlayingTts ? "재생 중..." : "AI 음성 듣기"}
          </button>

          {hasRecordedAudio ? (
            <button
              type="button"
              onClick={onPlayRecordedAudio}
              disabled={isInteractionLocked}
              className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:border-emerald-200 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
            >
              <Play size={18} />
              {isPlayingUserAudio ? "재생 중..." : "내 음성 듣기"}
            </button>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onRecord}
          disabled={!isSentenceSelected || isInteractionLocked}
          className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {hasRecordedAudio ? <RotateCcw size={18} /> : <Mic size={18} />}
          {isRecording ? "녹음 중..." : hasRecordedAudio ? "다시 녹음하기" : "녹음하기"}
        </button>
      </div>
    </section>
  );
};

export default MyNoteStudyCard;
