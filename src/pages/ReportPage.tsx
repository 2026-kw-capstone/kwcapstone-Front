import { useMemo, useState } from "react";

type Period = "week" | "month";
type Feature = "note" | "basic" | "scenario";

interface TrendPoint {
  label: string;
  accuracy: number;
  delivery: number;
}

interface AccuracyCompare {
  past: number;
  current: number;
}

const trendConfig: Record<Period, TrendPoint[]> = {
  week: [
    { label: "월", accuracy: 65, delivery: 60 },
    { label: "화", accuracy: 78, delivery: 65 },
    { label: "수", accuracy: 72, delivery: 70 },
    { label: "목", accuracy: 85, delivery: 75 },
    { label: "금", accuracy: 80, delivery: 80 },
    { label: "토", accuracy: 88, delivery: 78 },
    { label: "일", accuracy: 84, delivery: 81 },
  ],
  month: [
    { label: "1주차", accuracy: 70, delivery: 65 },
    { label: "2주차", accuracy: 75, delivery: 70 },
    { label: "3주차", accuracy: 80, delivery: 78 },
    { label: "4주차", accuracy: 86, delivery: 82 },
  ],
};

const barDataMap: Record<Feature, Record<Period, AccuracyCompare>> = {
  note: {
    week: { past: 75, current: 88 },
    month: { past: 68, current: 81 },
  },
  basic: {
    week: { past: 60, current: 82 },
    month: { past: 55, current: 76 },
  },
  scenario: {
    week: { past: 70, current: 85 },
    month: { past: 65, current: 80 },
  },
};

const featureLabels: Record<Feature, string> = {
  note: "문장 노트",
  basic: "기초 발성",
  scenario: "시나리오",
};

const weeklySteps = [
  { day: "월", completed: true },
  { day: "화", completed: true },
  { day: "수", completed: false },
  { day: "목", completed: true },
  { day: "금", completed: false },
  { day: "토", completed: true },
  { day: "일", completed: false },
];

