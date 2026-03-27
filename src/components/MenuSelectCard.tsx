import { Link } from "react-router-dom";
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
        group rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm
        transition-all duration-200
        hover:-translate-y-1 hover:border-slate-300 hover:shadow-md
        focus:outline-none focus:ring-2 focus:ring-slate-200
      "
    >
      <div className="mb-4 flex items-center gap-3">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconClassName}`}>
          <Icon size={28} strokeWidth={2.2} />
        </div>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
          {title}
        </h2>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </Link>
  );
};

export default MenuSelectCard;
