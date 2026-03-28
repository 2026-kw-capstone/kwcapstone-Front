import { Mic, RotateCcw, Volume2, Play } from "lucide-react";

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
  // 표시 전용 컴포넌트입니다. 녹음/업로드 로직은 부모 페이지가 담당합니다.
  const isSentenceSelected = !!selectedSentence;

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <h2 className="text-lg font-bold text-slate-900">학습</h2>
      </div>

      <div className="rounded-[20px] border border-dashed border-emerald-200 bg-emerald-50/40 p-5">
        <div className="flex min-h-[220px] flex-col items-center justify-center text-center min-[380px]:min-h-[260px]">
          <p className="text-sm font-semibold text-emerald-600">학습 문장</p>

          <div className="mt-3 min-h-[56px] max-w-xl text-pretty px-2 text-lg font-bold leading-8 text-slate-800">
            {selectedSentence ?? "목록에서 학습할 문장을 선택해 주세요."}
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-500">선택한 문장을 듣고 천천히 따라 말해보세요.</p>

          <div className="mt-6 flex w-full max-w-md flex-col gap-3">
            <button
              type="button"
              onClick={onPlayTts}
              disabled={!isSentenceSelected || isInteractionLocked}
              className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
            >
              <Volume2 size={18} />
              {isPlayingTts ? "재생 중..." : "문장 듣기"}
            </button>

            <button
              type="button"
              onClick={onRecord}
              disabled={!isSentenceSelected || isInteractionLocked}
              className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {hasRecordedAudio ? <RotateCcw size={18} /> : <Mic size={18} />}
              {isRecording ? "녹음 중..." : hasRecordedAudio ? "재녹음" : "녹음"}
            </button>

            <button
              type="button"
              onClick={onPlayRecordedAudio}
              disabled={!hasRecordedAudio || isInteractionLocked}
              className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
            >
              <Play size={18} />
              {isPlayingUserAudio ? "재생 중..." : "내 음성 듣기"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyNoteStudyCard;
