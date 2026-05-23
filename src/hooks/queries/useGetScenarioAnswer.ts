import { QUERY_KEY } from "../../constants/key";
import type { ScenarioLevel } from "../../types/scenarioType";

export const getScenarioAnswerQueryKey = ({
  scenarioId,
  level,
  stepNo,
}: {
  scenarioId?: number;
  level?: ScenarioLevel;
  stepNo?: number;
}) => [QUERY_KEY.scenarioAnswer, scenarioId, level, stepNo] as const;
