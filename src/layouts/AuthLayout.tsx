import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen min-h-[100dvh] w-full items-center justify-center bg-slate-900">
      <main className="flex h-[100dvh] w-full max-w-[430px] items-start justify-center overflow-y-auto bg-[#F4F6F8] px-5 py-6 text-slate-900 shadow-2xl sm:h-[850px] sm:max-h-[100dvh] sm:items-center sm:rounded-[48px] sm:border-[12px] sm:border-slate-800">
        <div className="w-full animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
