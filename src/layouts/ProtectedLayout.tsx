import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/sidebar/Sidebar";

const ProtectedLayout = () => {
  const { pathname } = useLocation();
  const isFreeConversationPage = pathname.startsWith("/ai-practice/free-conversation");

  // 액세스토큰이 있는 경우에만 접근할 수 있는 로직 추가

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#E9EBEF]">
      <div className="relative mx-auto h-screen h-[100dvh] w-full max-w-[430px] overflow-hidden bg-[#F8FAFB] text-slate-900">
        <Header />
        <Sidebar />

        <main
          className={`mt-16 h-[calc(100vh-64px-72px)] h-[calc(100dvh-64px-72px)] ${
            isFreeConversationPage ? "pb-0" : "pb-6"
          } ${isFreeConversationPage ? "overflow-hidden" : "overflow-y-auto"}`}
        >
          <div className={isFreeConversationPage ? "h-full min-h-0" : "min-h-full px-4 py-4"}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProtectedLayout;
