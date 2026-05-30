import { QUERY_KEY } from "../../../constants/key";
import type { ReportPeriod, ReportPracticeType } from "../../../types/reportType";

export const getWeeklyStampsReportQueryKey = () =>
  [QUERY_KEY.reportWeeklyStamps] as const;

export const getAchievementTrendReportQueryKey = (period?: ReportPeriod) =>
  [QUERY_KEY.reportAchievementTrend, period] as const;

export const getPronunciationAccuracyReportQueryKey = ({
  period,
  type,
}: {
  period?: ReportPeriod;
  type?: ReportPracticeType;
}) => [QUERY_KEY.reportPronunciationAccuracy, period, type] as const;
