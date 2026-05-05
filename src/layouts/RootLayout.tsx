import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";

const RootLayout = () => {
  return (
    <div className="flex min-h-screen min-h-[100dvh] w-full items-center justify-center bg-slate-900">
      <div className="relative flex h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden bg-white text-slate-900 shadow-2xl sm:h-[850px] sm:max-h-[100dvh] sm:rounded-[48px] sm:border-[12px] sm:border-slate-800">
        <Header />

        <main className="relative flex-1 overflow-x-hidden overflow-y-auto bg-[#F4F6F8]">
          <div className="min-h-full px-5 py-5 pb-24">
            <Outlet />
          </div>
        </main>

        <BottomNavigation />
      </div>
    </div>
  );
};

export default RootLayout;
