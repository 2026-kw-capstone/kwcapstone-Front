import { useEffect, useMemo, useState, type FormEvent } from "react";
import { KeyRound, LogOut, UserRound, UserX } from "lucide-react";
import MyPageActionRow from "../components/mypage/MyPageActionRow";
import PasswordChangeModal from "../components/mypage/PasswordChangeModal";
import UserProfileSection from "../components/mypage/UserProfileSection";
import WithdrawModal from "../components/mypage/WithdrawModal";
import { useGetMyInfo } from "../hooks/queries/useGetMyInfo";
import { usePostSignout } from "../hooks/mutations/usePostSignout";

type ModalType = "password" | "withdraw" | null;

const MyPage = () => {
  const { data: myInfo } = useGetMyInfo();
  const { mutate: signout, isPending: isSignoutPending } = usePostSignout();

  const initialNickname = useMemo(() => myInfo?.nickname ?? "홍길동", [myInfo?.nickname]);
  const email = myInfo?.email ?? "name@email.com";

  const [nickname, setNickname] = useState(initialNickname);
  const [nicknameDraft, setNicknameDraft] = useState(initialNickname);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [openedModal, setOpenedModal] = useState<ModalType>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [withdrawConfirmText, setWithdrawConfirmText] = useState("");

  useEffect(() => {
    setNickname(initialNickname);
    setNicknameDraft(initialNickname);
  }, [initialNickname]);

  const openModal = (type: Exclude<ModalType, null>) => {
    setOpenedModal(type);
  };

  const closeModal = () => {
    setOpenedModal(null);
  };

  const handleStartEditNickname = () => {
    setNicknameDraft(nickname);
    setIsEditingNickname(true);
  };

  const handleSaveNickname = () => {
    const trimmed = nicknameDraft.trim();

    if (!trimmed) {
      return;
    }

    setNickname(trimmed);
    setIsEditingNickname(false);
  };

  const handleCancelEditNickname = () => {
    setNicknameDraft(nickname);
    setIsEditingNickname(false);
  };

  const handlePasswordSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // TODO: API 연동 시 비밀번호 변경 로직 연결
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    closeModal();
  };

  const handleWithdrawSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // TODO: API 연동 시 회원 탈퇴 로직 연결
    setWithdrawConfirmText("");
    closeModal();
  };

  const isPasswordFormInvalid =
    !currentPassword.trim() ||
    !newPassword.trim() ||
    !confirmPassword.trim() ||
    newPassword !== confirmPassword;

  const isWithdrawFormInvalid = withdrawConfirmText !== "탈퇴";

  return (
    <div className="mx-auto w-full max-w-md pb-6">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <UserRound size={18} />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
              마이페이지
            </h1>
          </div>
        </header>

        <div className="relative bg-gradient-to-br from-white via-slate-50 to-sky-50/70 px-5 py-6">
          <UserProfileSection
            nickname={nickname}
            email={email}
            nicknameDraft={nicknameDraft}
            isEditingNickname={isEditingNickname}
            onNicknameDraftChange={setNicknameDraft}
            onStartEdit={handleStartEditNickname}
            onCancelEdit={handleCancelEditNickname}
            onSaveEdit={handleSaveNickname}
          />

          <section className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white/90 backdrop-blur">
            <MyPageActionRow
              icon={<KeyRound size={18} />}
              title="비밀번호 변경"
              onClick={() => openModal("password")}
            />
            <MyPageActionRow
              icon={<LogOut size={18} />}
              title="로그아웃"
              onClick={() => {
                if (!isSignoutPending) {
                  signout();
                }
              }}
            />
            <MyPageActionRow
              icon={<UserX size={18} />}
              title="회원 탈퇴"
              titleClassName="text-red-500"
              iconClassName="text-red-500"
              onClick={() => openModal("withdraw")}
            />
          </section>
        </div>
      </section>

      {openedModal === "password" && (
        <PasswordChangeModal
          currentPassword={currentPassword}
          newPassword={newPassword}
          confirmPassword={confirmPassword}
          isSubmitDisabled={isPasswordFormInvalid}
          onClose={closeModal}
          onSubmit={handlePasswordSubmit}
          onCurrentPasswordChange={setCurrentPassword}
          onNewPasswordChange={setNewPassword}
          onConfirmPasswordChange={setConfirmPassword}
        />
      )}

      {openedModal === "withdraw" && (
        <WithdrawModal
          confirmText={withdrawConfirmText}
          isSubmitDisabled={isWithdrawFormInvalid}
          onClose={closeModal}
          onSubmit={handleWithdrawSubmit}
          onConfirmTextChange={setWithdrawConfirmText}
        />
      )}
    </div>
  );
};

export default MyPage;
