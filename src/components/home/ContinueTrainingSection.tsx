import { FilePenLine, History, MessageCircle, Mic, Volume2 } from "lucide-react";
import LockedSection from "./LockedSection";
import ContinueTrainingCard from "./ContinueTrainingCard";

const continueTrainingItems = [
  {
    to: "/ai-practice/scenario",
    icon: Mic,
    iconClassName: "bg-emerald-50 text-emerald-500",
    hoverBorderClassName: "hover:border-emerald-100",
    label: "시나리오",
    title: "식당에서 주문하기",
    description: "Lv. 2 진행중",
  },
  {
    to: "/warmup/my-note",
    icon: FilePenLine,
    iconClassName: "bg-blue-50 text-[#278DFD]",
    hoverBorderClassName: "hover:border-blue-100",
    label: "워밍업",
    title: "나만의 문장 노트",
    description: "12문장 저장됨",
  },
  {
    to: "/warmup/basic-speak",
    icon: Volume2,
    iconClassName: "bg-violet-50 text-violet-500",
    hoverBorderClassName: "hover:border-violet-100",
    label: "워밍업",
    title: "기초 발성 연습",
    description: "'아' 연습 완료",
  },
  {
    to: "/ai-practice/free-conversation",
    icon: MessageCircle,
    iconClassName: "bg-sky-50 text-sky-500",
    hoverBorderClassName: "hover:border-sky-100",
    label: "AI 연습",
    title: "AI 자유 대화",
    description: "카페 주문 연습",
  },
];

const ContinueTrainingSection = () => {
  return (
    <section>
      <h3 className="mb-3 flex items-center gap-2 px-1 text-[16px] font-extrabold text-slate-900">
        <History size={18} className="text-[#278DFD]" />
        이어서 학습하기
      </h3>

      <LockedSection message="로그인하고 학습을 이어가세요">
        <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 hide-scrollbar">
          {continueTrainingItems.map((item) => (
            <ContinueTrainingCard key={item.to} {...item} />
          ))}
        </div>
      </LockedSection>
    </section>
  );
};

export default ContinueTrainingSection;
