import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { usePostSignout } from "../hooks/mutations/usePostSignout";
import { useGetMyInfo } from "../hooks/queries/useGetMyInfo";

const Header = () => {
  const { isLoggedIn } = useAuth();
  const { mutate: signout, isPending: isSignoutPending } = usePostSignout();
  const { data: myInfo } = useGetMyInfo();

  const userName = myInfo?.nickname ?? "사용자";

  return (
    <header className="fixed left-1/2 top-0 z-50 h-16 w-full max-w-[430px] -translate-x-1/2 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="flex h-full items-center justify-between px-4">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 shadow-sm shadow-emerald-200">
            <MessageCircle className="fill-white text-white" size={20} />
          </div>
          <h1 className="truncate text-xl font-extrabold tracking-tight text-slate-900">
            이음
          </h1>
        </Link>

        {!isLoggedIn ? (
          <div className="flex items-center gap-1 text-sm font-medium text-slate-600">
            <Link
              to="/login"
              className="rounded-lg px-2 py-2 transition hover:bg-slate-100 hover:text-slate-900"
            >
              로그인
            </Link>
            <span className="text-slate-300">|</span>
            <Link
              to="/signup"
              className="rounded-lg px-2 py-2 transition hover:bg-slate-100 hover:text-slate-900"
            >
              회원가입
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <span className="hidden rounded-lg bg-slate-100 px-3 py-2 min-[380px]:inline-flex">
              {userName}님 반갑습니다
            </span>
            <span className="hidden text-slate-300 min-[380px]:inline">|</span>
            <button
              type="button"
              disabled={isSignoutPending}
              onClick={() => signout()}
              className="cursor-pointer rounded-lg px-2 py-2 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSignoutPending ? "로그아웃 중..." : "로그아웃"}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
