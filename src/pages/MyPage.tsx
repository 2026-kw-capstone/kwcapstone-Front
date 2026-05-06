import {
  ChevronRight,
  Key,
  LogIn,
  LogOut,
  User,
  UserMinus,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordChangeModal from "../components/mypage/PasswordChangeModal";
import WithdrawModal from "../components/mypage/WithdrawModal";
import { useAuth } from "../contexts/AuthContext";
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
  const { data: myInfo } = useGetMyInfo();
  const { mutate: signout, isPending: isSignoutPending } = usePostSignout();
  const [openedModal, setOpenedModal] = useState<ModalType>(null);

  const displayName = isLoggedIn ? myInfo?.nickname ?? "-" : "-";
  const displayEmail = isLoggedIn ? myInfo?.email ?? "-" : "-";

  const closeModal = () => {
    setOpenedModal(null);
  };

  const handlePasswordSubmit = () => {
    closeModal();
  };

  const handleWithdrawSubmit = () => {
    closeModal();
  };

  return (
    <div className="flex min-h-full flex-col bg-[#F4F6F8] pb-24 animate-fade-in">
      <div className="relative z-10 mb-6 rounded-b-[40px] bg-white px-6 pb-8 pt-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-5">
          <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-[24px] bg-gradient-to-br from-[#278DFD] to-blue-300 text-white shadow-lg shadow-blue-200">
            <User size={36} strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <h2 className="mb-1 truncate text-[22px] font-black text-slate-900">
              {displayName}
            </h2>
            <p className="truncate text-[14px] font-medium text-slate-500">
              {displayEmail}
            </p>
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
                label={isSignoutPending ? "로그아웃 중" : "로그아웃"}
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
