import { Flame, Mic, MessageCircleMore } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface HomeQuickMenu {
  title: string;
  description: string;
  path: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

export const homequickMenus: HomeQuickMenu[] = [
  {
    title: "워밍업",
    description: "기초 발성 연습 · 나만의 문장 노트",
    path: "/warmup",
    icon: Flame,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
  },
  {
    title: "시나리오 대화 연습",
    description: "상황별 시나리오 대화 훈련",
    path: "/ai-practice/scenario",
    icon: Mic,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
  },
  {
    title: "AI 자유 대화",
    description: "AI와 자유롭게 말하며 표현 연습",
    path: "/ai-practice/free-conversation",
    icon: MessageCircleMore,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-500",
  },
];