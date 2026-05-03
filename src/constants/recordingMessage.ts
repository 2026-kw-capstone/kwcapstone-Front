import type { RecordStatus } from "../contexts/RecordContext";

const RECORD_ERROR_MESSAGE_MAP: Record<string, string> = {
  already_recording: "이미 녹음 중입니다.",
  recording_busy: "녹음 준비 또는 종료 처리 중입니다.",
  media_devices_unavailable: "이 브라우저에서는 마이크를 사용할 수 없습니다.",
  media_recorder_unsupported: "이 브라우저에서는 녹음을 지원하지 않습니다.",
  permission_denied: "마이크 권한이 필요합니다.",
  device_not_found: "사용 가능한 마이크를 찾을 수 없습니다.",
  recording_error: "녹음 중 오류가 발생했습니다.",
  not_recording: "현재 녹음 중이 아닙니다.",
  stop_failed: "녹음을 종료하지 못했습니다.",
  unknown_error: "알 수 없는 오류가 발생했습니다.",
};

const RECORD_STATUS_MESSAGE_MAP: Record<RecordStatus, string> = {
  idle: "대기 중",
  requesting_permission: "권한 요청 중",
  recording: "녹음 중",
  stopping: "녹음 종료 중",
  error: "오류",
};

export const getRecordErrorMessage = (errorCode: string | null) => {
  if (!errorCode) return null;
  return RECORD_ERROR_MESSAGE_MAP[errorCode] ?? `녹음 오류: ${errorCode}`;
};

export const getRecordStatusMessage = (status: RecordStatus) => {
  return RECORD_STATUS_MESSAGE_MAP[status];
};

