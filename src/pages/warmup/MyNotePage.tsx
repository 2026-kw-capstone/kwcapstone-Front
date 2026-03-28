import { useMemo, useState } from "react";
import { uploadMyNoteVoice } from "../../apis/voicePlaceholder";
import BackLinkButton from "../../components/BackLinkButton";
import MyNoteResultCard from "../../components/warmup/my-note/MyNoteResultCard";
import MyNoteSentenceList from "../../components/warmup/my-note/MyNoteSentenceList";
import MyNoteStudyCard from "../../components/warmup/my-note/MyNoteStudyCard";
import { useRecord } from "../../contexts/RecordContext";
import { useAudioPlayer } from "../../hooks/audio/useAudioPlayer";
import { useRecordUploadFlow } from "../../hooks/audio/useRecordUploadFlow";
import type {
  MyNoteAnalysisResult,
  MyNoteSentenceItem,
} from "../../types/myNoteType";

const INITIAL_SENTENCES: MyNoteSentenceItem[] = [
  {
    id: 1,
    text: "아이스 아메리카노 한 잔 주세요",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    text: "병원 예약을 다음 주 월요일로 변경하고 싶어요",
    createdAt: new Date(Date.now() - 1000 * 60).toISOString(),
  },
];

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
  const [hasRecording, setHasRecording] = useState(false);
  const [result, setResult] = useState<MyNoteAnalysisResult | null>(null);
  const [isPlayingTts, setIsPlayingTts] = useState(false);
  const [isAddingSentence, setIsAddingSentence] = useState(false);
  const [isSavingReport, setIsSavingReport] = useState(false);

  const selectedSentence = useMemo(() => {
    return sentences.find((sentence) => sentence.id === selectedSentenceId) ?? null;
  }, [sentences, selectedSentenceId]);

  const resetStudyState = () => {
    setHasRecording(false);
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
      // 새 녹음을 시작할 때 이전 결과/재생 URL을 초기화합니다.
      setResult(null);
      setHasRecording(false);
      clearAudioUrl();
    },
    onUploadSuccess: ({ analysis, mp3Url }, blob) => {
      // 업로드 응답의 mp3Url과 분석 결과를 페이지 상태로 저장합니다.
      setAudioUrl(mp3Url || URL.createObjectURL(blob));
      setHasRecording(true);
      setResult({
        pronunciationScore: analysis.pronunciationScore,
        stabilityScore: analysis.stabilityScore,
        deliveryScore: analysis.deliveryScore,
        feedback: analysis.feedback ?? "",
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
    // 1회 클릭: 녹음 시작 / 녹음 중 클릭: 녹음 종료 + 업로드
    await toggleRecordAndUpload();
  };

  const handlePlayRecordedAudio = async () => {
    if (!hasRecording || !audioUrl) return;
    // API 응답으로 받은 mp3Url을 재생합니다.
    await playAudio();
  };

  const handleSaveReport = async () => {
    if (!result || !selectedSentence) return;

    setIsSavingReport(true);
    window.setTimeout(() => {
      setIsSavingReport(false);
      alert("레포트에 저장되었습니다.");
    }, 800);
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

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-5">
      <section className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <BackLinkButton to="/warmup" label="워밍업으로" />
          <h1 className="text-[24px] font-extrabold leading-tight tracking-tight text-slate-900 min-[380px]:text-[28px]">
            나만의 문장 노트
          </h1>
        </div>
        <p className="text-sm leading-6 text-slate-500">
          자주 쓰는 문장을 저장하고 듣고 말하고 결과까지 확인해보세요.
        </p>
        {lastError ? (
          <p className="text-xs font-semibold text-rose-500">녹음 오류: {lastError}</p>
        ) : null}
      </section>

      <section className="grid grid-cols-1 gap-4">
        <MyNoteStudyCard
          selectedSentence={selectedSentence?.text ?? null}
          hasRecording={hasRecording}
          isRecording={isRecording}
          isPlayingTts={isPlayingTts}
          isPlayingUserAudio={isPlaying}
          isInteractionLocked={isUploading}
          onPlayTts={handlePlayTts}
          onRecord={handleRecord}
          onPlayRecordedAudio={handlePlayRecordedAudio}
        />

        <MyNoteResultCard
          result={result}
          isSavingReport={isSavingReport || isUploading}
          onSaveReport={handleSaveReport}
        />
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
