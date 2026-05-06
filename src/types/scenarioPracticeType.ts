import type { ScenarioLevel } from "./scenarioType";

export type ScenarioSyllableStatus = "good" | "warning" | "bad";

export interface ScenarioSyllableFeedback {
  text: string;
  status: ScenarioSyllableStatus;
}

export interface StepResult {
  transcript: string;
  accuracy: number;
  semanticRate: number;
  speed: number;
  silenceRatio: number;
  feedback: string;
  syllables: ScenarioSyllableFeedback[];
}

export interface PracticeStep {
  step: ScenarioLevel;
  title: string;
  prompt: string;
  hint: string;
}
