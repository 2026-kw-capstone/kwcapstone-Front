export const ENCOURAGEMENT_MESSAGES = [
  "천천히 말해도 괜찮아요. 오늘의 한 문장이 내일의 자신감이 됩니다.",
  "완벽한 발음보다 중요한 건, 다시 말해보는 용기예요.",
  "작은 연습이 쌓이면 어느 순간 말이 더 편안해져요.",
  "오늘은 짧게라도 좋아요. 목소리를 꺼낸 순간 이미 시작한 거예요.",
  "틀려도 괜찮아요. 고쳐 말하는 과정이 가장 좋은 연습입니다.",
  "내 속도에 맞춰 말해도 충분해요. 이음이 함께 들어줄게요.",
  "한 번 더 소리 내어 말해보세요. 익숙함은 반복 속에서 자라요.",
  "어제보다 조금 또렷해진 한 마디면 오늘의 연습은 충분합니다.",
  "말이 막혀도 괜찮아요. 잠깐 쉬고 다시 이어가면 됩니다.",
  "지금의 목소리도 소중해요. 오늘도 차분히 이어가 봐요.",
];

export const getRandomEncouragementMessage = () => {
  const randomValues = new Uint32Array(1);
  globalThis.crypto.getRandomValues(randomValues);
  const randomIndex = randomValues[0] % ENCOURAGEMENT_MESSAGES.length;

  return ENCOURAGEMENT_MESSAGES[randomIndex];
};
