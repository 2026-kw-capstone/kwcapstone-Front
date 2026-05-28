import { useMemo } from "react";
import { useGetAchievementTrendReport } from "../../hooks/queries/report";
import type { AchievementTrendPoint, ReportPeriod } from "../../types/reportType";
import ReportSectionError from "./ReportSectionError";

interface ChartPoint {
  x: number;
  y: number;
}

interface AchievementTrendSectionProps {
  period: ReportPeriod;
  onPeriodChange: (period: ReportPeriod) => void;
}

const CHART_X_PADDING = 6;

const periodLabels: Record<ReportPeriod, string> = {
  WEEK: "주",
  MONTH: "월",
};

const fallbackTrendPoints: Record<ReportPeriod, AchievementTrendPoint[]> = {
  WEEK: ["월", "화", "수", "목", "금", "토", "일"].map((label, index) => ({
    label,
    startDate: "",
    endDate: "",
    pronunciationAccuracy: [65, 78, 72, 85, 80, 88, 84][index],
    meaningDeliveryRate: [60, 65, 70, 75, 80, 78, 81][index],
    hasPronunciationData: true,
    hasMeaningDeliveryData: true,
  })),
  MONTH: ["1주차", "2주차", "3주차", "4주차"].map((label, index) => ({
    label,
    startDate: "",
    endDate: "",
    pronunciationAccuracy: [70, 75, 80, 86][index],
    meaningDeliveryRate: [65, 70, 78, 82][index],
    hasPronunciationData: true,
    hasMeaningDeliveryData: true,
  })),
};

const clampScore = (value: number) => Math.min(100, Math.max(0, value));

const getChartPoint = (
  value: number,
  index: number,
  totalCount: number
): ChartPoint => {
  const drawableWidth = 100 - CHART_X_PADDING * 2;
  const x =
    totalCount === 1
      ? 50
      : CHART_X_PADDING + (index * drawableWidth) / (totalCount - 1);
  const y = 10 + ((100 - clampScore(value)) * 72) / 100;

  return { x, y };
};

const buildLineSegments = (values: Array<number | null>) => {
  const segment: string[] = [];

  values.forEach((value, index) => {
    if (value === null) {
      return;
    }

    const point = getChartPoint(value, index, values.length);
    const command = segment.length === 0 ? "M" : "L";
    segment.push(`${command} ${point.x} ${point.y}`);
  });

  return segment.length > 0 ? [segment.join(" ")] : [];
};

const getChartPoints = (values: Array<number | null>) =>
  values.flatMap((value, index) =>
    value === null ? [] : [getChartPoint(value, index, values.length)]
  );

const getValidPointCount = (values: Array<number | null>) =>
  values.filter((value) => value !== null).length;

const hasAnyTrendData = (points: AchievementTrendPoint[]) =>
  points.some(
    (point) =>
      point.pronunciationAccuracy !== null || point.meaningDeliveryRate !== null
  );

