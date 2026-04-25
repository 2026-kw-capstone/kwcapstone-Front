import { ChevronRight, Trash2 } from "lucide-react";
import type { ScenarioItem } from "../../types/scenarioType";

interface ScenarioRowCardProps {
  scenario: ScenarioItem;
  onClick: () => void;
  onDelete?: () => void;
}

const ScenarioRowCard = ({ scenario, onClick, onDelete }: ScenarioRowCardProps) => {
  const Icon = scenario.icon;

  return (
    <div className="group relative">
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center gap-3 rounded-[22px] border border-slate-200 bg-white px-4 py-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow"
      >
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${scenario.iconClassName}`}
        >
          <Icon size={22} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-bold text-slate-900">{scenario.title}</p>
          <p className="mt-1 truncate text-[13px] text-slate-500">{scenario.description}</p>
        </div>

        <ChevronRight className="shrink-0 text-slate-300 transition group-hover:text-slate-500" />
      </button>

      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="absolute right-9 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-rose-500"
          aria-label="시나리오 삭제"
        >
          <Trash2 size={17} />
        </button>
      )}
    </div>
  );
};

export default ScenarioRowCard;
