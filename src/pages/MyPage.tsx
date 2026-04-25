import { useEffect, useMemo, useState } from "react";
import { KeyRound, LogOut, UserX } from "lucide-react";
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
  const streakDays = 5;
  const averageAccuracy = 92;

  const [nickname, setNickname] = useState(initialNickname);
  const [nicknameDraft, setNicknameDraft] = useState(initialNickname);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [openedModal, setOpenedModal] = useState<ModalType>(null);

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

  const handlePasswordSubmit = () => {
    // TODO: API 연동 시 비밀번호 변경 로직 연결
    closeModal();
  };

  const handleWithdrawSubmit = () => {
    // TODO: API 연동 시 회원 탈퇴 로직 연결
    closeModal();
  };

  return (
    <section className="mx-auto w-full max-w-md">
      <div className="relative">
        <h1 className="mb-2 ml-2 text-2xl font-extrabold tracking-tight text-slate-900">
          마이페이지
        </h1>
        <UserProfileSection
          nickname={nickname}
          email={email}
          nicknameDraft={nicknameDraft}
          isEditingNickname={isEditingNickname}
          streakDays={streakDays}
          averageAccuracy={averageAccuracy}
          onNicknameDraftChange={setNicknameDraft}
          onStartEdit={handleStartEditNickname}
          onCancelEdit={handleCancelEditNickname}
          onSaveEdit={handleSaveNickname}
        />

        <section className="mt-5">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
            <h2 className="mt-4 ml-4 px-1 text-sm font-extrabold tracking-[0.08em] text-emerald-700">
              ACCOUNT
            </h2>
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
          </div>
        </section>
      </div>

      {openedModal === "password" && (
        <PasswordChangeModal onClose={closeModal} onSubmit={handlePasswordSubmit} />
      )}

      {openedModal === "withdraw" && (
        <WithdrawModal onClose={closeModal} onSubmit={handleWithdrawSubmit} />
      )}
    </section>
  );
};

export default MyPage;
