import type { FormEvent } from "react";
import { MessageCircleMore } from "lucide-react";

interface ScenarioOnboardingProps {
  title: string;
  description: string;
  isCreating: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

const ScenarioOnboarding = ({
  title,
  description,
  isCreating,
  onSubmit,
  onTitleChange,
  onDescriptionChange,
}: ScenarioOnboardingProps) => {
  return (
    <div className="flex min-h-full flex-col items-center justify-center rounded-[28px] border border-slate-100 bg-white p-6 text-center shadow-[0_4px_18px_rgba(15,23,42,0.03)] animate-fade-in">
      <div className="mb-6 flex h-10 w-20 items-center justify-center rounded-full border border-slate-100 bg-[#F8F9FD] text-[#278DFD] shadow-sm">
        <MessageCircleMore size={40} />
      </div>

      <h1 className="mb-3 text-[24px] font-black leading-tight text-slate-900">
        어떤 상황을
        <br />
        연습하고 싶으신가요?
      </h1>

      <p className="mb-8 text-center text-[15px] font-medium leading-relaxed text-slate-500 break-keep">
        오직 나만을 위한 맞춤 상황을
        <br />
        직접 설정하고 대화를 시작해보세요.
      </p>

      <form onSubmit={onSubmit} className="w-full space-y-5 text-left">
        <label className="block">
          <span className="mb-2 ml-1 block text-[13px] font-extrabold text-slate-700">
            상황 제목
          </span>
          <input
            required
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            placeholder="예: 해외 여행 식당에서 주문하기"
            className="h-[56px] w-full rounded-[18px] border border-slate-100 bg-[#F8F9FD] px-5 text-[15.5px] font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-[#278DFD] focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <label className="block">
          <span className="mb-2 ml-1 block text-[13px] font-extrabold text-slate-700">
            상세 설명
          </span>
          <textarea
            required
            rows={3}
            value={description}
            onChange={(event) => onDescriptionChange(event.target.value)}
            placeholder="어떤 대화를 연습하고 싶은지 구체적으로 적어주세요."
            className="w-full resize-none rounded-[18px] border border-slate-100 bg-[#F8F9FD] p-5 text-[15.5px] font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-[#278DFD] focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <button
          type="submit"
          disabled={isCreating || !title.trim() || !description.trim()}
          className="mt-2 h-[56px] w-full rounded-[18px] bg-[#278DFD] text-[16.5px] font-bold text-white shadow-[0_8px_20px_rgba(39,141,253,0.3)] transition-all active:scale-95 disabled:cursor-not-allowed disabled:bg-blue-300 disabled:shadow-none"
        >
          {isCreating ? "생성 중..." : "시나리오 생성하기"}
        </button>
      </form>
    </div>
  );
};

export default ScenarioOnboarding;
