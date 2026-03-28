import { useCallback, useState } from "react";
import type { RecordStatus } from "../../contexts/RecordContext";

interface UseRecordUploadFlowParams<TResponse> {
  isRecording: boolean;
  status: RecordStatus;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob | null>;
  uploadFn: (blob: Blob) => Promise<TResponse>;
  isBlocked?: boolean;
  onBeforeStart?: () => void;
  onUploadSuccess?: (response: TResponse, blob: Blob) => void;
}

interface UseRecordUploadFlowResult<TResponse> {
  isUploading: boolean;
  // 버튼 1개로 "녹음 시작" 또는 "녹음 종료+업로드"를 수행하는 진입점입니다.
  toggleRecordAndUpload: () => Promise<TResponse | null>;
}

// 녹음/업로드 흐름을 묶는 훅:
// - idle 상태: 녹음 시작
// - recording 상태: 녹음 종료 -> 블롭 획득 -> 업로드 -> 성공 콜백
// - busy 상태: 중복 동작 차단
export const useRecordUploadFlow = <TResponse>({
  isRecording,
  status,
  startRecording,
  stopRecording,
  uploadFn,
  isBlocked = false,
  onBeforeStart,
  onUploadSuccess,
}: UseRecordUploadFlowParams<TResponse>): UseRecordUploadFlowResult<TResponse> => {
  const [isUploading, setIsUploading] = useState(false);

  // 현재 상태에 따라:
  // 1) idle이면 녹음 시작
  // 2) recording이면 녹음 종료 후 업로드
  // 3) busy면 아무 동작도 하지 않음
  const toggleRecordAndUpload = useCallback(async () => {
    if (
      isBlocked ||
      isUploading ||
      status === "requesting_permission" ||
      status === "stopping"
    ) {
      return null;
    }

    if (!isRecording) {
      // 녹음 시작 전 화면 상태 초기화가 필요하면 페이지에서 주입
      onBeforeStart?.();
      await startRecording();
      return null;
    }

    // 녹음을 멈춰 Blob을 얻고, 업로드를 진행합니다.
    const blob = await stopRecording();
    if (!blob) return null;

    setIsUploading(true);
    try {
      const response = await uploadFn(blob);
      onUploadSuccess?.(response, blob);
      return response;
    } finally {
      setIsUploading(false);
    }
  }, [
    isBlocked,
    isRecording,
    isUploading,
    onBeforeStart,
    onUploadSuccess,
    startRecording,
    status,
    stopRecording,
    uploadFn,
  ]);

  return {
    isUploading,
    toggleRecordAndUpload,
  };
};
