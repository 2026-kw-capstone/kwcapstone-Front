import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Navigate,
  useBeforeUnload,
  useBlocker,
  useNavigate,
  useParams,
} from "react-router-dom";
import { getApiErrorMessage } from "../../apis/apiError";
import { getScenarioUserAudio } from "../../apis/scenario";
import PracticeHeader from "../../components/scenario/practice/PracticeHeader";
import PracticeStepPanel from "../../components/scenario/practice/PracticeStepPanel";
import PracticeSummaryPanel from "../../components/scenario/practice/PracticeSummaryPanel";
import { QUERY_KEY } from "../../constants/key";
import { getRecordErrorMessage } from "../../constants/recordingMessage";
import { useRecord } from "../../contexts/RecordContext";
import {
  revokeObjectUrlIfNeeded,
  useAudioPlayer,
} from "../../hooks/audio/useAudioPlayer";
import { useRecordUploadFlow } from "../../hooks/audio/useRecordUploadFlow";
import { usePostScenarioAnswer } from "../../hooks/mutations/usePostScenarioAnswer";
import { useGetScenarioResult } from "../../hooks/queries/useGetScenarioResult";
import { useGetScenarioStep } from "../../hooks/queries/useGetScenarioStep";
import type {
  PracticeStep,
  ScenarioSyllableStatus,
  StepResult,
} from "../../types/scenarioPracticeType";
import type {
  ScenarioAnswerResultDto,
  ScenarioLevel,
  ScenarioStepDto,
} from "../../types/scenarioType";

const DEFAULT_TOTAL_STEP_COUNT = 3;

const getScenarioUserAudioQueryKey = ({
  scenarioId,
  level,
  stepNo,
}: {
  scenarioId?: number;
  level?: ScenarioLevel;
  stepNo?: number;
}) => [QUERY_KEY.scenarioUserAudio, scenarioId, level, stepNo] as const;

const isScenarioLevel = (value: number): value is ScenarioLevel =>
  value === 1 || value === 2 || value === 3;

const normalizeSyllableStatus = (grade: string): ScenarioSyllableStatus => {
  if (grade === "good" || grade === "warn" || grade === "error") {
    return grade;
  }

  return "warn";
};

const mapStepToPracticeStep = (step: ScenarioStepDto | undefined): PracticeStep => ({
  step: (step?.stepNo ?? 1) as ScenarioLevel,
  title: step?.step ?? "",
  prompt: step?.assistantMessage ?? "",
  hint: step?.userIntent ?? "",
});

const mapAnswerToStepResult = (answer: ScenarioAnswerResultDto): StepResult => ({
  accuracy: Math.round(answer.pronunciationScore),
  semanticRate: Math.round(answer.meaningDeliveryScore),
  speed: Math.round(answer.speechRateScore),
  silenceRatio: Math.round(answer.silenceRatio),
  feedback: answer.feedback,
  syllables: answer.wordAnalysis.map((word, index) => ({
    text: word.hypChar || word.refChar || String(index + 1),
    status: normalizeSyllableStatus(word.grade),
  })),
});

interface ScenarioPracticeContentProps {
  resolvedScenarioId: number;
  resolvedLevel: ScenarioLevel;
}

