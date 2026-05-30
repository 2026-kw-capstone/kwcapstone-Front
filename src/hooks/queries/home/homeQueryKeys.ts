import { QUERY_KEY } from "../../../constants/key";

export const getContinueLearningQueryKey = () =>
  [QUERY_KEY.homeContinueLearning] as const;

export const getWeeklySummaryQueryKey = () =>
  [QUERY_KEY.homeWeeklySummary] as const;
