export interface BasicSpeakCardItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: "모음" | "자음" | "반복 발성";
  guideText?: string;
}