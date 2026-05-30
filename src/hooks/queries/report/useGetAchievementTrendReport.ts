import { useQuery } from "@tanstack/react-query";
import { getAchievementTrendReport } from "../../../apis/report";
import { useAuth } from "../../../contexts/AuthContext";
import type {
  AchievementTrendReportResult,
  ReportPeriod,
} from "../../../types/reportType";
import { getAchievementTrendReportQueryKey } from "./reportQueryKeys";

const dayLabelsByDateIndex = ["일", "월", "화", "수", "목", "금", "토"];

const getDayLabelFromDate = (date: string) => {
  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return dayLabelsByDateIndex[parsedDate.getDay()];
};

const normalizeAchievementTrend = (
  report: AchievementTrendReportResult
): AchievementTrendReportResult => ({
  ...report,
  points: report.points.map((point, index) => ({
    ...point,
    label:
      report.period === "WEEK"
        ? getDayLabelFromDate(point.startDate) || point.label
        : `${index + 1}주차`,
  })),
});

export const useGetAchievementTrendReport = (period: ReportPeriod) => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: getAchievementTrendReportQueryKey(period),
    queryFn: () => getAchievementTrendReport(period),
    enabled: !!accessToken,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    select: (response) => normalizeAchievementTrend(response.result),
  });
};
