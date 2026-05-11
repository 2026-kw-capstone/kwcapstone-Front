import axios from "axios";

type ApiFailureResponse = {
  code?: string;
  message?: string;
};

const MESSAGE_MAP: Record<string, string> = {
  AUTH401: "로그인이 필요합니다. 다시 로그인해주세요.",
  COMMON401: "로그인이 필요합니다. 다시 로그인해주세요.",
  CONVERSATION4001: "시나리오 제목을 입력해주세요.",
  CONVERSATION4002: "시나리오 상세 설명을 입력해주세요.",
  CONVERSATION4003: "유효하지 않은 레벨입니다.",
  CONVERSATION4004: "유효하지 않은 단계입니다.",
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
