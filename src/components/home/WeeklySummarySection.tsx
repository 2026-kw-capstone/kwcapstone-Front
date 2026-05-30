import { BarChart2, Minus, TrendingUp, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useGetWeeklySummary } from "../../hooks/queries/home";
import type { WeeklySummaryResult } from "../../types/homeType";
import HomeSectionError from "./HomeSectionError";
import LockedSection from "./LockedSection";

const fallbackWeeklySummary: WeeklySummaryResult = {
  weeklyTrainingCount: 12,
  isIncreasedFromLastWeek: true,
  averagePronunciationScore: 84,
  averageMeaningDeliveryScore: 78,
};

const WeeklySummarySection = () => {
  const { isLoggedIn } = useAuth();
  const weeklySummaryQuery = useGetWeeklySummary();
  const summary =
    isLoggedIn && weeklySummaryQuery.data
      ? weeklySummaryQuery.data
      : fallbackWeeklySummary;
  const isInitialLoading = isLoggedIn && weeklySummaryQuery.isLoading;
  const isRefreshing =
    isLoggedIn && weeklySummaryQuery.isFetching && !!weeklySummaryQuery.data;
  const TrendIcon = summary.isIncreasedFromLastWeek ? TrendingUp : Minus;

  return (
    <section>
      <div className="mb-3 flex items-center justify-between px-1">
        <h3 className="flex items-center gap-2 text-[16px] font-extrabold text-slate-900">
          <BarChart2 size={18} className="text-indigo-500" />
          이번 주 요약
        </h3>
        <Link
          to="/report"
          className="text-[13px] font-bold text-slate-400 transition-colors hover:text-[#278DFD]"
        >
          전체보기
        </Link>
      </div>

      <LockedSection message="로그인하면 이번 주 학습 기록을 볼 수 있어요">
        {weeklySummaryQuery.isError ? (
          <HomeSectionError
            message="이번 주 요약을 불러오지 못했어요."
            onRetry={() => void weeklySummaryQuery.refetch()}
          />
        ) : (
          <div
            className={`relative overflow-hidden rounded-[24px] bg-slate-800 p-6 shadow-xl shadow-slate-200/50 transition-all ${
              isInitialLoading
                ? "pointer-events-none opacity-40 blur-[1px]"
                : isRefreshing
                  ? "opacity-80"
                  : ""
            }`}
          >
            <div className="relative z-10 mb-6 flex items-end justify-between">
              <div>
                <p className="mb-1 text-[13px] font-medium text-slate-400">
                  이번 주 훈련 수
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-[32px] font-black leading-none text-white">
                    {summary.weeklyTrainingCount}
                  </span>
                  <span className="text-[14px] font-bold text-slate-400">회</span>
                </div>
              </div>
              <div className="rounded-full border border-white/5 bg-white/10 px-3 py-1.5 backdrop-blur-md">
                <span
                  className={`flex items-center gap-1 text-[12px] font-bold ${
                    summary.isIncreasedFromLastWeek
                      ? "text-emerald-400"
                      : "text-slate-300"
                  }`}
                >
                  <TrendIcon size={14} strokeWidth={2.5} />
                  {summary.isIncreasedFromLastWeek
                    ? "지난주 대비 상승"
                    : "지난주 대비 증가 없음"}
                </span>
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-3">
              <div className="rounded-[16px] border border-white/5 bg-white/10 p-3.5 text-center backdrop-blur-sm">
                <p className="mb-1 text-[11px] font-medium text-slate-300">
                  평균 발음 정확도
                </p>
                <p className="text-[20px] font-extrabold text-white">
                  {summary.averagePronunciationScore}
                  <span className="ml-0.5 text-[12px] text-slate-400">%</span>
                </p>
              </div>
              <div className="rounded-[16px] border border-white/5 bg-white/10 p-3.5 text-center backdrop-blur-sm">
                <p className="mb-1 text-[11px] font-medium text-slate-300">
                  의미 전달률
                </p>
                <p className="text-[20px] font-extrabold text-white">
                  {summary.averageMeaningDeliveryScore}
                  <span className="ml-0.5 text-[12px] text-slate-400">%</span>
                </p>
              </div>
            </div>

            <Zap
              size={120}
              className="absolute -right-6 -top-6 rotate-12 text-white/5"
            />
          </div>
        )}
      </LockedSection>
    </section>
  );
};

export default WeeklySummarySection;
