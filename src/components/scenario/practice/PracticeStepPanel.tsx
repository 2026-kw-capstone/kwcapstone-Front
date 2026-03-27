import {
  Coffee,
  Mic,
  MicOff,
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
  onRecord: () => void;
  onReRecord: () => void;
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
  onRecord,
  onReRecord,
  onPrev,
  onNext,
}: PracticeStepPanelProps) => {
  return (
    <>
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <Coffee size={22} />
          </div>

          <div>
            <p className="text-xs font-bold text-emerald-600">{currentStep.title} 연습 중</p>
            <h2 className="mt-1 text-2xl font-extrabold leading-tight text-slate-900">
              "{currentStep.prompt}"
            </h2>
            <p className="mt-2 text-sm text-slate-500">{currentStep.hint}</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white px-4 py-8 text-center shadow-sm">
        <button
          type="button"
          onClick={onRecord}
          disabled={isRecording || isAnalyzing}
          className={`mx-auto inline-flex h-24 w-24 items-center justify-center rounded-full text-white transition ${
            isRecording ? "bg-rose-500" : "bg-emerald-500 hover:brightness-105"
          }`}
        >
          {isRecording ? <MicOff size={40} /> : <Mic size={40} />}
        </button>

        <p className="mt-5 text-base font-semibold text-slate-500">
          {isRecording
            ? "녹음 중입니다..."
            : isAnalyzing
              ? "분석 중입니다..."
              : "마이크 버튼을 눌러 녹음하세요"}
        </p>

        {currentResult && !isRecording && !isAnalyzing && (
          <button
            type="button"
            onClick={onReRecord}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            <RotateCcw size={16} />
            재녹음
          </button>
        )}
      </section>

      {currentResult && (
        <section className="rounded-3xl border border-emerald-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Signal className="text-emerald-500" size={20} />
            <h3 className="text-2xl font-extrabold text-slate-900">발음 분석 결과</h3>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {currentResult.transcript.split("").map((char, index) => (
              <span
                key={`${char}-${index}`}
                className="inline-flex h-11 min-w-11 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 px-2 text-2xl font-bold text-emerald-700"
              >
                {char}
              </span>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-500">정확도</p>
              <p className="mt-1 text-5xl font-extrabold text-blue-500">{currentResult.accuracy}%</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-500">유창성</p>
              <p className="mt-1 text-5xl font-extrabold text-amber-500">{currentResult.fluency}%</p>
            </div>
          </div>

          <p className="mt-4 text-sm font-medium text-slate-600">피드백: {currentResult.feedback}</p>
        </section>
      )}

      <footer className="grid grid-cols-2 gap-3 pt-1">
        <button
          type="button"
          onClick={onPrev}
          disabled={!canGoPrev}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-lg font-bold text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-300"
        >
          <StepBack size={20} />
          이전 단계
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-100 transition hover:brightness-105 disabled:cursor-not-allowed disabled:bg-emerald-300"
        >
          {currentStepIndex === totalSteps - 1 ? "최종 결과 보기" : "다음 단계"}
          <StepForward size={20} />
        </button>
      </footer>
    </>
  );
};

export default PracticeStepPanel;
