import {
  Building2,
  Coffee,
  MessageCircleMore,
  Mic,
  Sparkles,
  Stethoscope,
  Target,
} from "lucide-react";
import type { MenuItem } from "../types/menuItem";

export const AI_PRACTICE_MENU_ITEMS: MenuItem[] = [
  {
    title: "시나리오 연습",
    description: "식당, 병원 등 맞춤 상황을 설정하고 3단계로 이루어진 대화를 연습하세요.",
    to: "/ai-practice/scenario",
    icon: Target,
    badgeIcon: Sparkles,
    badgeText: "추천 훈련",
    footerIcons: [Coffee, Stethoscope, Building2],
    iconClassName: "text-white",
    badgeClassName: "border border-white/5 bg-white/10 text-emerald-400",
    backgroundIconClassName: "text-white rotate-12",
    hoverBorderClassName: "hover:border-emerald-500/50 hover:shadow-[0_8px_32px_rgba(16,185,129,0.15)]",
    actionClassName: "text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white",
    variant: "dark",
  },
  {
    title: "AI 자유 대화",
    description: "주제 제한 없이 AI와 편하게 대화하며 자연스러운 피드백을 받아보세요.",
    to: "/ai-practice/free-conversation",
    icon: MessageCircleMore,
    badgeIcon: Mic,
    badgeText: "자유도 100%",
    footerText: "언제든 편하게 말 걸어주세요.",
    iconClassName: "text-purple-500",
    badgeClassName: "bg-purple-50 text-purple-500",
    backgroundIconClassName: "text-purple-500 -rotate-6",
    hoverBorderClassName: "hover:border-purple-200 hover:shadow-[0_8px_32px_rgba(168,85,247,0.12)]",
    actionClassName: "group-hover:bg-purple-500 group-hover:text-white",
    variant: "light",
  },
];
