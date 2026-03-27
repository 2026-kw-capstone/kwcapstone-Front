import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import BackLinkButton from "../../components/BackLinkButton";
import BasicSpeakStudyCard from "../../components/warmup/basic-speak/BasicSpeakStudyCard";
import BasicSpeakResultCard from "../../components/warmup/basic-speak/BasicSpeakResultCard";
import {
  BASIC_SPEAK_CARDS,
  getBasicSpeakCardById,
} from "../../constants/basicSpeak";

type PracticeResult = {
  pronunciationScore: number;
  stabilityScore: number;
  deliveryScore: number;
};

const BasicSpeakPracticePage = () => {
  const { cardId } = useParams<{ cardId: string }>();

  const card = useMemo(() => getBasicSpeakCardById(cardId), [cardId]);

  const [hasRecording, setHasRecording] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingGuideAudio, setIsPlayingGuideAudio] = useState(false);
  const [isPlayingUserAudio, setIsPlayingUserAudio] = useState(false);
  const [isSavingReport, setIsSavingReport] = useState(false);
  const [result, setResult] = useState<PracticeResult | null>(null);

  if (!card) {
    return <Navigate to="/warmup/basic-speak" replace />;
  }

  const handlePlayGuideAudio = () => {
    setIsPlayingGuideAudio(true);

    window.setTimeout(() => {
      setIsPlayingGuideAudio(false);
    }, 900);
  };

  const handleRecord = () => {
    setIsRecording(true);

    window.setTimeout(() => {
      setIsRecording(false);
      setHasRecording(true);
      setResult({
        pronunciationScore: 86,
        stabilityScore: 83,
        deliveryScore: 85,
      });
    }, 1200);
  };

  const handlePlayRecordedAudio = () => {
    if (!hasRecording) return;

    setIsPlayingUserAudio(true);

    window.setTimeout(() => {
      setIsPlayingUserAudio(false);
    }, 900);
  };

  const handleSaveReport = () => {
    if (!result) return;

    setIsSavingReport(true);

    window.setTimeout(() => {
      setIsSavingReport(false);
    }, 1000);
  };

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
      </section>

      <section className="grid grid-cols-1 gap-4">
        <BasicSpeakStudyCard
          card={card}
          hasRecording={hasRecording}
          isRecording={isRecording}
          isPlayingGuideAudio={isPlayingGuideAudio}
          isPlayingUserAudio={isPlayingUserAudio}
          onPlayGuideAudio={handlePlayGuideAudio}
          onRecord={handleRecord}
          onPlayRecordedAudio={handlePlayRecordedAudio}
        />

        <BasicSpeakResultCard
          result={result}
          isSavingReport={isSavingReport}
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
