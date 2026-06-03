import { useQueryClient } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";
import { getApiErrorMessage } from "../../apis/apiError";
import PracticeHeader from "../../components/scenario/practice/PracticeHeader";
import PracticeStepPanel from "../../components/scenario/practice/PracticeStepPanel";
import PracticeSummaryPanel from "../../components/scenario/practice/PracticeSummaryPanel";
import { usePostScenarioRegenerate } from "../../hooks/mutations/usePostScenarioRegenerate";
import { getScenarioStepQueryKey } from "../../hooks/queries/useGetScenarioStep";
import { isScenarioLevel } from "../../hooks/scenario/scenarioPracticeMapper";
import { useScenarioPracticeFlow } from "../../hooks/scenario/useScenarioPracticeFlow";
import { useScenarioRecordingFlow } from "../../hooks/scenario/useScenarioRecordingFlow";
import type { ScenarioLevel } from "../../types/scenarioType";

interface ScenarioPracticeContentProps {
  resolvedScenarioId: number;
  resolvedLevel: ScenarioLevel;
}

const ScenarioPracticeContent = ({
  resolvedScenarioId,
  resolvedLevel,
}: ScenarioPracticeContentProps) => {
  const queryClient = useQueryClient();
  const {
    currentStepNo,
    maxCompletedStepNo,
    currentStepIndex,
    currentStep,
    currentAnswer,
    currentResult,
    steps,
    totalStepCount,
    isSummaryMode,
    summaryResult,
    isSummaryLoading,
    isSummaryError,
    summaryError,
    isStepLoading,
    isStepError,
    stepError,
    levelLabel,
    progressPercent,
    setIsSummaryMode,
    setMaxCompletedStepNo,
    handlePrevStep,
    handleNextStep,
    handleBackToList,
  } = useScenarioPracticeFlow({
    scenarioId: resolvedScenarioId,
    level: resolvedLevel,
  });

  const {
    isRecording,
    isAnalyzing,
    isPlayingUserAudio,
    isNavigationLocked,
    hasRecordedAudio,
    recordErrorMessage,
    uploadErrorMessage,
    handleRecord,
    handleReRecord,
    handlePlayRecordedAudio,
    clearRecordedAudioFromStep,
  } = useScenarioRecordingFlow({
    scenarioId: resolvedScenarioId,
    level: resolvedLevel,
    currentStepNo,
    isStepLoading,
    isSummaryMode,
    hasPracticeProgress: maxCompletedStepNo > 0 || !!currentAnswer,
    setIsSummaryMode,
    setMaxCompletedStepNo,
  });
  const {
    regenerateScenario,
    isPending: isRegenerating,
    error: regenerateError,
  } = usePostScenarioRegenerate();

  const canGoPrev = currentStepNo > 1 && !isNavigationLocked && !isRegenerating;
  const canGoNext = !!currentAnswer && !isNavigationLocked && !isRegenerating;
  const isRegenerateDisabled = isNavigationLocked || isRegenerating;
  const apiErrorMessage = isStepError ? getApiErrorMessage(stepError) : "";
  const errorMessage = recordErrorMessage || uploadErrorMessage || apiErrorMessage;
  const regenerateErrorMessage = regenerateError
    ? getApiErrorMessage(regenerateError)
    : "";

  const handleRegenerate = async () => {
    if (isRegenerateDisabled) return;

    try {
      await regenerateScenario({
        scenarioId: resolvedScenarioId,
        level: resolvedLevel,
        stepNo: currentStepNo,
      });

      setIsSummaryMode(false);
      setMaxCompletedStepNo((prev) => Math.min(prev, currentStepNo - 1));
      clearRecordedAudioFromStep(currentStepNo);

      await queryClient.refetchQueries({
        queryKey: getScenarioStepQueryKey({
          scenarioId: resolvedScenarioId,
          level: resolvedLevel,
          stepNo: currentStepNo,
        }),
        exact: true,
      });
    } catch {
      // The modal reads mutation.error and keeps the user in place for retry.
    }
  };

  if (isSummaryMode) {
    return (
      <div className="mx-auto flex min-h-full w-full max-w-md">
        {isSummaryLoading ? (
          <section className="flex min-h-full w-full items-center justify-center rounded-[28px] bg-white p-6 text-center">
            <p className="text-[14px] font-bold text-slate-400">
              훈련 결과를 불러오는 중입니다...
            </p>
          </section>
        ) : isSummaryError || !summaryResult ? (
          <section className="flex min-h-full w-full flex-col items-center justify-center gap-4 rounded-[28px] bg-white p-6 text-center">
            <p className="rounded-2xl bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-500">
              {getApiErrorMessage(summaryError)}
            </p>
            <button
              type="button"
              onClick={handleBackToList}
              className="h-12 rounded-2xl bg-[#278DFD] px-5 text-[14px] font-bold text-white"
            >
              목록으로 돌아가기
            </button>
          </section>
        ) : (
          <PracticeSummaryPanel
            averageAccuracy={Math.round(summaryResult.averagePronunciationScore)}
            averageSemanticRate={Math.round(
              summaryResult.averageMeaningDeliveryScore
            )}
            onBackToList={handleBackToList}
          />
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-md flex-col gap-4 animate-fade-in">
      <div className="h-1.5 w-full rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-[#278DFD] transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <PracticeHeader
        levelLabel={levelLabel}
        currentStepIndex={currentStepIndex}
        currentStep={currentStep}
        steps={steps}
      />

      {errorMessage ? (
        <p className="rounded-2xl bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-500">
          {errorMessage}
        </p>
      ) : null}

      {isStepLoading ? (
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <p className="text-[14px] font-bold text-slate-400">
            대화 단계를 불러오는 중입니다...
          </p>
        </div>
      ) : (
        <PracticeStepPanel
          currentStep={currentStep}
          currentStepIndex={currentStepIndex}
          totalSteps={totalStepCount}
          currentResult={currentResult}
          isRecording={isRecording}
          isAnalyzing={isAnalyzing}
          canGoPrev={canGoPrev}
          canGoNext={canGoNext}
          isRegenerateDisabled={isRegenerateDisabled}
          hasRecordedAudio={hasRecordedAudio}
          isPlayingUserAudio={isPlayingUserAudio}
          onRecord={handleRecord}
          onReRecord={handleReRecord}
          onPlayRecordedAudio={handlePlayRecordedAudio}
          onPrev={handlePrevStep}
          onNext={handleNextStep}
          onRegenerate={handleRegenerate}
          isRegenerating={isRegenerating}
          regenerateErrorMessage={regenerateErrorMessage}
        />
      )}
    </div>
  );
};

const ScenarioPracticePage = () => {
  const { scenarioId, level } = useParams<{ scenarioId: string; level: string }>();

  const numericScenarioId = Number(scenarioId);
  const numericLevel = Number(level);
  const isValidScenarioId = Number.isFinite(numericScenarioId);
  const isValidLevel = isScenarioLevel(numericLevel);

  if (!isValidScenarioId || !isValidLevel) {
    return <Navigate to="/ai-practice/scenario" replace />;
  }

  return (
    <ScenarioPracticeContent
      key={`${numericScenarioId}-${numericLevel}`}
      resolvedScenarioId={numericScenarioId}
      resolvedLevel={numericLevel}
    />
  );
};

export default ScenarioPracticePage;
