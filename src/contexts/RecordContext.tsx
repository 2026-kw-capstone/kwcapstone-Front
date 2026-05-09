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

export type RecordStatus =
  | "idle"
  | "requesting_permission"
  | "recording"
  | "stopping"
  | "error";

interface RecordContextValue {
  status: RecordStatus;
  isRecording: boolean;
  lastError: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob | null>;
}

const RecordContext = createContext<RecordContextValue | null>(null);

const MIME_TYPE_CANDIDATES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/mp4",
  "audio/m4a",
  "audio/x-m4a",
  "audio/mpeg",
  "audio/mp3",
] as const;

const MIN_RECORDING_MS = 800;

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });

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
  const recordingStartedAtRef = useRef<number | null>(null);

  const isRecording = status === "recording";

  const cleanupResources = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    streamRef.current = null;
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    recordingStartedAtRef.current = null;
  }, []);

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

      recorder.start(250);
      recordingStartedAtRef.current = Date.now();
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

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state !== "recording") {
      setLastError("not_recording");
      return null;
    }

    setLastError(null);
    setStatus("stopping");

    const startedAt = recordingStartedAtRef.current;
    const elapsedMs = startedAt ? Date.now() - startedAt : MIN_RECORDING_MS;
    if (elapsedMs < MIN_RECORDING_MS) {
      await wait(MIN_RECORDING_MS - elapsedMs);
    }

    const recordedMimeType = recorder.mimeType || "audio/webm";

    return new Promise((resolve) => {
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recordedMimeType,
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
        recorder.requestData();
        recorder.stop();
      } catch {
        setLastError("stop_failed");
        cleanupResources();
        setStatus("error");
        resolve(null);
      }
    });
  }, [cleanupResources]);

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
