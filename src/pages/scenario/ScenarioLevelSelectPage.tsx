import { Navigate, useNavigate, useOutlet, useParams } from "react-router-dom";
import { getApiErrorMessage } from "../../apis/apiError";
import ScenarioLevelCard from "../../components/scenario/ScenarioLevelCard";
import { LEVEL_ITEMS } from "../../constants/scenarioLevel";
import { useGetScenarioDetail } from "../../hooks/queries/useGetScenarioDetail";
import type { ScenarioLevel, ScenarioLevelItem } from "../../types/scenarioType";

const ScenarioLevelSelectPage = () => {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  const navigate = useNavigate();
  const normalizedScenarioId = Number(scenarioId);
  const isValidScenarioId = Number.isFinite(normalizedScenarioId);
  const {
    data: scenario,
    isLoading,
    isError,
    error,
  } = useGetScenarioDetail(isValidScenarioId ? normalizedScenarioId : undefined);
  const outlet = useOutlet();

  if (outlet) {
    return outlet;
  }

  if (!isValidScenarioId) {
    return <Navigate to="/ai-practice/scenario" replace />;
  }

  const moveToLevel = (level: ScenarioLevel) => {
    navigate(`/ai-practice/scenario/${normalizedScenarioId}/level/${level}`);
  };

  const levelItems: ScenarioLevelItem[] =
    scenario?.levels.map((level) => {
      const fallback = LEVEL_ITEMS.find((item) => item.level === level.level);

      return {
        level: level.level,
        title: level.levelTitle,
        description: level.levelDescription,
        icon: fallback?.icon ?? LEVEL_ITEMS[0].icon,
        iconClassName: fallback?.iconClassName ?? LEVEL_ITEMS[0].iconClassName,
      };
    }) ?? [];

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-full w-full max-w-md items-center justify-center">
        <p className="text-[14px] font-bold text-slate-400">
          ?덈꺼 ?뺣낫瑜??덈윭?ㅻ뒗 以묒엯?덈떎...
        </p>
      </div>
    );
  }

  if (isError || !scenario) {
    return (
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col items-center justify-center gap-4 text-center">
        <p className="rounded-2xl bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-500">
          {getApiErrorMessage(error)}
        </p>
        <button
          type="button"
          onClick={() => navigate("/ai-practice/scenario")}
          className="h-12 rounded-2xl bg-[#278DFD] px-5 text-[14px] font-bold text-white"
        >
          紐⑸줉?쇰줈 ?뚯븘媛湲?
        </button>
      </div>
    );
  }

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
        {levelItems.map((item) => (
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
