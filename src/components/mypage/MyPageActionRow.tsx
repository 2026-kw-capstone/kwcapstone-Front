import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

interface MyPageActionRowProps {
  icon: ReactNode;
  title: string;
  onClick: () => void;
  titleClassName?: string;
  iconClassName?: string;
}

const MyPageActionRow = ({
  icon,
  title,
  onClick,
  titleClassName,
  iconClassName,
}: MyPageActionRowProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-3 border-b border-slate-200 px-4 py-4 text-left transition hover:bg-slate-50 last:border-b-0"
    >
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 ${iconClassName ?? ""}`}
        >
          {icon}
        </span>
        <p className={`text-base font-semibold text-slate-900 ${titleClassName ?? ""}`}>
          {title}
        </p>
      </div>

      <ChevronRight className="shrink-0 text-slate-300" size={20} />
    </button>
  );
};

export default MyPageActionRow;
