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

export const useRecordUploadFlow = <TResponse>({
  isRecording,
  status,
  startRecording,
  stopRecording,
  uploadFn,
  isBlocked = false,
  onBeforeStart,
  onUploadSuccess,
}: UseRecordUploadFlowParams<TResponse>) => {
  const [isUploading, setIsUploading] = useState(false);

  const toggleRecordAndUpload = useCallback(async () => {
    // 녹음/권한/업로드 중에는 중복 동작을 막습니다.
    if (
      isBlocked ||
      isUploading ||
      status === "requesting_permission" ||
      status === "stopping"
    ) {
      return null;
    }

    // 녹음 중이 아니면 녹음을 시작합니다.
    if (!isRecording) {
      onBeforeStart?.();
      await startRecording();
      return null;
    }

    // 녹음 중이면 종료 -> Blob 획득 -> 업로드 -> 성공 콜백 순서로 진행합니다.
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
