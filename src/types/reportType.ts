export type ReportPeriod = "WEEK" | "MONTH";

export type ReportPracticeType = "MY_SENTENCE" | "BASIC" | "SCENARIO";

export interface ApiResponseDto<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export interface WeeklyStamp {
  date: string;
  dayOfWeek: string;
  dayLabel: string;
  hasStudy: boolean;
  studyCount: number;
  completedTypes: ReportPracticeType[];
}

export interface WeeklyStampsReportResultRaw {
  weekStartDate: string;
  weekEndDate: string;
  totalStudyDays: number;
  totalStudyCount?: number;
  totalStydyCount?: number;
  stamps: WeeklyStamp[];
}

export interface WeeklyStampsReportResult {
  weekStartDate: string;
  weekEndDate: string;
  totalStudyDays: number;
  totalStudyCount: number;
  stamps: WeeklyStamp[];
}

export interface AchievementTrendPoint {
  label: string;
  startDate: string;
  endDate: string;
  pronunciationAccuracy: number | null;
  meaningDeliveryRate: number | null;
  hasPronunciationData: boolean;
  hasMeaningDeliveryData: boolean;
}

export interface AchievementTrendReportResult {
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  points: AchievementTrendPoint[];
}

export interface ReportDateRange {
  startDate: string;
  endDate: string;
}

export interface PronunciationAccuracyReportResult {
  period: ReportPeriod;
  type: ReportPracticeType;
  typeLabel: string;
  currentAverage: number | null;
  previousAverage: number | null;
  diff: number | null;
  currentLabel: string;
  previousLabel: string;
  hasCurrentData: boolean;
  hasPreviousData: boolean;
  currentRange: ReportDateRange;
  previousRange: ReportDateRange;
}

export type ResponseGetWeeklyStampsReportDto =
  ApiResponseDto<WeeklyStampsReportResultRaw>;

export type ResponseGetAchievementTrendReportDto =
  ApiResponseDto<AchievementTrendReportResult>;

export type ResponseGetPronunciationAccuracyReportDto =
  ApiResponseDto<PronunciationAccuracyReportResult>;
