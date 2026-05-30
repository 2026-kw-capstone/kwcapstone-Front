import type {
  ResponseGetContinueLearningDto,
  ResponseGetWeeklySummaryDto,
} from "../types/homeType";
import { axiosInstance } from "./axios";

const HOME_BASE_URL = "/api/home";

export const getContinueLearning =
  async (): Promise<ResponseGetContinueLearningDto> => {
    const { data } = await axiosInstance.get<ResponseGetContinueLearningDto>(
      `${HOME_BASE_URL}/continue-learning`
    );
    return data;
  };

export const getWeeklySummary =
  async (): Promise<ResponseGetWeeklySummaryDto> => {
    const { data } = await axiosInstance.get<ResponseGetWeeklySummaryDto>(
      `${HOME_BASE_URL}/weekly-summary`
    );
    return data;
  };
