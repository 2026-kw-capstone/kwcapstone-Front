import { Flame, House, Mic, User, BarChart3 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface SidebarMenuItemType {
  label: string;
  path: string;
  icon: LucideIcon;
  match: (pathname: string) => boolean;
}

export const sidebarMenuItems: SidebarMenuItemType[] = [
  {
    label: "홈",
    path: "/",
    icon: House,
    match: (pathname) => pathname === "/",
  },
  {
    label: "워밍업",
    path: "/warmup",
    icon: Flame,
    match: (pathname) => pathname.startsWith("/warmup"),
  },
  {
    label: "AI 실전대화",
    path: "/ai-practice",
    icon: Mic,
    match: (pathname) => pathname.startsWith("/ai-practice"),
  },
  {
    label: "리포트",
    path: "/report",
    icon: BarChart3,
    match: (pathname) => pathname.startsWith("/report"),
  },
  {
    label: "마이페이지",
    path: "/mypage",
    icon: User,
    match: (pathname) => pathname.startsWith("/mypage"),
  },
];