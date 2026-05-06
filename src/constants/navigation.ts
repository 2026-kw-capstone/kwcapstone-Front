import {
  BarChart2,
  Home,
  MessageCircleMore,
  PenTool,
  User,
  type LucideIcon,
} from "lucide-react";

export interface BottomNavigationItem {
  label: string;
  path: string;
  icon: LucideIcon;
  match: (pathname: string) => boolean;
}

export const bottomNavigationItems: BottomNavigationItem[] = [
  {
    label: "홈",
    path: "/",
    icon: Home,
    match: (pathname) => pathname === "/",
  },
  {
    label: "워밍업",
    path: "/warmup",
    icon: PenTool,
    match: (pathname) => pathname.startsWith("/warmup"),
  },
  {
    label: "AI 연습",
    path: "/ai-practice",
    icon: MessageCircleMore,
    match: (pathname) => pathname.startsWith("/ai-practice"),
  },
  {
    label: "리포트",
    path: "/report",
    icon: BarChart2,
    match: (pathname) => pathname.startsWith("/report"),
  },
  {
    label: "마이",
    path: "/mypage",
    icon: User,
    match: (pathname) => pathname.startsWith("/mypage"),
  },
];

export const ROOT_TAB_PATHS = ["/", "/warmup", "/ai-practice", "/report", "/mypage"];

export const isRootTabPath = (pathname: string) => ROOT_TAB_PATHS.includes(pathname);

export const getPageTitle = (pathname: string) => {
  if (pathname === "/") return "이음";
  if (pathname === "/warmup") return "워밍업";
  if (pathname === "/warmup/my-note") return "나만의 문장 노트";
  if (pathname === "/warmup/basic-speak") return "기초 발성 연습";
  if (pathname.startsWith("/warmup/basic-speak/")) return "기초 발성 연습";
  if (pathname === "/ai-practice") return "AI 실전 연습";
  if (pathname === "/ai-practice/scenario") return "시나리오 연습";
  if (pathname === "/ai-practice/free-conversation") return "AI 자유 대화";
  if (pathname.includes("/ai-practice/free-conversation/")) return "자유 대화";
  if (pathname.includes("/ai-practice/scenario/") && pathname.includes("/level/")) {
    return "대화 진행중";
  }
  if (pathname.includes("/ai-practice/scenario/")) return "레벨 선택";
  if (pathname === "/report") return "학습 리포트";
  if (pathname === "/mypage") return "마이페이지";
  if (pathname === "/login") return "로그인";
  if (pathname === "/signup") return "회원가입";
  return "";
};
