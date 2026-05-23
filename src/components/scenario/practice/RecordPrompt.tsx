import { Mic, MicOff } from "lucide-react";

interface RecordPromptProps {
  isRecording: boolean;
  isAnalyzing: boolean;
  onRecord: () => void;
}

const RecordPrompt = ({ isRecording, isAnalyzing, onRecord }: RecordPromptProps) => (
  <section className="flex min-h-[200px] flex-1 flex-col items-center justify-center">
    <div className="flex flex-col items-center animate-fade-in">
      <button
        type="button"
        onClick={onRecord}
        disabled={isAnalyzing}
        className={`flex h-[88px] w-[88px] items-center justify-center rounded-full text-white shadow-xl transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
          isRecording
            ? "scale-110 animate-pulse bg-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.4)]"
            : "bg-[#278DFD] shadow-[0_8px_20px_rgba(39,141,253,0.3)] hover:scale-105 active:scale-[0.9]"
        }`}
      >
        {isRecording ? <MicOff size={36} /> : <Mic size={36} />}
      </button>
      <p className="mt-6 text-[15px] font-extrabold text-slate-400">
        {isRecording
          ? "녹음 중입니다..."
          : isAnalyzing
            ? "분석 중입니다..."
            : "버튼을 눌러 대답해보세요"}
      </p>
    </div>
  </section>
);

export default RecordPrompt;
