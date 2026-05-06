import { FilePenLine, Mic, NotebookPen, Volume2 } from "lucide-react";
import type { MenuItem } from "../types/menuItem";

export const WARMUP_MENU_ITEMS: MenuItem[] = [
  {
    title: "문장 노트 연습",
    description: "자주 쓰는 문장을 미리 저장해두고 발음 정확도를 높여보세요.",
    to: "my-note",
    icon: FilePenLine,
    badgeIcon: NotebookPen,
    badgeText: "나만의 문장",
    footerText: "12개 문장 저장중",
    iconClassName: "text-[#278DFD]",
    badgeClassName: "bg-blue-50 text-[#278DFD]",
    backgroundIconClassName: "text-[#278DFD] rotate-12",
    hoverBorderClassName: "hover:border-blue-100 hover:shadow-[0_8px_32px_rgba(39,141,253,0.12)]",
    actionClassName: "group-hover:bg-[#278DFD] group-hover:text-white",
    variant: "light",
  },
  {
    title: "기초 발성 연습",
    description: "화면을 보고 입 모양을 의식하며 가장 기초적인 소리를 익혀요.",
    to: "basic-speak",
    icon: Volume2,
    badgeIcon: Mic,
    badgeText: "기초 훈련",
    footerText: "5개의 단모음 연습",
    iconClassName: "text-indigo-500",
    badgeClassName: "bg-indigo-50 text-indigo-500",
    backgroundIconClassName: "text-indigo-500 -rotate-6",
    hoverBorderClassName: "hover:border-indigo-100 hover:shadow-[0_8px_32px_rgba(99,102,241,0.12)]",
    actionClassName: "group-hover:bg-indigo-500 group-hover:text-white",
    variant: "light",
  },
];
