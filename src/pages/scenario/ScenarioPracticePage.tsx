import { useEffect, useMemo, useRef, useState } from "react";
import {
  useBeforeUnload,
  useBlocker,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { uploadScenarioVoice } from "../../apis/voicePlaceholder";
import { getRecordErrorMessage } from "../../constants/recordingMessage";
import PracticeHeader from "../../components/scenario/practice/PracticeHeader";
import PracticeStepPanel from "../../components/scenario/practice/PracticeStepPanel";
import PracticeSummaryPanel from "../../components/scenario/practice/PracticeSummaryPanel";
import { RECOMMENDED_SCENARIOS } from "../../constants/scenario";
import { PRACTICE_STEPS, buildMockResult } from "../../constants/scenarioPractice";
import { useRecord } from "../../contexts/RecordContext";
import {
  revokeObjectUrlIfNeeded,
  useAudioPlayer,
} from "../../hooks/audio/useAudioPlayer";
import { useRecordUploadFlow } from "../../hooks/audio/useRecordUploadFlow";
import type { StepResult } from "../../types/scenarioPracticeType";
import type { ScenarioOutletContext } from "../../types/scenarioType";

const ScenarioPracticePage = () => {
  const { scenarioId, level } = useParams<{ scenarioId: string; level: string }>();
  const navigate = useNavigate();
  const { myScenarios } = useOutletContext<ScenarioOutletContext>();
  const { isRecording, status, lastError, startRecording, stopRecording } =
    useRecord();
  const { isPlaying, playAudio } = useAudioPlayer();

  const createInitialResults = (): Array<StepResult | null> =>
    Array.from({ length: PRACTICE_STEPS.length }, () => null);
  const createInitialMp3Urls = (): Array<string | null> =>
    Array.from({ length: PRACTICE_STEPS.length }, () => null);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSummaryMode, setIsSummaryMode] = useState(false);
  const [resultsByStep, setResultsByStep] = useState<Array<StepResult | null>>(
    createInitialResults
  );
  const [recordedMp3UrlByStep, setRecordedMp3UrlByStep] = useState<
    Array<string | null>
  >(createInitialMp3Urls);
  const recordedMp3UrlByStepRef = useRef<Array<string | null>>(createInitialMp3Urls());

  const currentStep = PRACTICE_STEPS[currentStepIndex];
  const currentResult = resultsByStep[currentStepIndex];
  const currentMp3Url = recordedMp3UrlByStep[currentStepIndex];

  const { isUploading: isAnalyzing, toggleRecordAndUpload } = useRecordUploadFlow({
    isRecording,
    status,
    startRecording,
    stopRecording,
    uploadFn: uploadScenarioVoice,
    onBeforeStart: () => {
      setIsSummaryMode(false);
    },
    onUploadSuccess: ({ analysis, mp3Url }, blob) => {
      const mockResult = buildMockResult(currentStep.step);

      setResultsByStep((prev) => {
        const next = [...prev];
        next[currentStepIndex] = {
          ...mockResult,
          accuracy: analysis.pronunciationScore,
          fluency: analysis.stabilityScore,
        };
        return next;
      });

      setRecordedMp3UrlByStep((prev) => {
        const next = [...prev];
        revokeObjectUrlIfNeeded(next[currentStepIndex]);
        next[currentStepIndex] = mp3Url || URL.createObjectURL(blob);
        return next;
      });
    },
  });

  const hasAnyProgress = resultsByStep.some(Boolean) || isRecording || isAnalyzing;
  const shouldBlockNavigation = hasAnyProgress && !isSummaryMode;

  const scenarioName =
    [...RECOMMENDED_SCENARIOS, ...myScenarios].find(
      (scenario) => scenario.id === (scenarioId ?? "")
    )?.title ?? "나만의 시나리오";
  const levelLabel = level ? `Level ${level}` : "Level 1";

  const isNavigationLocked =
    isRecording ||
    isAnalyzing ||
    status === "requesting_permission" ||
    status === "stopping";
  const canGoPrev = currentStepIndex > 0 && !isNavigationLocked;
  const canGoNext = !!currentResult && !isNavigationLocked;
  const progressPercent = ((currentStepIndex + 1) / PRACTICE_STEPS.length) * 100;

  const averageAccuracy = useMemo(() => {
    const completeResults = resultsByStep.filter(
      (result): result is StepResult => result !== null
    );
    if (completeResults.length === 0) return 0;
    return Math.round(
      completeResults.reduce((acc, result) => acc + result.accuracy, 0) /
        completeResults.length
    );
  }, [resultsByStep]);

  const averageFluency = useMemo(() => {
    const completeResults = resultsByStep.filter(
      (result): result is StepResult => result !== null
    );
    if (completeResults.length === 0) return 0;
    return Math.round(
      completeResults.reduce((acc, result) => acc + result.fluency, 0) /
        completeResults.length
    );
  }, [resultsByStep]);

  const blocker = useBlocker(shouldBlockNavigation);

  useEffect(() => {
    if (blocker.state !== "blocked") return;

    const shouldLeave = window.confirm(
      "연습 결과가 저장되지 않고 사라집니다. 정말 이동하시겠어요?"
    );

    if (shouldLeave) {
      blocker.proceed();
    } else {
      blocker.reset();
    }
  }, [blocker]);

  useEffect(() => {
    recordedMp3UrlByStepRef.current = recordedMp3UrlByStep;
  }, [recordedMp3UrlByStep]);

  useEffect(() => {
    return () => {
      recordedMp3UrlByStepRef.current.forEach((url) => revokeObjectUrlIfNeeded(url));
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

    setResultsByStep((prev) => {
      const next = [...prev];
      next[currentStepIndex] = null;
      return next;
    });

    setRecordedMp3UrlByStep((prev) => {
      const next = [...prev];
      revokeObjectUrlIfNeeded(next[currentStepIndex]);
      next[currentStepIndex] = null;
      return next;
    });

    setIsSummaryMode(false);
    await startRecording();
  };

  const handlePlayRecordedAudio = async () => {
    if (!currentMp3Url) return;
    await playAudio(currentMp3Url);
  };

  const handlePrevStep = () => {
    if (!canGoPrev) return;
    setCurrentStepIndex((prev) => prev - 1);
  };

  const handleNextStep = () => {
    if (!canGoNext) return;

    if (currentStepIndex === PRACTICE_STEPS.length - 1) {
      setIsSummaryMode(true);
      return;
    }

    setCurrentStepIndex((prev) => prev + 1);
  };

  const handleBackToLevel = () => {
    navigate(`/ai-practice/scenario/${scenarioId}`);
  };

  const recordErrorMessage = getRecordErrorMessage(lastError);

  if (isSummaryMode) {
    return (
      <div className="fixed inset-x-0 top-16 bottom-[72px] left-1/2 z-40 flex w-full max-w-[430px] -translate-x-1/2 items-center justify-center px-4 py-4">
        <PracticeSummaryPanel
          averageAccuracy={averageAccuracy}
          averageFluency={averageFluency}
          onBackToLevel={handleBackToLevel}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 pb-2">
      <div className="h-1 w-full rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <PracticeHeader
        scenarioName={scenarioName}
        levelLabel={levelLabel}
        currentStepIndex={currentStepIndex}
        currentStep={currentStep}
        steps={PRACTICE_STEPS}
        onBack={handleBackToLevel}
      />

      {recordErrorMessage ? (
        <p className="text-xs font-semibold text-rose-500">{recordErrorMessage}</p>
      ) : null}

      <PracticeStepPanel
        currentStep={currentStep}
        currentStepIndex={currentStepIndex}
        totalSteps={PRACTICE_STEPS.length}
        currentResult={currentResult}
        isRecording={isRecording}
        isAnalyzing={isAnalyzing}
        canGoPrev={canGoPrev}
        canGoNext={canGoNext}
        hasRecordedAudio={!!currentMp3Url}
        isPlayingUserAudio={isPlaying}
        onRecord={handleRecord}
        onReRecord={handleReRecord}
        onPlayRecordedAudio={handlePlayRecordedAudio}
        onPrev={handlePrevStep}
        onNext={handleNextStep}
      />
    </div>
  );
};

export default ScenarioPracticePage;
