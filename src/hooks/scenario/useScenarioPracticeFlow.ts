import { useLayoutEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { QUERY_KEY } from "../../constants/key";
import { getScenarioAnswerQueryKey } from "../queries/useGetScenarioAnswer";
import { useGetScenarioResult } from "../queries/useGetScenarioResult";
import { useGetScenarioStep } from "../queries/useGetScenarioStep";
import type {
  ScenarioAnswerResultDto,
  ScenarioLevel,
} from "../../types/scenarioType";
import {
  mapAnswerToStepResult,
  mapStepToPracticeStep,
} from "./scenarioPracticeMapper";

const DEFAULT_TOTAL_STEP_COUNT = 3;

interface UseScenarioPracticeFlowParams {
  scenarioId: number;
  level: ScenarioLevel;
}

export const useScenarioPracticeFlow = ({
  scenarioId,
  level,
}: UseScenarioPracticeFlowParams) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentStepNo, setCurrentStepNo] = useState(1);
  const [isSummaryMode, setIsSummaryMode] = useState(false);
  const [maxCompletedStepNo, setMaxCompletedStepNo] = useState(0);

  const {
    data: currentStepData,
    isLoading: isStepLoading,
    isError: isStepError,
    error: stepError,
  } = useGetScenarioStep({
    scenarioId,
    level,
    stepNo: currentStepNo,
  });
  const {
    data: summaryResult,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
    error: summaryError,
  } = useGetScenarioResult({
    scenarioId,
    level,
    enabled: isSummaryMode,
  });

  const currentStep = mapStepToPracticeStep(currentStepData);
  const totalStepCount = currentStepData?.totalStepCount ?? DEFAULT_TOTAL_STEP_COUNT;
  const steps = Array.from({ length: totalStepCount }, (_, index) => ({
    step: (index + 1) as ScenarioLevel,
    title:
      index + 1 === currentStepNo && currentStepData
        ? currentStepData.step
        : `Step ${index + 1}`,
    prompt: "",
    hint: "",
  }));
  const currentStepIndex = currentStepNo - 1;
  const currentAnswer =
    currentStepNo <= maxCompletedStepNo
      ? queryClient.getQueryData<ScenarioAnswerResultDto>(
          getScenarioAnswerQueryKey({
            scenarioId,
            level,
            stepNo: currentStepNo,
          })
        ) ?? null
      : null;
  const currentResult = currentAnswer ? mapAnswerToStepResult(currentAnswer) : null;
  const levelLabel = `Level ${level}`;
  const progressPercent = (currentStepNo / totalStepCount) * 100;

  useLayoutEffect(() => {
    queryClient.removeQueries({
      queryKey: [QUERY_KEY.scenarioResult, scenarioId, level],
      exact: true,
    });
  }, [queryClient, level, scenarioId]);

  const handlePrevStep = () => {
    setCurrentStepNo((prev) => Math.max(prev - 1, 1));
  };

  const handleNextStep = () => {
    if (!currentAnswer) return;

    if (currentAnswer.isLastStep || currentStepNo >= totalStepCount) {
      setIsSummaryMode(true);
      return;
    }

    setCurrentStepNo(currentAnswer.nextStepNo ?? currentStepNo + 1);
  };

  const handleBackToList = () => {
    const keysToRemove = new Set<string>([
      QUERY_KEY.scenarioAnswer,
      QUERY_KEY.scenarioResult,
      QUERY_KEY.scenarioUserAudio,
    ]);

    queryClient.removeQueries({
      predicate: ({ queryKey }) =>
        keysToRemove.has(String(queryKey[0])) &&
        queryKey[1] === scenarioId &&
        queryKey[2] === level,
    });

    navigate("/ai-practice/scenario");
  };

  return {
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
  };
};
