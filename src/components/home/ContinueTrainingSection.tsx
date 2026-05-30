import {
  FilePenLine,
  History,
  MessageCircle,
  Mic,
  Volume2,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useGetContinueLearning } from "../../hooks/queries/home";
import type { ContinueLearningContent } from "../../types/homeType";
import ContinueTrainingCard from "./ContinueTrainingCard";
import HomeSectionError from "./HomeSectionError";
import LockedSection from "./LockedSection";

interface ContinueTrainingItem {
  to: string;
  icon: LucideIcon;
  iconClassName: string;
  hoverBorderClassName: string;
  label: string;
  title: string;
  description: string;
}

const fallbackContinueTrainingItems: ContinueTrainingItem[] = [
  {
    to: "/ai-practice/scenario",
    icon: Mic,
    iconClassName: "bg-emerald-50 text-emerald-500",
    hoverBorderClassName: "hover:border-emerald-100",
    label: "시나리오",
    title: "식당에서 주문하기",
    description: "Lv. 2 진행 중",
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

const mapContinueLearningContent = (
  content: ContinueLearningContent
): ContinueTrainingItem => {
  switch (content.type) {
    case "SCENARIO":
      return {
        to: "/ai-practice/scenario",
        icon: Mic,
        iconClassName: "bg-emerald-50 text-emerald-500",
        hoverBorderClassName: "hover:border-emerald-100",
        label: "시나리오",
        title: content.data.scenarioTitle,
        description: `Lv. ${content.data.currentLevel} 진행 중`,
      };
    case "MY_SENTENCE":
      return {
        to: "/warmup/my-note",
        icon: FilePenLine,
        iconClassName: "bg-blue-50 text-[#278DFD]",
        hoverBorderClassName: "hover:border-blue-100",
        label: "워밍업",
        title: "나만의 문장 노트",
        description: `${content.data.sentenceCount}문장 저장됨`,
      };
    case "BASIC_PRACTICE":
      return {
        to: "/warmup/basic-speak",
        icon: Volume2,
        iconClassName: "bg-violet-50 text-violet-500",
        hoverBorderClassName: "hover:border-violet-100",
        label: "워밍업",
        title: "기초 발성 연습",
        description: `'${content.data.practiceText}' 연습 완료`,
      };
    case "FREE_TALK":
      return {
        to: "/ai-practice/free-conversation",
        icon: MessageCircle,
        iconClassName: "bg-sky-50 text-sky-500",
        hoverBorderClassName: "hover:border-sky-100",
        label: "AI 연습",
        title: content.data.conversationTitle,
        description: "AI 자유 대화 이어가기",
      };
  }
};

const ContinueTrainingSection = () => {
  const { isLoggedIn } = useAuth();
  const continueLearningQuery = useGetContinueLearning();
  const items =
    isLoggedIn && continueLearningQuery.data
      ? continueLearningQuery.data.contents.map(mapContinueLearningContent)
      : fallbackContinueTrainingItems;
  const isInitialLoading = isLoggedIn && continueLearningQuery.isLoading;
  const isRefreshing =
    isLoggedIn && continueLearningQuery.isFetching && !!continueLearningQuery.data;
  const hasNoContent =
    isLoggedIn &&
    !continueLearningQuery.isLoading &&
    !continueLearningQuery.isError &&
    items.length === 0;

  return (
    <section>
      <h3 className="mb-3 flex items-center gap-2 px-1 text-[16px] font-extrabold text-slate-900">
        <History size={18} className="text-[#278DFD]" />
        이어서 학습하기
      </h3>

      <LockedSection message="로그인하고 학습을 이어가보세요">
        {continueLearningQuery.isError ? (
          <HomeSectionError
            message="학습 기록을 불러오지 못했어요."
            onRetry={() => void continueLearningQuery.refetch()}
          />
        ) : hasNoContent ? (
          <div className="rounded-[24px] border border-slate-100 bg-white px-5 py-6 text-center shadow-[0_4px_16px_rgba(0,0,0,0.03)]">
            <p className="mb-4 text-[13.5px] font-bold text-slate-500">
              아직 이어서 학습할 기록이 없어요.
            </p>
            <Link
              to="/ai-practice"
              className="inline-flex h-10 items-center justify-center rounded-[13px] bg-[#278DFD] px-4 text-[13px] font-bold text-white shadow-[0_8px_18px_rgba(39,141,253,0.2)] transition active:scale-95"
            >
              학습 시작하기
            </Link>
          </div>
        ) : (
          <div
            className={`-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 hide-scrollbar transition-all ${
              isInitialLoading
                ? "pointer-events-none opacity-40 blur-[1px]"
                : isRefreshing
                  ? "opacity-70"
                  : ""
            }`}
          >
            {items.map((item) => (
              <ContinueTrainingCard
                key={`${item.to}-${item.title}`}
                {...item}
              />
            ))}
          </div>
        )}
      </LockedSection>
    </section>
  );
};

export default ContinueTrainingSection;
