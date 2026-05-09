import { Mic, MicOff, NotebookPen } from "lucide-react";

interface MyNoteStudyCardProps {
  selectedSentence: string | null;
  isRecording?: boolean;
  isInteractionLocked?: boolean;
  onRecord: () => void;
}

const MyNoteStudyCard = ({
  selectedSentence,
  isRecording = false,
  isInteractionLocked = false,
  onRecord,
}: MyNoteStudyCardProps) => {
  const isSentenceSelected = !!selectedSentence;

  return (
    <section className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-[#278DFD]">
          <NotebookPen size={16} />
        </div>
        <h2 className="text-[16px] font-extrabold text-slate-800">
          연습 문장
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex min-h-[110px] items-center justify-center rounded-[18px] border border-slate-100 bg-[#F8F9FD] p-6 text-center">
          <p
            className={`break-keep text-[18px] leading-relaxed transition-colors duration-300 ${
              isSentenceSelected
                ? "font-extrabold text-slate-800"
                : "font-bold text-slate-400"
            }`}
          >
            {selectedSentence ?? "아래 목록에서 문장을 선택해주세요."}
          </p>
        </div>

        <button
          type="button"
          onClick={onRecord}
          disabled={!isSentenceSelected || isInteractionLocked}
          className={`flex h-[54px] w-full items-center justify-center gap-2 rounded-[16px] text-[16px] font-bold text-white shadow-lg transition-all duration-300 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none ${
            isRecording
              ? "animate-pulse bg-rose-500 shadow-rose-200/50"
              : "bg-[#278DFD] shadow-blue-300/50 active:scale-[0.98]"
          }`}
        >
          {isRecording ? (
            <>
              <MicOff size={20} />
              녹음 중...
            </>
          ) : (
            <>
              <Mic size={20} />
              발음 녹음하기
            </>
          )}
        </button>
      </div>
    </section>
  );
};

export default MyNoteStudyCard;
