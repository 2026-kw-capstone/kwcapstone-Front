import { useMemo, useState } from "react";
import { useQueryClient, type QueryClient } from "@tanstack/react-query";
import { getMyNoteTts, getMyNoteUserAudio } from "../../apis/myNote";
import { QUERY_KEY } from "../../constants/key";
import { getRecordErrorMessage } from "../../constants/recordingMessage";
import MyNoteDeleteConfirmModal from "../../components/warmup/my-note/MyNoteDeleteConfirmModal";
import MyNoteResultCard from "../../components/warmup/my-note/MyNoteResultCard";
import MyNoteSentenceList from "../../components/warmup/my-note/MyNoteSentenceList";
import MyNoteStudyCard from "../../components/warmup/my-note/MyNoteStudyCard";
import { useRecord } from "../../contexts/RecordContext";
import { useAudioPlayer } from "../../hooks/audio/useAudioPlayer";
import { useRecordUploadFlow } from "../../hooks/audio/useRecordUploadFlow";
import { useDeleteMyNoteSentence } from "../../hooks/mutations/useDeleteMyNoteSentence";
import { usePostMyNotePronunciationAnalyze } from "../../hooks/mutations/usePostMyNotePronunciationAnalyze";
import { usePostMyNoteSentence } from "../../hooks/mutations/usePostMyNoteSentence";
import { useGetMyNoteSentences } from "../../hooks/queries/useGetMyNoteSentences";
import type {
  MyNoteAnalysisResult,
  MyNoteSentenceItem,
  MyNoteTtsAudioResult,
  MyNoteUserAudioResult,
  ResponseMyNoteAnalyzeDto,
} from "../../types/myNoteType";

const AUDIO_URL_EXPIRY_BUFFER_MS = 60 * 1000;

interface PreparedAudioUrl {
  url: string;
  expiresAt: number;
}

const getAudioExpiresAt = (expiresIn: number) => {
  return Date.now() + Math.max(expiresIn * 1000 - AUDIO_URL_EXPIRY_BUFFER_MS, 0);
};

const getFreshPreparedAudioUrl = (audio: PreparedAudioUrl | null) => {
  if (!audio || Date.now() >= audio.expiresAt) {
    return null;
  }

  return audio.url;
};

const getFreshCachedAudio = <T extends { expiresIn: number }>(
  queryClient: QueryClient,
  queryKey: readonly unknown[]
) => {
  const queryState = queryClient.getQueryState<T>(queryKey);
  const data = queryState?.data;

  if (!data || !queryState.dataUpdatedAt) {
    return null;
  }

  const expiresAt =
    queryState.dataUpdatedAt +
    Math.max(data.expiresIn * 1000 - AUDIO_URL_EXPIRY_BUFFER_MS, 0);

  return Date.now() < expiresAt ? data : null;
};

const getMyNoteAudioQueryKeys = (sentenceId: number) => [
  [QUERY_KEY.myNoteUserAudio, sentenceId] as const,
  [QUERY_KEY.myNoteTts, sentenceId] as const,
];

