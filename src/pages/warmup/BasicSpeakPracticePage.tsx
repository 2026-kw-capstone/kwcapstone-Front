import { useMemo, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { uploadBasicSpeakVoice } from "../../apis/voicePlaceholder";
import { getRecordErrorMessage } from "../../constants/recordingMessage";
import BackLinkButton from "../../components/BackLinkButton";
import BasicSpeakResultCard from "../../components/warmup/basic-speak/BasicSpeakResultCard";
import BasicSpeakStudyCard from "../../components/warmup/basic-speak/BasicSpeakStudyCard";
import { getBasicSpeakCardById } from "../../constants/basicSpeak";
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
  const { isRecording, status, lastError, startRecording, stopRecording } =
    useRecord();
  const { setAudioUrl, clearAudioUrl } = useAudioPlayer();
  const card = useMemo(() => getBasicSpeakCardById(cardId), [cardId]);

  const [hasRecordedAudio, setHasRecordedAudio] = useState(false);
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

  const handleRecord = async () => {
    await toggleRecordAndUpload();
  };

  const recordErrorMessage = getRecordErrorMessage(lastError);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-5">
      <section className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <BackLinkButton to="/warmup/basic-speak" label="기초 발성 목록으로" />
          <h1 className="text-[18px] font-extrabold leading-tight tracking-tight text-slate-900 min-[380px]:text-[22px]">
            기초 발성 연습
          </h1>
        </div>

        {recordErrorMessage ? (
          <p className="text-xs font-semibold text-rose-500">{recordErrorMessage}</p>
        ) : null}
      </section>

      <section className="grid grid-cols-1 gap-4">
        <BasicSpeakStudyCard
          card={card}
          hasRecordedAudio={hasRecordedAudio}
          isRecording={isRecording}
          isInteractionLocked={isUploading}
          onRecord={handleRecord}
        />

        {result ? <BasicSpeakResultCard result={result} /> : null}
      </section>
    </div>
  );
};

export default BasicSpeakPracticePage;
