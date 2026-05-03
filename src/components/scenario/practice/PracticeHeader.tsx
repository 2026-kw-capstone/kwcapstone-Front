import BackLinkButton from "../../BackLinkButton";
import type { PracticeStep } from "../../../types/scenarioPracticeType";

interface PracticeHeaderProps {
  scenarioName: string;
  levelLabel: string;
  currentStepIndex: number;
  currentStep: PracticeStep;
  steps: PracticeStep[];
  onBack: () => void;
}

const PracticeHeader = ({
  scenarioName,
  levelLabel,
  currentStepIndex,
  currentStep,
  steps,
  onBack,
}: PracticeHeaderProps) => {
  const stepText = `Step ${currentStepIndex + 1}/${steps.length}`;
  const levelText = levelLabel.replace("Level", "Lv.");

  return (
    <header className="flex justify-between items-center px-3">
      <div className="flex items-center gap-2">
        <BackLinkButton onClick={onBack} label="레벨 선택으로" />
          <div className="flex gap-2">
            <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
              {stepText}
            </span>
            <p className="truncate text-sm font-extrabold text-slate-900">{currentStep.title}</p>
          </div>
      </div>
      <p className="text-center text-xs font-semibold text-slate-500">
        {scenarioName} · {levelText}
      </p>
    </header>
  );
};

export default PracticeHeader;
