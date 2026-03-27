import { CheckCircle2, FileDown, Trophy } from "lucide-react";
import type { MyNoteAnalysisResult } from "../../../types/myNoteType";

interface MyNoteResultCardProps {
  result: MyNoteAnalysisResult | null;
  isSavingReport?: boolean;
  onSaveReport: () => void;
}

const ScoreItem = ({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) => {
  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-4 text-center">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
};

const MyNoteResultCard = ({
  result,
  isSavingReport = false,
  onSaveReport,
}: MyNoteResultCardProps) => {
  const hasResult = !!result;

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-900">결과</h2>

        <button
          type="button"
          onClick={onSaveReport}
          disabled={!hasResult || isSavingReport}
          className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <FileDown size={17} />
          {isSavingReport ? "저장 중..." : "레포트에 저장"}
        </button>
      </div>

      <div className="min-h-[280px] rounded-[20px] border border-slate-100 bg-slate-50/70 p-5 min-[380px]:min-h-[368px]">
        {!hasResult ? (
          <div className="flex h-full min-h-[240px] flex-col items-center justify-center text-center min-[380px]:min-h-[320px]">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-300">
              <Trophy size={34} />
            </div>

            <p className="text-lg font-bold text-slate-700">결과가 아직 표시되지 않습니다.</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              문장을 녹음하면 발음 분석 결과를 확인할 수 있어요.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-3">
              <ScoreItem label="발음 정확도" value={`${result.pronunciationScore}점`} />
              <ScoreItem label="발화 안정성" value={`${result.stabilityScore}점`} />
              <ScoreItem label="의미 전달력" value={`${result.deliveryScore}점`} />
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2 text-emerald-600">
                <CheckCircle2 size={18} />
                <p className="text-sm font-semibold">분석 피드백</p>
              </div>

              <p className="text-sm leading-7 text-slate-600">{result.feedback}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MyNoteResultCard;
