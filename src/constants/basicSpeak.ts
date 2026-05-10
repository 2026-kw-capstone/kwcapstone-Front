import type { BasicSpeakCardItem } from "../types/basicSpeakType";

export const BASIC_SPEAK_CARDS: BasicSpeakCardItem[] = [
  {
    id: "vowel-a",
    targetVowel: "A",
    title: "아",
    subtitle: "입을 크게 아래로 벌리며",
    category: "단모음",
  },
  {
    id: "vowel-e",
    targetVowel: "E",
    title: "에",
    subtitle: "입꼬리를 양옆으로 당기며",
    category: "단모음",
  },
  {
    id: "vowel-i",
    targetVowel: "I",
    title: "이",
    subtitle: "입술을 얇게 펴서",
    category: "단모음",
  },
  {
    id: "vowel-o",
    targetVowel: "O",
    title: "오",
    subtitle: "입술을 둥글게 모아서",
    category: "단모음",
  },
  {
    id: "vowel-u",
    targetVowel: "U",
    title: "우",
    subtitle: "입술을 앞으로 내밀며",
    category: "단모음",
  },
];

export const getBasicSpeakCardById = (cardId?: string) =>
  BASIC_SPEAK_CARDS.find((card) => card.id === cardId);
