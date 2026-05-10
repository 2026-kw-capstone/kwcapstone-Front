export interface MyNoteSentenceItem {
  sentenceId: number;
  sentenceContent: string;
}

export type MyNoteWordStatus = "good" | "warn" | "error";

export interface MyNoteWordFeedback {
  refChar: string;
  hypChar: string;
  grade: MyNoteWordStatus;
}

export interface MyNoteAnalysisResult {
  analysisId: number;
  sentenceId: number;
  pronunciationScore: number;
  speechRateScore: number;
  silenceRatio: number;
  aiFeedback: string;
  wordAnalysis: MyNoteWordFeedback[];
}

export interface RequestPostMyNoteSentenceDto {
  sentenceContent: string;
}

export interface MyNoteTtsAudioResult {
  sentenceId: number;
  sentenceContent: string;
  aiAudioUrl: string;
  expiresIn: number;
}

export interface MyNoteUserAudioResult {
  sentenceId: number;
  analysisId: number;
  userAudioUrl: string;
  expiresIn: number;
}

export interface ResponseGetMyNoteSentencesDto {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    sentences: MyNoteSentenceItem[];
  };
}

export interface ResponseMyNoteSentenceDto {
  isSuccess: boolean;
  code: string;
  message: string;
  result: MyNoteSentenceItem;
}

export interface ResponseDeleteMyNoteSentenceDto {
  isSuccess: boolean;
  code: string;
  message: string;
  result: MyNoteSentenceItem;
}

export interface ResponseMyNoteAnalyzeDto {
  isSuccess: boolean;
  code: string;
  message: string;
  result: MyNoteAnalysisResult;
}
