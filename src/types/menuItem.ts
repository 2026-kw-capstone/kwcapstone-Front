import type { LucideIcon } from "lucide-react";

export interface MenuItem {
  title: string;
  description: string;
  to: string;
  icon: LucideIcon;
  badgeIcon: LucideIcon;
  badgeText: string;
  iconClassName: string;
  badgeClassName: string;
  backgroundIconClassName: string;
  hoverBorderClassName: string;
  actionClassName: string;
  footerText?: string;
  footerIcons?: LucideIcon[];
  variant?: "light" | "dark";
}
