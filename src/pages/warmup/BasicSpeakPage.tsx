import BasicSpeakCard from "../../components/warmup/basic-speak/BasicSpeakCard";
import { BASIC_SPEAK_CARDS } from "../../constants/basicSpeak";

const BasicSpeakPage = () => {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 animate-fade-in">
      <section className="mb-1">
        <p className="mb-1 text-[13px] font-bold text-slate-500">기초 발성</p>
        <h1 className="text-[24px] font-extrabold leading-tight text-slate-900">
          입 모양을 의식하며
          <br />
          단모음을 연습해요
        </h1>
      </section>

      <section className="grid grid-cols-2 gap-4">
        {BASIC_SPEAK_CARDS.map((card) => (
          <BasicSpeakCard key={card.id} card={card} />
        ))}
      </section>
    </div>
  );
};

export default BasicSpeakPage;
