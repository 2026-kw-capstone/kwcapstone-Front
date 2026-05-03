const PRONUNCIATION_LEVELS = [24, 38, 52, 46, 64, 72, 76];

const REPORT_POINTS = [
  { label: "4.18", pronunciation: 68, communication: 45 },
  { label: "4.19", pronunciation: 79, communication: 55 },
  { label: "4.20", pronunciation: 84, communication: 61 },
  { label: "4.21", pronunciation: 95, communication: 68 },
  { label: "4.22", pronunciation: 90, communication: 71 },
  { label: "4.23", pronunciation: 92, communication: 78 },
];

const chartWidth = 720;
const chartHeight = 300;
const chartPadding = 38;

const getPointY = (value: number) => {
  const chartAreaHeight = chartHeight - chartPadding * 2;
  return chartHeight - chartPadding - (value / 100) * chartAreaHeight;
};

const buildLinePath = (values: number[]) => {
  const step = (chartWidth - chartPadding * 2) / (values.length - 1);

  return values
    .map((value, index) => {
      const x = chartPadding + step * index;
      const y = getPointY(value);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
};

const pronunciationPath = buildLinePath(
  REPORT_POINTS.map((point) => point.pronunciation)
);
const communicationPath = buildLinePath(
  REPORT_POINTS.map((point) => point.communication)
);

const ReportPage = () => {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-5 pb-6">
      <section>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">레포트</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          사용자의 연습 결과를 분석해 성장 흐름을 보여드려요.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4">
        <article className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold tracking-wide text-slate-400">평균 정확도</p>
          <p className="mt-2 text-4xl font-black leading-none text-emerald-500">82.4%</p>

          <div className="mt-7 grid h-28 grid-cols-7 items-end gap-2">
            {PRONUNCIATION_LEVELS.map((level, index) => (
              <div
                key={`pronunciation-level-${index}`}
                className="relative h-full overflow-hidden rounded-xl bg-emerald-100/60"
              >
                <div
                  className="absolute inset-x-0 bottom-0 rounded-xl bg-gradient-to-t from-emerald-500 to-emerald-400"
                  style={{ height: `${level}%` }}
                />
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold tracking-wide text-slate-400">의사소통 지수 (MTSR)</p>
          <p className="mt-2 text-4xl font-black leading-none text-blue-500">76%</p>

          <div className="mt-7 rounded-2xl bg-slate-50 px-5 py-4 text-slate-600">
            <p className="text-xs font-semibold text-slate-500">MTSR 계산식</p>
            <p className="mt-2 text-[13px] leading-6">
              MTSR = (발화 성공 횟수 N_s / 전체 시나리오 횟수 N_t) × 100
            </p>
          </div>
        </article>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-5 flex flex-col gap-3">
          <h2 className="text-xl font-bold text-slate-900">일별 추이</h2>
          <button
            type="button"
            className="w-fit rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600"
          >
            일별 추이 | 2024.04.18
          </button>
        </div>

        <div className="overflow-x-auto pb-1">
          <div className="min-w-[540px]">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="h-[240px] w-full"
              role="img"
              aria-label="발성 정확도와 의사소통 성공 지수의 일별 추이 그래프"
            >
              {[25, 50, 75, 100].map((value) => (
                <g key={`grid-${value}`}>
                  <line
                    x1={chartPadding}
                    x2={chartWidth - chartPadding}
                    y1={getPointY(value)}
                    y2={getPointY(value)}
                    stroke="#E2E8F0"
                    strokeDasharray="5 6"
                  />
                  <text
                    x={12}
                    y={getPointY(value) + 5}
                    fontSize="12"
                    fill="#64748B"
                    className="font-medium"
                  >
                    {value}%
                  </text>
                </g>
              ))}

              {REPORT_POINTS.map((point, index) => {
                const step = (chartWidth - chartPadding * 2) / (REPORT_POINTS.length - 1);
                const x = chartPadding + step * index;

                return (
                  <g key={`label-${point.label}`}>
                    <line
                      x1={x}
                      x2={x}
                      y1={chartPadding}
                      y2={chartHeight - chartPadding}
                      stroke="#F1F5F9"
                    />
                    <text
                      x={x}
                      y={chartHeight - 8}
                      textAnchor="middle"
                      fontSize="12"
                      fill="#64748B"
                      className="font-medium"
                    >
                      {point.label}
                    </text>
                  </g>
                );
              })}

              <path
                d={pronunciationPath}
                fill="none"
                stroke="#7EA8F8"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={communicationPath}
                fill="none"
                stroke="#F2A35A"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {REPORT_POINTS.map((point, index) => {
                const step = (chartWidth - chartPadding * 2) / (REPORT_POINTS.length - 1);
                const x = chartPadding + step * index;
                const pronunciationY = getPointY(point.pronunciation);
                const communicationY = getPointY(point.communication);

                return (
                  <g key={`marker-${point.label}`}>
                    <circle cx={x} cy={pronunciationY} r="6" fill="white" stroke="#7EA8F8" strokeWidth="3" />
                    <circle cx={x} cy={communicationY} r="6" fill="white" stroke="#F2A35A" strokeWidth="3" />
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-5 text-sm font-semibold text-slate-700">
          <p className="inline-flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-full bg-[#7EA8F8]" />
            발성 정확도
          </p>
          <p className="inline-flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-full bg-[#F2A35A]" />
            의사소통 성공 지수
          </p>
        </div>
      </section>
    </div>
  );
};

export default ReportPage;
