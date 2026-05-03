export interface MyNoteSentenceItem {
  id: number;
  text: string;
  createdAt: string;
}

export interface MyNoteAnalysisResult {
  pronunciationScore: number;
  stabilityScore: number;
  deliveryScore: number;
  feedback: string;
}