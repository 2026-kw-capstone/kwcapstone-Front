import { useMemo, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { uploadBasicSpeakVoice } from "../../apis/voicePlaceholder";
import BasicSpeakResultCard from "../../components/warmup/basic-speak/BasicSpeakResultCard";
import BasicSpeakStudyCard from "../../components/warmup/basic-speak/BasicSpeakStudyCard";
import { getBasicSpeakCardById } from "../../constants/basicSpeak";
import { getRecordErrorMessage } from "../../constants/recordingMessage";
import { useRecord } from "../../contexts/RecordContext";
import { useAudioPlayer } from "../../hooks/audio/useAudioPlayer";
import { useRecordUploadFlow } from "../../hooks/audio/useRecordUploadFlow";

type PracticeResult = {
  pronunciationScore: number;
};

const BasicSpeakPracticePage = () => {
  const { cardId } = useParams<{ cardId: string }>();
  const { isRecording, status, lastError, startRecording, stopRecording } =
    useRecord();
  const { audioUrl, isPlaying, setAudioUrl, clearAudioUrl, playAudio } =
    useAudioPlayer();
  const card = useMemo(() => getBasicSpeakCardById(cardId), [cardId]);

  const [result, setResult] = useState<PracticeResult | null>(null);
  const [isPlayingModelAudio, setIsPlayingModelAudio] = useState(false);

  const { isUploading, toggleRecordAndUpload } = useRecordUploadFlow({
    isRecording,
    status,
    startRecording,
    stopRecording,
    uploadFn: uploadBasicSpeakVoice,
    onBeforeStart: () => {
      setResult(null);
      clearAudioUrl();
    },
    onUploadSuccess: ({ analysis, mp3Url }, blob) => {
      setAudioUrl(mp3Url || URL.createObjectURL(blob));
      setResult({
        pronunciationScore: analysis.pronunciationScore,
      });
    },
  });

  if (!card) {
    return <Navigate to="/warmup/basic-speak" replace />;
  }

  const handleRecord = async () => {
    await toggleRecordAndUpload();
  };

  const handlePlayRecordedAudio = async () => {
    if (!audioUrl) return;
    await playAudio();
  };

  const handlePlayModelAudio = () => {
    setIsPlayingModelAudio(true);
    window.setTimeout(() => {
      setIsPlayingModelAudio(false);
    }, 900);
  };

  const recordErrorMessage = getRecordErrorMessage(lastError);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-5 animate-fade-in">
      {recordErrorMessage ? (
        <p className="rounded-2xl bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-500">
          {recordErrorMessage}
        </p>
      ) : null}

      <BasicSpeakStudyCard
        card={card}
        hasResult={!!result}
        isRecording={isRecording}
        isInteractionLocked={isUploading}
        onRecord={handleRecord}
      />

      {result ? (
        <BasicSpeakResultCard
          result={result}
          isPlayingModelAudio={isPlayingModelAudio}
          isPlayingUserAudio={isPlaying}
          isInteractionLocked={isUploading}
          onPlayModelAudio={handlePlayModelAudio}
          onPlayRecordedAudio={handlePlayRecordedAudio}
        />
      ) : null}
    </div>
  );
};

export default BasicSpeakPracticePage;
