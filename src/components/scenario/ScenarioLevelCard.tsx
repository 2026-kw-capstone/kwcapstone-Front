import { ChevronRight } from "lucide-react";
import type { ScenarioLevelItem } from "../../types/scenarioType";

interface ScenarioLevelCardProps {
  item: ScenarioLevelItem;
  onClick: () => void;
}

const ScenarioLevelCard = ({ item, onClick }: ScenarioLevelCardProps) => {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-4 rounded-[22px] border border-slate-200 bg-white px-4 py-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow"
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.iconClassName}`}
      >
        <Icon size={22} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-md font-bold text-slate-900">{item.title}</p>
        <p className="mt-1 text-xs text-slate-500">{item.description}</p>
      </div>

      <ChevronRight className="shrink-0 text-slate-300 transition group-hover:text-slate-500" />
    </button>
  );
};

export default ScenarioLevelCard;
