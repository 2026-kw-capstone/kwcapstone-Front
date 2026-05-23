import type {
  PracticeStep,
  ScenarioSyllableStatus,
  StepResult,
} from "../../types/scenarioPracticeType";
import type {
  ScenarioAnswerResultDto,
  ScenarioLevel,
  ScenarioStepDto,
} from "../../types/scenarioType";

export const isScenarioLevel = (value: number): value is ScenarioLevel =>
  value === 1 || value === 2 || value === 3;

const normalizeSyllableStatus = (grade: string): ScenarioSyllableStatus => {
  if (grade === "good" || grade === "warn" || grade === "error") {
    return grade;
  }

  return "warn";
};

export const mapStepToPracticeStep = (
  step: ScenarioStepDto | undefined
): PracticeStep => ({
  step: (step?.stepNo ?? 1) as ScenarioLevel,
  title: step?.step ?? "",
  prompt: step?.assistantMessage ?? "",
  hint: step?.userIntent ?? "",
});

export const mapAnswerToStepResult = (
  answer: ScenarioAnswerResultDto
): StepResult => ({
  accuracy: Math.round(answer.pronunciationScore),
  semanticRate: Math.round(answer.meaningDeliveryScore),
  speed: Math.round(answer.speechRateScore),
  silenceRatio: Math.round(answer.silenceRatio),
  feedback: answer.feedback,
  syllables: (answer.wordAnalysis ?? []).map((word, index) => ({
    text: word.hypChar || word.refChar || String(index + 1),
    status: normalizeSyllableStatus(word.grade),
  })),
});
