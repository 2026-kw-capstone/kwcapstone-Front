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
    <form
      className="shrink-0 border-t border-slate-100 bg-white/95 px-4 py-3 backdrop-blur-xl"
      onSubmit={handleSubmit}
    >
      <div className="flex min-h-12 w-full items-center gap-2 rounded-[24px] border border-transparent bg-[#F8F9FD] px-2 py-2 transition focus-within:border-blue-200 focus-within:bg-white">
        <button
          type="button"
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition ${
            isRecording
              ? "bg-rose-100 text-rose-500 shadow-[0_0_0_6px_rgba(244,63,94,0.08)]"
              : "bg-white text-slate-500 shadow-sm hover:text-blue-500"
          }`}
          aria-label="음성 입력"
          onClick={onToggleVoiceRecord}
          disabled={isVoiceBusy || isTextBusy}
        >
          {isRecording ? <MicOff size={19} /> : <Mic size={19} />}
        </button>

        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={isRecording ? "듣고 있어요..." : "메시지 입력..."}
          disabled={isTextBusy}
          className="h-10 min-w-0 flex-1 border-none bg-transparent px-1 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
        />

        <button
          type="submit"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#278DFD] text-white shadow-[0_10px_20px_rgba(39,141,253,0.24)] transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300"
          aria-label="메시지 전송"
          disabled={isTextBusy || !text.trim()}
        >
          <Send size={17} />
        </button>
      </div>
    </form>
  );
};

export default ConversationInput;
