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
      className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="mb-3 flex items-center gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${menu.iconBg}`}>
          <Icon className={menu.iconColor} size={20} />
        </div>
        <h4 className="text-base font-bold text-slate-900">{menu.title}</h4>
      </div>

      <div className="flex items-end justify-between gap-3">
        <p className="flex-1 text-xs leading-5 text-slate-500">{menu.description}</p>

        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
          바로가기
          <ChevronRight size={14} className="transition group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};

export default QuickMenuCard;
