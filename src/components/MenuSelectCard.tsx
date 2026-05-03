import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { MenuItem } from "../types/menuItem";

interface MenuSelectCardProps {
  item: MenuItem;
}

const MenuSelectCard = ({ item }: MenuSelectCardProps) => {
  const { title, description, to, icon: Icon, iconClassName } = item;

  return (
    <Link
      to={to}
      className="
        group rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm
        transition-all duration-200
        hover:border-slate-300 hover:shadow-md
        focus:outline-none focus:ring-2 focus:ring-slate-200
      "
    >
      <div className="flex p-1 items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconClassName}`}>
            <Icon size={24} strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-md font-extrabold tracking-tight text-slate-900">{title}</h2>
            <p className="mt-1 truncate text-xs leading-5 text-slate-500">{description}</p>
          </div>
        </div>

        <ChevronRight
          size={18}
          className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-400"
        />
      </div>
    </Link>
  );
};

export default MenuSelectCard;
