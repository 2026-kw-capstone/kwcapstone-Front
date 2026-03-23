import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ScenarioItem } from "../../types/scenarioType";

interface ScenarioSwitchSectionProps {
  title: string;
  scenarios: ScenarioItem[];
  currentScenarioId: string;
  onSelect: (scenarioId: string) => void;
}

const ScenarioSwitchSection = ({
  title,
  scenarios,
  currentScenarioId,
  onSelect,
}: ScenarioSwitchSectionProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  const handleArrowClick = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    const amount = direction === "left" ? -240 : 240;
    container.scrollBy({ left: amount, behavior: "smooth" });
  };

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);

    return () => {
      window.removeEventListener("resize", updateScrollState);
    };
  }, [scenarios.length]);

  return (
    <section>
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-slate-600">{title}</h2>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleArrowClick("left")}
            disabled={scenarios.length === 0 || !canScrollLeft}
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="왼쪽으로 이동"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => handleArrowClick("right")}
            disabled={scenarios.length === 0 || !canScrollRight}
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="오른쪽으로 이동"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {scenarios.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-5 text-center text-xs text-slate-500">
          아직 추가된 시나리오가 없습니다.
        </div>
      ) : (
        <div
          ref={scrollContainerRef}
          onScroll={updateScrollState}
          className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {scenarios.map((scenario) => {
            const Icon = scenario.icon;
            const isCurrent = currentScenarioId === scenario.id;

            return (
              <button
                key={scenario.id}
                type="button"
                onClick={() => onSelect(scenario.id)}
                className={`flex h-[84px] min-w-[92px] shrink-0 flex-col items-center justify-center gap-1.5 rounded-2xl border transition ${
                  isCurrent
                    ? "border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-100"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <Icon
                  size={20}
                  className={isCurrent ? "text-white" : "text-slate-500"}
                />
                <span className="px-2 text-xs font-bold">{scenario.title}</span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ScenarioSwitchSection;
