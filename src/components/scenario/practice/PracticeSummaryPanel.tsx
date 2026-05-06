import { Trophy } from "lucide-react";

interface PracticeSummaryPanelProps {
  averageAccuracy: number;
  averageSemanticRate: number;
  onBackToList: () => void;
}

const PracticeSummaryPanel = ({
  averageAccuracy,
  averageSemanticRate,
  onBackToList,
}: PracticeSummaryPanelProps) => {
  return (
    <section className="flex min-h-full w-full flex-col items-center justify-center rounded-[28px] bg-white p-6 text-center animate-fade-in">
      <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-[32px] bg-gradient-to-br from-[#278DFD] to-blue-400 text-white shadow-[0_8px_30px_rgba(39,141,253,0.3)]">
        <Trophy size={48} strokeWidth={2} />
      </div>

      <h2 className="mb-8 text-[28px] font-black leading-tight text-slate-900">
        시나리오 훈련
        <br />
        완료!
      </h2>

      <div className="mb-10 grid w-full grid-cols-2 gap-3">
        <div className="rounded-[18px] border border-blue-100 bg-blue-50 p-4 text-center">
          <p className="text-[12px] font-bold text-blue-500">평균 발음 정확도</p>
          <p className="mt-1.5 text-[26px] font-black text-[#278DFD]">
            {averageAccuracy}
            <span className="ml-0.5 text-[14px] font-bold">%</span>
          </p>
        </div>
        <div className="rounded-[18px] border border-slate-100 bg-[#F8F9FD] p-4 text-center">
          <p className="text-[12px] font-bold text-slate-500">평균 의미 전달률</p>
          <p className="mt-1.5 text-[26px] font-black text-emerald-500">
            {averageSemanticRate}
            <span className="ml-0.5 text-[14px] font-bold">%</span>
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onBackToList}
        className="h-[60px] w-full rounded-[20px] bg-[#278DFD] text-[17px] font-bold text-white shadow-lg shadow-blue-100 transition-all active:scale-95"
      >
        목록으로 돌아가기
      </button>
    </section>
  );
};

export default PracticeSummaryPanel;
