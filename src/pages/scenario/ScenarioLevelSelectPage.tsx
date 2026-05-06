import { Navigate, useNavigate, useOutlet, useOutletContext, useParams } from "react-router-dom";
import ScenarioLevelCard from "../../components/scenario/ScenarioLevelCard";
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
  const scenario = myScenarios.find(
    (item) => item.id === normalizedScenarioId
  );

  if (!scenario) {
    return <Navigate to="/ai-practice/scenario" replace />;
  }

  const moveToLevel = (level: ScenarioLevel) => {
    navigate(`/ai-practice/scenario/${normalizedScenarioId}/level/${level}`);
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 animate-fade-in">
      <section className="mb-2 px-1">
        <p className="mb-1 text-[13px] font-black text-[#278DFD]">
          {scenario.title}
        </p>
        <h1 className="text-[24px] font-extrabold leading-tight text-slate-900">
          어떤 난이도로
          <br />
          연습해볼까요?
        </h1>
      </section>

      <section className="flex flex-col gap-4">
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
