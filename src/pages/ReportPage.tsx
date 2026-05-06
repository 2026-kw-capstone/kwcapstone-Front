import { useState } from "react";
import { BarChart, Target, TrendingUp, Trophy } from "lucide-react";

const WEEKLY_CHART_DATA = [
  { label: "월", value: 30 },
  { label: "화", value: 60 },
  { label: "수", value: 15 },
  { label: "목", value: 75 },
  { label: "금", value: 45 },
  { label: "토", value: 0 },
  { label: "일", value: 90, highlight: true },
];

const MONTHLY_CHART_DATA = [
  { label: "1주차", value: 50 },
  { label: "2주차", value: 85 },
  { label: "3주차", value: 40 },
  { label: "4주차", value: 95, highlight: true },
];

const TYPE_SCORE_DATA = [
  { label: "일상 대화", score: 92, colorClassName: "bg-emerald-400" },
  { label: "여행/식당", score: 85, colorClassName: "bg-[#278DFD]" },
  { label: "의료/병원", score: 76, colorClassName: "bg-indigo-400" },
];

const ReportPage = () => {
  const [chartView, setChartView] = useState<"weekly" | "monthly">("weekly");
  const chartData = chartView === "weekly" ? WEEKLY_CHART_DATA : MONTHLY_CHART_DATA;

  return (
    <div className="flex min-h-full flex-col gap-6 bg-[#F4F6F8] p-5 pb-24 animate-fade-in">
      <div className="mb-2 px-1">
        <h1 className="text-[24px] font-extrabold leading-tight text-slate-900">
          나의 학습 레포트
        </h1>
        <p className="mt-1 text-[14px] font-medium text-slate-500">
          상세한 훈련 통계를 확인하세요
        </p>
      </div>

      <section className="rounded-[24px] border border-slate-50 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp size={22} className="text-[#278DFD]" />
          <h2 className="text-[17px] font-extrabold text-slate-900">
            말하기 능력 종합 점수
          </h2>
        </div>
        <p className="mb-6 inline-block rounded-lg bg-slate-50 px-3 py-1.5 text-[12px] font-medium text-slate-400">
          * 발음 정확도, 속도, 침묵비율, 의미전달률 가중 합산
        </p>

        <div className="relative flex h-[140px] w-full flex-col justify-end overflow-hidden rounded-[20px] border border-slate-100 bg-[#F8F9FD] px-3 pb-3 pt-6">
          <svg viewBox="0 0 100 50" className="h-full w-full overflow-visible">
            <line
              x1="0"
              y1="10"
              x2="100"
              y2="10"
              stroke="#E2E8F0"
              strokeWidth="0.5"
              strokeDasharray="2 2"
            />
            <line
              x1="0"
              y1="30"
              x2="100"
              y2="30"
              stroke="#E2E8F0"
              strokeWidth="0.5"
              strokeDasharray="2 2"
            />
            <path
              d="M 5,40 L 25,35 L 45,20 L 65,25 L 85,15 L 95,5"
              fill="none"
              stroke="#278DFD"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {[
              [5, 40],
              [25, 35],
              [45, 20],
              [65, 25],
              [85, 15],
            ].map(([cx, cy], index) => (
              <circle
                key={`score-point-${index}`}
                cx={cx}
                cy={cy}
                r="2.5"
                fill="#278DFD"
                stroke="white"
                strokeWidth="1"
              />
            ))}
            <circle
              cx="95"
              cy="5"
              r="3.5"
              fill="#10B981"
              stroke="white"
              strokeWidth="1.5"
            />
          </svg>
          <div className="absolute right-4 top-3 flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[11px] font-extrabold text-emerald-600 shadow-sm">
            <Trophy size={12} />
            92점 (최고)
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border border-slate-50 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart size={22} className="text-indigo-500" />
            <h2 className="text-[17px] font-extrabold text-slate-900">
              훈련 횟수 추이
            </h2>
          </div>
          <select
            value={chartView}
            onChange={(event) =>
              setChartView(event.target.value as "weekly" | "monthly")
            }
            className="rounded-[10px] border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[13px] font-bold text-slate-600 outline-none"
          >
            <option value="weekly">주간 보기</option>
            <option value="monthly">월간 보기</option>
          </select>
        </div>

        <div className="mb-2 flex h-[120px] items-end justify-between gap-2 px-2">
          {chartData.map((item) => (
            <div
              key={`${chartView}-${item.label}`}
              className="group flex h-full flex-1 flex-col items-center justify-end gap-2.5"
            >
              <div
                className={`w-full rounded-[6px] transition-all duration-300 ease-in-out ${
                  item.highlight
                    ? "bg-[#278DFD] shadow-[0_4px_10px_rgba(39,141,253,0.3)]"
                    : "bg-slate-200 group-hover:bg-slate-300"
                }`}
                style={{
                  height: `${item.value}%`,
                  minHeight: item.value === 0 ? "4px" : "0",
                }}
              />
              <span
                className={`text-[12px] ${
                  item.highlight
                    ? "font-black text-[#278DFD]"
                    : "font-medium text-slate-500"
                }`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-slate-50 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="mb-6 flex items-center gap-2">
          <Target size={22} className="text-emerald-500" />
          <h2 className="text-[17px] font-extrabold text-slate-900">
            유형별 평균 점수
          </h2>
        </div>

        <div className="flex flex-col gap-5">
          {TYPE_SCORE_DATA.map((type) => (
            <div key={type.label}>
              <div className="mb-2 flex justify-between text-[14px]">
                <span className="font-extrabold text-slate-700">
                  {type.label}
                </span>
                <span className="font-black text-slate-900">
                  {type.score}
                  <span className="ml-0.5 text-[12px] font-bold text-slate-400">
                    점
                  </span>
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${type.colorClassName}`}
                  style={{ width: `${type.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ReportPage;
