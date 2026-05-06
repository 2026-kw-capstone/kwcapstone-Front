import { useOutlet } from "react-router-dom";
import MenuSelectCard from "../../components/MenuSelectCard";
import { WARMUP_MENU_ITEMS } from "../../constants/warmup";

const WarmupPage = () => {
  const outlet = useOutlet();

  if (outlet) {
    return outlet;
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col animate-fade-in">
      <section className="mb-6 pt-2">
        <p className="mb-1.5 px-1 text-[14px] font-black uppercase tracking-wider text-[#278DFD]">
          Warm Up
        </p>
        <h1 className="px-1 text-[26px] font-black leading-tight text-slate-900">
          말하기 전,
          <br />
          가볍게 입을 풀어봐요
        </h1>
      </section>

      <section className="flex flex-col gap-4">
        {WARMUP_MENU_ITEMS.map((item) => (
          <MenuSelectCard key={item.to} item={item} />
        ))}
      </section>
    </div>
  );
};

export default WarmupPage;
