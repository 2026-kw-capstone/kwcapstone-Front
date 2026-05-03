import {
  Lightbulb,
  Mic,
  MicOff,
  Play,
  RotateCcw,
  Signal,
  StepBack,
  StepForward,
} from "lucide-react";
import type { PracticeStep, StepResult } from "../../../types/scenarioPracticeType";

interface PracticeStepPanelProps {
  currentStep: PracticeStep;
  currentStepIndex: number;
  totalSteps: number;
  currentResult: StepResult | null;
  isRecording: boolean;
  isAnalyzing: boolean;
  canGoPrev: boolean;
  canGoNext: boolean;
  hasRecordedAudio: boolean;
  isPlayingUserAudio: boolean;
  onRecord: () => void;
  onReRecord: () => void;
  onPlayRecordedAudio: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const PracticeStepPanel = ({
  currentStep,
  currentStepIndex,
  totalSteps,
  currentResult,
  isRecording,
  isAnalyzing,
  canGoPrev,
  canGoNext,
  hasRecordedAudio,
  isPlayingUserAudio,
  onRecord,
  onReRecord,
  onPlayRecordedAudio,
  onPrev,
  onNext,
}: PracticeStepPanelProps) => {

  return (
    <>
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <span className="inline-flex rounded-xl bg-slate-900 px-3 py-1 text-xs font-bold text-white">
          AI
        </span>
        <p className="mt-3 text-lg font-extrabold leading-tight text-slate-900">
          "{currentStep.prompt}"
        </p>

        <div className="mt-4 rounded-2xl bg-slate-100 p-4">
          <p className="text-xs font-bold text-emerald-600">연습 포인트</p>
          <p className="mt-1 text-xs leading-6 text-slate-700">{currentStep.hint}</p>
        </div>
      </section>

      <section className="rounded-3xl border border-transparent bg-transparent px-4 py-8 text-center">
        <button
          type="button"
          onClick={onRecord}
          disabled={isAnalyzing}
          className={`mx-auto inline-flex h-22 w-22 items-center justify-center rounded-full text-white shadow-lg shadow-emerald-100 transition ${
            isRecording ? "bg-rose-500" : "bg-emerald-500 enabled:hover:brightness-105"
          } disabled:cursor-not-allowed disabled:opacity-60`}
        >
          {isRecording ? <MicOff size={40} /> : <Mic size={40} />}
        </button>

        <p className="mt-5 text-xs font-semibold text-slate-400">
          {isRecording
            ? "녹음 중입니다... 버튼을 다시 누르면 종료됩니다."
            : isAnalyzing
              ? "분석 중입니다..."
              : "버튼을 눌러 대답하세요"}
        </p>

        {currentResult && !isRecording && !isAnalyzing && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={onReRecord}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <RotateCcw size={14} />
              재녹음
            </button>

            <button
              type="button"
              onClick={onPlayRecordedAudio}
              disabled={!hasRecordedAudio}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-300"
            >
              <Play size={14} />
              {isPlayingUserAudio ? "재생 중..." : "내 음성 듣기"}
            </button>
          </div>
        )}
      </section>

      {currentResult && (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Signal className="text-emerald-500" size={18} />
            <h3 className="font-extrabold text-slate-900">발음 분석 결과</h3>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {currentResult.transcript.split("").map((char, index) => (
              <span
                key={`${char}-${index}`}
                className="inline-flex h-10 min-w-11 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 px-2 text-lg font-bold text-emerald-700"
              >
                {char}
              </span>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-slate-50 p-4 text-center">
              <p className="text-sm font-semibold text-slate-500">정확도</p>
              <p className="mt-1 text-2xl font-extrabold text-emerald-600">{currentResult.accuracy}%</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 text-center">
              <p className="text-sm font-semibold text-slate-500">유창성</p>
              <p className="mt-1 text-2xl font-extrabold text-teal-600">{currentResult.fluency}%</p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600">
              <Lightbulb size={14} />
              AI 맞춤 피드백
            </p>
            <p className="mt-2 text-sm font-medium text-slate-700">{currentResult.feedback}</p>
          </div>
        </section>
      )}

      <footer className="grid grid-cols-[56px_1fr] gap-3 pt-1">
        <button
          type="button"
          onClick={onPrev}
          disabled={!canGoPrev}
          className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-300"
        >
          <StepBack size={20} />
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-3 py-3 font-bold text-white shadow-lg shadow-emerald-100 transition enabled:hover:brightness-105 disabled:cursor-not-allowed disabled:bg-emerald-300"
        >
          {currentStepIndex === totalSteps - 1 ? "최종 결과 보기" : "다음 단계"}
          <StepForward size={20} />
        </button>
      </footer>
    </>
  );
};

export default PracticeStepPanel;
