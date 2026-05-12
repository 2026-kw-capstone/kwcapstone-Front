import { ChevronRight, Trash2 } from "lucide-react";
import type { MouseEvent } from "react";
import type { ScenarioItem } from "../../types/scenarioType";

interface ScenarioRowCardProps {
  scenario: ScenarioItem;
  onClick: () => void;
  onDelete?: () => void;
}

const ScenarioRowCard = ({ scenario, onClick, onDelete }: ScenarioRowCardProps) => {
  const Icon = scenario.icon;

  const handleDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onDelete?.();
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-4 rounded-[24px] border border-slate-50 bg-white p-5 text-left shadow-[0_4px_16px_rgba(0,0,0,0.03)] transition-all hover:border-slate-200 active:scale-[0.98]"
    >
      <div
        className={`flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-[18px] ${scenario.iconClassName}`}
      >
        <Icon size={26} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="mb-1 truncate text-[16px] font-extrabold text-slate-900">
          {scenario.title}
        </p>
        <p className="truncate text-[13px] font-medium text-slate-500">
          {scenario.description}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {onDelete ? (
          <button
            type="button"
            onClick={handleDelete}
            className="flex h-11 w-11 items-center justify-center rounded-[16px] text-slate-300 transition hover:bg-rose-50 hover:text-rose-500 active:scale-95"
            aria-label="시나리오 삭제"
          >
            <Trash2 size={20} />
          </button>
        ) : null}
        <ChevronRight
          className="text-slate-300 transition group-hover:text-slate-500"
          size={20}
        />
      </div>
    </button>
  );
};

export default ScenarioRowCard;
