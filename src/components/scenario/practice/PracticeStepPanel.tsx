import {
  Lightbulb,
  MessageSquare,
  Mic,
  MicOff,
  Play,
  RotateCcw,
  Signal,
  StepBack,
  StepForward,
} from "lucide-react";
import type {
  PracticeStep,
  ScenarioSyllableStatus,
  StepResult,
} from "../../../types/scenarioPracticeType";

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

const syllableStatusClassName: Record<ScenarioSyllableStatus, string> = {
  good: "border-emerald-100 bg-emerald-50 text-emerald-600",
  warn: "border-amber-100 bg-amber-50 text-amber-600",
  error: "border-rose-100 bg-rose-50 text-rose-600",
};

const MetricBlock = ({
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
}) => (
  <div
    className={`rounded-[16px] border p-3 text-center ${
      highlight ? "border-blue-100 bg-blue-50" : "border-slate-100 bg-[#F8F9FD]"
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
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="-mx-5 min-h-0 flex-1 overflow-y-auto px-5 pb-4 pt-4 hide-scrollbar">
        <div className="flex min-h-full flex-col gap-4">
          <section className="relative shrink-0 rounded-[24px] border border-slate-100 bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.03)]">
            <div className="absolute -top-3.5 left-5 rounded-lg bg-slate-800 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-md">
              AI 질문
            </div>
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
          </section>

          <section className="flex min-h-[200px] flex-1 flex-col items-center justify-center">
            {!currentResult ? (
              <div className="flex flex-col items-center animate-fade-in">
                <button
                  type="button"
                  onClick={onRecord}
                  disabled={isAnalyzing}
                  className={`flex h-[88px] w-[88px] items-center justify-center rounded-full text-white shadow-xl transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                    isRecording
                      ? "scale-110 animate-pulse bg-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.4)]"
                      : "bg-[#278DFD] shadow-[0_8px_20px_rgba(39,141,253,0.3)] hover:scale-105 active:scale-[0.9]"
                  }`}
                >
                  {isRecording ? <MicOff size={36} /> : <Mic size={36} />}
                </button>
                <p className="mt-6 text-[15px] font-extrabold text-slate-400">
                  {isRecording
                    ? "녹음 중입니다..."
                    : isAnalyzing
                      ? "분석 중입니다..."
                      : "버튼을 눌러 대답해보세요"}
                </p>
              </div>
            ) : (
              <div className="w-full animate-slide-up rounded-[24px] border border-blue-50 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
                <h3 className="mb-5 flex items-center gap-2 text-[15px] font-black text-slate-900">
                  <Signal className="text-[#278DFD]" size={20} />
                  분석 결과
                </h3>

                <div className="mb-6 grid grid-cols-2 gap-2">
                  <MetricBlock
                    label="발음 정확도"
                    value={currentResult.accuracy}
                    unit="%"
                    colorClassName="text-[#278DFD]"
                    highlight
                  />
                  <MetricBlock
                    label="의미 전달률"
                    value={currentResult.semanticRate}
                    unit="%"
                    colorClassName="text-emerald-500"
                  />
                  <MetricBlock
                    label="발화 속도"
                    value={currentResult.speed}
                    unit=""
                    colorClassName="text-slate-700"
                  />
                  <MetricBlock
                    label="침묵 비율"
                    value={currentResult.silenceRatio}
                    unit="%"
                    colorClassName="text-slate-700"
                  />
                </div>

                <div className="mb-6 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={onReRecord}
                    className="flex h-12 items-center justify-center gap-2 rounded-xl border border-transparent bg-slate-50 text-[14px] font-bold text-slate-700 transition-colors hover:bg-slate-100"
                  >
                    <RotateCcw size={16} />
                    다시 녹음
                  </button>
                  <button
                    type="button"
                    onClick={onPlayRecordedAudio}
                    disabled={!hasRecordedAudio}
                    className="flex h-12 items-center justify-center gap-2 rounded-xl border border-transparent bg-blue-50 text-[14px] font-bold text-[#278DFD] transition-colors hover:bg-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    <Play size={16} fill="currentColor" />
                    {isPlayingUserAudio ? "재생 중..." : "녹음 듣기"}
                  </button>
                </div>

                <p className="mb-2.5 text-[13px] font-black text-slate-500">
                  발음 세부 피드백
                </p>
                <div className="mb-6 flex gap-1.5 overflow-x-auto pb-2 hide-scrollbar">
                  {currentResult.syllables.map((syllable, index) => (
                    <span
                      key={`${syllable.text}-${index}`}
                      className={`flex h-[42px] min-w-[38px] shrink-0 items-center justify-center rounded-[12px] border text-[16px] font-extrabold shadow-sm ${
                        syllableStatusClassName[syllable.status]
                      }`}
                    >
                      {syllable.text}
                    </span>
                  ))}
                </div>

                <div className="relative rounded-[18px] border border-slate-100 bg-[#F8F9FD] p-4">
                  <div className="absolute left-4 top-0 flex -translate-y-1/2 items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-extrabold text-[#278DFD] shadow-sm">
                    <MessageSquare size={12} />
                    AI 코멘트
                  </div>
                  <p className="mt-2 break-keep text-[14px] font-medium leading-relaxed text-slate-700">
                    {currentResult.feedback}
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      <footer className="z-20 -mx-5 grid grid-cols-[56px_1fr] gap-3 border-t border-slate-100 bg-white p-4 shadow-[0_-4px_16px_rgba(0,0,0,0.02)]">
        <button
          type="button"
          onClick={onPrev}
          disabled={!canGoPrev}
          className="flex h-[56px] items-center justify-center rounded-[18px] bg-[#F8F9FD] text-slate-400 transition-colors active:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="이전 단계"
        >
          <StepBack size={22} />
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          className="flex h-[56px] items-center justify-center gap-2 rounded-[18px] bg-slate-800 text-[16px] font-bold text-white shadow-lg transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30 disabled:shadow-none"
        >
          {currentStepIndex === totalSteps - 1 ? "종료 및 결과보기" : "다음 단계로"}
          <StepForward size={20} />
        </button>
      </footer>
    </div>
  );
};

export default PracticeStepPanel;
