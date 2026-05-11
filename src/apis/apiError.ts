import axios from "axios";
<<<<<<< feature/scenario-26-api

type ApiFailureResponse = {
  code?: string;
  message?: string;
};

const MESSAGE_MAP: Record<string, string> = {
  AUTH401: "로그인이 필요합니다. 다시 로그인해주세요.",
  COMMON401: "로그인이 필요합니다. 다시 로그인해주세요.",
=======
import type {
  ApiFailureResponse,
  NormalizedApiError,
} from "../types/apiErrorType";

const CODE_ALIAS_MAP: Record<string, string> = {
  AUTH401: "COMMON401",
  WARMUP4031: "WARMUP_403",
  WARMUP_403_1: "WARMUP_403",
  WARMUP4041: "WARMUP_404_1",
  WARMUP4042: "WARMUP_404_1",
  WARMUP_404_2_DOC_SENTENCE: "WARMUP_404_1",
  WARMUP4044: "WARMUP_404_2",
  WARMUP_404_4: "WARMUP_404_2",
  WARMUP4001: "WARMUP_400_1",
  WARMUP4002: "WARMUP_400_2",
  WARMUP_400_3: "WARMUP400_3",
  WARMUP_400_4: "WARMUP400_4",
  WARMUP_400_5: "WARMUP400_5",
  WARMUP_500_1: "WARMUP_500",
  WARMUP_500_2: "WARMUP500_2",
  CONVERSATION4001: "CONVERSATION4001",
  CONVERSATION4002: "CONVERSATION4002",
  CONVERSATION4003: "CONVERSATION4003",
  CONVERSATION4004: "CONVERSATION4004",
  CONVERSATION4005: "CONVERSATION4005",
  CONVERSATION4006: "CONVERSATION4006",
  CONVERSATION4031: "CONVERSATION403",
  CONVERSATION4041: "CONVERSATION404",
  CONVERSATION4042: "CONVERSATION4042",
  CONVERSATION4043: "CONVERSATION4043",
  CONVERSATION5021: "AI500",
  CONVERSATION5022: "AI500",
};

const MESSAGE_MAP: Record<string, string> = {
  NETWORK_ERROR: "서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.",
  UNKNOWN_ERROR: "알 수 없는 오류가 발생했습니다. 다시 시도해주세요.",
  COMMON400: "잘못된 요청입니다.",
  COMMON400_1: "입력값을 다시 확인해주세요.",
  COMMON401: "로그인이 필요합니다. 다시 로그인해주세요.",
  COMMON403: "이 작업을 수행할 권한이 없습니다.",
  COMMON404: "요청한 데이터를 찾을 수 없습니다.",
  COMMON409: "현재 서버 상태와 충돌하는 요청입니다.",
  COMMON409_1: "이미 존재하는 데이터입니다.",
  COMMON500: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
  FILE400_1: "녹음 파일이 비어 있습니다. 다시 녹음해주세요.",
  FILE400_2: "지원하지 않는 음성 형식입니다. 다시 녹음해주세요.",
  FILE500_1: "파일 업로드에 실패했습니다. 다시 시도해주세요.",
  FILE500_2: "파일 삭제에 실패했습니다. 다시 시도해주세요.",
  AI500: "AI 서버가 일시적으로 응답하지 않습니다. 잠시 후 다시 시도해주세요.",
>>>>>>> develop
  CONVERSATION4001: "시나리오 제목을 입력해주세요.",
  CONVERSATION4002: "시나리오 상세 설명을 입력해주세요.",
  CONVERSATION4003: "유효하지 않은 레벨입니다.",
  CONVERSATION4004: "유효하지 않은 단계입니다.",
<<<<<<< feature/scenario-26-api
  CONVERSATION4005: "음성 파일은 필수입니다.",
  CONVERSATION4006: "지원하지 않는 음성 파일 형식입니다.",
  CONVERSATION4031: "해당 시나리오에 접근할 수 없습니다.",
  CONVERSATION4041: "시나리오를 찾을 수 없습니다.",
  CONVERSATION4042: "대화 단계를 찾을 수 없습니다.",
  CONVERSATION4043: "훈련 결과를 찾을 수 없습니다.",
  CONVERSATION5021: "AI 서버 시나리오 생성에 실패했습니다. 잠시 후 다시 시도해주세요.",
  CONVERSATION5022: "AI 서버 음성 분석에 실패했습니다. 잠시 후 다시 시도해주세요.",
};

export const getApiErrorMessage = (
  error: unknown,
  fallbackMessage = "오류가 발생했습니다. 다시 시도해주세요."
) => {
  if (!axios.isAxiosError<ApiFailureResponse>(error)) {
    return error instanceof Error && error.message.trim()
      ? error.message
      : fallbackMessage;
  }

  if (!error.response) {
    return "서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.";
  }

  const code = error.response.data?.code;
  if (code && MESSAGE_MAP[code]) {
    return MESSAGE_MAP[code];
  }

  return error.response.data?.message || fallbackMessage;
};
=======
  CONVERSATION4005: "음성 파일이 필요합니다.",
  CONVERSATION4006: "지원하지 않는 음성 파일 형식입니다.",
  CONVERSATION403: "이 대화에 접근할 권한이 없습니다.",
  CONVERSATION404: "대화를 찾을 수 없습니다.",
  CONVERSATION4042: "대화 단계를 찾을 수 없습니다.",
  CONVERSATION4043: "훈련 결과를 찾을 수 없습니다.",
  MESSAGE400: "이 메시지에는 재생할 음성이 없습니다.",
  MESSAGE403: "이 메시지에 접근할 권한이 없습니다.",
  MESSAGE404: "메시지를 찾을 수 없습니다.",
  WARMUP_400_1: "문장을 입력해주세요.",
  WARMUP_400_2: "문장이 너무 깁니다.",
  WARMUP400_3: "음성 파일이 필요합니다. 다시 녹음해주세요.",
  WARMUP400_4: "지원하지 않는 음성 형식입니다. 다시 녹음해주세요.",
  WARMUP400_5: "음성이 너무 짧습니다. 다시 녹음해주세요.",
  WARMUP_403: "이 문장에 접근할 권한이 없습니다.",
  WARMUP_404_1: "문장을 찾을 수 없습니다.",
  WARMUP_404_2: "최근 녹음 음성이 없습니다. 먼저 녹음해주세요.",
  WARMUP_500: "AI 음성 생성에 실패했습니다. 다시 시도해주세요.",
  WARMUP500_2: "발음 분석에 실패했습니다. 다시 시도해주세요.",
  BASIC_PRONUNCIATION400: "선택한 모음이 올바르지 않습니다.",
  BASIC_PRONUNCIATION500_1: "AI 피드백을 받아오지 못했습니다. 다시 시도해주세요.",
  BASIC_PRONUNCIATION500_2: "모범 발음 음성을 받아오지 못했습니다. 다시 시도해주세요.",
  MEMBER404: "사용자 정보를 찾을 수 없습니다.",
};

