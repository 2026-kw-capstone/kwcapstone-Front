interface BasicSpeakResult {
  pronunciationScore: number;
  stabilityScore: number;
  deliveryScore: number;
}

interface BasicSpeakResultCardProps {
  result: BasicSpeakResult;
}

const ScoreItem = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  return (
    <div className="rounded-2xl bg-slate-100 px-4 py-4 text-center">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
};

const BasicSpeakResultCard = ({ result }: BasicSpeakResultCardProps) => {
  return (
    <section className="rounded-[24px] bg-white p-5 shadow-sm">
      <h2 className="font-bold text-slate-900 mb-4">분석 결과</h2>

      <div className="grid grid-cols-3 gap-3">
        <ScoreItem label="정확도" value={`${result.pronunciationScore}점`} />
        <ScoreItem label="안정성" value={`${result.stabilityScore}점`} />
        <ScoreItem label="전달력" value={`${result.deliveryScore}점`} />
      </div>
    </section>
  );
};

export default BasicSpeakResultCard;
