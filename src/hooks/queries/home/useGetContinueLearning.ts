import { useQuery } from "@tanstack/react-query";
import { getContinueLearning } from "../../../apis/home";
import { useAuth } from "../../../contexts/AuthContext";
import { getContinueLearningQueryKey } from "./homeQueryKeys";

export const useGetContinueLearning = () => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: getContinueLearningQueryKey(),
    queryFn: getContinueLearning,
    enabled: !!accessToken,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    select: (response) => response.result,
  });
};
