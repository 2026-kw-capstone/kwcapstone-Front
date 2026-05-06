import type {
  PracticeStep,
  ScenarioSyllableFeedback,
  ScenarioSyllableStatus,
  StepResult,
} from "../types/scenarioPracticeType";

export const PRACTICE_STEPS: PracticeStep[] = [
  {
    step: 1,
    title: "상황 파악 질문",
    prompt: "안녕하세요! 찾으시는 물건이 있나요?",
    hint: "상황에 맞춰 필요한 내용을 질문하거나 대답해보세요.",
  },
  {
    step: 2,
    title: "추가 요청",
    prompt: "원하시는 다른 조건이 있으실까요?",
    hint: "추가 질문으로 대화를 확장해보세요.",
  },
  {
    step: 3,
    title: "마무리 대화",
    prompt: "감사합니다. 더 도와드릴 일이 있을까요?",
    hint: "대화를 자연스럽게 마무리하는 문장을 말해보세요.",
  },
];

const SYLLABLE_STATUS_PATTERN: ScenarioSyllableStatus[] = [
  "good",
  "good",
  "warning",
  "good",
  "bad",
  "good",
];

const createSyllableFeedback = (text: string): ScenarioSyllableFeedback[] => {
  return Array.from(text)
    .filter((char) => /[가-힣A-Za-z0-9]/.test(char))
    .map((char, index) => ({
      text: char,
      status: SYLLABLE_STATUS_PATTERN[index % SYLLABLE_STATUS_PATTERN.length],
    }));
};

export const buildMockResult = (step: number): StepResult => {
  const transcript =
    step === 1
      ? "네, 필요한 물건 위치를 알고 싶어요."
      : step === 2
        ? "다른 조건도 확인해주실 수 있나요?"
        : "감사합니다. 안내해주신 대로 해볼게요.";

  const accuracy = Math.min(99, 86 + step * 3);
  const semanticRate = Math.min(98, 88 + step * 2);

  return {
    transcript,
    accuracy,
    semanticRate,
    speed: 78 + step,
    silenceRatio: Math.max(8, 16 - step * 2),
    feedback:
      step === 1
        ? "질문 시작이 자연스럽습니다. 문장 끝을 조금 더 또렷하게 말해보세요."
        : step === 2
          ? "추가 요청 표현이 좋습니다. 핵심 단어를 조금 더 천천히 말하면 더 명확해집니다."
          : "마무리 표현이 매우 좋습니다. 속도를 약간만 늦추면 전달력이 더 좋아집니다.",
    syllables: createSyllableFeedback(transcript),
  };
};
