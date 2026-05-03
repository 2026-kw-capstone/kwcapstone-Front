import type { ScenarioLevel } from "./scenarioType";

export interface StepResult {
  transcript: string;
  accuracy: number;
  fluency: number;
  feedback: string;
}

export interface PracticeStep {
  step: ScenarioLevel;
  title: string;
  prompt: string;
  hint: string;
}
