import type {
  ReportPeriod,
  ReportPracticeType,
  ResponseGetAchievementTrendReportDto,
  ResponseGetPronunciationAccuracyReportDto,
  ResponseGetWeeklyStampsReportDto,
} from "../types/reportType";
import { axiosInstance } from "./axios";

const REPORT_BASE_URL = "/api/reports";

export const getWeeklyStampsReport =
  async (): Promise<ResponseGetWeeklyStampsReportDto> => {
    const { data } = await axiosInstance.get<ResponseGetWeeklyStampsReportDto>(
      `${REPORT_BASE_URL}/weekly-stamps`
    );
    return data;
  };

export const getAchievementTrendReport = async (
  period: ReportPeriod
): Promise<ResponseGetAchievementTrendReportDto> => {
  const { data } =
    await axiosInstance.get<ResponseGetAchievementTrendReportDto>(
      `${REPORT_BASE_URL}/achievement-trend`,
      {
        params: { period },
      }
    );
  return data;
};

export const getPronunciationAccuracyReport = async ({
  period,
  type,
}: {
  period: ReportPeriod;
  type: ReportPracticeType;
}): Promise<ResponseGetPronunciationAccuracyReportDto> => {
  const { data } =
    await axiosInstance.get<ResponseGetPronunciationAccuracyReportDto>(
      `${REPORT_BASE_URL}/pronunciation-accuracy`,
      {
        params: { period, type },
      }
    );
  return data;
};
