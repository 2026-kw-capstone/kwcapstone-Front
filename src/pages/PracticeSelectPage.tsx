import MenuSelectCard from "../components/MenuSelectCard";
import { AI_PRACTICE_MENU_ITEMS } from "../constants/aiPractice";

const PracticeSelectPage = () => {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col animate-fade-in">
      <section className="relative mb-6 pt-2">
        <p className="mb-1.5 px-1 text-[14px] font-black uppercase tracking-wider text-emerald-500">
          AI Practice
        </p>
        <h1 className="relative z-10 px-1 text-[26px] font-black leading-tight text-slate-900">
          상황에 맞는
          <br />
          대화를 연습해요
        </h1>
      </section>

      <section className="relative z-10 flex flex-col gap-4">
        {AI_PRACTICE_MENU_ITEMS.map((item) => (
          <MenuSelectCard key={item.to} item={item} />
        ))}
      </section>
    </div>
  );
};

export default PracticeSelectPage;
