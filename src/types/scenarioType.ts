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

export interface RequestCreateScenarioDto {
  title: string;
  description: string;
}

export interface ScenarioSummaryDto {
  scenarioId: number;
  title: string;
  description: string;
}

export interface ScenarioLevelDto {
  level: ScenarioLevel;
  levelTitle: string;
  levelDescription: string;
  steps?: ScenarioGeneratedStepDto[];
}

export interface ScenarioGeneratedStepDto {
  stepNo: number;
  step: string;
  assistantMessage: string;
  userIntent: string;
}

export interface ScenarioDetailDto extends ScenarioSummaryDto {
  levels: ScenarioLevelDto[];
}

export interface ScenarioStepDto {
  scenarioId: number;
  level: ScenarioLevel;
  stepNo: number;
  totalStepCount: number;
  levelTitle: string;
  step: string;
  assistantMessage: string;
  userIntent: string;
  isAnswered: boolean;
}

export type ScenarioWordAnalysisGrade = "good" | "warn" | "error";

export interface ScenarioWordAnalysisDto {
  refChar: string;
  hypChar: string;
  grade: ScenarioWordAnalysisGrade;
}

export interface ScenarioAnswerResultDto {
  answerId: number;
  scenarioId: number;
  level: ScenarioLevel;
  stepNo: number;
  meaningDeliveryScore: number;
  meaningFeedback: string;
  pronunciationScore: number;
  speechRateScore: number;
  silenceRatio: number;
  pronunciationFeedback: string;
  isLastStep: boolean;
  nextStepNo: number | null;
  wordAnalysis: ScenarioWordAnalysisDto[];
}

export interface ScenarioUserAudioDto {
  answerId: number;
  scenarioId: number;
  level: ScenarioLevel;
  stepNo: number;
  userAudioUrl: string;
  expiresIn: number;
}

export interface ScenarioTrainingResultDto {
  scenarioId: number;
  level: ScenarioLevel;
  totalStepCount: number;
  completedStepCount: number;
  averagePronunciationScore: number;
  averageMeaningDeliveryScore: number;
  isCompleted: boolean;
}

export interface ScenarioRegeneratedFromDto {
  level: ScenarioLevel;
  stepNo: number;
}

export interface ScenarioRegeneratedStepDto {
  scenarioId: number;
  level: ScenarioLevel;
  stepNo: number;
  levelTitle: string;
  step: string;
  assistantMessage: string;
  userIntent: string;
  isAnswered: boolean;
}

export interface ScenarioRegenerateResultDto extends ScenarioSummaryDto {
  regeneratedFrom: ScenarioRegeneratedFromDto;
  currentStep: ScenarioRegeneratedStepDto;
}

export interface ScenarioDeleteResultDto {
  scenarioId: number;
}

export interface ResponseCreateScenarioDto {
  isSuccess: boolean;
  code: string;
  message: string;
  result: ScenarioDetailDto;
}

export interface ResponseGetScenariosDto {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    scenarios: ScenarioSummaryDto[];
  };
}

export interface ResponseGetScenarioDetailDto {
  isSuccess: boolean;
  code: string;
  message: string;
  result: ScenarioDetailDto;
}

export interface ResponseGetScenarioStepDto {
  isSuccess: boolean;
  code: string;
  message: string;
  result: ScenarioStepDto;
}

export interface ResponsePostScenarioAnswerDto {
  isSuccess: boolean;
  code: string;
  message: string;
  result: ScenarioAnswerResultDto;
}

export interface ResponseGetScenarioResultDto {
  isSuccess: boolean;
  code: string;
  message: string;
  result: ScenarioTrainingResultDto;
}

export interface ResponseGetScenarioUserAudioDto {
  isSuccess: boolean;
  code: string;
  message: string;
  result: ScenarioUserAudioDto;
}

export interface ResponsePostScenarioRegenerateDto {
  isSuccess: boolean;
  code: string;
  message: string;
  result: ScenarioRegenerateResultDto;
}

export interface ResponseDeleteScenarioDto {
  isSuccess: boolean;
  code: string;
  message: string;
  result: ScenarioDeleteResultDto;
}
