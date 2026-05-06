export interface MyNoteSentenceItem {
  id: number;
  text: string;
  createdAt: string;
}

export type MyNoteSyllableStatus = "good" | "warning" | "bad";

export interface MyNoteSyllableFeedback {
  text: string;
  status: MyNoteSyllableStatus;
}

export interface MyNoteAnalysisResult {
  pronunciationScore: number;
  stabilityScore: number;
  deliveryScore: number;
  feedback: string;
  syllables: MyNoteSyllableFeedback[];
}
