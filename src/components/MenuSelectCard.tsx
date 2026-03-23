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
        group rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm
        transition-all duration-200
        hover:-translate-y-1 hover:border-slate-300 hover:shadow-md
        focus:outline-none focus:ring-2 focus:ring-slate-200
        sm:p-8
      "
    >
      <div
        className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${iconClassName}`}
      >
        <Icon size={28} strokeWidth={2.2} />
      </div>

      <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
        {title}
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-[15px]">
        {description}
      </p>
    </Link>
  );
};

export default MenuSelectCard;
