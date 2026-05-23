import { Lightbulb, Play, RefreshCw, RotateCcw } from "lucide-react";
import type { PracticeStep, StepResult } from "../../../types/scenarioPracticeType";

interface AiQuestionCardProps {
  currentStep: PracticeStep;
  currentResult: StepResult | null;
  hasRecordedAudio: boolean;
  isPlayingUserAudio: boolean;
  onOpenRegenerateModal: () => void;
  onReRecord: () => void;
  onPlayRecordedAudio: () => void;
}

const AiQuestionCard = ({
  currentStep,
  currentResult,
  hasRecordedAudio,
  isPlayingUserAudio,
  onOpenRegenerateModal,
  onReRecord,
  onPlayRecordedAudio,
}: AiQuestionCardProps) => (
  <section className="relative shrink-0 rounded-[24px] border border-slate-100 bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.03)]">
    <div className="absolute -top-3.5 left-5 rounded-lg bg-slate-800 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-md">
      AI 질문
    </div>
    <button
      type="button"
      onClick={onOpenRegenerateModal}
      className="absolute -top-3.5 right-5 flex h-7 items-center gap-1.5 rounded-lg border border-blue-100 bg-blue-50 px-2.5 text-[11px] font-extrabold text-[#278DFD] shadow-sm transition-colors hover:bg-blue-100"
    >
      <RefreshCw size={13} />
      질문 재생성
    </button>
    <p className="mb-4 mt-3 break-keep text-[18px] font-extrabold leading-relaxed text-slate-800">
      "{currentStep.prompt}"
    </p>
    <div className="rounded-[16px] border border-slate-100 bg-[#F8F9FD] p-4">
      <p className="mb-1.5 flex items-center gap-1.5 text-[12px] font-black text-slate-500">
        <Lightbulb size={14} />
        힌트
      </p>
      <p className="break-keep text-[13.5px] font-medium leading-relaxed text-slate-700">
        {currentStep.hint}
      </p>
    </div>
    {currentResult ? (
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onReRecord}
          className="flex h-11 items-center justify-center gap-2 rounded-xl border border-transparent bg-slate-50 text-[13px] font-bold text-slate-700 transition-colors hover:bg-slate-100"
        >
          <RotateCcw size={15} />
          다시 녹음
        </button>
        <button
          type="button"
          onClick={onPlayRecordedAudio}
          disabled={!hasRecordedAudio}
          className="flex h-11 items-center justify-center gap-2 rounded-xl border border-transparent bg-blue-50 text-[13px] font-bold text-[#278DFD] transition-colors hover:bg-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
        >
          <Play size={15} fill="currentColor" />
          {isPlayingUserAudio ? "재생 중..." : "녹음 듣기"}
        </button>
      </div>
    ) : null}
  </section>
);

export default AiQuestionCard;
