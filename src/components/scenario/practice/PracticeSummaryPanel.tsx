import { Trophy } from "lucide-react";

interface PracticeSummaryPanelProps {
  averageAccuracy: number;
  averageFluency: number;
  onBackToLevel: () => void;
}

const PracticeSummaryPanel = ({
  averageAccuracy,
  averageFluency,
  onBackToLevel,
}: PracticeSummaryPanelProps) => {
  return (
    <section className="w-full max-w-[340px]">
      <div className="flex flex-col items-center text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <Trophy size={28} />
        </div>

        <h2 className="mt-4 text-xl font-extrabold leading-tight tracking-tight text-slate-900">
          모든 단계를 완료했어요!
        </h2>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2.5">
        <div className="rounded-2xl bg-gray-100 p-4 text-center">
          <p className="text-xs font-semibold text-slate-500">평균 정확도</p>
          <p className="mt-1.5 text-2xl font-extrabold text-emerald-600">{averageAccuracy}%</p>
        </div>
        <div className="rounded-2xl bg-gray-100 p-4 text-center">
          <p className="text-xs font-semibold text-slate-500">평균 유창성</p>
          <p className="mt-1.5 text-2xl font-extrabold text-teal-600">{averageFluency}%</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onBackToLevel}
        className="mt-5 w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-white shadow-md shadow-emerald-100 transition hover:brightness-105"
      >
        종료하기
      </button>
    </section>
  );
};

export default PracticeSummaryPanel;
