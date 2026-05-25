import { useState } from "react";
import type { PracticeStep, StepResult } from "../../../types/scenarioPracticeType";
import AiQuestionCard from "./AiQuestionCard";
import PracticeNavigationFooter from "./PracticeNavigationFooter";
import RecordPrompt from "./RecordPrompt";
import RegenerateQuestionModal from "./RegenerateQuestionModal";
import StepResultPanel from "./StepResultPanel";

interface PracticeStepPanelProps {
  currentStep: PracticeStep;
  currentStepIndex: number;
  totalSteps: number;
  currentResult: StepResult | null;
  isRecording: boolean;
  isAnalyzing: boolean;
  canGoPrev: boolean;
  canGoNext: boolean;
  isRegenerateDisabled: boolean;
  hasRecordedAudio: boolean;
  isPlayingUserAudio: boolean;
  onRecord: () => void;
  onReRecord: () => void;
  onPlayRecordedAudio: () => void;
  onPrev: () => void;
  onNext: () => void;
  onRegenerate: () => Promise<void>;
  isRegenerating: boolean;
  regenerateErrorMessage: string;
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
  isRegenerateDisabled,
  hasRecordedAudio,
  isPlayingUserAudio,
  onRecord,
  onReRecord,
  onPlayRecordedAudio,
  onPrev,
  onNext,
  onRegenerate,
  isRegenerating,
  regenerateErrorMessage,
}: PracticeStepPanelProps) => {
  const [isRegenerateModalOpen, setIsRegenerateModalOpen] = useState(false);

  const handleRegenerateConfirm = async () => {
    await onRegenerate();
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="-mx-5 min-h-0 flex-1 overflow-y-auto px-5 pb-4 pt-4 hide-scrollbar">
        <div className="flex min-h-full flex-col gap-4">
          <AiQuestionCard
            currentStep={currentStep}
            currentResult={currentResult}
          hasRecordedAudio={hasRecordedAudio}
          isPlayingUserAudio={isPlayingUserAudio}
          isRegenerateDisabled={isRegenerateDisabled}
          onOpenRegenerateModal={() => {
            if (isRegenerateDisabled) return;
            setIsRegenerateModalOpen(true);
          }}
            onReRecord={onReRecord}
            onPlayRecordedAudio={onPlayRecordedAudio}
          />

          {!currentResult ? (
            <RecordPrompt
              isRecording={isRecording}
              isAnalyzing={isAnalyzing}
              onRecord={onRecord}
            />
          ) : (
            <StepResultPanel currentResult={currentResult} />
          )}
        </div>
      </div>

      <PracticeNavigationFooter
        currentStepIndex={currentStepIndex}
        totalSteps={totalSteps}
        canGoPrev={canGoPrev}
        canGoNext={canGoNext}
        onPrev={onPrev}
        onNext={onNext}
      />

      {isRegenerateModalOpen ? (
        <RegenerateQuestionModal
          isPending={isRegenerating}
          errorMessage={regenerateErrorMessage}
          onClose={() => setIsRegenerateModalOpen(false)}
          onConfirm={handleRegenerateConfirm}
        />
      ) : null}
    </div>
  );
};

export default PracticeStepPanel;
