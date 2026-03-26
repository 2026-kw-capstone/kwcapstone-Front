import { X } from "lucide-react";
import type { FormEvent } from "react";
import ModalBackdrop from "../ModalBackdrop";

interface PasswordChangeModalProps {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  isSubmitDisabled: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCurrentPasswordChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
}

const PasswordChangeModal = ({
  currentPassword,
  newPassword,
  confirmPassword,
  isSubmitDisabled,
  onClose,
  onSubmit,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
}: PasswordChangeModalProps) => {
  return (
    <ModalBackdrop onClose={onClose}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">비밀번호 변경</h2>
          <p className="mt-1 text-sm text-slate-500">
            API 연동 전 단계라 현재는 UI만 제공됩니다.
          </p>
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

      <form className="mt-5 space-y-3" onSubmit={onSubmit}>
        <ModalInput
          label="현재 비밀번호"
          value={currentPassword}
          onChange={onCurrentPasswordChange}
          placeholder="현재 비밀번호 입력"
          type="password"
        />
        <ModalInput
          label="새 비밀번호"
          value={newPassword}
          onChange={onNewPasswordChange}
          placeholder="새 비밀번호 입력"
          type="password"
        />
        <ModalInput
          label="새 비밀번호 확인"
          value={confirmPassword}
          onChange={onConfirmPasswordChange}
          placeholder="새 비밀번호 재입력"
          type="password"
        />

        {newPassword && confirmPassword && newPassword !== confirmPassword && (
          <p className="text-xs font-medium text-red-500">
            새 비밀번호와 확인 비밀번호가 일치하지 않습니다.
          </p>
        )}

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
            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-300"
          >
            변경하기
          </button>
        </div>
      </form>
    </ModalBackdrop>
  );
};

interface ModalInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: "text" | "password";
}

const ModalInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: ModalInputProps) => {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-semibold text-slate-700">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        className="h-11 w-full rounded-xl border border-slate-300 px-3 text-slate-900 outline-none transition focus:border-emerald-400"
      />
    </label>
  );
};

export default PasswordChangeModal;

