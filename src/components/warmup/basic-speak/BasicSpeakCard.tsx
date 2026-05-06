import { Volume2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { BasicSpeakCardItem } from "../../../types/basicSpeakType";

interface BasicSpeakCardProps {
  card: BasicSpeakCardItem;
}

const BasicSpeakCard = ({ card }: BasicSpeakCardProps) => {
  return (
    <Link
      to={`/warmup/basic-speak/${card.id}`}
      className="group relative flex min-h-[168px] flex-col items-center justify-center overflow-hidden rounded-[24px] border border-slate-50 bg-white px-4 py-10 text-center shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all duration-200 hover:border-indigo-100 hover:shadow-[0_4px_24px_rgba(99,102,241,0.1)] active:scale-[0.98]"
    >
      <Volume2
        size={80}
        className="absolute -right-4 -top-4 text-indigo-500 opacity-5 transition group-hover:opacity-10"
        aria-hidden="true"
      />

      <div className="relative z-10 mb-3 text-[54px] font-black leading-none text-indigo-600">
        {card.title}
      </div>

      <p className="relative z-10 rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-500">
        {card.category}
      </p>
    </Link>
  );
};

export default BasicSpeakCard;
