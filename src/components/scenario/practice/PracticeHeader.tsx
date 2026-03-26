import { ArrowLeft } from "lucide-react";
import type { PracticeStep, StepResult } from "../../../types/scenarioPracticeType";

interface PracticeHeaderProps {
  scenarioName: string;
  levelLabel: string;
  isSummaryMode: boolean;
  currentStepIndex: number;
  steps: PracticeStep[];
  resultsByStep: Array<StepResult | null>;
  onBack: () => void;
}

const PracticeHeader = ({
  scenarioName,
  levelLabel,
  isSummaryMode,
  currentStepIndex,
  steps,
  resultsByStep,
  onBack,
}: PracticeHeaderProps) => {
  return (
    <header className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          <ArrowLeft size={18} />
          레벨 선택으로
        </button>

        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5">
          <p className="text-sm font-extrabold text-emerald-700">
            {scenarioName}: {levelLabel}
          </p>
        </div>
      </div>

      {!isSummaryMode && (
        <div className="mt-4">
          <div className="mb-3 flex items-center justify-between text-sm font-semibold text-slate-500">
            <span>진행 상황</span>
            <span>
              Step {currentStepIndex + 1} / {steps.length}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {steps.map((step, index) => {
              const isActive = index === currentStepIndex;
              const isComplete = !!resultsByStep[index];

              return (
                <div
                  key={step.step}
                  className={`rounded-xl px-3 py-2 text-center text-sm font-bold transition ${
                    isActive
                      ? "bg-emerald-500 text-white"
                      : isComplete
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-400"
                  }`}
                >
                  Step {step.step}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

export default PracticeHeader;
