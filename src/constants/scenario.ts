import { Building2, Bus, Coffee, Stethoscope, Store } from "lucide-react";
import type { ScenarioItem } from "../types/scenarioType";

export const RECOMMENDED_SCENARIOS: ScenarioItem[] = [
  {
    id: "cafe",
    title: "카페",
    description: "주문, 결제 및 서비스 요청 상황",
    icon: Coffee,
    iconClassName: "bg-orange-50 text-orange-500",
  },
  {
    id: "hospital",
    title: "병원",
    description: "증상 설명 및 진료 예약 상황",
    icon: Stethoscope,
    iconClassName: "bg-rose-50 text-rose-500",
  },
  {
    id: "mart",
    title: "마트",
    description: "물건 찾기 및 교환/환불 상황",
    icon: Store,
    iconClassName: "bg-emerald-50 text-emerald-500",
  },
  {
    id: "hotel",
    title: "호텔",
    description: "체크인, 객실 요청 및 문의 상황",
    icon: Building2,
    iconClassName: "bg-indigo-50 text-indigo-500",
  },
  {
    id: "transport",
    title: "교통",
    description: "길 묻기, 탑승 및 이동 안내 상황",
    icon: Bus,
    iconClassName: "bg-sky-50 text-sky-500",
  },
  {
    id: "public-office",
    title: "관공서",
    description: "민원 접수 및 서류 발급 상황",
    icon: Building2,
    iconClassName: "bg-slate-100 text-slate-600",
  },
];
