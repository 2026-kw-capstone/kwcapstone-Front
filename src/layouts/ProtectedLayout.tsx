import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";
import { isRootTabPath } from "../constants/navigation";
import { useAuth } from "../contexts/AuthContext";

const ProtectedLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const isFreeConversationPage = pathname.startsWith("/ai-practice/free-conversation");
  const isFreeConversationChatPage = pathname.startsWith(
    "/ai-practice/free-conversation/chat/"
  );
  const isReportPage = pathname === "/report";
  const isScenarioPracticePage =
    pathname.startsWith("/ai-practice/scenario/") && pathname.includes("/level/");
  const hasBottomNavigation = isRootTabPath(pathname);

  useEffect(() => {
    if (isLoggedIn) {
      return;
    }

    window.alert("로그인이 필요한 서비스입니다.");
    navigate("/login", { replace: true });
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="flex min-h-screen min-h-[100dvh] w-full items-center justify-center bg-slate-900">
      <div className="relative flex h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden bg-white text-slate-900 shadow-2xl sm:h-[850px] sm:max-h-[100dvh] sm:rounded-[48px] sm:border-[12px] sm:border-slate-800">
        <Header />

        <main
          className={`relative flex-1 overflow-x-hidden bg-[#F4F6F8] ${
            isFreeConversationChatPage || isScenarioPracticePage
              ? "overflow-hidden"
              : "overflow-y-auto"
          }`}
        >
          <div
            className={
              isFreeConversationChatPage
                ? "h-full min-h-0"
                : isFreeConversationPage || isReportPage
                  ? "min-h-full"
                  : isScenarioPracticePage
                    ? "h-full min-h-0 px-5 pt-5 pb-0"
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
