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
      className="group flex w-full items-center gap-4 rounded-[24px] border border-slate-50 bg-white p-5 text-left shadow-[0_4px_16px_rgba(0,0,0,0.03)] transition-all hover:border-slate-200 active:scale-[0.98]"
    >
      <div
        className={`flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-[20px] ${item.iconClassName}`}
      >
        <Icon size={26} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="mb-1 text-[17px] font-black leading-snug text-slate-900 break-keep">
          {item.title}
        </p>
        <p className="text-[13px] font-medium leading-relaxed text-slate-500 break-keep">
          {item.description}
        </p>
      </div>

      <ChevronRight className="shrink-0 text-slate-300 transition group-hover:text-slate-500" size={20} />
    </button>
  );
};

export default ScenarioLevelCard;