const buildLinePath = (values: number[]) => {
  if (values.length === 0) return "";

  return values
    .map((value, index) => {
      const x = values.length === 1 ? 50 : (index * 100) / (values.length - 1);
      const y = 10 + ((100 - value) * 72) / 100;

      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
};

const ReportPage = () => {
  const [trendPeriod, setTrendPeriod] = useState<Period>("week");
  const [barPeriod, setBarPeriod] = useState<Period>("week");
  const [barFeature, setBarFeature] = useState<Feature>("note");

  const curTrend = trendConfig[trendPeriod];
  const curBar = barDataMap[barFeature][barPeriod];
  const trendPaths = useMemo(
    () => ({
      accuracy: buildLinePath(curTrend.map((item) => item.accuracy)),
      delivery: buildLinePath(curTrend.map((item) => item.delivery)),
    }),
    [curTrend]
  );
  return (
    <div className="flex flex-col gap-6 p-5 pb-24 animate-fade-in bg-[#F4F6F9]">
      <div className="mb-1 px-1">
        <h1 className="text-[26px] font-black text-slate-900 leading-tight tracking-tight">
          나의 학습 레포트
        </h1>
        <p className="text-[13.5px] font-medium text-slate-500 mt-1.5">
          지금까지의 성장 기록을 확인해보세요.
        </p>
      </div>

      <div className="rounded-[32px] border border-slate-100 bg-white px-6 py-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <h2 className="mb-5 text-[17px] font-black leading-none text-slate-950">
          이번 주 한 걸음 <span aria-hidden="true">👣</span>
        </h2>

        <div className="grid grid-cols-7 gap-1">
          {weeklySteps.map((step) => (
            <div
              key={step.day}
              className="flex min-h-[80px] min-w-0 flex-col items-center justify-between rounded-[12px] border border-slate-100 bg-[#F7F8FC] px-1.5 py-3"
            >
              <div className="flex h-7 items-center justify-center">
                {step.completed ? (
                  <span className="text-[20px] leading-none" aria-label={`${step.day}요일 완료`}>
                    🌱
                  </span>
                ) : (
                  <span
                    className="h-5 w-5 rounded-full border-2 border-dashed border-slate-300"
                    aria-label={`${step.day}요일 미완료`}
                  />
                )}
              </div>
              <span
                className={`text-[15px] font-extrabold ${
                  step.completed ? "text-slate-900" : "text-slate-400"
                }`}
              >
                {step.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      <section className="bg-white rounded-[32px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[17px] font-extrabold text-slate-900">
            학습 성취도 추이
          </h3>
          <div className="flex bg-[#F4F6F9] p-1 rounded-[14px] w-[96px] relative border border-slate-100">
            <div
              className={`absolute top-1 bottom-1 w-[42px] bg-white rounded-[10px] shadow-sm transition-transform duration-300 ${
                trendPeriod === "month" ? "translate-x-[44px]" : "translate-x-0"
              }`}
            />
            <button
              type="button"
              onClick={() => setTrendPeriod("week")}
              className={`flex-1 text-[12px] font-bold py-1 z-10 ${
                trendPeriod === "week" ? "text-[#278DFD]" : "text-slate-400"
              }`}
            >
              주
            </button>
            <button
              type="button"
              onClick={() => setTrendPeriod("month")}
              className={`flex-1 text-[12px] font-bold py-1 z-10 ${
                trendPeriod === "month" ? "text-[#278DFD]" : "text-slate-400"
              }`}
            >
              월
            </button>
          </div>
        </div>

        <div className="flex gap-2.5 mb-6">
          <span className="px-2.5 py-1.5 bg-blue-50 text-[#278DFD] text-[11px] font-bold rounded-lg flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#278DFD]" />
            발음 정확도
          </span>
          <span className="px-2.5 py-1.5 bg-emerald-50 text-[#10B981] text-[11px] font-bold rounded-lg flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            의미 전달률
          </span>
        </div>

        <div className="h-[180px] w-full relative mb-2">
          <div className="absolute inset-0 flex flex-col justify-between py-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-full border-t border-slate-100/70" />
            ))}
          </div>
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full py-4 overflow-visible"
          >
            <path
              d={trendPaths.accuracy}
              fill="none"
              stroke="#278DFD"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={trendPaths.delivery}
              fill="none"
              stroke="#10B981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="flex justify-between items-center px-1 mt-2">
          {curTrend.map((item) => (
            <span key={item.label} className="text-[11px] font-bold text-slate-400">
              {item.label}
            </span>
          ))}
        </div>

        <div className="text-[12.5px] text-slate-600 font-medium px-4 py-3.5 leading-relaxed mt-5 bg-[#F8F9FD] rounded-[16px] border border-slate-100">
          <span className="text-[#278DFD] font-bold">발음 정확도</span>는 나만의
          문장 노트, 기초 발성 연습, 시나리오 연습에서 측정된 발음 정확도의
          평균값입니다.
          <br />
          <span className="text-[#10B981] font-bold">의미 전달률</span>은 시나리오
          연습 결과를 기반으로 제공됩니다.
        </div>
      </section>

      <section className="bg-white rounded-[32px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-[17px] font-extrabold text-slate-900 mt-1">
            평균 발음 정확도
          </h3>
          <div className="flex bg-[#F4F6F9] p-1 rounded-[14px] w-[96px] relative border border-slate-100">
            <div
              className={`absolute top-1 bottom-1 w-[42px] bg-white rounded-[10px] shadow-sm transition-transform duration-300 ${
                barPeriod === "month" ? "translate-x-[44px]" : "translate-x-0"
              }`}
            />
            <button
              type="button"
              onClick={() => setBarPeriod("week")}
              className={`flex-1 text-[12px] font-bold py-1 z-10 ${
                barPeriod === "week" ? "text-[#278DFD]" : "text-slate-400"
              }`}
            >
              주
            </button>
            <button
              type="button"
              onClick={() => setBarPeriod("month")}
              className={`flex-1 text-[12px] font-bold py-1 z-10 ${
                barPeriod === "month" ? "text-[#278DFD]" : "text-slate-400"
              }`}
            >
              월
            </button>
          </div>
        </div>

        <div className="flex bg-[#F8F9FD] rounded-[16px] p-1.5 mb-8 border border-slate-100">
          {(["note", "basic", "scenario"] as const).map((feature) => (
            <button
              key={feature}
              type="button"
              onClick={() => setBarFeature(feature)}
              className={`flex-1 text-[12.5px] font-bold py-2.5 rounded-[12px] transition-all ${
                barFeature === feature
                  ? "bg-white text-[#278DFD] shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {featureLabels[feature]}
            </button>
          ))}
        </div>

        <div className="relative h-[200px] w-full flex justify-center gap-14 mt-6">
          <div className="absolute inset-0 flex flex-col justify-between z-0 py-2 px-2">
            {[100, 75, 50, 25, 0].map((value) => (
              <div key={value} className="w-full border-t border-slate-100 relative">
                <span className="absolute -left-3 text-[10px] font-bold text-slate-300 -translate-y-1/2">
                  {value}
                </span>
              </div>
            ))}
          </div>

          <div className="relative z-10 flex justify-center items-end gap-14 w-full h-full pb-2">
            <div className="flex flex-col items-center justify-end h-full w-[54px]">
              <span className="text-[14px] font-black text-[#278DFD] mb-2">
                {curBar.past}%
              </span>
              <div
                className="w-full bg-[#278DFD] rounded-t-[14px] transition-all duration-700 shadow-sm"
                style={{ height: `${curBar.past}%` }}
              />
            </div>
            <div className="flex flex-col items-center justify-end h-full w-[54px]">
              <span className="text-[14px] font-black text-[#10B981] mb-2">
                {curBar.current}%
              </span>
              <div
                className="w-full bg-[#10B981] rounded-t-[14px] transition-all duration-700 shadow-sm"
                style={{ height: `${curBar.current}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-14 mt-3 px-2 border-t border-slate-50 pt-4">
          <div className="w-[54px] text-center text-[13px] font-bold text-slate-500">
            {barPeriod === "week" ? "저번 주" : "저번 달"}
          </div>
          <div className="w-[54px] text-center text-[13px] font-bold text-slate-800">
            {barPeriod === "week" ? "이번 주" : "이번 달"}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReportPage;
