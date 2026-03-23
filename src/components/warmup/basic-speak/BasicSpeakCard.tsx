import { ChevronRight } from "lucide-react";
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
        sm:min-h-[148px] sm:px-5 sm:py-6
      "
    >
      <div className="text-[38px] font-extrabold leading-none tracking-tight text-emerald-600 sm:text-[46px]">
        {card.title}
      </div>

      <p className="mt-3 text-base font-semibold text-slate-500 sm:text-lg">
        {card.subtitle}
      </p>

      <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-slate-400 transition group-hover:text-emerald-600">
        연습하기
        <ChevronRight size={16} />
      </div>
    </Link>
  );
};

export default BasicSpeakCard;