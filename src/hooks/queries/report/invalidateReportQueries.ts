import type { QueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "../../../constants/key";

export const invalidateReportQueries = (queryClient: QueryClient) => {
  void queryClient.invalidateQueries({
    queryKey: [QUERY_KEY.reportWeeklyStamps],
  });
  void queryClient.invalidateQueries({
    queryKey: [QUERY_KEY.reportAchievementTrend],
  });
  void queryClient.invalidateQueries({
    queryKey: [QUERY_KEY.reportPronunciationAccuracy],
  });
};
