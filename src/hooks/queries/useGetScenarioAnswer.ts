import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../constants/key";
import type { ScenarioAnswerResultDto, ScenarioLevel } from "../../types/scenarioType";

export const getScenarioAnswerQueryKey = ({
  scenarioId,
  level,
  stepNo,
}: {
  scenarioId?: number;
  level?: ScenarioLevel;
  stepNo?: number;
}) => [QUERY_KEY.scenarioAnswer, scenarioId, level, stepNo] as const;

export const useGetScenarioAnswer = ({
  scenarioId,
  level,
  stepNo,
}: {
  scenarioId?: number;
  level?: ScenarioLevel;
  stepNo?: number;
}) =>
  useQuery<ScenarioAnswerResultDto | null>({
    queryKey: getScenarioAnswerQueryKey({ scenarioId, level, stepNo }),
    queryFn: async () => null,
    enabled: false,
    initialData: null,
  });
