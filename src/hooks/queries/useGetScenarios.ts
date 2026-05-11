import { useQuery } from "@tanstack/react-query";
import { Target } from "lucide-react";
import { getScenarios } from "../../apis/scenario";
import { QUERY_KEY } from "../../constants/key";
import { useAuth } from "../../contexts/AuthContext";
import type { ScenarioItem, ScenarioSummaryDto } from "../../types/scenarioType";

export const getScenariosQueryKey = () => [QUERY_KEY.scenarios] as const;

export const mapScenarioSummaryToItem = (
  scenario: ScenarioSummaryDto
): ScenarioItem => ({
  id: String(scenario.scenarioId),
  title: scenario.title,
  description: scenario.description,
  icon: Target,
  iconClassName: "bg-emerald-50 text-emerald-500",
});

export const useGetScenarios = () => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: getScenariosQueryKey(),
    queryFn: getScenarios,
    enabled: !!accessToken,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    select: (response) => response.result.scenarios.map(mapScenarioSummaryToItem),
  });
};
