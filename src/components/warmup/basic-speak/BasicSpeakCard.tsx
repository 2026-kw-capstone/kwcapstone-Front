import { Link } from "react-router-dom";
import type { BasicSpeakCardItem } from "../../../types/basicSpeakType";

interface BasicSpeakCardProps {
  card: BasicSpeakCardItem;
}

const BasicSpeakCard = ({ card }: BasicSpeakCardProps) => {
  return (
    <Link
      to={`/warmup/basic-speak/${card.id}`}
      className="
        group flex min-h-[132px] flex-col items-center justify-center rounded-[24px]
        border border-slate-200 bg-white px-4 py-5 text-center shadow-sm
        transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md
      "
    >
      <div className="text-[35px] font-extrabold leading-none tracking-tight text-emerald-600">
        {card.title}
      </div>

      <p className="mt-3 text-base font-semibold text-slate-500">{card.subtitle}</p>


    </Link>
  );
};

export default BasicSpeakCard;
