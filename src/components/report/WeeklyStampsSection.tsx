import { useGetWeeklyStampsReport } from "../../hooks/queries/report";
import type { WeeklyStamp } from "../../types/reportType";
import ReportSectionError from "./ReportSectionError";

const fallbackWeeklyStamps: WeeklyStamp[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
].map((dayOfWeek, index) => ({
  date: "",
  dayOfWeek,
  dayLabel: ["월", "화", "수", "목", "금", "토", "일"][index],
  hasStudy: index === 0 || index === 1 || index === 3 || index === 5,
  studyCount: index === 0 || index === 1 || index === 3 || index === 5 ? 1 : 0,
  completedTypes: [],
}));

const WeeklyStampsSection = () => {
  const weeklyStampsQuery = useGetWeeklyStampsReport();
  const stamps = weeklyStampsQuery.data?.stamps ?? fallbackWeeklyStamps;
  const isInitialLoading = weeklyStampsQuery.isLoading;
  const isRefreshing = weeklyStampsQuery.isFetching && !!weeklyStampsQuery.data;

  return (
    <section className="rounded-[32px] border border-slate-100 bg-white px-6 py-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[17px] font-black leading-none text-slate-950">
          이번 주 한 걸음 👣
        </h2>
      </div>

      {weeklyStampsQuery.isError ? (
        <div className="mb-4">
          <ReportSectionError
            onRetry={() => void weeklyStampsQuery.refetch()}
          />
        </div>
      ) : null}

      <div
        className={`grid grid-cols-7 gap-1 transition-all ${
          isInitialLoading
            ? "pointer-events-none opacity-40 blur-[1px]"
            : isRefreshing
              ? "opacity-70"
              : ""
        }`}
      >
        {stamps.map((stamp) => (
          <div
            key={`${stamp.dayOfWeek}-${stamp.date}`}
            className="flex min-h-[80px] min-w-0 flex-col items-center justify-between rounded-[12px] border border-slate-100 bg-[#F7F8FC] px-1.5 py-3"
            title={stamp.hasStudy ? `${stamp.studyCount}회 학습` : "학습 기록 없음"}
          >
            <div className="flex h-7 items-center justify-center">
              {stamp.hasStudy ? (
                <span
                  className="text-[20px] leading-none"
                  aria-label={`${stamp.dayLabel}요일 완료`}
                >
                  🌱
                </span>
              ) : (
                <span
                  className="h-5 w-5 rounded-full border-2 border-dashed border-slate-300"
                  aria-label={`${stamp.dayLabel}요일 미완료`}
                />
              )}
            </div>
            <span
              className={`text-[15px] font-extrabold ${
                stamp.hasStudy ? "text-slate-900" : "text-slate-400"
              }`}
            >
              {stamp.dayLabel}
            </span>
          </div>
        ))}
      </div>

      {!weeklyStampsQuery.isLoading &&
      !weeklyStampsQuery.isError &&
      stamps.every((stamp) => !stamp.hasStudy) ? (
        <p className="mt-4 rounded-[14px] bg-[#F8F9FD] px-4 py-3 text-center text-[12.5px] font-bold text-slate-400">
          이번 주 학습 기록이 아직 없어요.
        </p>
      ) : null}
    </section>
  );
};

export default WeeklyStampsSection;
