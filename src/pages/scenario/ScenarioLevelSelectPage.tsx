import { useNavigate, useOutlet, useOutletContext, useParams } from "react-router-dom";
import BackLinkButton from "../../components/BackLinkButton";
import ScenarioLevelCard from "../../components/scenario/ScenarioLevelCard";
import { RECOMMENDED_SCENARIOS } from "../../constants/scenario";
import { LEVEL_ITEMS } from "../../constants/scenarioLevel";
import type { ScenarioLevel, ScenarioOutletContext } from "../../types/scenarioType";

const ScenarioLevelSelectPage = () => {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  const navigate = useNavigate();
  const { myScenarios } = useOutletContext<ScenarioOutletContext>();

  const scenarioOutletContext: ScenarioOutletContext = { myScenarios };
  const outlet = useOutlet(scenarioOutletContext);

  if (outlet) {
    return outlet;
  }

  const normalizedScenarioId = scenarioId ?? "";
  const scenarioName =
    [...RECOMMENDED_SCENARIOS, ...myScenarios].find(
      (scenario) => scenario.id === normalizedScenarioId
    )?.title ?? "나만의 시나리오";

  const moveToLevel = (level: ScenarioLevel) => {
    navigate(`/ai-practice/scenario/${normalizedScenarioId}/level/${level}`);
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-5">
      <section>
        <div className="flex flex-wrap items-center gap-2">
          <BackLinkButton to="/ai-practice/scenario" label="시나리오 목록으로" />
          <h1 className="text-[18px] font-extrabold leading-tight tracking-tight text-slate-900 min-[380px]:text-[22px]">
            {scenarioName} 레벨 선택
          </h1>
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          어떤 난이도로 연습해볼까요?
        </p>
      </section>

      <section className="space-y-3">
        {LEVEL_ITEMS.map((item) => (
          <ScenarioLevelCard
            key={item.level}
            item={item}
            onClick={() => moveToLevel(item.level)}
          />
        ))}
      </section>
    </div>
  );
};

export default ScenarioLevelSelectPage;