const AchievementTrendSection = ({
  period,
  onPeriodChange,
}: AchievementTrendSectionProps) => {
  const achievementTrendQuery = useGetAchievementTrendReport(period);
  const trendPoints =
    achievementTrendQuery.data?.points ?? fallbackTrendPoints[period];
  const isInitialLoading = achievementTrendQuery.isLoading;
  const isRefreshing =
    achievementTrendQuery.isFetching && !!achievementTrendQuery.data;
  const isTrendEmpty =
    !achievementTrendQuery.isLoading &&
    !achievementTrendQuery.isError &&
    !hasAnyTrendData(trendPoints);

  const trendChart = useMemo(() => {
    const accuracyValues = trendPoints.map((item) => item.pronunciationAccuracy);
    const deliveryValues = trendPoints.map((item) => item.meaningDeliveryRate);

    return {
      accuracyPaths: buildLineSegments(accuracyValues),
      deliveryPaths: buildLineSegments(deliveryValues),
      accuracyPoints: getChartPoints(accuracyValues),
      deliveryPoints: getChartPoints(deliveryValues),
      shouldShowAccuracyLine: getValidPointCount(accuracyValues) > 1,
      shouldShowDeliveryLine: getValidPointCount(deliveryValues) > 1,
    };
  }, [trendPoints]);

  return (
    <section className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-[17px] font-extrabold text-slate-900">
          학습 성취도 추이
        </h3>
        <div className="relative flex w-[96px] rounded-[14px] border border-slate-100 bg-[#F4F6F9] p-1">
          <div
            className={`absolute bottom-1 top-1 w-[42px] rounded-[10px] bg-white shadow-sm transition-transform duration-300 ${
              period === "MONTH" ? "translate-x-[44px]" : "translate-x-0"
            }`}
          />
          {(["WEEK", "MONTH"] as const).map((nextPeriod) => (
            <button
              key={nextPeriod}
              type="button"
              onClick={() => onPeriodChange(nextPeriod)}
              className={`z-10 flex-1 py-1 text-[12px] font-bold ${
                period === nextPeriod ? "text-[#278DFD]" : "text-slate-400"
              }`}
            >
              {periodLabels[nextPeriod]}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2.5">
        <span className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1.5 text-[11px] font-bold text-[#278DFD]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#278DFD]" />
          발음 정확도
        </span>
        <span className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[11px] font-bold text-[#10B981]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
          의미 전달률
        </span>
      </div>

      {achievementTrendQuery.isError ? (
        <div className="mb-4">
          <ReportSectionError
            onRetry={() => void achievementTrendQuery.refetch()}
          />
        </div>
      ) : null}

      <div
        className={`transition-all ${
          isInitialLoading
            ? "pointer-events-none opacity-40 blur-[1px]"
            : isRefreshing
              ? "opacity-70"
              : ""
        }`}
      >
        <div className="relative mb-2 h-[180px] w-full">
          <div className="absolute inset-0 flex flex-col justify-between py-2">
            {[100, 75, 50, 25, 0].map((value) => (
              <div
                key={value}
                className="relative w-full border-t border-slate-100/70"
              >
                <span className="absolute -left-1 -translate-y-1/2 text-[10px] font-bold text-slate-300">
                  {value}
                </span>
              </div>
            ))}
          </div>
          {isTrendEmpty ? (
            <div className="absolute inset-0 flex items-center justify-center text-[13px] font-bold text-slate-400">
              아직 분석한 결과가 없어요.
            </div>
          ) : (
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full overflow-visible py-4"
            >
              {trendChart.shouldShowAccuracyLine
                ? trendChart.accuracyPaths.map((path) => (
                    <path
                      key={`accuracy-${path}`}
                      d={path}
                      fill="none"
                      stroke="#278DFD"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  ))
                : null}
              {trendChart.shouldShowDeliveryLine
                ? trendChart.deliveryPaths.map((path) => (
                    <path
                      key={`delivery-${path}`}
                      d={path}
                      fill="none"
                      stroke="#10B981"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  ))
                : null}
              {trendChart.accuracyPoints.map((point) => (
                <circle
                  key={`accuracy-point-${point.x}-${point.y}`}
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill="#278DFD"
                />
              ))}
              {trendChart.deliveryPoints.map((point) => (
                <circle
                  key={`delivery-point-${point.x}-${point.y}`}
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill="#10B981"
                />
              ))}
            </svg>
          )}
        </div>
        <div className="mt-2 flex items-center justify-between px-1">
          {trendPoints.map((item) => (
            <span
              key={`${item.label}-${item.startDate}`}
              className="text-[11px] font-bold text-slate-400"
            >
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-[16px] border border-slate-100 bg-[#F8F9FD] px-4 py-3.5 text-[12.5px] font-medium leading-relaxed text-slate-600">
        <span className="font-bold text-[#278DFD]">발음 정확도</span>는 문장
        노트, 기초 발성, 시나리오 연습의 평균값입니다.
        <br />
        <span className="font-bold text-[#10B981]">의미 전달률</span>은
        시나리오 연습 결과를 기반으로 제공됩니다.
      </div>
    </section>
  );
};

export default AchievementTrendSection;
