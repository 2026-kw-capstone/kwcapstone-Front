import { FilePenLine, Volume2 } from "lucide-react";
import type { MenuItem } from "../types/menuItem";

export const WARMUP_MENU_ITEMS: MenuItem[] = [
  {
    title: "나만의 문장 노트",
    description: "자주 쓰는 문장을 저장하고 반복해서 연습해보세요.",
    to: "my-note",
    icon: FilePenLine,
    iconClassName: "bg-emerald-50 text-emerald-500",
  },
  {
    title: "기초 발성 연습",
    description: "천천히 따라 말하며 자연스러운 발화를 차근차근 시작해보세요.",
    to: "basic-speak",
    icon: Volume2,
    iconClassName: "bg-blue-50 text-blue-500",
  },
];
