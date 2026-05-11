import { useQuery } from "@tanstack/react-query";
import { getScenarioDetail } from "../../apis/scenario";
import { QUERY_KEY } from "../../constants/key";
import { useAuth } from "../../contexts/AuthContext";

export const getScenarioDetailQueryKey = (scenarioId?: number) =>
  [QUERY_KEY.scenarioDetail, scenarioId] as const;

export const useGetScenarioDetail = (scenarioId?: number) => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: getScenarioDetailQueryKey(scenarioId),
    queryFn: async () => {
      const response = await getScenarioDetail(scenarioId!);
      return response.result;
    },
    enabled: !!accessToken && typeof scenarioId === "number",
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
};
