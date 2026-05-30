export type ContinueLearningType =
  | "SCENARIO"
  | "MY_SENTENCE"
  | "BASIC_PRACTICE"
  | "FREE_TALK";

export interface ApiResponseDto<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export interface ScenarioContinueLearningData {
  scenarioId: number;
  scenarioTitle: string;
  currentLevel: number;
}

export interface MySentenceContinueLearningData {
  sentenceCount: number;
}

export interface BasicPracticeContinueLearningData {
  practiceText: string;
}

export interface FreeTalkContinueLearningData {
  conversationId: number;
  conversationTitle: string;
}

export type ContinueLearningContent =
  | {
      type: "SCENARIO";
      latestCreatedAt: string;
      data: ScenarioContinueLearningData;
    }
  | {
      type: "MY_SENTENCE";
      latestCreatedAt: string;
      data: MySentenceContinueLearningData;
    }
  | {
      type: "BASIC_PRACTICE";
      latestCreatedAt: string;
      data: BasicPracticeContinueLearningData;
    }
  | {
      type: "FREE_TALK";
      latestCreatedAt: string;
      data: FreeTalkContinueLearningData;
    };

export interface ContinueLearningResult {
  contents: ContinueLearningContent[];
}

export interface WeeklySummaryResult {
  weeklyTrainingCount: number;
  isIncreasedFromLastWeek: boolean;
  averagePronunciationScore: number;
  averageMeaningDeliveryScore: number;
}

export type ResponseGetContinueLearningDto =
  ApiResponseDto<ContinueLearningResult>;

export type ResponseGetWeeklySummaryDto = ApiResponseDto<WeeklySummaryResult>;
