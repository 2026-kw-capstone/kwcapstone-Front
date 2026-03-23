import MenuSelectCard from "../components/MenuSelectCard";
import { AI_PRACTICE_MENU_ITEMS } from "../constants/aiPractice";

const PracticeSelectPage = () => {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col">
      <section className="mb-8">
        <h1 className="text-[28px] font-extrabold tracking-tight text-slate-900 sm:text-[32px]">
          AI 실전대화연습
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
          원하는 연습 모드를 선택해서 바로 시작해보세요.
          <br />
          상황형 대화와 자유 대화를 모두 연습할 수 있어요.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        {AI_PRACTICE_MENU_ITEMS.map((item) => (
          <MenuSelectCard key={item.to} item={item} />
        ))}
      </section>
    </div>
  );
};

export default PracticeSelectPage;
