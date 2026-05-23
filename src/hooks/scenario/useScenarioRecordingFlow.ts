import { useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useBeforeUnload, useBlocker } from "react-router-dom";
import { getApiErrorMessage } from "../../apis/apiError";
import { getRecordErrorMessage } from "../../constants/recordingMessage";
import { useRecord } from "../../contexts/RecordContext";
import {
  revokeObjectUrlIfNeeded,
  useAudioPlayer,
} from "../audio/useAudioPlayer";
import { useRecordUploadFlow } from "../audio/useRecordUploadFlow";
import { usePostScenarioAnswer } from "../mutations/usePostScenarioAnswer";
import { getScenarioAnswerQueryKey } from "../queries/useGetScenarioAnswer";
import type { ScenarioLevel } from "../../types/scenarioType";

interface UseScenarioRecordingFlowParams {
  scenarioId: number;
  level: ScenarioLevel;
  currentStepNo: number;
  isStepLoading: boolean;
  isSummaryMode: boolean;
  hasPracticeProgress: boolean;
  setIsSummaryMode: (value: boolean) => void;
  setMaxCompletedStepNo: Dispatch<SetStateAction<number>>;
}

export const useScenarioRecordingFlow = ({
  scenarioId,
  level,
  currentStepNo,
  isStepLoading,
  isSummaryMode,
  hasPracticeProgress,
  setIsSummaryMode,
  setMaxCompletedStepNo,
}: UseScenarioRecordingFlowParams) => {
  const queryClient = useQueryClient();
  const { isRecording, status, lastError, startRecording, stopRecording } =
    useRecord();
  const { isPlaying, playAudio } = useAudioPlayer();
  const { analyzeScenarioAnswer } = usePostScenarioAnswer();
  const [uploadErrorMessage, setUploadErrorMessage] = useState("");
  const [recordedAudioUrlByStep, setRecordedAudioUrlByStep] = useState<
    Record<number, string | null>
  >({});
  const recordedAudioUrlByStepRef = useRef<Record<number, string | null>>({});

  const currentAudioUrl = recordedAudioUrlByStep[currentStepNo] ?? null;

  const { isUploading: isAnalyzing, toggleRecordAndUpload } = useRecordUploadFlow({
    isRecording,
    status,
    startRecording,
    stopRecording,
    isBlocked: isStepLoading,
    uploadFn: (voiceFile) =>
      analyzeScenarioAnswer({
        scenarioId,
        level,
        stepNo: currentStepNo,
        voiceFile,
      }),
    onBeforeStart: () => {
      setUploadErrorMessage("");
      setIsSummaryMode(false);
    },
    onUploadSuccess: (response, blob) => {
      const nextAudioUrl = URL.createObjectURL(blob);

      setUploadErrorMessage("");
      setMaxCompletedStepNo((prev) => Math.max(prev, response.result.stepNo));
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

  const hasAnyProgress = hasPracticeProgress || isRecording || isAnalyzing;
  const shouldBlockNavigation = hasAnyProgress && !isSummaryMode;
  const isNavigationLocked =
    isRecording ||
    isAnalyzing ||
    isStepLoading ||
    status === "requesting_permission" ||
    status === "stopping";
  const hasRecordedAudio = !!currentAudioUrl;
  const recordErrorMessage = getRecordErrorMessage(lastError);
  const blocker = useBlocker(shouldBlockNavigation);

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
    try {
      await toggleRecordAndUpload();
    } catch (error) {
      setUploadErrorMessage(getApiErrorMessage(error));
    }
  };

  const handleReRecord = async () => {
    if (isAnalyzing || status === "requesting_permission" || status === "stopping") {
      return;
    }

    setUploadErrorMessage("");
    setRecordedAudioUrlByStep((prev) => {
      const previousUrl = prev[currentStepNo];
      revokeObjectUrlIfNeeded(previousUrl);

      return {
        ...prev,
        [currentStepNo]: null,
      };
    });
    queryClient.removeQueries({
      queryKey: getScenarioAnswerQueryKey({
        scenarioId,
        level,
        stepNo: currentStepNo,
      }),
      exact: true,
    });
    setMaxCompletedStepNo((prev) => Math.min(prev, currentStepNo - 1));

    setIsSummaryMode(false);
    await startRecording();
  };

  const handlePlayRecordedAudio = async () => {
    if (!currentAudioUrl) return;
    await playAudio(currentAudioUrl);
  };

  return {
    isRecording,
    isAnalyzing,
    isPlayingUserAudio: isPlaying,
    isNavigationLocked,
    hasRecordedAudio,
    recordErrorMessage,
    uploadErrorMessage,
    handleRecord,
    handleReRecord,
    handlePlayRecordedAudio,
  };
};
