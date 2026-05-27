import { useQuery } from "@tanstack/react-query";
import { getPronunciationAccuracyReport } from "../../../apis/report";
import { useAuth } from "../../../contexts/AuthContext";
import type {
  ReportPeriod,
  ReportPracticeType,
} from "../../../types/reportType";
import { getPronunciationAccuracyReportQueryKey } from "./reportQueryKeys";

export const useGetPronunciationAccuracyReport = ({
  period,
  type,
}: {
  period: ReportPeriod;
  type: ReportPracticeType;
}) => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: getPronunciationAccuracyReportQueryKey({ period, type }),
    queryFn: () => getPronunciationAccuracyReport({ period, type }),
    enabled: !!accessToken,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    select: (response) => response.result,
  });
};
