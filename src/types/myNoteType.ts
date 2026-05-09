export interface MyNoteSentenceItem {
  sentenceId: number;
  sentenceContent: string;
}

export type MyNoteSyllableStatus = "good" | "warn" | "bad";

export interface MyNoteSyllableFeedback {
  text: string;
  grade: MyNoteSyllableStatus;
}

export interface MyNoteAnalysisResult {
  analysisId: number;
  sentenceId: number;
  referenceText: string;
  sttText: string;
  pronunciationScore: number;
  speechRate: number;
  silenceRatio: number;
  feedback: string;
  syllableAnalysis: MyNoteSyllableFeedback[];
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
