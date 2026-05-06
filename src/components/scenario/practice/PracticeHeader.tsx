import type { PracticeStep } from "../../../types/scenarioPracticeType";

interface PracticeHeaderProps {
  levelLabel: string;
  currentStepIndex: number;
  currentStep: PracticeStep;
  steps: PracticeStep[];
}

const PracticeHeader = ({
  levelLabel,
  currentStepIndex,
  currentStep,
  steps,
}: PracticeHeaderProps) => {
  const levelText = levelLabel.replace("Level", "Lv.");

  return (
    <header className="flex items-center justify-between px-1">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="shrink-0 rounded-full bg-blue-100 px-3 py-1 text-[12px] font-black uppercase tracking-wider text-[#278DFD]">
          Step {currentStepIndex + 1}/{steps.length}
        </span>
        <span className="truncate text-[15px] font-extrabold text-slate-800">
          {currentStep.title}
        </span>
      </div>
      <span className="shrink-0 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[12px] font-bold text-slate-500 shadow-sm">
        {levelText}
      </span>
    </header>
  );
};

export default PracticeHeader;
