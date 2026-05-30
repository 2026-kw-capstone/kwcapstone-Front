import { useState } from "react";
import AchievementTrendSection from "../components/report/AchievementTrendSection";
import PronunciationAccuracySection from "../components/report/PronunciationAccuracySection";
import WeeklyStampsSection from "../components/report/WeeklyStampsSection";
import type { ReportPeriod, ReportPracticeType } from "../types/reportType";

type Period = ReportPeriod;
type Feature = ReportPracticeType;

const ReportPage = () => {
  const [trendPeriod, setTrendPeriod] = useState<Period>("WEEK");
  const [barPeriod, setBarPeriod] = useState<Period>("WEEK");
  const [barFeature, setBarFeature] = useState<Feature>("MY_SENTENCE");

  return (
    <div className="flex flex-col gap-6 bg-[#F4F6F9] p-5 pb-24 animate-fade-in">
      <div className="mb-1 px-1">
        <h1 className="text-[26px] font-black leading-tight tracking-tight text-slate-900">
          나의 학습 레포트
        </h1>
        <p className="mt-1.5 text-[13.5px] font-medium text-slate-500">
          지금까지의 성장 기록을 확인해보세요.
        </p>
      </div>

      <WeeklyStampsSection />
      <AchievementTrendSection
        period={trendPeriod}
        onPeriodChange={setTrendPeriod}
      />
      <PronunciationAccuracySection
        period={barPeriod}
        feature={barFeature}
        onPeriodChange={setBarPeriod}
        onFeatureChange={setBarFeature}
      />
    </div>
  );
};

export default ReportPage;
