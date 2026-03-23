import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { HomeQuickMenu } from "../../constants/homeQuickMenus";

interface QuickMenuCardProps {
  menu: HomeQuickMenu;
}

const QuickMenuCard = ({ menu }: QuickMenuCardProps) => {
  const Icon = menu.icon;

  return (
    <Link
      to={menu.path}
      className="group rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg md:rounded-[28px] md:p-6"
    >
      <div
        className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl md:mb-6 md:h-14 md:w-14 ${menu.iconBg}`}
      >
        <Icon className={menu.iconColor} size={24} />
      </div>

      <h4 className="text-xl font-bold text-slate-900 md:text-2xl">
        {menu.title}
      </h4>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {menu.description}
      </p>

      <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 md:mt-6">
        바로가기
        <ChevronRight
          size={16}
          className="transition group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
};

export default QuickMenuCard;