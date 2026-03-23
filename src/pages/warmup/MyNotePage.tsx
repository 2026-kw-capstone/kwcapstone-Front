import { useMemo, useState } from "react";
import MyNoteStudyCard from "../../components/warmup/my-note/MyNoteStudyCard";
import MyNoteResultCard from "../../components/warmup/my-note/MyNoteResultCard";
import MyNoteSentenceList from "../../components/warmup/my-note/MyNoteSentenceList";
import type {
  MyNoteAnalysisResult,
  MyNoteSentenceItem,
} from "../../types/myNoteType";

// 기능이 잘 작동하는지 확인하기 위한 테스트
// 실제 api 적용하면 사라질 코드
const INITIAL_SENTENCES: MyNoteSentenceItem[] = [
  {
    id: 1,
    text: "아이스 아메리카노 한 잔 주세요.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    text: "병원 예약을 다음 주 월요일로 변경하고 싶어요.",
    createdAt: new Date(Date.now() - 1000 * 60).toISOString(),
  },
];

const MyNotePage = () => {
  const [sentences, setSentences] = useState<MyNoteSentenceItem[]>([
    ...INITIAL_SENTENCES,
  ].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)));

  const [selectedSentenceId, setSelectedSentenceId] = useState<number | null>(null);

  const [hasRecording, setHasRecording] = useState(false);
  const [result, setResult] = useState<MyNoteAnalysisResult | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingTts, setIsPlayingTts] = useState(false);
  const [isPlayingUserAudio, setIsPlayingUserAudio] = useState(false);
  const [isAddingSentence, setIsAddingSentence] = useState(false);
  const [isSavingReport, setIsSavingReport] = useState(false);

  const selectedSentence = useMemo(() => {
    return sentences.find((sentence) => sentence.id === selectedSentenceId) ?? null;
  }, [sentences, selectedSentenceId]);

  const resetStudyState = () => {
    setHasRecording(false);
    setIsRecording(false);
    setIsPlayingTts(false);
    setIsPlayingUserAudio(false);
    setResult(null);
  };

  const handleSelectSentence = (sentence: MyNoteSentenceItem) => {
    setSelectedSentenceId(sentence.id);
    resetStudyState();
  };

  const handlePlayTts = async () => {
    if (!selectedSentence) return;

    setIsPlayingTts(true);

    // 추후 TTS API 연동
    window.setTimeout(() => {
      setIsPlayingTts(false);
    }, 900);
  };

  const handleRecord = async () => {
    if (!selectedSentence) return;

    setIsRecording(true);

    // 추후 녹음 + 분석 API 연동
    window.setTimeout(() => {
      setIsRecording(false);
      setHasRecording(true);

      setResult({
        pronunciationScore: 87,
        stabilityScore: 82,
        deliveryScore: 85,
        feedback:
          "문장 끝맺음이 비교적 안정적입니다. 첫 음절을 조금 더 분명하게 시작하면 전달력이 더 좋아질 수 있어요.",
      });
    }, 1200);
  };

  const handlePlayRecordedAudio = async () => {
    if (!hasRecording) return;

    setIsPlayingUserAudio(true);

    // 추후 녹음 파일 재생 로직 연동
    window.setTimeout(() => {
      setIsPlayingUserAudio(false);
    }, 900);
  };

  const handleSaveReport = async () => {
    if (!result || !selectedSentence) return;

    setIsSavingReport(true);

    // 추후 레포트 저장 API 연동
    window.setTimeout(() => {
      setIsSavingReport(false);
      alert("레포트에 저장되었습니다.");
    }, 800);
  };

  const handleAddSentence = async (text: string) => {
    setIsAddingSentence(true);

    // 추후 문장 추가 API 연동
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
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 md:gap-6">
      <section className="flex flex-col gap-1">
        <h1 className="text-[28px] font-extrabold tracking-tight text-slate-900 sm:text-[32px]">
          나만의 문장 노트
        </h1>
        <p className="text-sm leading-6 text-slate-500 sm:text-base">
          자주 쓰는 문장을 저장하고, 듣고, 말하고, 결과까지 확인해보세요.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <MyNoteStudyCard
          selectedSentence={selectedSentence?.text ?? null}
          hasRecording={hasRecording}
          isRecording={isRecording}
          isPlayingTts={isPlayingTts}
          isPlayingUserAudio={isPlayingUserAudio}
          onPlayTts={handlePlayTts}
          onRecord={handleRecord}
          onPlayRecordedAudio={handlePlayRecordedAudio}
        />

        <MyNoteResultCard
          result={result}
          isSavingReport={isSavingReport}
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