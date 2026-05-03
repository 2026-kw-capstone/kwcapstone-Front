import { Plus, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { MyNoteSentenceItem } from "../../../types/myNoteType";

interface MyNoteSentenceListProps {
  sentences: MyNoteSentenceItem[];
  selectedSentenceId: number | null;
  isAdding?: boolean;
  onAddSentence: (text: string) => void;
  onSelectSentence: (sentence: MyNoteSentenceItem) => void;
  onDeleteSentence: (id: number) => void;
}

const MyNoteSentenceList = ({
  sentences,
  selectedSentenceId,
  isAdding = false,
  onAddSentence,
  onSelectSentence,
  onDeleteSentence,
}: MyNoteSentenceListProps) => {
  const [inputValue, setInputValue] = useState("");
  const canSubmit = !!inputValue.trim() && !isAdding;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = inputValue.trim();
    if (!trimmed) return;

    onAddSentence(trimmed);
    setInputValue("");
  };

  return (
    <section>
      <div className="mb-4 flex flex-col gap-3">
        <h2 className="ml-1 font-bold text-slate-900">저장된 문장</h2>

        <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="연습할 새 문장을 입력해주세요"
            className="min-h-12 w-full flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400"
          />
          <button
            type="submit"
            disabled={!canSubmit}
            className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition ${
              canSubmit
                ? "cursor-pointer bg-emerald-500 text-white shadow-sm hover:bg-emerald-600"
                : "cursor-not-allowed bg-slate-200 text-slate-400"
            }`}
            aria-label={isAdding ? "문장 추가 중" : "문장 추가"}
          >
            <Plus size={18} />
          </button>
        </form>
      </div>

      <div className="space-y-3">
        {sentences.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            아직 추가한 문장이 없습니다. 자주 연습할 문장을 먼저 등록해보세요.
          </div>
        ) : (
          sentences.map((sentence) => {
            const isActive = selectedSentenceId === sentence.id;

            return (
              <div
                key={sentence.id}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                  isActive
                    ? "border-emerald-300 bg-emerald-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-400 hover:shadow-sm"
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelectSentence(sentence)}
                  className="flex-1 text-left"
                >
                  <p
                    className={`text-sm leading-6 ${
                      isActive ? "font-semibold text-emerald-700" : "text-slate-700"
                    }`}
                  >
                    {sentence.text}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteSentence(sentence.id)}
                  className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-500"
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
