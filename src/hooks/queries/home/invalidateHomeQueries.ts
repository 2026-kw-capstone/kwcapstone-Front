import type { QueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "../../../constants/key";

export const invalidateHomeQueries = (queryClient: QueryClient) => {
  void queryClient.invalidateQueries({
    queryKey: [QUERY_KEY.homeContinueLearning],
  });
  void queryClient.invalidateQueries({
    queryKey: [QUERY_KEY.homeWeeklySummary],
  });
};
