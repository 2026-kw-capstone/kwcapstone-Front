import { Mic, MicOff, Send } from "lucide-react";
import { useState, type FormEvent } from "react";

interface ConversationInputProps {
  isRecording: boolean;
  isVoiceBusy: boolean;
  isTextBusy: boolean;
  onToggleVoiceRecord: () => void;
  onSubmitText: (content: string) => Promise<void> | void;
}

const ConversationInput = ({
  isRecording,
  isVoiceBusy,
  isTextBusy,
  onToggleVoiceRecord,
  onSubmitText,
}: ConversationInputProps) => {
  const [text, setText] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedText = text.trim();

    if (!trimmedText || isTextBusy) {
      return;
    }

    await onSubmitText(trimmedText);
    setText("");
  };

  return (
    <form className="relative z-10 mt-3" onSubmit={handleSubmit}>
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
          disabled={isVoiceBusy || isTextBusy}
        >
          {isRecording ? <MicOff size={17} /> : <Mic size={17} />}
        </button>

        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="메시지를 입력하세요..."
          disabled={isTextBusy}
          className="h-9 min-w-0 flex-1 border-none bg-transparent px-1 text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />

        <button
          type="submit"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-[0_8px_20px_rgba(16,185,129,0.34)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
          aria-label="메시지 전송"
          disabled={isTextBusy}
        >
          <Send size={16} />
        </button>
      </div>
    </form>
  );
};

export default ConversationInput;
