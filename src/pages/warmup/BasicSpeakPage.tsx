import BasicSpeakCard from "../../components/warmup/basic-speak/BasicSpeakCard";
import { BASIC_SPEAK_CARDS } from "../../constants/basicSpeak";

const BasicSpeakPage = () => {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 md:gap-8">
      <section className="flex flex-col gap-2">
        <h1 className="text-[28px] font-extrabold tracking-tight text-slate-900 sm:text-[32px]">
          기초 발성 연습
        </h1>

        <p className="text-sm leading-6 text-slate-500 sm:text-base">
          기초적인 발음부터 차근차근 연습해봐요.
        </p>

        <p className="pt-2 text-sm leading-6 text-slate-500 sm:text-base">
          연습하고 싶은 카드를 선택해주세요.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
        {BASIC_SPEAK_CARDS.map((card) => (
          <BasicSpeakCard key={card.id} card={card} />
        ))}
      </section>
    </div>
  );
};

export default BasicSpeakPage;