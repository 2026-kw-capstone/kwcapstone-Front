import { PencilLine, Save } from "lucide-react";

interface UserProfileSectionProps {
  nickname: string;
  email: string;
  nicknameDraft: string;
  isEditingNickname: boolean;
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
  onNicknameDraftChange,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
}: UserProfileSectionProps) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white/90 p-5 backdrop-blur sm:p-6">
      <p className="text-sm font-semibold text-slate-500">사용자 정보</p>

      <div className="mt-3 flex flex-col gap-3 sm:mt-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {isEditingNickname ? (
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-500">닉네임</span>
              <input
                value={nicknameDraft}
                onChange={(event) => onNicknameDraftChange(event.target.value)}
                className="h-11 w-full max-w-xs rounded-xl border border-slate-300 px-3 text-base font-semibold text-slate-900 outline-none transition focus:border-emerald-400"
              />
            </label>
          ) : (
            <p className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              {nickname}
            </p>
          )}

          <p className="mt-2 text-sm text-slate-500 sm:text-base">{email}</p>
        </div>

        <div className="flex gap-2">
          {isEditingNickname ? (
            <>
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
                className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-emerald-500 px-4 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                <Save size={15} />
                저장
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onStartEdit}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <PencilLine size={15} />
              수정
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default UserProfileSection;
