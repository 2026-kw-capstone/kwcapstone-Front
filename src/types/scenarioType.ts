import type { LucideIcon } from "lucide-react";

export interface ScenarioItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconClassName: string;
}

export interface CreateScenarioPayload {
  title: string;
  description: string;
}

export type ScenarioLevel = 1 | 2 | 3;

export interface ScenarioLevelItem {
  level: ScenarioLevel;
  title: string;
  description: string;
  icon: LucideIcon;
  iconClassName: string;
}

export interface ScenarioOutletContext {
  myScenarios: ScenarioItem[];
}
