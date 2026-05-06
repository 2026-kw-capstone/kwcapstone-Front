import { useMemo, useState } from "react";
import { uploadMyNoteVoice } from "../../apis/voicePlaceholder";
import { getRecordErrorMessage } from "../../constants/recordingMessage";
import MyNoteResultCard from "../../components/warmup/my-note/MyNoteResultCard";
import MyNoteSentenceList from "../../components/warmup/my-note/MyNoteSentenceList";
import MyNoteStudyCard from "../../components/warmup/my-note/MyNoteStudyCard";
import { useRecord } from "../../contexts/RecordContext";
import { useAudioPlayer } from "../../hooks/audio/useAudioPlayer";
import { useRecordUploadFlow } from "../../hooks/audio/useRecordUploadFlow";
import type {
  MyNoteAnalysisResult,
  MyNoteSentenceItem,
  MyNoteSyllableFeedback,
  MyNoteSyllableStatus,
} from "../../types/myNoteType";

const INITIAL_SENTENCES: MyNoteSentenceItem[] = [
  {
    id: 1,
    text: "아이스 아메리카노 한 잔 주세요.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    text: "병원 예약을 다음 주 화요일로 변경하고 싶어요.",
    createdAt: new Date(Date.now() - 1000 * 60).toISOString(),
  },
];

const SYLLABLE_STATUS_PATTERN: MyNoteSyllableStatus[] = [
  "good",
  "good",
  "warning",
  "good",
  "bad",
  "good",
];

const createSyllableFeedback = (text: string): MyNoteSyllableFeedback[] => {
  const syllables = Array.from(text).filter((char) => /[가-힣A-Za-z0-9]/.test(char));

  return syllables.map((char, index) => ({
    text: char,
    status: SYLLABLE_STATUS_PATTERN[index % SYLLABLE_STATUS_PATTERN.length],
  }));
};

const MyNotePage = () => {
  const { isRecording, status, lastError, startRecording, stopRecording } =
    useRecord();
  const { audioUrl, isPlaying, setAudioUrl, clearAudioUrl, playAudio } =
    useAudioPlayer();

  const [sentences, setSentences] = useState<MyNoteSentenceItem[]>(
    [...INITIAL_SENTENCES].sort(
      (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
    )
  );
  const [selectedSentenceId, setSelectedSentenceId] = useState<number | null>(
    null
  );
  const [hasRecordedAudio, setHasRecordedAudio] = useState(false);
  const [result, setResult] = useState<MyNoteAnalysisResult | null>(null);
  const [isPlayingTts, setIsPlayingTts] = useState(false);
  const [isAddingSentence, setIsAddingSentence] = useState(false);

  const selectedSentence = useMemo(() => {
    return sentences.find((sentence) => sentence.id === selectedSentenceId) ?? null;
  }, [sentences, selectedSentenceId]);

  const resetStudyState = () => {
    setHasRecordedAudio(false);
    setIsPlayingTts(false);
    clearAudioUrl();
    setResult(null);
  };

  const { isUploading, toggleRecordAndUpload } = useRecordUploadFlow({
    isRecording,
    status,
    startRecording,
    stopRecording,
    uploadFn: uploadMyNoteVoice,
    onBeforeStart: () => {
      setResult(null);
      setHasRecordedAudio(false);
      clearAudioUrl();
    },
    onUploadSuccess: ({ analysis, mp3Url }, blob) => {
      setAudioUrl(mp3Url || URL.createObjectURL(blob));
      setHasRecordedAudio(true);
      setResult({
        pronunciationScore: analysis.pronunciationScore,
        stabilityScore: analysis.stabilityScore,
        deliveryScore: analysis.deliveryScore,
        feedback:
          analysis.feedback ??
          "전체적으로 안정적인 발화입니다. 첫 음절을 조금 더 또렷하게 시작하면 전달력이 좋아집니다.",
        syllables: createSyllableFeedback(selectedSentence?.text ?? ""),
      });
    },
  });

  const handleSelectSentence = (sentence: MyNoteSentenceItem) => {
    setSelectedSentenceId(sentence.id);
    resetStudyState();
  };

  const handlePlayTts = async () => {
    if (!selectedSentence) return;

    setIsPlayingTts(true);
    window.setTimeout(() => {
      setIsPlayingTts(false);
    }, 900);
  };

  const handleRecord = async () => {
    if (!selectedSentence) return;
    await toggleRecordAndUpload();
  };

  const handlePlayRecordedAudio = async () => {
    if (!hasRecordedAudio || !audioUrl) return;
    await playAudio();
  };

  const handleAddSentence = async (text: string) => {
    setIsAddingSentence(true);

    window.setTimeout(() => {
      const newSentence: MyNoteSentenceItem = {
        id: Date.now(),
        text,
        createdAt: new Date().toISOString(),
      };

      setSentences((prev) =>
        [newSentence, ...prev].sort(
          (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
        )
      );
      setIsAddingSentence(false);
    }, 500);
  };

  const handleDeleteSentence = async (id: number) => {
    const nextSentences = sentences.filter((sentence) => sentence.id !== id);
    const isDeletingSelected = selectedSentenceId === id;

    setSentences(nextSentences);

    if (isDeletingSelected) {
      const nextSelected = nextSentences[0] ?? null;
      setSelectedSentenceId(nextSelected?.id ?? null);
      resetStudyState();
    }
  };

  const recordErrorMessage = getRecordErrorMessage(lastError);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-5 animate-fade-in">
      {recordErrorMessage ? (
        <p className="rounded-[14px] bg-rose-50 px-4 py-3 text-[13px] font-bold text-rose-500">
          {recordErrorMessage}
        </p>
      ) : null}

      <section className="grid grid-cols-1 gap-4">
        <MyNoteStudyCard
          selectedSentence={selectedSentence?.text ?? null}
          isRecording={isRecording}
          isInteractionLocked={isUploading}
          onRecord={handleRecord}
        />

        {result ? (
          <MyNoteResultCard
            result={result}
            isPlayingTts={isPlayingTts}
            isPlayingUserAudio={isPlaying}
            isInteractionLocked={isUploading}
            onPlayTts={handlePlayTts}
            onPlayRecordedAudio={handlePlayRecordedAudio}
          />
        ) : null}
      </section>

      <MyNoteSentenceList
        sentences={sentences}
        selectedSentenceId={selectedSentenceId}
        isAdding={isAddingSentence}
        onAddSentence={handleAddSentence}
        onSelectSentence={handleSelectSentence}
        onDeleteSentence={handleDeleteSentence}
      />
    </div>
  );
};

export default MyNotePage;
