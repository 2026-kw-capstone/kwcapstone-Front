import { useEffect, useMemo, useState } from "react";
import {
  useBeforeUnload,
  useBlocker,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import PracticeHeader from "../../components/scenario/practice/PracticeHeader";
import PracticeStepPanel from "../../components/scenario/practice/PracticeStepPanel";
import PracticeSummaryPanel from "../../components/scenario/practice/PracticeSummaryPanel";
import { RECOMMENDED_SCENARIOS } from "../../constants/scenario";
import { PRACTICE_STEPS, buildMockResult } from "../../constants/scenarioPractice";
import type { ScenarioOutletContext } from "../../types/scenarioType";
import type { StepResult } from "../../types/scenarioPracticeType";

const ScenarioPracticePage = () => {
  const { scenarioId, level } = useParams<{ scenarioId: string; level: string }>();
  const navigate = useNavigate();
  const { myScenarios } = useOutletContext<ScenarioOutletContext>();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSummaryMode, setIsSummaryMode] = useState(false);
  const [resultsByStep, setResultsByStep] = useState<Array<StepResult | null>>([
    null,
    null,
    null,
  ]);

  const currentStep = PRACTICE_STEPS[currentStepIndex];
  const currentResult = resultsByStep[currentStepIndex];
  const hasAnyProgress = resultsByStep.some(Boolean) || isRecording || isAnalyzing;
  const shouldBlockNavigation = hasAnyProgress && !isSummaryMode;

  const scenarioName =
    [...RECOMMENDED_SCENARIOS, ...myScenarios].find(
      (scenario) => scenario.id === (scenarioId ?? "")
    )?.title ?? "나만의 시나리오";

  const levelLabel = level ? `Level ${level}` : "Level 1";

  const isNavigationLocked = isRecording || isAnalyzing;
  const canGoPrev = currentStepIndex > 0 && !isNavigationLocked;
  const canGoNext = !!currentResult && !isNavigationLocked;

  const averageAccuracy = useMemo(() => {
    const completeResults = resultsByStep.filter(
      (result): result is StepResult => result !== null
    );

    if (completeResults.length === 0) {
      return 0;
    }

    return Math.round(
      completeResults.reduce((acc, result) => acc + result.accuracy, 0) /
        completeResults.length
    );
  }, [resultsByStep]);

  const averageFluency = useMemo(() => {
    const completeResults = resultsByStep.filter(
      (result): result is StepResult => result !== null
    );

    if (completeResults.length === 0) {
      return 0;
    }

    return Math.round(
      completeResults.reduce((acc, result) => acc + result.fluency, 0) /
        completeResults.length
    );
  }, [resultsByStep]);

  const blocker = useBlocker(shouldBlockNavigation);

  useEffect(() => {
    if (blocker.state !== "blocked") {
      return;
    }

    const shouldLeave = window.confirm(
      "연습 결과가 저장되지 않고 사라집니다. 정말 이동하시겠어요?"
    );

    if (shouldLeave) {
      blocker.proceed();
    } else {
      blocker.reset();
    }
  }, [blocker]);

  useBeforeUnload((event) => {
    if (!shouldBlockNavigation) {
      return;
    }

    event.preventDefault();
    event.returnValue = "";
  });

  const handleRecord = () => {
    if (isRecording || isAnalyzing) {
      return;
    }

    setIsSummaryMode(false);
    setIsRecording(true);

    setTimeout(() => {
      setIsRecording(false);
      setIsAnalyzing(true);

      setTimeout(() => {
        setResultsByStep((prev) => {
          const next = [...prev];
          next[currentStepIndex] = buildMockResult(currentStep.step);
          return next;
        });
        setIsAnalyzing(false);
      }, 900);
    }, 1600);
  };

  const handleReRecord = () => {
    setResultsByStep((prev) => {
      const next = [...prev];
      next[currentStepIndex] = null;
      return next;
    });
    handleRecord();
  };

  const handlePrevStep = () => {
    if (!canGoPrev) {
      return;
    }

    setCurrentStepIndex((prev) => prev - 1);
  };

  const handleNextStep = () => {
    if (!canGoNext) {
      return;
    }

    if (currentStepIndex === PRACTICE_STEPS.length - 1) {
      setIsSummaryMode(true);
      return;
    }

    setCurrentStepIndex((prev) => prev + 1);
  };

  const handleBackToLevel = () => {
    navigate(`/ai-practice/scenario/${scenarioId}`);
  };

  const handleRestartPractice = () => {
    setCurrentStepIndex(0);
    setIsSummaryMode(false);
    setIsRecording(false);
    setIsAnalyzing(false);
    setResultsByStep([null, null, null]);
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 pb-2 md:gap-6">
      <PracticeHeader
        scenarioName={scenarioName}
        levelLabel={levelLabel}
        isSummaryMode={isSummaryMode}
        currentStepIndex={currentStepIndex}
        steps={PRACTICE_STEPS}
        resultsByStep={resultsByStep}
        onBack={handleBackToLevel}
      />

      {!isSummaryMode ? (
        <PracticeStepPanel
          currentStep={currentStep}
          currentStepIndex={currentStepIndex}
          totalSteps={PRACTICE_STEPS.length}
          currentResult={currentResult}
          isRecording={isRecording}
          isAnalyzing={isAnalyzing}
          canGoPrev={canGoPrev}
          canGoNext={canGoNext}
          onRecord={handleRecord}
          onReRecord={handleReRecord}
          onPrev={handlePrevStep}
          onNext={handleNextStep}
        />
      ) : (
        <PracticeSummaryPanel
          averageAccuracy={averageAccuracy}
          averageFluency={averageFluency}
          onRestart={handleRestartPractice}
          onBackToLevel={handleBackToLevel}
        />
      )}
    </div>
  );
};

export default ScenarioPracticePage;
