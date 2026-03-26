import { Check, Sparkles } from "lucide-react";

interface PracticeSummaryPanelProps {
  averageAccuracy: number;
  averageFluency: number;
  onRestart: () => void;
  onBackToLevel: () => void;
}

const PracticeSummaryPanel = ({
  averageAccuracy,
  averageFluency,
  onRestart,
  onBackToLevel,
}: PracticeSummaryPanelProps) => {
  return (
    <section className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">
        <Check size={16} />
        3단계 연습 완료
      </div>

      <h2 className="text-[30px] font-extrabold tracking-tight text-slate-900">최종 분석 결과</h2>
      <p className="mt-2 text-sm text-slate-500">이번 연습의 전체 결과와 종합 피드백입니다.</p>

      <div className="mt-5 grid grid-cols-1 gap-3">
        <div className="rounded-2xl bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-500">평균 정확도</p>
          <p className="mt-1 text-5xl font-extrabold text-blue-500">{averageAccuracy}%</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-500">평균 유창성</p>
          <p className="mt-1 text-5xl font-extrabold text-amber-500">{averageFluency}%</p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-700">종합 피드백</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {averageAccuracy >= 90
            ? "발음 정확도가 매우 좋습니다. 질문 문장의 억양을 조금 더 자연스럽게 주면 실전 전달력이 더 좋아질 수 있어요."
            : "전달 의도는 좋습니다. 문장 첫 음절을 조금 더 또렷하게 발화해보세요."}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <button
          type="button"
          onClick={onRestart}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          같은 단계 다시 연습
        </button>
        <button
          type="button"
          onClick={onBackToLevel}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
        >
          레벨 선택으로
          <Sparkles size={16} />
        </button>
      </div>
    </section>
  );
};

export default PracticeSummaryPanel;
