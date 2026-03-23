import type { PracticeStep, StepResult } from "../types/scenarioPracticeType";

export const PRACTICE_STEPS: PracticeStep[] = [
  {
    step: 1,
    title: "상황 파악 질문",
    prompt: "안녕하세요! 찾으시는 물건이 있나요?",
    hint: "점원에게 필요한 물건의 위치를 물어보는 연습입니다.",
  },
  {
    step: 2,
    title: "추가 요청",
    prompt: "이 제품의 다른 색상이나 할인 행사도 있나요?",
    hint: "추가 질문으로 대화를 확장해보세요.",
  },
  {
    step: 3,
    title: "마무리 대화",
    prompt: "감사합니다. 그럼 계산은 어디에서 하면 될까요?",
    hint: "대화를 자연스럽게 마무리하는 문장을 말해보세요.",
  },
];

export const buildMockResult = (step: number): StepResult => {
  const baseAccuracy = 85 + step * 3;
  const baseFluency = 74 + step * 4;

  return {
    transcript:
      step === 1
        ? "네, 종이컵이 필요해요. 어디에 있나요?"
        : step === 2
          ? "같은 제품 다른 색상도 있나요? 할인도 궁금해요."
          : "감사합니다. 계산대가 어디인지 알려주세요.",
    accuracy: Math.min(99, baseAccuracy),
    fluency: Math.min(97, baseFluency),
    feedback:
      step === 1
        ? "질문 시작이 자연스럽습니다. 문장 끝을 조금 더 또렷하게 말해보세요."
        : step === 2
          ? "추가 요청 표현이 좋습니다. 핵심 단어를 조금 더 천천히 말하면 더 명확해집니다."
          : "마무리 표현이 매우 좋습니다. 속도를 약간만 낮추면 전달력이 더 좋아집니다.",
  };
};
