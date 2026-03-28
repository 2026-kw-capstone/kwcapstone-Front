import { useMemo, useState } from "react";
import { getRecordErrorMessage, getRecordStatusMessage } from "../../constants/recordingMessage";
import { useRecord } from "../../contexts/RecordContext";
import { useAudioPlayer } from "../../hooks/audio/useAudioPlayer";

const toReadableSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
};

const RecordTestPanel = () => {
  const { status, isRecording, lastError, startRecording, stopRecording } = useRecord();
  const { audioUrl, isPlaying, setAudioUrl, clearAudioUrl, playAudio } = useAudioPlayer();
  const [lastRecordedInfo, setLastRecordedInfo] = useState<{ size: number; type: string } | null>(null);

  const statusMessage = useMemo(() => getRecordStatusMessage(status), [status]);
  const errorMessage = useMemo(() => getRecordErrorMessage(lastError), [lastError]);

  const handleToggleRecording = async () => {
    if (!isRecording) {
      await startRecording();
      return;
    }

    const blob = await stopRecording();
    if (!blob) return;

    setAudioUrl(URL.createObjectURL(blob));
    setLastRecordedInfo({
      size: blob.size,
      type: blob.type || "audio/webm",
    });
  };

  const handlePlay = async () => {
    if (!audioUrl) return;
    await playAudio(audioUrl);
  };

  const handleReset = () => {
    clearAudioUrl();
    setLastRecordedInfo(null);
  };

  return (
    <section className="rounded-[20px] border border-amber-300 bg-amber-50/80 p-4 shadow-sm">
      <p className="text-xs font-bold tracking-wide text-amber-700">녹음 테스트</p>
      <h3 className="mt-1 text-lg font-extrabold text-slate-900">홈에서 바로 녹음/재생 확인</h3>

      <p className="mt-2 text-sm text-slate-600">
        현재 상태: <span className="font-semibold">{statusMessage}</span>
      </p>

      {errorMessage ? (
        <p className="mt-1 text-sm font-semibold text-rose-600">오류: {errorMessage}</p>
      ) : null}

      {lastRecordedInfo ? (
        <p className="mt-2 text-xs text-slate-500">
          최근 녹음 파일: {lastRecordedInfo.type} / {toReadableSize(lastRecordedInfo.size)}
        </p>
      ) : (
        <p className="mt-2 text-xs text-slate-500">아직 녹음한 파일이 없습니다.</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleToggleRecording}
          disabled={status === "requesting_permission" || status === "stopping"}
          className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isRecording ? "녹음 종료" : "녹음 시작"}
        </button>

        <button
          type="button"
          onClick={handlePlay}
          disabled={!audioUrl || isRecording || status !== "idle"}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
        >
          {isPlaying ? "재생 중..." : "녹음 재생"}
        </button>

        <button
          type="button"
          onClick={handleReset}
          disabled={!audioUrl}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
        >
          초기화
        </button>
      </div>
    </section>
  );
};

export default RecordTestPanel;
