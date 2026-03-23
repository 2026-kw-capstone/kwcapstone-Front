import { FileDown, Trophy } from "lucide-react";

interface BasicSpeakResult {
  pronunciationScore: number;
  stabilityScore: number;
  deliveryScore: number;
}

interface BasicSpeakResultCardProps {
  result: BasicSpeakResult | null;
  isSavingReport?: boolean;
  onSaveReport: () => void;
}

const ScoreItem = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-4 text-center">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
};

const BasicSpeakResultCard = ({
  result,
  isSavingReport = false,
  onSaveReport,
}: BasicSpeakResultCardProps) => {
  const hasResult = !!result;

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-900 sm:text-xl">결과</h2>

        <button
          type="button"
          onClick={onSaveReport}
          disabled={!hasResult || isSavingReport}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition cursor-pointer hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <FileDown size={17} />
          {isSavingReport ? "저장 중..." : "레포트에 저장"}
        </button>
      </div>

      <div className="min-h-[320px] rounded-[20px] border border-slate-100 bg-slate-50/70 p-5">
        {!hasResult ? (
          <div className="flex h-full min-h-[270px] flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-300">
              <Trophy size={34} />
            </div>

            <p className="text-lg font-bold text-slate-700">
              결과가 이곳에 표시됩니다.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              음성을 녹음하면 발음 분석 결과를 확인할 수 있어요.
            </p>
          </div>
        ) : (
          <div className="flex min-h-[270px] flex-col justify-center gap-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <ScoreItem
                label="발음 정확도"
                value={`${result.pronunciationScore}점`}
              />
              <ScoreItem
                label="발화 안정성"
                value={`${result.stabilityScore}점`}
              />
              <ScoreItem
                label="의미 전달력"
                value={`${result.deliveryScore}점`}
              />
            </div>

            <div className="rounded-2xl bg-white px-4 py-4 text-sm leading-6 text-slate-600 shadow-sm">
              녹음 결과를 바탕으로 기초 발성 지표가 표시됩니다.
              <br />
              이후 실제 분석 API를 연결하면 카드별 맞춤 피드백도 함께 보여줄 수 있습니다.
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BasicSpeakResultCard;