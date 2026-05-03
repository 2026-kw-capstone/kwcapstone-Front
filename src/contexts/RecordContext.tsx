import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";

/*
녹음 아키텍처 요약

[역할 경계]
- RecordContext: 마이크 권한 요청, 녹음 시작/종료, 녹음 상태 관리 담당
- useRecordUploadFlow: 녹음 토글(시작 또는 종료 후 업로드) 흐름 담당
- useAudioPlayer: 재생 URL 수명주기와 오디오 재생 상태 담당
- 페이지: 화면별 상태(분석 결과, 선택 항목 등) 매핑 담당
- 컴포넌트: UI 렌더링과 이벤트 전달만 담당

[표준 흐름]
1) 사용자가 녹음 버튼 클릭
2) idle 상태면 toggleRecordAndUpload가 녹음 시작
3) 사용자가 녹음 버튼 재클릭
4) 녹음 종료 후 Blob 생성 -> 업로드 함수 호출
5) 페이지가 응답(mp3Url, 분석 결과)을 상태에 저장
6) 재생 버튼은 저장된 mp3Url을 useAudioPlayer로 재생

[에러/상태 매핑]
- RecordContext.lastError 코드는 getRecordErrorMessage(errorCode)로 사용자 문구 변환
- RecordContext.status 값은 getRecordStatusMessage(status)로 화면 문구 변환

[네이밍 규칙]
- hasRecordedAudio: 재생 가능한 녹음 결과 존재 여부
- audioUrl: 재생에 사용하는 URL(가능하면 API mp3Url 우선 사용)
- isUploading: 녹음 종료 후 업로드 진행 상태
- isInteractionLocked: 버튼 조작 잠금 상태
*/

export type RecordStatus =
  // 기본 대기 상태 (녹음 시작 가능)
  | "idle"
  // 브라우저 마이크 권한 요청 중
  | "requesting_permission"
  // 실제 녹음 진행 중
  | "recording"
  // stop 호출 후 Blob 생성 대기 중
  | "stopping"
  // 녹음 흐름 중 오류 발생
  | "error";

interface RecordContextValue {
  status: RecordStatus;
  isRecording: boolean;
  // UI/디버깅 확인용 값입니다. 페이지에서 사용자 메시지로 변환해 사용합니다.
  lastError: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob | null>;
}

const RecordContext = createContext<RecordContextValue | null>(null);

// 백엔드 허용 미디어 형식 범위입니다. 실제 사용 가능 여부는 녹음기 지원 여부로 결정됩니다.
const MIME_TYPE_CANDIDATES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/mp4",
  "audio/m4a",
  "audio/x-m4a",
  "audio/mpeg",
  "audio/mp3",
] as const;

// 브라우저가 지원하는 첫 번째 MIME 타입을 선택합니다.
const resolveMimeType = () => {
  for (const mimeType of MIME_TYPE_CANDIDATES) {
    if (MediaRecorder.isTypeSupported(mimeType)) {
      return mimeType;
    }
  }
  return undefined;
};

export const RecordProvider = ({ children }: PropsWithChildren) => {
  const [status, setStatus] = useState<RecordStatus>("idle");
  const [lastError, setLastError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const isRecording = status === "recording";

  // 스트림/레코더/청크를 모두 정리해 메모리 누수를 방지합니다.
  const cleanupResources = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    streamRef.current = null;
    mediaRecorderRef.current = null;
    chunksRef.current = [];
  }, []);

  // 녹음 시작: 권한 확인 -> MediaRecorder 생성 -> data 청크 수집 시작
  const startRecording = useCallback(async () => {
    if (status === "requesting_permission" || status === "stopping") {
      setLastError("recording_busy");
      return;
    }

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      setLastError("already_recording");
      return;
    }

    setLastError(null);
    setStatus("requesting_permission");

    try {
      if (
        typeof navigator === "undefined" ||
        !navigator.mediaDevices?.getUserMedia
      ) {
        setLastError("media_devices_unavailable");
        setStatus("error");
        return;
      }

      if (typeof MediaRecorder === "undefined") {
        setLastError("media_recorder_unsupported");
        setStatus("error");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = resolveMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      chunksRef.current = [];
      streamRef.current = stream;
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onerror = () => {
        setLastError("recording_error");
        cleanupResources();
        setStatus("error");
      };

      recorder.start();
      setStatus("recording");
    } catch (error) {
      cleanupResources();

      if (error instanceof DOMException) {
        if (error.name === "NotAllowedError" || error.name === "SecurityError") {
          setLastError("permission_denied");
        } else if (error.name === "NotFoundError") {
          setLastError("device_not_found");
        } else {
          setLastError(error.name);
        }
      } else {
        setLastError("unknown_error");
      }

      setStatus("error");
    }
  }, [cleanupResources, status]);

  // 녹음 종료: recorder.stop() -> onstop에서 Blob 생성 후 반환
  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state !== "recording") {
      setLastError("not_recording");
      return null;
    }

    setLastError(null);
    setStatus("stopping");

    return new Promise((resolve) => {
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });

        cleanupResources();
        setStatus("idle");
        resolve(blob);
      };

      recorder.onerror = () => {
        setLastError("stop_failed");
        cleanupResources();
        setStatus("error");
        resolve(null);
      };

      try {
        recorder.stop();
      } catch {
        setLastError("stop_failed");
        cleanupResources();
        setStatus("error");
        resolve(null);
      }
    });
  }, [cleanupResources]);

  // Provider가 언마운트될 때 열려 있는 트랙/참조를 정리합니다.
  useEffect(() => {
    return () => {
      cleanupResources();
    };
  }, [cleanupResources]);

  const value = useMemo<RecordContextValue>(
    () => ({
      status,
      isRecording,
      lastError,
      startRecording,
      stopRecording,
    }),
    [isRecording, lastError, startRecording, status, stopRecording]
  );

  return <RecordContext.Provider value={value}>{children}</RecordContext.Provider>;
};

export const useRecord = () => {
  const context = useContext(RecordContext);
  if (!context) {
    throw new Error("useRecord must be used within RecordProvider.");
  }
  return context;
};
