import type { ScenarioLevel } from "./scenarioType";

export type ScenarioSyllableStatus = "good" | "warn" | "error";

export interface ScenarioSyllableFeedback {
  text: string;
  status: ScenarioSyllableStatus;
}

export interface StepResult {
  accuracy: number;
  semanticRate: number;
  speed: number;
  silenceRatio: number;
  meaningFeedback: string;
  pronunciationFeedback: string;
  syllables: ScenarioSyllableFeedback[];
}

export interface PracticeStep {
  step: ScenarioLevel;
  title: string;
  prompt: string;
  hint: string;
}
