import { UserRoundPlus } from "lucide-react";
import type {
  CreateScenarioPayload,
  ScenarioItem,
} from "../types/scenarioType";

// 테스트용 Mock DB입니다.
// TODO: 실제 API 연결 시 axios 요청으로 교체하세요.
let mockMyScenarios: ScenarioItem[] = [];

const delay = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const getMyScenariosSnapshot = (): ScenarioItem[] => {
  return [...mockMyScenarios];
};

export const createScenarioRequest = async (
  payload: CreateScenarioPayload
): Promise<ScenarioItem> => {
  await delay(300);

  const createdScenario: ScenarioItem = {
    id: `custom-${Date.now()}`,
    title: payload.title,
    description:
      payload.description.trim() || "내가 직접 만든 맞춤 시나리오입니다.",
    icon: UserRoundPlus,
    iconClassName: "bg-emerald-50 text-emerald-600",
  };

  mockMyScenarios = [createdScenario, ...mockMyScenarios];
  return createdScenario;
};

export const deleteMyScenarioRequest = async (
  scenarioId: string
): Promise<void> => {
  await delay(200);
  mockMyScenarios = mockMyScenarios.filter((scenario) => scenario.id !== scenarioId);
};
