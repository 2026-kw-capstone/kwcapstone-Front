import {
  Check,
  ChevronRight,
  Edit3,
  Key,
  LogIn,
  LogOut,
  User,
  UserMinus,
  UserPlus,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../apis/apiError";
import PasswordChangeModal from "../components/mypage/PasswordChangeModal";
import WithdrawModal from "../components/mypage/WithdrawModal";
import { useAuth } from "../contexts/AuthContext";
import { usePatchNickname } from "../hooks/mutations/usePatchNickname";
import { usePostSignout } from "../hooks/mutations/usePostSignout";
import { useGetMyInfo } from "../hooks/queries/useGetMyInfo";

type ModalType = "password" | "withdraw" | null;

type MenuListItemProps = {
  icon: LucideIcon;
  label: string;
  textClassName?: string;
  iconClassName?: string;
  disabled?: boolean;
  onClick: () => void;
};

const MenuListItem = ({
  icon: Icon,
  label,
  textClassName = "text-slate-800",
  iconClassName = "text-slate-400",
  disabled = false,
  onClick,
}: MenuListItemProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="flex w-full items-center gap-4 rounded-[16px] px-4 py-4 transition-colors hover:bg-slate-50 active:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
  >
    <Icon size={20} className={iconClassName} />
    <span className={`flex-1 text-left text-[16px] font-extrabold ${textClassName}`}>
      {label}
    </span>
    <ChevronRight size={18} className="text-slate-300" />
  </button>
);

const MyPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const {
    data: myInfo,
    isLoading: isMyInfoLoading,
    isError: isMyInfoError,
    error: myInfoError,
  } = useGetMyInfo();
  const { mutate: signout, isPending: isSignoutPending } = usePostSignout();
  const {
    changeNickname,
    isPending: isNicknamePending,
    error: nicknameError,
    reset: resetNicknameMutation,
  } = usePatchNickname();
  const [openedModal, setOpenedModal] = useState<ModalType>(null);
  const [isNicknameEditing, setIsNicknameEditing] = useState(false);
  const [nicknameInput, setNicknameInput] = useState("");
  const [nicknameValidationMessage, setNicknameValidationMessage] = useState("");

  const displayName = isLoggedIn
    ? isMyInfoLoading
      ? "불러오는 중..."
      : myInfo?.nickname ?? "-"
    : "방문자";
  const displayEmail = isLoggedIn ? myInfo?.email ?? "-" : "로그인이 필요합니다";

  useEffect(() => {
    if (!isNicknameEditing) {
      setNicknameInput(myInfo?.nickname ?? "");
    }
  }, [isNicknameEditing, myInfo?.nickname]);

  const closeModal = () => {
    setOpenedModal(null);
  };

  const startNicknameEdit = () => {
    resetNicknameMutation();
    setNicknameValidationMessage("");
    setNicknameInput(myInfo?.nickname ?? "");
    setIsNicknameEditing(true);
  };

  const cancelNicknameEdit = () => {
    resetNicknameMutation();
    setNicknameValidationMessage("");
    setNicknameInput(myInfo?.nickname ?? "");
    setIsNicknameEditing(false);
  };

  const handleNicknameConfirm = async () => {
    const trimmedNickname = nicknameInput.trim();

    if (!trimmedNickname) {
      setNicknameValidationMessage("닉네임을 입력해주세요.");
      return;
    }

    if (trimmedNickname.length > 20) {
      setNicknameValidationMessage("닉네임은 20자 이하로 입력해주세요.");
      return;
    }

    if (trimmedNickname === myInfo?.nickname) {
      setIsNicknameEditing(false);
      return;
    }

    try {
      setNicknameValidationMessage("");
      await changeNickname({ nickname: trimmedNickname });
      setIsNicknameEditing(false);
    } catch {
      // The error message is rendered below the input.
    }
  };

  const handlePasswordSubmit = () => {
    closeModal();
  };

  const handleWithdrawSubmit = () => {
    closeModal();
  };

  const profileErrorMessage = isMyInfoError
    ? getApiErrorMessage(
        myInfoError,
        "프로필 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요."
      )
    : "";
  const nicknameErrorMessage = nicknameError
    ? getApiErrorMessage(
        nicknameError,
        "닉네임 변경에 실패했습니다. 다시 시도해주세요."
      )
    : "";

  return (
    <div className="flex min-h-full flex-col bg-[#F4F6F8] pb-24 animate-fade-in">
      <div className="relative z-10 mb-6 rounded-b-[40px] bg-white px-6 pb-8 pt-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
        <div className="flex items-start gap-5">
          <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-[24px] bg-gradient-to-br from-[#278DFD] to-blue-300 text-white shadow-lg shadow-blue-200">
            <User size={36} strokeWidth={2.5} />
          </div>
          <div className="min-w-0 flex-1">
            {isNicknameEditing ? (
              <div className="mb-1 flex items-center gap-2">
                <input
                  value={nicknameInput}
                  onChange={(event) => {
                    setNicknameInput(event.target.value);
                    setNicknameValidationMessage("");
                    resetNicknameMutation();
                  }}
                  onKeyDown={(event) => {
                    if (event.key !== "Enter" || isNicknamePending) {
                      return;
                    }

                    event.preventDefault();
                    void handleNicknameConfirm();
                  }}
                  maxLength={20}
                  disabled={isNicknamePending}
                  className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 bg-[#F8F9FD] px-3 text-[18px] font-extrabold text-slate-900 outline-none transition focus:border-[#278DFD] focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
                  aria-label="닉네임"
                />
                <button
                  type="button"
                  onClick={() => {
                    void handleNicknameConfirm();
                  }}
                  disabled={isNicknamePending}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#278DFD] text-white transition active:scale-95 disabled:cursor-not-allowed disabled:bg-blue-300"
                  aria-label="닉네임 변경 확인"
                >
                  <Check size={18} />
                </button>
                <button
                  type="button"
                  onClick={cancelNicknameEdit}
                  disabled={isNicknamePending}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label="닉네임 변경 취소"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div className="mb-1 flex min-w-0 items-center gap-2">
                <h2 className="truncate text-[22px] font-black text-slate-900">
                  {displayName}
                </h2>
                {isLoggedIn && !isMyInfoLoading && !isMyInfoError ? (
                  <button
                    type="button"
                    onClick={startNicknameEdit}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-[#278DFD] active:scale-95"
                    aria-label="닉네임 수정"
                  >
                    <Edit3 size={16} />
                  </button>
                ) : null}
              </div>
            )}
            <p className="truncate text-[14px] font-medium text-slate-500">
              {displayEmail}
            </p>
            {profileErrorMessage ? (
              <p className="mt-2 rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-500">
                {profileErrorMessage}
              </p>
            ) : null}
            {isNicknameEditing &&
            (nicknameValidationMessage || nicknameErrorMessage) ? (
              <p className="mt-2 text-xs font-semibold text-rose-500">
                {nicknameValidationMessage || nicknameErrorMessage}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5 px-5">
        <section className="rounded-[24px] bg-white p-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
          <h3 className="px-4 py-3 pb-2 text-[12px] font-black uppercase tracking-widest text-[#278DFD]">
            Account
          </h3>

          {isLoggedIn ? (
            <>
              <MenuListItem
                icon={Key}
                label="비밀번호 변경"
                onClick={() => setOpenedModal("password")}
              />
              <MenuListItem
                icon={LogOut}
                label={isSignoutPending ? "로그아웃 중..." : "로그아웃"}
                disabled={isSignoutPending}
                onClick={() => {
                  if (!isSignoutPending) {
                    signout();
                  }
                }}
              />
              <MenuListItem
                icon={UserMinus}
                label="회원탈퇴"
                textClassName="text-rose-500"
                iconClassName="text-rose-400"
                onClick={() => setOpenedModal("withdraw")}
              />
            </>
          ) : (
            <>
              <MenuListItem
                icon={LogIn}
                label="로그인"
                iconClassName="text-[#278DFD]"
                onClick={() => navigate("/login")}
              />
              <MenuListItem
                icon={UserPlus}
                label="회원가입"
                iconClassName="text-[#278DFD]"
                onClick={() => navigate("/signup")}
              />
            </>
          )}
        </section>
      </div>

      {openedModal === "password" && (
        <PasswordChangeModal onClose={closeModal} onSubmit={handlePasswordSubmit} />
      )}

      {openedModal === "withdraw" && (
        <WithdrawModal onClose={closeModal} onSubmit={handleWithdrawSubmit} />
      )}
    </div>
  );
};

export default MyPage;
