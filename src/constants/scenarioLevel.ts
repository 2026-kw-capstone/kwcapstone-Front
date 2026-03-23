import { CircleGauge, Flame, ShieldCheck } from "lucide-react";
import type { ScenarioLevelItem } from "../types/scenarioType";

export const LEVEL_ITEMS: ScenarioLevelItem[] = [
  {
    level: 1,
    title: "레벨 1",
    description: "짧은 문장 중심의 기초 상황",
    icon: Flame,
    iconClassName: "bg-emerald-50 text-emerald-500",
  },
  {
    level: 2,
    title: "레벨 2",
    description: "추가 질문이 포함된 일반 상황",
    icon: CircleGauge,
    iconClassName: "bg-blue-50 text-blue-500",
  },
  {
    level: 3,
    title: "레벨 3",
    description: "변수가 많은 실전형 상황",
    icon: ShieldCheck,
    iconClassName: "bg-indigo-50 text-indigo-500",
  },
];
