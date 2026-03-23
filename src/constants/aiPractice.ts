import { MessageCircleMore, Mic } from "lucide-react";
import type { MenuItem } from "../types/menuItem";

export const AI_PRACTICE_MENU_ITEMS: MenuItem[] = [
  {
    title: "시나리오 대화 연습",
    description:
      "상황별 시나리오를 고르고 AI와 실전처럼 대화를 연습해요.",
    to: "/ai-practice/scenario",
    icon: Mic,
    iconClassName: "bg-blue-50 text-blue-500",
  },
  {
    title: "AI 자유 대화",
    description:
      "주제 제한 없이 AI와 자유롭게 이야기하며 말하기 감각을 키워요.",
    to: "/ai-practice/free-conversation",
    icon: MessageCircleMore,
    iconClassName: "bg-violet-50 text-violet-500",
  },
];
