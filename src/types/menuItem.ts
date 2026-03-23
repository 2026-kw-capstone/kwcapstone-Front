import type { LucideIcon } from "lucide-react";

export interface MenuItem {
  title: string;
  description: string;
  to: string;
  icon: LucideIcon;
  iconClassName: string;
}
