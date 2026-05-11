import type {
  RequestCreateScenarioDto,
  ResponseCreateScenarioDto,
  ResponseGetScenarioDetailDto,
  ResponseGetScenarioResultDto,
  ResponseGetScenariosDto,
  ResponseGetScenarioStepDto,
  ResponsePostScenarioAnswerDto,
  ScenarioLevel,
} from "../types/scenarioType";
import { axiosInstance } from "./axios";

const SCENARIO_BASE_URL = "/api/conversations/scenarios";

const getVoiceFileName = (mimeType: string) => {
  if (mimeType.includes("wav")) return "scenario-answer.wav";
  if (mimeType.includes("mp4") || mimeType.includes("m4a")) {
    return "scenario-answer.m4a";
  }
  if (mimeType.includes("mpeg") || mimeType.includes("mp3")) {
    return "scenario-answer.mp3";
  }

  return "scenario-answer.webm";
};

export const getScenarios = async (): Promise<ResponseGetScenariosDto> => {
  const { data } = await axiosInstance.get<ResponseGetScenariosDto>(
    SCENARIO_BASE_URL
  );
  return data;
};

export const postScenario = async (
  payload: RequestCreateScenarioDto
): Promise<ResponseCreateScenarioDto> => {
  const { data } = await axiosInstance.post<ResponseCreateScenarioDto>(
    SCENARIO_BASE_URL,
    payload
  );
  return data;
};

export const getScenarioDetail = async (
  scenarioId: number
): Promise<ResponseGetScenarioDetailDto> => {
  const { data } = await axiosInstance.get<ResponseGetScenarioDetailDto>(
    `${SCENARIO_BASE_URL}/${scenarioId}`
  );
  return data;
};

export const getScenarioStep = async ({
  scenarioId,
  level,
  stepNo,
}: {
  scenarioId: number;
  level: ScenarioLevel;
  stepNo: number;
}): Promise<ResponseGetScenarioStepDto> => {
  const { data } = await axiosInstance.get<ResponseGetScenarioStepDto>(
    `${SCENARIO_BASE_URL}/${scenarioId}/levels/${level}/steps/${stepNo}`
  );
  return data;
};

export const postScenarioAnswer = async ({
  scenarioId,
  level,
  stepNo,
  voiceFile,
}: {
  scenarioId: number;
  level: ScenarioLevel;
  stepNo: number;
  voiceFile: Blob;
}): Promise<ResponsePostScenarioAnswerDto> => {
  const formData = new FormData();
  formData.append("audioFile", voiceFile, getVoiceFileName(voiceFile.type));

  const { data } = await axiosInstance.post<ResponsePostScenarioAnswerDto>(
    `${SCENARIO_BASE_URL}/${scenarioId}/levels/${level}/steps/${stepNo}/answers`,
    formData
  );
  return data;
};

export const getScenarioResult = async ({
  scenarioId,
  level,
}: {
  scenarioId: number;
  level: ScenarioLevel;
}): Promise<ResponseGetScenarioResultDto> => {
  const { data } = await axiosInstance.get<ResponseGetScenarioResultDto>(
    `${SCENARIO_BASE_URL}/${scenarioId}/levels/${level}/result`
  );
  return data;
};
