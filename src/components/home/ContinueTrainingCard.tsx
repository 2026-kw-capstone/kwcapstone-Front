import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface ContinueTrainingCardProps {
  to: string;
  icon: LucideIcon;
  iconClassName: string;
  label: string;
  title: string;
  description: string;
  hoverBorderClassName: string;
}

const ContinueTrainingCard = ({
  to,
  icon: Icon,
  iconClassName,
  label,
  title,
  description,
  hoverBorderClassName,
}: ContinueTrainingCardProps) => {
  return (
    <Link
      to={to}
      className={`group flex min-h-[150px] flex-col justify-between rounded-[20px] border border-slate-100 bg-white p-5 shadow-[0_4px_16px_rgba(0,0,0,0.03)] transition-all ${hoverBorderClassName} active:scale-95`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div
          className={`rounded-[14px] p-2.5 transition-transform group-hover:scale-110 ${iconClassName}`}
        >
          <Icon size={20} />
        </div>
        <span className="rounded-full border border-slate-100 bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-slate-400">
          {label}
        </span>
      </div>
      <div>
        <h4 className="mb-1 truncate text-[15px] font-extrabold text-slate-800">
          {title}
        </h4>
        <p className="flex items-center gap-1 break-keep text-[12px] font-medium leading-relaxed text-slate-500">
          {description}
        </p>
      </div>
    </Link>
  );
};

export default ContinueTrainingCard;