const MyNotePage = () => {
  const queryClient = useQueryClient();
  const { isRecording, status, lastError, startRecording, stopRecording } =
    useRecord();
  const { clearAudioUrl, playAudio } = useAudioPlayer();

  const { data: sentences = [], isLoading, isError } = useGetMyNoteSentences();
  const postSentenceMutation = usePostMyNoteSentence();
  const deleteSentenceMutation = useDeleteMyNoteSentence();
  const analyzeMutation = usePostMyNotePronunciationAnalyze();

  const [selectedSentenceId, setSelectedSentenceId] = useState<number | null>(
    null
  );
  const [result, setResult] = useState<MyNoteAnalysisResult | null>(null);
  const [isPlayingTts, setIsPlayingTts] = useState(false);
  const [isPlayingUserAudio, setIsPlayingUserAudio] = useState(false);
  const [isAudioPreparing, setIsAudioPreparing] = useState(false);
  const [preparedUserAudio, setPreparedUserAudio] =
    useState<PreparedAudioUrl | null>(null);
  const [preparedTtsAudio, setPreparedTtsAudio] =
    useState<PreparedAudioUrl | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MyNoteSentenceItem | null>(
    null
  );

  const selectedSentence = useMemo(() => {
    return (
      sentences.find((sentence) => sentence.sentenceId === selectedSentenceId) ??
      null
    );
  }, [sentences, selectedSentenceId]);

  const resetStudyState = () => {
    setIsPlayingTts(false);
    setIsPlayingUserAudio(false);
    setIsAudioPreparing(false);
    setPreparedUserAudio(null);
    setPreparedTtsAudio(null);
    clearAudioUrl();
    setResult(null);
  };

  const { isUploading, toggleRecordAndUpload } =
    useRecordUploadFlow<ResponseMyNoteAnalyzeDto>({
      isRecording,
      status,
      startRecording,
      stopRecording,
      isBlocked: !selectedSentence,
      uploadFn: async (blob) => {
        if (!selectedSentence) {
          throw new Error("No sentence selected.");
        }

        return analyzeMutation.mutateAsync({
          sentenceId: selectedSentence.sentenceId,
          voiceFile: blob,
        });
      },
      onBeforeStart: () => {
        setResult(null);
        setIsAudioPreparing(false);
        setPreparedUserAudio(null);
        setPreparedTtsAudio(null);
        clearAudioUrl();
        if (!selectedSentence) return;

        for (const queryKey of getMyNoteAudioQueryKeys(
          selectedSentence.sentenceId
        )) {
          void queryClient.cancelQueries({ queryKey });
          queryClient.removeQueries({ queryKey });
        }
      },
      onUploadSuccess: (response) => {
        setResult(response.result);
        const sentenceId = response.result.sentenceId;

        setIsAudioPreparing(true);

        const userAudioFetch = queryClient
          .fetchQuery({
            queryKey: [QUERY_KEY.myNoteUserAudio, sentenceId],
            queryFn: () => getMyNoteUserAudio(sentenceId),
            staleTime: 0,
          })
          .then((userAudio) => {
            setPreparedUserAudio({
              url: userAudio.userAudioUrl,
              expiresAt: getAudioExpiresAt(userAudio.expiresIn),
            });
          });

        const ttsFetch = queryClient
          .fetchQuery({
            queryKey: [QUERY_KEY.myNoteTts, sentenceId],
            queryFn: () => getMyNoteTts(sentenceId),
            staleTime: 0,
          })
          .then((tts) => {
            setPreparedTtsAudio({
              url: tts.aiAudioUrl,
              expiresAt: getAudioExpiresAt(tts.expiresIn),
            });
          });

        void Promise.allSettled([userAudioFetch, ttsFetch]).finally(() => {
          setIsAudioPreparing(false);
        });
      },
    });

  const handleSelectSentence = (sentence: MyNoteSentenceItem) => {
    setSelectedSentenceId(sentence.sentenceId);
    resetStudyState();
  };

  const handlePlayTts = async () => {
    if (!selectedSentence) return;

    setIsPlayingTts(true);

    try {
      const preparedUrl = getFreshPreparedAudioUrl(preparedTtsAudio);
      if (preparedUrl) {
        await playAudio(preparedUrl);
        return;
      }

      const queryKey = [QUERY_KEY.myNoteTts, selectedSentence.sentenceId];
      const cachedTts = getFreshCachedAudio<MyNoteTtsAudioResult>(
        queryClient,
        queryKey
      );
      const cachedUrl = cachedTts?.aiAudioUrl;

      if (cachedUrl) {
        await playAudio(cachedUrl);
        return;
      }

      const tts = await queryClient.fetchQuery({
        queryKey,
        queryFn: () => getMyNoteTts(selectedSentence.sentenceId),
        staleTime: 0,
      });

      if (tts.aiAudioUrl) {
        setPreparedTtsAudio({
          url: tts.aiAudioUrl,
          expiresAt: getAudioExpiresAt(tts.expiresIn),
        });
        await playAudio(tts.aiAudioUrl);
      }
    } catch {
      // 재생 실패는 useAudioPlayer에서 처리합니다.
    } finally {
      setIsPlayingTts(false);
    }
  };

  const handleRecord = async () => {
    if (!selectedSentence) return;
    await toggleRecordAndUpload();
  };

  const handlePlayRecordedAudio = async () => {
    if (!selectedSentence) return;

    setIsPlayingUserAudio(true);

    try {
      const preparedUrl = getFreshPreparedAudioUrl(preparedUserAudio);
      if (preparedUrl) {
        await playAudio(preparedUrl);
        return;
      }

      const queryKey = [QUERY_KEY.myNoteUserAudio, selectedSentence.sentenceId];
      const cachedUserAudio = getFreshCachedAudio<MyNoteUserAudioResult>(
        queryClient,
        queryKey
      );
      const cachedUrl = cachedUserAudio?.userAudioUrl;

      if (cachedUrl) {
        await playAudio(cachedUrl);
        return;
      }

      const userAudio = await queryClient.fetchQuery({
        queryKey,
        queryFn: () => getMyNoteUserAudio(selectedSentence.sentenceId),
        staleTime: 0,
      });

      if (userAudio.userAudioUrl) {
        setPreparedUserAudio({
          url: userAudio.userAudioUrl,
          expiresAt: getAudioExpiresAt(userAudio.expiresIn),
        });
        await playAudio(userAudio.userAudioUrl);
      }
    } catch {
      // 재생 실패는 useAudioPlayer에서 처리합니다.
    } finally {
      setIsPlayingUserAudio(false);
    }
  };

  const handleAddSentence = async (text: string) => {
    const response = await postSentenceMutation.mutateAsync(text);
    setSelectedSentenceId(response.result.sentenceId);
    resetStudyState();
  };

  const handleDeleteSentence = (id: number) => {
    const target = sentences.find((sentence) => sentence.sentenceId === id);
    if (target) {
      setDeleteTarget(target);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    const targetId = deleteTarget.sentenceId;
    await deleteSentenceMutation.mutateAsync(targetId);
    setDeleteTarget(null);

    if (selectedSentenceId === targetId) {
      setSelectedSentenceId(null);
      resetStudyState();
    }
  };

  const recordErrorMessage = getRecordErrorMessage(lastError);
  const isInteractionLocked =
    isUploading ||
    analyzeMutation.isPending ||
    deleteSentenceMutation.isPending ||
    isAudioPreparing;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-5 animate-fade-in">
      {recordErrorMessage ? (
        <p className="rounded-[14px] bg-rose-50 px-4 py-3 text-[13px] font-bold text-rose-500">
          {recordErrorMessage}
        </p>
      ) : null}

      {isError ? (
        <p className="rounded-[14px] bg-rose-50 px-4 py-3 text-[13px] font-bold text-rose-500">
          문장 목록을 불러오지 못했습니다.
        </p>
      ) : null}

      <section className="grid grid-cols-1 gap-4">
        <MyNoteStudyCard
          selectedSentence={selectedSentence?.sentenceContent ?? null}
          isRecording={isRecording}
          isInteractionLocked={isInteractionLocked || isLoading}
          onRecord={handleRecord}
        />

        {analyzeMutation.isPending ? (
          <p className="rounded-[14px] bg-blue-50 px-4 py-3 text-[13px] font-bold text-[#278DFD]">
            분석을 진행 중입니다.
          </p>
        ) : null}

        {result ? (
          <MyNoteResultCard
            result={result}
            isPlayingTts={isPlayingTts}
            isPlayingUserAudio={isPlayingUserAudio}
            isInteractionLocked={isInteractionLocked}
            onPlayTts={handlePlayTts}
            onPlayRecordedAudio={handlePlayRecordedAudio}
          />
        ) : null}
      </section>

      <MyNoteSentenceList
        sentences={sentences}
        selectedSentenceId={selectedSentenceId}
        isAdding={postSentenceMutation.isPending}
        isDeleting={deleteSentenceMutation.isPending}
        onAddSentence={handleAddSentence}
        onSelectSentence={handleSelectSentence}
        onDeleteSentence={handleDeleteSentence}
      />

      <MyNoteDeleteConfirmModal
        sentence={deleteTarget}
        isSubmitting={deleteSentenceMutation.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleConfirmDelete()}
      />
    </div>
  );
};

export default MyNotePage;
