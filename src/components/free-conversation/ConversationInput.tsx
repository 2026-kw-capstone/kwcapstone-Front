import { Mic, MicOff, Send } from "lucide-react";

interface ConversationInputProps {
  isRecording: boolean;
  isVoiceBusy: boolean;
  onToggleVoiceRecord: () => void;
}

const ConversationInput = ({
  isRecording,
  isVoiceBusy,
  onToggleVoiceRecord,
}: ConversationInputProps) => {
  // UI 전용 컴포넌트입니다. 녹음 시작/종료 요청만 페이지로 전달합니다.
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
          {/* 페이지에서 주입한 녹음 토글 함수(시작/종료+업로드)를 호출 */}
          {isRecording ? <MicOff size={17} /> : <Mic size={17} />}
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
    </form>
  );
};

export default ConversationInput;
