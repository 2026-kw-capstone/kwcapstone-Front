import { MessageCircleMore, Mic } from "lucide-react";
import type { MenuItem } from "../types/menuItem";

export const AI_PRACTICE_MENU_ITEMS: MenuItem[] = [
  {
    title: "시나리오 대화 연습",
    description:
      "시나리오를 고르고 실전처럼 연습해요.",
    to: "/ai-practice/scenario",
    icon: Mic,
    iconClassName: "bg-blue-50 text-blue-500",
  },
  {
    title: "AI 자유 대화",
    description:
      "AI와 자유롭게 이야기하며 말하기 감각을 키워요.",
    to: "/ai-practice/free-conversation",
    icon: MessageCircleMore,
    iconClassName: "bg-violet-50 text-violet-500",
  },
];
