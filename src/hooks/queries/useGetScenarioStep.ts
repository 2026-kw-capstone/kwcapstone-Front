import { useQuery } from "@tanstack/react-query";
import { getScenarioStep } from "../../apis/scenario";
import { QUERY_KEY } from "../../constants/key";
import { useAuth } from "../../contexts/AuthContext";
import type { ScenarioLevel } from "../../types/scenarioType";

export const getScenarioStepQueryKey = ({
  scenarioId,
  level,
  stepNo,
}: {
  scenarioId?: number;
  level?: ScenarioLevel;
  stepNo?: number;
}) => [QUERY_KEY.scenarioStep, scenarioId, level, stepNo] as const;

export const useGetScenarioStep = ({
  scenarioId,
  level,
  stepNo,
}: {
  scenarioId?: number;
  level?: ScenarioLevel;
  stepNo?: number;
}) => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: getScenarioStepQueryKey({ scenarioId, level, stepNo }),
    queryFn: () =>
      getScenarioStep({
        scenarioId: scenarioId!,
        level: level!,
        stepNo: stepNo!,
      }),
    enabled:
      !!accessToken &&
      typeof scenarioId === "number" &&
      typeof level === "number" &&
      typeof stepNo === "number",
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    select: (response) => response.result,
  });
};
