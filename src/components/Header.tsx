import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { usePostSignout } from "../hooks/mutations/usePostSignout";
import { useGetMyInfo } from "../hooks/queries/useGetMyInfo";

const Header = () => {
  const { isLoggedIn } = useAuth();
  const { mutate: signout } = usePostSignout();
  const { data: myInfo } = useGetMyInfo();

  const userName = myInfo?.name ?? "사용자";

  return (
    <header className="fixed left-0 right-0 top-0 z-50 h-20 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 md:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 shadow-md shadow-emerald-200 md:h-11 md:w-11">
            <MessageCircle className="fill-white text-white" size={22} />
          </div>
          <h1 className="truncate text-xl font-extrabold tracking-tight text-slate-900 md:text-2xl">
            이음
          </h1>
        </Link>

        {/* 실제 인증 연동 시 사용 */}
        {/*
        {!isLoggedIn ? (
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600 md:gap-3">
            <Link
              to="/login"
              className="rounded-lg px-2 py-2 transition hover:bg-slate-100 hover:text-slate-900 md:px-3"
            >
              로그인
            </Link>
            <span className="text-slate-300">|</span>
            <Link
              to="/signup"
              className="rounded-lg px-2 py-2 transition hover:bg-slate-100 hover:text-slate-900 md:px-3"
            >
              회원가입
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700 md:gap-3">
            <span className="hidden rounded-lg bg-slate-100 px-3 py-2 sm:inline-flex">
              {userName}님 반갑습니다
            </span>
            <span className="hidden text-slate-300 sm:inline">|</span>
            <button
              onClick={() => signout()}
              className="cursor-pointer rounded-lg px-2 py-2 transition hover:bg-slate-100 hover:text-slate-900 md:px-3"
            >
              로그아웃
            </button>
          </div>
        )}
        */}

        {/* 테스트용 UI */}
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700 md:gap-3">
          <span className="hidden rounded-lg bg-slate-100 px-3 py-2 sm:inline-flex">
            {userName}님 반갑습니다
          </span>
          <span className="hidden text-slate-300 sm:inline">|</span>
          <Link
            to="/login"
            className="rounded-lg px-2 py-2 transition hover:bg-slate-100 hover:text-slate-900 md:px-3"
          >
            로그인
          </Link>
          <Link
            to="/signup"
            className="rounded-lg px-2 py-2 transition hover:bg-slate-100 hover:text-slate-900 md:px-3"
          >
            회원가입
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
