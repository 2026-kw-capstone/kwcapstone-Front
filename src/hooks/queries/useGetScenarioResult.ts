import { useQuery } from "@tanstack/react-query";
import { getScenarioResult } from "../../apis/scenario";
import { QUERY_KEY } from "../../constants/key";
import { useAuth } from "../../contexts/AuthContext";
import type { ScenarioLevel } from "../../types/scenarioType";

export const getScenarioResultQueryKey = ({
  scenarioId,
  level,
}: {
  scenarioId?: number;
  level?: ScenarioLevel;
}) => [QUERY_KEY.scenarioResult, scenarioId, level] as const;

export const useGetScenarioResult = ({
  scenarioId,
  level,
  enabled = true,
}: {
  scenarioId?: number;
  level?: ScenarioLevel;
  enabled?: boolean;
}) => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: getScenarioResultQueryKey({ scenarioId, level }),
    queryFn: () =>
      getScenarioResult({
        scenarioId: scenarioId!,
        level: level!,
      }),
    enabled:
      enabled &&
      !!accessToken &&
      typeof scenarioId === "number" &&
      typeof level === "number",
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    select: (response) => response.result,
  });
};
