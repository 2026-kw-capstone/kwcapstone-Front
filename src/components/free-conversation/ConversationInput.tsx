import { Mic, Send } from "lucide-react";

const ConversationInput = () => {
  return (
    <form className="relative z-10 mt-3 md:mt-5">
      <div className="mx-auto flex w-full max-w-4xl items-center gap-1.5 rounded-xl border border-slate-200 bg-white/95 px-1.5 py-1.5 shadow-[0_8px_25px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:gap-3 sm:rounded-[22px] sm:px-3 sm:py-2.5">
        <button
          type="button"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 transition hover:bg-emerald-200 sm:h-10 sm:w-10"
          aria-label="음성 입력"
        >
          <Mic size={17} />
        </button>

        <input
          type="text"
          placeholder="메시지를 입력하세요..."
          className="h-9 min-w-0 flex-1 border-none bg-transparent px-1 text-sm text-slate-700 outline-none placeholder:text-slate-400 sm:h-10 sm:text-base"
        />

        <button
          type="button"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-[0_8px_20px_rgba(16,185,129,0.34)] transition hover:brightness-105 sm:h-10 sm:w-10 sm:rounded-xl"
          aria-label="메시지 전송"
        >
          <Send size={16} />
        </button>
      </div>
    </form>
  );
};

export default ConversationInput;
