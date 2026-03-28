import { Mic, MicOff, Play, Send } from "lucide-react";

interface ConversationInputProps {
  isRecording: boolean;
  isVoiceBusy: boolean;
  hasRecordedAudio: boolean;
  isPlayingRecordedAudio: boolean;
  onToggleVoiceRecord: () => void;
  onPlayRecordedAudio: () => void;
}

const ConversationInput = ({
  isRecording,
  isVoiceBusy,
  hasRecordedAudio,
  isPlayingRecordedAudio,
  onToggleVoiceRecord,
  onPlayRecordedAudio,
}: ConversationInputProps) => {
  // UI 전용 컴포넌트입니다. 녹음/재생 로직은 페이지가 담당합니다.
  return (
    <form className="relative z-10 mt-3">
      <div className="mx-auto flex w-full items-center gap-1.5 rounded-xl border border-slate-200 bg-white/95 px-1.5 py-1.5 shadow-[0_8px_25px_rgba(15,23,42,0.08)] backdrop-blur-sm">
        <button
          type="button"
          className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${
            isRecording
              ? "bg-rose-100 text-rose-600 hover:bg-rose-200"
              : "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
          }`}
          aria-label="음성 입력"
          onClick={onToggleVoiceRecord}
          disabled={isVoiceBusy}
        >
          {isRecording ? <MicOff size={17} /> : <Mic size={17} />}
        </button>

        <button
          type="button"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-300"
          aria-label="녹음 재생"
          onClick={onPlayRecordedAudio}
          disabled={!hasRecordedAudio || isVoiceBusy}
        >
          <Play size={16} />
        </button>

        <input
          type="text"
          placeholder="메시지를 입력하세요..."
          className="h-9 min-w-0 flex-1 border-none bg-transparent px-1 text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />

        <button
          type="button"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-[0_8px_20px_rgba(16,185,129,0.34)] transition hover:brightness-105"
          aria-label="메시지 전송"
        >
          <Send size={16} />
        </button>
      </div>

      {isPlayingRecordedAudio ? (
        <p className="pt-1 text-xs font-semibold text-emerald-600">재생 중...</p>
      ) : null}
    </form>
  );
};

export default ConversationInput;