const normalizeCode = (code?: string, status?: number | null) => {
  const compactCode = code?.trim();
  if (compactCode) {
    return CODE_ALIAS_MAP[compactCode] ?? compactCode;
  }

  if (status === 400) return "COMMON400";
  if (status === 401) return "COMMON401";
  if (status === 403) return "COMMON403";
  if (status === 404) return "COMMON404";
  if (status === 409) return "COMMON409";
  if (status && status >= 500) return "COMMON500";

  return "UNKNOWN_ERROR";
};

const getAction = (status: number | null, code: string) => {
  if (status === 401 || code === "COMMON401") return "redirectLogin";
  if (status === 404 || code.endsWith("404") || code.includes("404")) {
    return "retry";
  }
  if (status && status >= 500) return "retry";
  if (code === "AI500" || code.includes("500")) return "retry";
  return "inline";
};

const getFieldErrors = (result: ApiFailureResponse["result"]) => {
  if (!result || typeof result !== "object") {
    return undefined;
  }

  return result;
};

export const normalizeApiError = (
  error: unknown,
  fallbackMessage = "오류가 발생했습니다. 다시 시도해주세요."
): NormalizedApiError => {
  if (!axios.isAxiosError<ApiFailureResponse>(error)) {
    const message =
      error instanceof Error && error.message.trim()
        ? error.message
        : fallbackMessage;

    return {
      status: null,
      code: "UNKNOWN_ERROR",
      message,
      action: "inline",
      raw: error,
    };
  }

  if (!error.response) {
    return {
      status: null,
      code: "NETWORK_ERROR",
      message: MESSAGE_MAP.NETWORK_ERROR,
      action: "retry",
      raw: error,
    };
  }

  const status = error.response.status;
  const data = error.response.data;
  const code = normalizeCode(data?.code, status);
  const fieldErrors = getFieldErrors(data?.result);
  const serverMessage =
    typeof data?.message === "string" && data.message.trim()
      ? data.message
      : "";

  return {
    status,
    code,
    message: MESSAGE_MAP[code] ?? serverMessage ?? fallbackMessage,
    fieldErrors,
    action: getAction(status, code),
    raw: error,
  };
};

export const getApiErrorMessage = (
  error: unknown,
  fallbackMessage = "오류가 발생했습니다. 다시 시도해주세요."
) => normalizeApiError(error, fallbackMessage).message;

export const getApiFieldErrors = (error: unknown) =>
  normalizeApiError(error).fieldErrors;
>>>>>>> develop
