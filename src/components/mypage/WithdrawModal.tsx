import { ShieldAlert, X } from "lucide-react";
import type { FormEvent } from "react";
import ModalBackdrop from "../ModalBackdrop";

interface WithdrawModalProps {
  confirmText: string;
  isSubmitDisabled: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onConfirmTextChange: (value: string) => void;
}

const WithdrawModal = ({
  confirmText,
  isSubmitDisabled,
  onClose,
  onSubmit,
  onConfirmTextChange,
}: WithdrawModalProps) => {
  return (
    <ModalBackdrop onClose={onClose}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-red-500">
          <ShieldAlert size={20} />
          <h2 className="text-xl font-extrabold">회원 탈퇴</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 text-slate-500 transition hover:bg-slate-100"
          aria-label="닫기"
        >
          <X size={18} />
        </button>
      </div>

      <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm leading-6 text-red-700">
        탈퇴 시 계정 정보와 학습 기록이 삭제되며 복구할 수 없습니다.
      </p>

      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <label className="block text-sm">
          <span className="mb-1.5 block font-semibold text-slate-700">
            확인을 위해 아래 입력창에 "탈퇴"를 입력해주세요.
          </span>
          <input
            value={confirmText}
            onChange={(event) => onConfirmTextChange(event.target.value)}
            placeholder="탈퇴"
            className="h-11 w-full rounded-xl border border-slate-300 px-3 text-slate-900 outline-none transition focus:border-red-400"
          />
        </label>

        <div className="flex flex-col-reverse gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-300"
          >
            탈퇴하기
          </button>
        </div>
      </form>
    </ModalBackdrop>
  );
};

export default WithdrawModal;

