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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = inputValue.trim();
    if (!trimmed) return;

    onAddSentence(trimmed);
    setInputValue("");
  };

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-slate-900 sm:text-xl">문장 목록</h2>

        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-2 sm:w-full sm:max-w-[720px] sm:flex-row"
        >
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="연습할 문장을 입력해주세요"
            className="min-h-12 w-full flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isAdding}
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition cursor-pointer hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-300 sm:px-5"
          >
            <Plus size={18} />
            {isAdding ? "추가 중..." : "추가"}
          </button>
        </form>
      </div>

      <div className="space-y-3">
        {sentences.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            아직 추가된 문장이 없습니다. 자주 연습할 문장을 먼저 등록해보세요.
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
                    className={`text-sm leading-6 sm:text-[15px] ${
                      isActive ? "font-semibold text-emerald-700" : "text-slate-700"
                    }`}
                  >
                    {sentence.text}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteSentence(sentence.id)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition cursor-pointer hover:bg-red-50 hover:text-red-500"
                  aria-label="문장 삭제"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-5 rounded-2xl bg-emerald-50/70 px-4 py-4 text-sm leading-6 text-slate-600">
        이전에 추가한 문장을 다시 연습할 수 있어요.
        <br />
        문장을 클릭하면 학습 영역으로 불러오고, 휴지통 버튼으로 바로 삭제할 수 있습니다.
      </div>
    </section>
  );
};

export default MyNoteSentenceList;