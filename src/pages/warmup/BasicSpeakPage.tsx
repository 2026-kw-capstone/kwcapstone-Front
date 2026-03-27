import BackLinkButton from "../../components/BackLinkButton";
import BasicSpeakCard from "../../components/warmup/basic-speak/BasicSpeakCard";
import { BASIC_SPEAK_CARDS } from "../../constants/basicSpeak";

const BasicSpeakPage = () => {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-5">
      <section className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <BackLinkButton to="/warmup" label="워밍업으로" />
          <h1 className="text-[24px] font-extrabold leading-tight tracking-tight text-slate-900 min-[380px]:text-[28px]">
            기초 발성 연습
          </h1>
        </div>

        <p className="text-sm leading-6 text-slate-500">기초적인 발음부터 차근차근 연습해요.</p>

        <p className="pt-2 text-sm leading-6 text-slate-500">연습하고 싶은 카드를 선택해주세요.</p>
      </section>

      <section className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2">
        {BASIC_SPEAK_CARDS.map((card) => (
          <BasicSpeakCard key={card.id} card={card} />
        ))}
      </section>
    </div>
  );
};

export default BasicSpeakPage;
