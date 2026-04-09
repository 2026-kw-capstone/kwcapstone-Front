import { ChevronRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import QuickMenuCard from "../components/home/QuickMenuCard";
import { homequickMenus } from "../constants/homeQuickMenus";
import { useGetMyInfo } from "../hooks/queries/useGetMyInfo";

const HomePage = () => {
  const { data: myInfo } = useGetMyInfo();

  const userName = myInfo?.nickname ?? "사용자";

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-5">
      <section className="relative overflow-hidden rounded-[22px] bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-6 text-white shadow-md shadow-emerald-200">
        <div className="relative z-10 max-w-[75%]">
          <p className="mb-2 text-xs font-medium text-emerald-50">오늘의 응원 메시지</p>

          <h2 className="text-[30px] font-extrabold leading-tight">
            {userName}님,
            <br />
            오늘도 함께 성장해요!
          </h2>

          <p className="mt-3 text-sm text-emerald-50/95">당신의 목소리는 매일 더 또렷해지고 있습니다.</p>

          <div className="mt-5">
            <button className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50">
              다른 문구 보기
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <Sparkles size={112} className="absolute -bottom-3 -right-2 text-white/20" />
      </section>

      <section>
        <div className="mb-3 flex flex-col gap-1">
          <h3 className="text-[28px] font-bold leading-tight text-slate-900">핵심 기능 바로가기</h3>
          <p className="text-xs text-slate-500">자주 사용하는 기능에 빠르게 접근해보세요.</p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {homequickMenus.map((menu) => (
            <QuickMenuCard key={menu.path} menu={menu} />
          ))}
        </div>
      </section>

      <section className="flex justify-center">
        <div className="w-full overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-sm">
          <div className="flex justify-between bg-gradient-to-r from-slate-800 to-slate-700 px-4 py-3 text-white">
            <h3 className="text-lg font-bold">레포트 요약</h3>

            <Link
              to="/report"
              className="inline-flex items-center gap-1 text-xs font-semibold text-white/90 hover:text-white"
            >
              레포트 페이지로
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">이번 주 훈련 수</p>
                <p className="mt-2 text-3xl font-extrabold text-slate-900">12회</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">의미 전달 성공률</p>
                <p className="mt-2 text-3xl font-extrabold text-slate-900">84%</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
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
