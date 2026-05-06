import { CircleGauge, Flame, ShieldCheck } from "lucide-react";
import type { ScenarioLevelItem } from "../types/scenarioType";

export const LEVEL_ITEMS: ScenarioLevelItem[] = [
  {
    level: 1,
    title: "레벨 1. 기본 대답하기",
    description: "짧은 문장으로 상황에 필요한 핵심 대답을 연습합니다.",
    icon: Flame,
    iconClassName: "bg-blue-50 text-[#278DFD]",
  },
  {
    level: 2,
    title: "레벨 2. 추가 질문 주고받기",
    description: "상대의 질문에 맞춰 조건과 요청을 조금 더 자세히 말합니다.",
    icon: CircleGauge,
    iconClassName: "bg-indigo-50 text-indigo-500",
  },
  {
    level: 3,
    title: "레벨 3. 실전 상황 대응하기",
    description: "예상 밖의 상황에서도 자연스럽게 대화를 이어가는 연습입니다.",
    icon: ShieldCheck,
    iconClassName: "bg-purple-50 text-purple-500",
  },
];
