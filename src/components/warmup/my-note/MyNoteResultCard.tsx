import { Activity, CheckCircle2, FileDown } from "lucide-react";
import type { MyNoteAnalysisResult } from "../../../types/myNoteType";

interface MyNoteResultCardProps {
  result: MyNoteAnalysisResult;
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
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-green-500" />
          <h2 className="font-bold text-slate-900">발음 분석 결과</h2>
        </div>

        <button
          type="button"
          onClick={onSaveReport}
          disabled={isSavingReport}
          className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <FileDown size={17} />
          {isSavingReport ? "저장 중..." : "저장"}
        </button>
      </div>

      <div>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
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
      </div>
    </section>
  );
};

export default MyNoteResultCard;
