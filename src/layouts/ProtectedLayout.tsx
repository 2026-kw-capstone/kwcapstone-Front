import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";
import { isRootTabPath } from "../constants/navigation";

const ProtectedLayout = () => {
  const { pathname } = useLocation();
  const isFreeConversationPage = pathname.startsWith("/ai-practice/free-conversation");
  const hasBottomNavigation = isRootTabPath(pathname);

  // 액세스토큰이 있는 경우에만 접근할 수 있는 로직 추가

  return (
    <div className="flex min-h-screen min-h-[100dvh] w-full items-center justify-center bg-slate-900">
      <div className="relative flex h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden bg-white text-slate-900 shadow-2xl sm:h-[850px] sm:max-h-[100dvh] sm:rounded-[48px] sm:border-[12px] sm:border-slate-800">
        <Header />

        <main
          className={`relative flex-1 overflow-x-hidden bg-[#F4F6F8] ${
            isFreeConversationPage ? "overflow-hidden" : "overflow-y-auto"
          }`}
        >
          <div
            className={
              isFreeConversationPage
                ? "h-full min-h-0"
                : `min-h-full px-5 py-5 ${hasBottomNavigation ? "pb-24" : "pb-6"}`
            }
          >
            <Outlet />
          </div>
        </main>

        {hasBottomNavigation && <BottomNavigation />}
      </div>
    </div>
  );
};

export default ProtectedLayout;
