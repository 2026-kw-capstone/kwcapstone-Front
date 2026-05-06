import type { BasicSpeakCardItem } from "../types/basicSpeakType";

export const BASIC_SPEAK_CARDS: BasicSpeakCardItem[] = [
  {
    id: "vowel-a",
    title: "아",
    subtitle: "입을 크게 상하로 벌리며",
    category: "단모음",
  },
  {
    id: "vowel-e",
    title: "에",
    subtitle: "입꼬리를 양옆으로 당기며",
    category: "단모음",
  },
  {
    id: "vowel-i",
    title: "이",
    subtitle: "입술을 얇게 펴서",
    category: "단모음",
  },
  {
    id: "vowel-o",
    title: "오",
    subtitle: "입술을 둥글게 모아서",
    category: "단모음",
  },
  {
    id: "vowel-u",
    title: "우",
    subtitle: "입술을 앞으로 쭉 내밀며",
    category: "단모음",
  },
];

export const getBasicSpeakCardById = (cardId?: string) =>
  BASIC_SPEAK_CARDS.find((card) => card.id === cardId);
