import { ChevronRight, Sparkles, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import QuickMenuCard from "../components/home/QuickMenuCard";
import { homequickMenus } from "../constants/homeQuickMenus";
import { useAuth } from "../contexts/AuthContext";
import { useGetMyInfo } from "../hooks/queries/useGetMyInfo";

const HomePage = () => {
  const { isLoggedIn } = useAuth();
  const { data: myInfo } = useGetMyInfo();

  const userName = myInfo?.name ?? "사용자";

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 md:gap-8">
      <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-7 text-white shadow-xl shadow-emerald-100 sm:px-6 sm:py-8 md:rounded-[32px] md:px-8 md:py-10">
        <div className="relative z-10 max-w-2xl">
          <p className="mb-2 text-sm font-medium text-emerald-50 md:text-[15px]">
            오늘의 응원 메시지
          </p>

          <h2 className="text-2xl font-extrabold leading-tight sm:text-3xl md:text-4xl">
            {userName}님,
            <br />
            오늘도 함께 성장해요!
          </h2>

          <p className="mt-3 text-sm text-emerald-50/95 sm:text-base">
            당신의 목소리는 매일 더 또렷해지고 있습니다.
          </p>

          <div className="mt-5 md:mt-6">
            <button className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50">
              다른 문구 보기
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <Sparkles
          size={140}
          className="absolute right-4 top-1/2 hidden -translate-y-1/2 text-white/10 sm:block md:right-6 md:size-[180px]"
        />
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-xl font-bold text-slate-900 md:text-2xl">
            핵심 기능 바로가기
          </h3>

          <p className="text-sm text-slate-500">
            자주 사용하는 기능에 빠르게 접근해보세요
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-3">
          {homequickMenus.map((menu) => (
            <QuickMenuCard key={menu.path} menu={menu} />
          ))}
        </div>
      </section>

      <section className="flex justify-center">
        <div className="w-full max-w-4xl overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm md:rounded-[28px]">
          <div className="flex flex-col gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between md:px-6">
            <h3 className="text-lg font-bold md:text-xl">레포트 요약</h3>

            <Link
              to="/report"
              className="inline-flex items-center gap-1 text-sm font-semibold text-white/90 hover:text-white"
            >
              레포트 페이지로
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="p-5 md:p-6">
            {/* 실제 인증 연동 시 사용 */}
            {/*
            {!isLoggedIn ? (
              <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl bg-slate-50 px-4 text-center">
                <BarChart3 size={44} className="mb-4 text-slate-300" />

                <p className="text-lg font-bold text-slate-700 md:text-xl">
                  로그인이 필요합니다
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  로그인 후 훈련 결과와 성장 추이를 확인할 수 있어요.
                </p>

                <Link
                  to="/login"
                  className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  로그인하러 가기
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">이번 주 훈련 수</p>
                  <p className="mt-2 text-3xl font-extrabold text-slate-900">
                    12회
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">의미 전달 성공률</p>
                  <p className="mt-2 text-3xl font-extrabold text-slate-900">
                    84%
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">발화 안정성</p>
                  <p className="mt-2 text-3xl font-extrabold text-slate-900">
                    78점
                  </p>
                </div>
              </div>
            )}
            */}

            {/* 테스트용 UI */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">이번 주 훈련 수</p>
                <p className="mt-2 text-3xl font-extrabold text-slate-900">12회</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">의미 전달 성공률</p>
                <p className="mt-2 text-3xl font-extrabold text-slate-900">84%</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">발화 안정성</p>
                <p className="mt-2 text-3xl font-extrabold text-slate-900">78점</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
