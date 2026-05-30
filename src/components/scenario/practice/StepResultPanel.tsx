import { Lightbulb, MessageSquare, Signal } from "lucide-react";
import type {
  ScenarioSyllableStatus,
  StepResult,
} from "../../../types/scenarioPracticeType";

interface StepResultPanelProps {
  currentResult: StepResult;
}

const MetricBlock = ({
  label,
  value,
  unit,
  colorClassName,
}: {
  label: string;
  value: number;
  unit: string;
  colorClassName: string;
}) => (
  <div className="flex min-h-[86px] flex-col items-center justify-center rounded-[16px] border border-slate-100 bg-[#F8F9FD] px-2 py-3 text-center shadow-sm">
    <p className="mb-2 text-[11px] font-bold text-slate-500">{label}</p>
    <p className={`text-[22px] font-black leading-none ${colorClassName}`}>
      {value}
      <span className="ml-0.5 text-[13px] font-black">{unit}</span>
    </p>
  </div>
);

const syllableStatusClassName: Record<ScenarioSyllableStatus, string> = {
  good: "border-emerald-200 bg-emerald-50 text-emerald-600",
  warn: "border-amber-200 bg-amber-50 text-amber-600",
  error: "border-rose-200 bg-rose-50 text-rose-600",
};

const StepResultPanel = ({ currentResult }: StepResultPanelProps) => (
  <section className="flex flex-col gap-5 animate-slide-up">
    <div className="rounded-[24px] border border-slate-50 bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
      <h3 className="mb-5 flex items-center gap-2 text-[16px] font-extrabold text-slate-900">
        <Lightbulb size={18} className="text-[#10B981]" />
        의미 전달 분석
      </h3>

      <div className="mb-5 flex min-h-[88px] flex-col items-center justify-center rounded-[18px] border border-slate-100 bg-[#F8F9FD] p-4 text-center">
        <p className="mb-1.5 text-[12px] font-extrabold text-[#10B981]">
          의미 전달률
        </p>
        <p className="text-[32px] font-black leading-none text-[#10B981]">
          {currentResult.semanticRate}
          <span className="ml-1 text-[17px] font-black">%</span>
        </p>
      </div>

      <div className="rounded-[18px] border border-emerald-100 bg-emerald-50/60 p-4">
        <div className="mb-3 flex items-center gap-1.5 text-[#10B981]">
          <MessageSquare size={14} />
          <span className="text-[12px] font-extrabold">AI 코멘트</span>
        </div>
        <p className="break-keep text-[13.5px] font-medium leading-relaxed text-slate-700">
          {currentResult.meaningFeedback}
        </p>
      </div>
    </div>

    <div className="rounded-[24px] border border-slate-50 bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
      <h3 className="mb-5 flex items-center gap-2 text-[16px] font-extrabold text-slate-900">
        <Signal size={19} className="text-[#278DFD]" />
        발음 분석
      </h3>

      <div className="mb-5 grid grid-cols-3 gap-3">
        <MetricBlock
          label="발음 정확도"
          value={currentResult.accuracy}
          unit="%"
          colorClassName="text-[#278DFD]"
        />
        <MetricBlock
          label="발화 속도"
          value={currentResult.speed}
          unit="sps"
          colorClassName="text-slate-900"
        />
        <MetricBlock
          label="침묵 비율"
          value={currentResult.silenceRatio}
          unit="%"
          colorClassName="text-slate-900"
        />
      </div>

      {currentResult.syllables.length > 0 ? (
        <>
          <p className="mb-3 text-[13px] font-black text-slate-900">
            발음 세부 피드백
          </p>
          <div className="mb-6 flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {currentResult.syllables.map((syllable, index) => (
              <span
                key={`${syllable.text}-${index}`}
                className={`flex h-[42px] min-w-[40px] shrink-0 items-center justify-center rounded-[12px] border text-[16px] font-extrabold shadow-sm ${syllableStatusClassName[syllable.status]}`}
              >
                {syllable.text}
              </span>
            ))}
          </div>
        </>
      ) : null}

      <div className="rounded-[18px] border border-blue-100 bg-blue-50/60 p-4">
        <div className="mb-3 flex items-center gap-1.5 text-[#278DFD]">
          <MessageSquare size={14} />
          <span className="text-[12px] font-extrabold">AI 코멘트</span>
        </div>
        <p className="break-keep text-[13.5px] font-medium leading-relaxed text-slate-700">
          {currentResult.pronunciationFeedback}
        </p>
      </div>
    </div>
  </section>
);

export default StepResultPanel;
