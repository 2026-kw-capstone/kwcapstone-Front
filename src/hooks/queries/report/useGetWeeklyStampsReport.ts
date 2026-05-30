import { useQuery } from "@tanstack/react-query";
import { getWeeklyStampsReport } from "../../../apis/report";
import { useAuth } from "../../../contexts/AuthContext";
import type {
  WeeklyStamp,
  WeeklyStampsReportResult,
} from "../../../types/reportType";
import { getWeeklyStampsReportQueryKey } from "./reportQueryKeys";

const dayLabelsByDayOfWeek: Record<string, string> = {
  MONDAY: "월",
  TUESDAY: "화",
  WEDNESDAY: "수",
  THURSDAY: "목",
  FRIDAY: "금",
  SATURDAY: "토",
  SUNDAY: "일",
};

const normalizeWeeklyStamp = (stamp: WeeklyStamp): WeeklyStamp => ({
  ...stamp,
  dayLabel: dayLabelsByDayOfWeek[stamp.dayOfWeek] ?? stamp.dayLabel,
});

export const useGetWeeklyStampsReport = () => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: getWeeklyStampsReportQueryKey(),
    queryFn: getWeeklyStampsReport,
    enabled: !!accessToken,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    select: (response): WeeklyStampsReportResult => ({
      ...response.result,
      totalStudyCount:
        response.result.totalStudyCount ?? response.result.totalStydyCount ?? 0,
      stamps: response.result.stamps.map(normalizeWeeklyStamp),
    }),
  });
};
