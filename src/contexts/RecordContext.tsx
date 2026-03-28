import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';

// 녹음 상태 전이 규약:
// idle -> requesting_permission -> recording -> stopping -> idle
// 오류 발생 시 언제든 error 상태로 전이될 수 있습니다.
type RecordStatus =
  | 'idle'
  | 'requesting_permission'
  | 'recording'
  | 'stopping'
  | 'error';

interface RecordContextValue {
  // 현재 녹음 상태
  status: RecordStatus;
  // UI에서 버튼 토글 등에 사용하기 위한 편의 값
  isRecording: boolean;
  // UI/디버깅 확인용 값입니다. 안정화 이후 제거 가능합니다.
  lastError: string | null;
  // 녹음 시작: 권한 요청 + MediaRecorder 시작
  startRecording: () => Promise<void>;
  // 녹음 종료: webm Blob 반환 (실패 시 null)
  stopRecording: () => Promise<Blob | null>;
}

const RecordContext = createContext<RecordContextValue | null>(null);

const MIME_TYPE_CANDIDATES = [
  // 백엔드 허용 타입 기준 우선순위:
  // audio/webm, audio/mp4, audio/m4a, audio/mpeg, audio/mp3, audio/x-m4a
  // 실제 브라우저 지원 여부는 MediaRecorder.isTypeSupported로 최종 확인됩니다.
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/mp4',
  'audio/m4a',
  'audio/x-m4a',
  'audio/mpeg',
  'audio/mp3',
] as const;

const resolveMimeType = () => {
  // 호환성 폴백 전략:
  // 1) webm/opus를 우선 시도
  // 2) 실패 시 audio/webm으로 폴백
  // 3) 둘 다 미지원이면 mimeType 없이 생성하여 브라우저 기본값 사용
  for (const mimeType of MIME_TYPE_CANDIDATES) {
    if (MediaRecorder.isTypeSupported(mimeType)) {
      return mimeType;
    }
  }

  return undefined;
};

export const RecordProvider = ({ children }: PropsWithChildren) => {
  const [status, setStatus] = useState<RecordStatus>('idle');
  // UI/디버깅 확인용 값입니다. 안정화 이후 제거 가능합니다.
  const [lastError, setLastError] = useState<string | null>(null);

  // 내부 참조값:
  // - mediaRecorderRef: 현재 MediaRecorder 인스턴스
  // - streamRef: 현재 마이크 스트림
  // - chunksRef: ondataavailable로 수집한 오디오 청크
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const isRecording = status === 'recording';

  const cleanupResources = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    streamRef.current = null;
    mediaRecorderRef.current = null;
    chunksRef.current = [];
  }, []);

  const startRecording = useCallback(async () => {
    // 권한 요청 중/종료 처리 중에는 새 녹음을 시작하지 않음
    if (status === 'requesting_permission' || status === 'stopping') {
      setLastError('recording_busy');
      return;
    }

    // 단일 세션 정책: 이미 녹음 중이면 중복 시작 금지
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === 'recording'
    ) {
      setLastError('already_recording');
      return;
    }

    setLastError(null);
    setStatus('requesting_permission');

    try {
      // 브라우저 API 지원 여부 검사
      if (
        typeof navigator === 'undefined' ||
        !navigator.mediaDevices?.getUserMedia
      ) {
        setLastError('media_devices_unavailable');
        setStatus('error');
        return;
      }

      if (typeof MediaRecorder === 'undefined') {
        setLastError('media_recorder_unsupported');
        setStatus('error');
        return;
      }

      // 사용자 마이크 권한 요청
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
        setLastError('recording_error');
        cleanupResources();
        setStatus('error');
      };

      recorder.start();
      setStatus('recording');
    } catch (error) {
      // 권한 거부/장치 없음 등 예외 케이스를 코드로 구분
      cleanupResources();

      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError' || error.name === 'SecurityError') {
          setLastError('permission_denied');
        } else if (error.name === 'NotFoundError') {
          setLastError('device_not_found');
        } else {
          setLastError(error.name);
        }
      } else {
        setLastError('unknown_error');
      }

      setStatus('error');
    }
  }, [cleanupResources, status]);

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    const recorder = mediaRecorderRef.current;

    // 녹음 중이 아닐 때 stop 호출 시 null 반환
    if (!recorder || recorder.state !== 'recording') {
      setLastError('not_recording');
      return null;
    }

    setLastError(null);
    setStatus('stopping');

    return new Promise((resolve) => {
      recorder.onstop = () => {
        // 녹음 종료 시점에만 Blob 생성 후 반환
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || 'audio/webm',
        });

        // 반환 직후 내부 버퍼/스트림 정리 (메모리 누수 방지)
        cleanupResources();
        setStatus('idle');
        resolve(blob);
      };

      recorder.onerror = () => {
        setLastError('stop_failed');
        cleanupResources();
        setStatus('error');
        resolve(null);
      };

      try {
        recorder.stop();
      } catch {
        setLastError('stop_failed');
        cleanupResources();
        setStatus('error');
        resolve(null);
      }
    });
  }, [cleanupResources]);

  useEffect(() => {
    // 페이지 이동/언마운트 시 리소스 정리
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
    [status, isRecording, lastError, startRecording, stopRecording]
  );

  return <RecordContext.Provider value={value}>{children}</RecordContext.Provider>;
};

export const useRecord = () => {
  const context = useContext(RecordContext);

  if (!context) {
    throw new Error('useRecord는 RecordProvider 내부에서 사용해야 합니다.');
  }

  return context;
};

/*
사용 규약 (페이지/컴포넌트 연동용)
1) RecordProvider로 앱 루트를 감싼 뒤, 필요한 곳에서 useRecord를 사용합니다.
2) 녹음 시작 버튼: startRecording() 호출
3) 녹음 종료 버튼: const blob = await stopRecording()
4) blob이 null이 아니면 해당 페이지/컴포넌트에서 API 업로드 및 재생 처리
5) 업로드 결과(mp3/분석 데이터)는 각 페이지/컴포넌트의 useState로 저장
6) error 상태 또는 lastError가 있으면 화면에서 안내 메시지 표시
7) 중복 start 호출은 차단되며, 동시에 1개 녹음만 허용됩니다.
*/
