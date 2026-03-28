import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { uploadBasicSpeakVoice } from "../../apis/voicePlaceholder";
import { getRecordErrorMessage } from "../../constants/recordingMessage";
import BackLinkButton from "../../components/BackLinkButton";
import BasicSpeakResultCard from "../../components/warmup/basic-speak/BasicSpeakResultCard";
import BasicSpeakStudyCard from "../../components/warmup/basic-speak/BasicSpeakStudyCard";
import { BASIC_SPEAK_CARDS, getBasicSpeakCardById } from "../../constants/basicSpeak";
import { useRecord } from "../../contexts/RecordContext";
import { useAudioPlayer } from "../../hooks/audio/useAudioPlayer";
import { useRecordUploadFlow } from "../../hooks/audio/useRecordUploadFlow";

type PracticeResult = {
  pronunciationScore: number;
  stabilityScore: number;
  deliveryScore: number;
};

const BasicSpeakPracticePage = () => {
  const { cardId } = useParams<{ cardId: string }>();
  // 전역 녹음 컨텍스트: 시작/종료와 상태만 담당
  const { isRecording, status, lastError, startRecording, stopRecording } =
    useRecord();
  // 페이지 재생 상태: 업로드 응답 mp3Url(또는 로컬 blob URL) 재생 담당
  const { audioUrl, isPlaying, setAudioUrl, clearAudioUrl, playAudio } =
    useAudioPlayer();
  const card = useMemo(() => getBasicSpeakCardById(cardId), [cardId]);

  const [hasRecordedAudio, setHasRecordedAudio] = useState(false);
  const [isPlayingGuideAudio, setIsPlayingGuideAudio] = useState(false);
  const [isSavingReport, setIsSavingReport] = useState(false);
  const [result, setResult] = useState<PracticeResult | null>(null);

  const { isUploading, toggleRecordAndUpload } = useRecordUploadFlow({
    isRecording,
    status,
    startRecording,
    stopRecording,
    uploadFn: uploadBasicSpeakVoice,
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
      });
    },
  });

  if (!card) {
    return <Navigate to="/warmup/basic-speak" replace />;
  }

  const handlePlayGuideAudio = () => {
    setIsPlayingGuideAudio(true);
    window.setTimeout(() => {
      setIsPlayingGuideAudio(false);
    }, 900);
  };

  const handleRecord = async () => {
    // 녹음 토글 + 업로드까지 한 번에 실행
    await toggleRecordAndUpload();
  };

  const handlePlayRecordedAudio = async () => {
    if (!hasRecordedAudio || !audioUrl) return;
    // 현재 저장된 음성 URL을 재생
    await playAudio();
  };

  const handleSaveReport = () => {
    if (!result) return;
    setIsSavingReport(true);
    window.setTimeout(() => {
      setIsSavingReport(false);
    }, 1000);
  };

  const recordErrorMessage = getRecordErrorMessage(lastError);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-5">
      <section className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <BackLinkButton to="/warmup/basic-speak" label="기초 발성 목록으로" />
          <h1 className="text-[24px] font-extrabold leading-tight tracking-tight text-slate-900 min-[380px]:text-[28px]">
            기초 발성 연습
          </h1>
        </div>

        <p className="text-sm leading-6 text-slate-500">
          {card.category} "{card.subtitle}" 발성을 연습해요.
        </p>
        {recordErrorMessage ? (
          <p className="text-xs font-semibold text-rose-500">{recordErrorMessage}</p>
        ) : null}
      </section>

      <section className="grid grid-cols-1 gap-4">
        <BasicSpeakStudyCard
          card={card}
          hasRecordedAudio={hasRecordedAudio}
          isRecording={isRecording}
          isPlayingGuideAudio={isPlayingGuideAudio}
          isPlayingUserAudio={isPlaying}
          isInteractionLocked={isUploading}
          onPlayGuideAudio={handlePlayGuideAudio}
          onRecord={handleRecord}
          onPlayRecordedAudio={handlePlayRecordedAudio}
        />

        <BasicSpeakResultCard
          result={result}
          isSavingReport={isSavingReport || isUploading}
          onSaveReport={handleSaveReport}
        />
      </section>

      <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">다른 카드로 이동하기</h2>

        <div className="mt-4 grid grid-cols-1 gap-3 min-[360px]:grid-cols-2">
          {BASIC_SPEAK_CARDS.filter((item) => item.id !== card.id).map((item) => (
            <Link
              key={item.id}
              to={`/warmup/basic-speak/${item.id}`}
              className="flex min-h-[92px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-3 py-4 text-center transition hover:border-emerald-300 hover:bg-emerald-50"
            >
              <span className="text-2xl font-extrabold text-emerald-600">
                {item.title}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BasicSpeakPracticePage;
