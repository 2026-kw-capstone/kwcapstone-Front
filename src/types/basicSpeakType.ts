export type BasicSpeakTargetVowel = "A" | "E" | "I" | "O" | "U";

export interface BasicSpeakCardItem {
  id: string;
  targetVowel: BasicSpeakTargetVowel;
  title: string;
  subtitle: string;
  category: string;
}

export interface BasicSpeakPractice {
  practiceId: number;
  accuracyScore: number;
  feedback: string;
  voiceUrl: string;
  modelVoiceUrl: string;
}

export interface BasicSpeakLatestPractice extends BasicSpeakPractice {
  createdAt: string;
}

export interface ResponseBasicSpeakAnalyzeDto {
  isSuccess: boolean;
  code: string;
  message: string;
  clientRequestId: string;
  result: BasicSpeakPractice;
}

export interface ResponseBasicSpeakLatestDto {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    hasPractice: boolean;
    practice: BasicSpeakLatestPractice | null;
  };
}
