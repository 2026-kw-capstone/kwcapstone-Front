import { PencilLine, Save, UserRound } from "lucide-react";

interface UserProfileSectionProps {
  nickname: string;
  email: string;
  nicknameDraft: string;
  isEditingNickname: boolean;
  streakDays: number;
  averageAccuracy: number;
  onNicknameDraftChange: (value: string) => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
}

const UserProfileSection = ({
  nickname,
  email,
  nicknameDraft,
  isEditingNickname,
  streakDays,
  averageAccuracy,
  onNicknameDraftChange,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
}: UserProfileSectionProps) => {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-sm">
            <UserRound size={28} />
          </div>

          <div>
            {isEditingNickname ? (
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-500">닉네임</span>
                <input
                  value={nicknameDraft}
                  onChange={(event) => onNicknameDraftChange(event.target.value)}
                  className="h-11 w-full min-w-36 rounded-xl border border-slate-300 px-3 text-base font-semibold text-slate-900 outline-none transition focus:border-emerald-400"
                />
              </label>
            ) : (
              <p className="text-xl font-black tracking-tight text-slate-800">{nickname} 님</p>
            )}

            <p className="mt-1.5 text-sm text-slate-500">{email}</p>
          </div>
        </div>

        {isEditingNickname ? (
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={onCancelEdit}
              className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              취소
            </button>
            <button
              type="button"
              onClick={onSaveEdit}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <Save size={15} />
              저장
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onStartEdit}
            className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
          >
            <PencilLine size={15} />
            수정
          </button>
        )}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-center">
        <article className="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3.5">
          <p className="text-xs font-semibold tracking-wide text-emerald-700">연속 학습</p>
          <p className="mt-1 text-xl font-black tracking-tight text-slate-900">
            {streakDays}
            <span className="ml-1 text-base font-bold text-slate-600">일차</span>
          </p>
        </article>

        <article className="rounded-2xl border border-amber-100 bg-amber-50/80 px-4 py-3.5">
          <p className="text-xs font-semibold tracking-wide text-amber-700">평균 정확도</p>
          <p className="mt-1 text-xl font-black tracking-tight text-slate-900">
            {averageAccuracy}
            <span className="ml-0.5 text-xl text-amber-700">%</span>
          </p>
        </article>
      </div>
    </section>
  );
};

export default UserProfileSection;
