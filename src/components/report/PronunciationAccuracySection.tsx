import { useGetPronunciationAccuracyReport } from "../../hooks/queries/report";
import type { ReportPeriod, ReportPracticeType } from "../../types/reportType";
import ReportSectionError from "./ReportSectionError";

interface PronunciationAccuracySectionProps {
  period: ReportPeriod;
  feature: ReportPracticeType;
  onPeriodChange: (period: ReportPeriod) => void;
  onFeatureChange: (feature: ReportPracticeType) => void;
}

const periodLabels: Record<ReportPeriod, string> = {
  WEEK: "주",
  MONTH: "월",
};

const featureLabels: Record<ReportPracticeType, string> = {
  MY_SENTENCE: "문장 노트",
  BASIC: "기초 발성",
  SCENARIO: "시나리오",
};

const clampScore = (value: number) => Math.min(100, Math.max(0, value));

const formatScore = (score: number | null | undefined) =>
  score === null || score === undefined ? "-" : Math.round(score).toString();

const PronunciationAccuracySection = ({
  period,
  feature,
  onPeriodChange,
  onFeatureChange,
}: PronunciationAccuracySectionProps) => {
  const pronunciationAccuracyQuery = useGetPronunciationAccuracyReport({
    period,
    type: feature,
  });
  const accuracyReport = pronunciationAccuracyQuery.data;
  const isInitialLoading = pronunciationAccuracyQuery.isLoading;
  const isRefreshing =
    pronunciationAccuracyQuery.isFetching && !!pronunciationAccuracyQuery.data;
  const isBarEmpty =
    !pronunciationAccuracyQuery.isLoading &&
    !pronunciationAccuracyQuery.isError &&
    !accuracyReport?.hasCurrentData &&
    !accuracyReport?.hasPreviousData;

  const previousAverage = accuracyReport?.previousAverage ?? null;
  const currentAverage = accuracyReport?.currentAverage ?? null;
  const previousHeight = previousAverage === null ? 0 : clampScore(previousAverage);
  const currentHeight = currentAverage === null ? 0 : clampScore(currentAverage);

  return (
    <section className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
      <div className="mb-6 flex items-start justify-between">
        <h3 className="mt-1 text-[17px] font-extrabold text-slate-900">
          평균 발음 정확도
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

      <div className="mb-8 flex rounded-[16px] border border-slate-100 bg-[#F8F9FD] p-1.5">
        {(["MY_SENTENCE", "BASIC", "SCENARIO"] as const).map((nextFeature) => (
          <button
            key={nextFeature}
            type="button"
            onClick={() => onFeatureChange(nextFeature)}
            className={`flex-1 rounded-[12px] py-2.5 text-[12.5px] font-bold transition-all ${
              feature === nextFeature
                ? "bg-white text-[#278DFD] shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {featureLabels[nextFeature]}
          </button>
        ))}
      </div>

      {pronunciationAccuracyQuery.isError ? (
        <div className="mb-4">
          <ReportSectionError
            onRetry={() => void pronunciationAccuracyQuery.refetch()}
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
        <div className="relative mt-6 flex h-[200px] w-full justify-center gap-14">
          <div className="absolute inset-0 z-0 flex flex-col justify-between px-2 py-2">
            {[100, 75, 50, 25, 0].map((value) => (
              <div key={value} className="relative w-full border-t border-slate-100">
                <span className="absolute -left-3 -translate-y-1/2 text-[10px] font-bold text-slate-300">
                  {value}
                </span>
              </div>
            ))}
          </div>

          {isBarEmpty ? (
            <div className="absolute inset-0 z-20 flex items-center justify-center text-[13px] font-bold text-slate-400">
              아직 분석한 결과가 없어요.
            </div>
          ) : null}

          <div className="relative z-10 flex h-full w-full items-end justify-center gap-14 pb-2">
            <div className="flex h-full w-[54px] flex-col items-center justify-end">
              <span className="mb-2 text-[14px] font-black text-[#278DFD]">
                {formatScore(previousAverage)}
                {previousAverage === null ? "" : "%"}
              </span>
              <div
                className={`w-full rounded-t-[14px] shadow-sm transition-all duration-700 ${
                  previousAverage === null ? "bg-slate-200" : "bg-[#278DFD]"
                }`}
                style={{ height: `${previousHeight}%` }}
              />
            </div>
            <div className="flex h-full w-[54px] flex-col items-center justify-end">
              <span className="mb-2 text-[14px] font-black text-[#10B981]">
                {formatScore(currentAverage)}
                {currentAverage === null ? "" : "%"}
              </span>
              <div
                className={`w-full rounded-t-[14px] shadow-sm transition-all duration-700 ${
                  currentAverage === null ? "bg-slate-200" : "bg-[#10B981]"
                }`}
                style={{ height: `${currentHeight}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-3 flex justify-center gap-14 border-t border-slate-50 px-2 pt-4">
          <div className="w-[54px] text-center text-[13px] font-bold text-slate-500">
            {period === "WEEK" ? "저번 주" : "저번 달"}
          </div>
          <div className="w-[54px] text-center text-[13px] font-bold text-slate-800">
            {period === "WEEK" ? "이번 주" : "이번 달"}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PronunciationAccuracySection;