const ScenarioPracticeContent = ({
  resolvedScenarioId,
  resolvedLevel,
}: ScenarioPracticeContentProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isRecording, status, lastError, startRecording, stopRecording } =
    useRecord();
  const { isPlaying, playAudio } = useAudioPlayer();
  const { analyzeScenarioAnswer } = usePostScenarioAnswer();

  const [currentStepNo, setCurrentStepNo] = useState(1);
  const [isSummaryMode, setIsSummaryMode] = useState(false);
  const [answerByStep, setAnswerByStep] = useState<
    Record<number, ScenarioAnswerResultDto | null>
  >({});
  const [recordedAudioUrlByStep, setRecordedAudioUrlByStep] = useState<
    Record<number, string | null>
  >({});
  const recordedAudioUrlByStepRef = useRef<Record<number, string | null>>({});

  const {
    data: currentStepData,
    isLoading: isStepLoading,
    isError: isStepError,
    error: stepError,
  } = useGetScenarioStep({
    scenarioId: resolvedScenarioId,
    level: resolvedLevel,
    stepNo: currentStepNo,
  });
  const {
    data: summaryResult,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
    error: summaryError,
  } = useGetScenarioResult({
    scenarioId: resolvedScenarioId,
    level: resolvedLevel,
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
  const currentAnswer = answerByStep[currentStepNo] ?? null;
  const currentResult = currentAnswer ? mapAnswerToStepResult(currentAnswer) : null;
  const currentAudioUrl = recordedAudioUrlByStep[currentStepNo] ?? null;

  const { isUploading: isAnalyzing, toggleRecordAndUpload } = useRecordUploadFlow({
    isRecording,
    status,
    startRecording,
    stopRecording,
    isBlocked: isStepLoading,
    uploadFn: (voiceFile) =>
      analyzeScenarioAnswer({
        scenarioId: resolvedScenarioId,
        level: resolvedLevel,
        stepNo: currentStepNo,
        voiceFile,
      }),
    onBeforeStart: () => {
      setIsSummaryMode(false);
    },
    onUploadSuccess: (response, blob) => {
      const nextAudioUrl = URL.createObjectURL(blob);

      setAnswerByStep((prev) => ({
        ...prev,
        [currentStepNo]: response.result,
      }));
      setRecordedAudioUrlByStep((prev) => {
        const previousUrl = prev[currentStepNo];
        revokeObjectUrlIfNeeded(previousUrl);

        return {
          ...prev,
          [currentStepNo]: nextAudioUrl,
        };
      });
    },
  });

  const hasAnyProgress = !!currentAnswer || isRecording || isAnalyzing;
  const shouldBlockNavigation = hasAnyProgress && !isSummaryMode;
  const levelLabel = resolvedLevel ? `Level ${resolvedLevel}` : "Level 1";
  const isNavigationLocked =
    isRecording ||
    isAnalyzing ||
    isStepLoading ||
    status === "requesting_permission" ||
    status === "stopping";
  const canGoPrev = currentStepNo > 1 && !isNavigationLocked;
  const canGoNext = !!currentAnswer && !isNavigationLocked;
  const hasRecordedAudio = !!currentAudioUrl || !!currentStepData?.isAnswered;
  const progressPercent = (currentStepNo / totalStepCount) * 100;
  const blocker = useBlocker(shouldBlockNavigation);

  useLayoutEffect(() => {
    queryClient.removeQueries({
      queryKey: [QUERY_KEY.scenarioResult, resolvedScenarioId, resolvedLevel],
      exact: true,
    });
  }, [queryClient, resolvedLevel, resolvedScenarioId]);

  useEffect(() => {
    if (blocker.state !== "blocked") return;

    const shouldLeave = window.confirm(
      "훈련을 나가면 현재 진행 중인 녹음이 중단됩니다. 정말 나가시겠어요?"
    );

    if (shouldLeave) {
      const proceedAfterCleanup = async () => {
        if (isRecording) {
          await stopRecording();
        }

        blocker.proceed();
      };

      void proceedAfterCleanup();
    } else {
      blocker.reset();
    }
  }, [blocker, isRecording, stopRecording]);

  useEffect(() => {
    recordedAudioUrlByStepRef.current = recordedAudioUrlByStep;
  }, [recordedAudioUrlByStep]);

  useEffect(() => {
    return () => {
      Object.values(recordedAudioUrlByStepRef.current).forEach((url) =>
        revokeObjectUrlIfNeeded(url)
      );
    };
  }, []);

  useBeforeUnload((event) => {
    if (!shouldBlockNavigation) return;
    event.preventDefault();
    event.returnValue = "";
  });

  const handleRecord = async () => {
    await toggleRecordAndUpload();
  };

  const handleReRecord = async () => {
    if (isAnalyzing || status === "requesting_permission" || status === "stopping") {
      return;
    }

    setRecordedAudioUrlByStep((prev) => {
      const previousUrl = prev[currentStepNo];
      revokeObjectUrlIfNeeded(previousUrl);

      return {
        ...prev,
        [currentStepNo]: null,
      };
    });
    setAnswerByStep((prev) => ({
      ...prev,
      [currentStepNo]: null,
    }));

    setIsSummaryMode(false);
    await startRecording();
  };

  const handlePlayRecordedAudio = async () => {
    if (currentAudioUrl) {
      await playAudio(currentAudioUrl);
      return;
    }

    if (!resolvedScenarioId || !resolvedLevel || !currentStepData?.isAnswered) {
      return;
    }

    const userAudio = await queryClient.fetchQuery({
      queryKey: getScenarioUserAudioQueryKey({
        scenarioId: resolvedScenarioId,
        level: resolvedLevel,
        stepNo: currentStepNo,
      }),
      queryFn: async () => {
        const response = await getScenarioUserAudio({
          scenarioId: resolvedScenarioId,
          level: resolvedLevel,
          stepNo: currentStepNo,
        });
        return response.result;
      },
      staleTime: 5 * 60 * 1000,
    });

    await playAudio(userAudio.userAudioUrl);
  };

  const handlePrevStep = () => {
    if (!canGoPrev) return;
    setCurrentStepNo((prev) => prev - 1);
  };

  const handleNextStep = () => {
    if (!canGoNext || !currentAnswer) return;

    if (currentAnswer.isLastStep || currentStepNo >= totalStepCount) {
      setIsSummaryMode(true);
      return;
    }

    setCurrentStepNo(currentAnswer.nextStepNo ?? currentStepNo + 1);
  };

  const handleBackToList = () => {
    navigate("/ai-practice/scenario");
  };

  const recordErrorMessage = getRecordErrorMessage(lastError);
  const apiErrorMessage = isStepError ? getApiErrorMessage(stepError) : "";

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

      {recordErrorMessage || apiErrorMessage ? (
        <p className="rounded-2xl bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-500">
          {recordErrorMessage || apiErrorMessage}
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
          hasRecordedAudio={hasRecordedAudio}
          isPlayingUserAudio={isPlaying}
          onRecord={handleRecord}
          onReRecord={handleReRecord}
          onPlayRecordedAudio={handlePlayRecordedAudio}
          onPrev={handlePrevStep}
          onNext={handleNextStep}
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
