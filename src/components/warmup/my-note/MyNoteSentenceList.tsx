import { Plus, Trash2, Volume2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { MyNoteSentenceItem } from "../../../types/myNoteType";

interface MyNoteSentenceListProps {
  sentences: MyNoteSentenceItem[];
  selectedSentenceId: number | null;
  isAdding?: boolean;
  isDeleting?: boolean;
  onAddSentence: (text: string) => Promise<void> | void;
  onSelectSentence: (sentence: MyNoteSentenceItem) => void;
  onDeleteSentence: (id: number) => Promise<void> | void;
}

const MyNoteSentenceList = ({
  sentences,
  selectedSentenceId,
  isAdding = false,
  isDeleting = false,
  onAddSentence,
  onSelectSentence,
  onDeleteSentence,
}: MyNoteSentenceListProps) => {
  const [inputValue, setInputValue] = useState("");
  const canSubmit = !!inputValue.trim() && !isAdding;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = inputValue.trim();
    if (!trimmed) return;

    await onAddSentence(trimmed);
    setInputValue("");
  };

  return (
    <section>
      <div className="mb-4 flex flex-col gap-3">
        <h2 className="px-1 text-[16px] font-extrabold text-slate-900">
          저장된 문장
        </h2>

        <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="연습할 문장을 입력해주세요"
            className="h-[54px] w-full flex-1 rounded-[16px] border border-slate-200 bg-white px-4 text-[15px] font-medium text-slate-700 shadow-[0_2px_10px_rgba(0,0,0,0.02)] outline-none transition-all placeholder:text-slate-400 focus:border-[#278DFD] focus:ring-1 focus:ring-[#278DFD]"
          />
          <button
            type="submit"
            disabled={!canSubmit}
            className={`flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-[16px] transition-colors active:scale-95 ${
              canSubmit
                ? "cursor-pointer bg-[#278DFD] text-white shadow-[0_8px_18px_rgba(39,141,253,0.24)] hover:brightness-105"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
            }`}
            aria-label={isAdding ? "문장 추가 중" : "문장 추가"}
          >
            <Plus size={24} />
          </button>
        </form>
      </div>

      <div className="space-y-3">
        {sentences.length === 0 ? (
          <div className="rounded-[20px] bg-white px-4 py-8 text-center text-[14px] font-medium text-slate-500 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            아직 추가한 문장이 없습니다. 자주 연습할 문장을 먼저 등록해보세요.
          </div>
        ) : (
          sentences.map((sentence) => {
            const isActive = selectedSentenceId === sentence.sentenceId;

            return (
              <div
                key={sentence.sentenceId}
                className={`flex items-center gap-3 rounded-[20px] bg-white p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all ${
                  isActive
                    ? "scale-[1.01] border border-[#278DFD] shadow-[0_4px_16px_rgba(39,141,253,0.10)]"
                    : "border border-transparent hover:border-slate-100"
                }`}
              >
                {isActive && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#278DFD]">
                    <Volume2 size={16} strokeWidth={2.5} />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => onSelectSentence(sentence)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p
                    className={`break-keep text-[15px] leading-snug ${
                      isActive
                        ? "font-extrabold text-[#278DFD]"
                        : "font-bold text-slate-400"
                    }`}
                  >
                    {sentence.sentenceContent}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteSentence(sentence.sentenceId)}
                  disabled={isDeleting}
                  className={`inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                    isActive
                      ? "text-[#278DFD]/50 hover:bg-blue-50 hover:text-[#278DFD]"
                      : "text-slate-300 hover:bg-rose-50 hover:text-rose-500"
                  }`}
                  aria-label="문장 삭제"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default MyNoteSentenceList;
