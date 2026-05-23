import { StepBack, StepForward } from "lucide-react";

interface PracticeNavigationFooterProps {
  currentStepIndex: number;
  totalSteps: number;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

const PracticeNavigationFooter = ({
  currentStepIndex,
  totalSteps,
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
}: PracticeNavigationFooterProps) => (
  <footer className="z-20 -mx-5 grid grid-cols-[56px_1fr] gap-3 border-t border-slate-100 bg-white p-4 shadow-[0_-4px_16px_rgba(0,0,0,0.02)]">
    <button
      type="button"
      onClick={onPrev}
      disabled={!canGoPrev}
      className="flex h-[56px] items-center justify-center rounded-[18px] bg-[#F8F9FD] text-slate-400 transition-colors active:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
      aria-label="이전 단계"
    >
      <StepBack size={22} />
    </button>

    <button
      type="button"
      onClick={onNext}
      disabled={!canGoNext}
      className="flex h-[56px] items-center justify-center gap-2 rounded-[18px] bg-slate-800 text-[16px] font-bold text-white shadow-lg transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30 disabled:shadow-none"
    >
      {currentStepIndex === totalSteps - 1 ? "종료 및 결과보기" : "다음 단계로"}
      <StepForward size={20} />
    </button>
  </footer>
);

export default PracticeNavigationFooter;
