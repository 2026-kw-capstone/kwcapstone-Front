import { useQuery } from "@tanstack/react-query";
import { getWeeklySummary } from "../../../apis/home";
import { useAuth } from "../../../contexts/AuthContext";
import { getWeeklySummaryQueryKey } from "./homeQueryKeys";

export const useGetWeeklySummary = () => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: getWeeklySummaryQueryKey(),
    queryFn: getWeeklySummary,
    enabled: !!accessToken,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    select: (response) => response.result,
  });
};
