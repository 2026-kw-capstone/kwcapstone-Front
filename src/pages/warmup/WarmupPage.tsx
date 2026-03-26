import { useOutlet } from "react-router-dom";
import MenuSelectCard from "../../components/MenuSelectCard";
import { WARMUP_MENU_ITEMS } from "../../constants/warmup";

const WarmupPage = () => {
  const outlet = useOutlet();

  if (outlet) {
    return outlet;
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col">
      <section className="mb-8">
        <h1 className="text-[28px] font-extrabold tracking-tight text-slate-900">워밍업</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          오늘의 발음 근력을 가볍게 시작해볼까요?
          <br />
          한 단계부터 천천히 연습해보세요.
        </p>
      </section>
      <section className="grid grid-cols-1 gap-3">
        {WARMUP_MENU_ITEMS.map((item) => (
          <MenuSelectCard key={item.to} item={item} />
        ))}
      </section>
    </div>
  );
};

export default WarmupPage;
