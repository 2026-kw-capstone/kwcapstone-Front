import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";
import { getApiErrorMessage } from "../../apis/apiError";
import BasicSpeakResultCard from "../../components/warmup/basic-speak/BasicSpeakResultCard";
import BasicSpeakStudyCard from "../../components/warmup/basic-speak/BasicSpeakStudyCard";
import { isAudioUrlFresh } from "../../constants/audio";
import { getBasicSpeakCardById } from "../../constants/basicSpeak";
import { getRecordErrorMessage } from "../../constants/recordingMessage";
import { useRecord } from "../../contexts/RecordContext";
import { useAudioPlayer } from "../../hooks/audio/useAudioPlayer";
import { useRecordUploadFlow } from "../../hooks/audio/useRecordUploadFlow";
import { usePostBasicSpeakPracticeAnalyze } from "../../hooks/mutations/usePostBasicSpeakPracticeAnalyze";
import {
  getBasicSpeakPracticeQueryKey,
  useGetBasicSpeakLatestPractice,
} from "../../hooks/queries/useGetBasicSpeakLatestPractice";
import type {
  ResponseBasicSpeakAnalyzeDto,
  ResponseBasicSpeakLatestDto,
} from "../../types/basicSpeakType";

const BasicSpeakPracticePage = () => {
  const queryClient = useQueryClient();
  const { cardId } = useParams<{ cardId: string }>();
  const { isRecording, status, lastError, startRecording, stopRecording } =
    useRecord();
  const { clearAudioUrl, playAudio } = useAudioPlayer();
  const card = useMemo(() => getBasicSpeakCardById(cardId), [cardId]);

  const latestPracticeQuery = useGetBasicSpeakLatestPractice(card?.targetVowel);
  const analyzeMutation = usePostBasicSpeakPracticeAnalyze();

  const [isPlayingModelAudio, setIsPlayingModelAudio] = useState(false);
  const [isPlayingUserAudio, setIsPlayingUserAudio] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState("");

  useEffect(() => {
    clearAudioUrl();
    setApiErrorMessage("");
  }, [card?.targetVowel, clearAudioUrl]);

  const result = latestPracticeQuery.data?.result.practice ?? null;

  const { isUploading, toggleRecordAndUpload } =
    useRecordUploadFlow<ResponseBasicSpeakAnalyzeDto>({
      isRecording,
      status,
      startRecording,
      stopRecording,
      isBlocked: !card,
      uploadFn: async (blob) => {
        if (!card) {
          throw new Error("No basic speak card selected.");
        }

        return analyzeMutation.analyzeBasicSpeak({
          targetVowel: card.targetVowel,
          voiceFile: blob,
        });
      },
      onBeforeStart: () => {
        setApiErrorMessage("");
        clearAudioUrl();
        if (!card) return;

        const emptyLatest: ResponseBasicSpeakLatestDto = {
          isSuccess: true,
          code: "COMMON200",
          message: "",
          result: {
            hasPractice: false,
            practice: null,
          },
        };

        queryClient.setQueryData(
          getBasicSpeakPracticeQueryKey(card.targetVowel),
          emptyLatest
        );
      },
    });

  if (!card) {
    return <Navigate to="/warmup/basic-speak" replace />;
  }

  const handleRecord = async () => {
    setApiErrorMessage("");

    try {
      await toggleRecordAndUpload();
    } catch (error) {
      setApiErrorMessage(
        getApiErrorMessage(error, "발음 분석에 실패했습니다.")
      );
    }
  };

  const getPlayablePractice = async () => {
    if (!result) return null;

    if (isAudioUrlFresh(latestPracticeQuery.dataUpdatedAt)) {
      return result;
    }

    const { data } = await latestPracticeQuery.refetch();
    return data?.result.practice ?? null;
  };

  const handlePlayRecordedAudio = async () => {
    setIsPlayingUserAudio(true);
    setApiErrorMessage("");
    try {
      const playablePractice = await getPlayablePractice();
      if (playablePractice?.voiceUrl) {
        await playAudio(playablePractice.voiceUrl);
      }
    } catch (error) {
      setApiErrorMessage(
        getApiErrorMessage(error, "내 녹음 음성을 불러오지 못했습니다.")
      );
    } finally {
      setIsPlayingUserAudio(false);
    }
  };

  const handlePlayModelAudio = async () => {
    setIsPlayingModelAudio(true);
    setApiErrorMessage("");
    try {
      const playablePractice = await getPlayablePractice();
      if (playablePractice?.modelVoiceUrl) {
        await playAudio(playablePractice.modelVoiceUrl);
      }
    } catch (error) {
      setApiErrorMessage(
        getApiErrorMessage(error, "모범 발음 음성을 불러오지 못했습니다.")
      );
    } finally {
      setIsPlayingModelAudio(false);
    }
  };

  const recordErrorMessage = getRecordErrorMessage(lastError);
  const isInteractionLocked =
    isUploading || analyzeMutation.isPending || latestPracticeQuery.isFetching;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-5 animate-fade-in">
      {recordErrorMessage ? (
        <p className="rounded-2xl bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-500">
          {recordErrorMessage}
        </p>
      ) : null}

      {latestPracticeQuery.isError ? (
        <p className="rounded-2xl bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-500">
          최근 기초 발성 연습 결과를 불러오지 못했습니다.
        </p>
      ) : null}

      {apiErrorMessage ? (
        <p className="rounded-2xl bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-500">
          {apiErrorMessage}
        </p>
      ) : null}

      <BasicSpeakStudyCard
        card={card}
        hasResult={!!result}
        isRecording={isRecording}
        isInteractionLocked={isInteractionLocked}
        onRecord={handleRecord}
      />

      {analyzeMutation.isPending ? (
        <p className="rounded-2xl bg-indigo-50 px-4 py-3 text-xs font-semibold text-indigo-500">
          분석을 진행 중입니다.
        </p>
      ) : null}

      {result ? (
        <BasicSpeakResultCard
          result={result}
          isPlayingModelAudio={isPlayingModelAudio}
          isPlayingUserAudio={isPlayingUserAudio}
          isInteractionLocked={isInteractionLocked}
          onPlayModelAudio={handlePlayModelAudio}
          onPlayRecordedAudio={handlePlayRecordedAudio}
        />
      ) : null}
    </div>
  );
};

export default BasicSpeakPracticePage;
