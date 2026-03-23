import { Outlet, Navigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/sidebar/Sidebar";
import { useAuth } from "../contexts/AuthContext";

const ProtectedLayout = () => {
  const { isLoggedIn } = useAuth();
  const { pathname } = useLocation();
  const isFreeConversationPage = pathname.startsWith("/ai-practice/free-conversation");

  // 실제 인증 가드 적용 시 사용
  // if (!isLoggedIn) {
  //   return <Navigate to="/login" replace />;
  // }

  return (
    <div className="h-screen overflow-hidden bg-[#F8FAFB] text-slate-900">
      <Header />
      <Sidebar />

      <main
        className={`mt-20 h-[calc(100vh-80px-76px)] md:ml-[260px] md:h-[calc(100vh-80px)] ${
          isFreeConversationPage ? "pb-0" : "pb-24"
        } md:pb-0 ${
          isFreeConversationPage ? "overflow-hidden" : "overflow-y-auto"
        }`}
      >
        <div
          className={
            isFreeConversationPage
              ? "h-full min-h-0"
              : "min-h-full px-4 py-4 sm:px-6 sm:py-6 md:p-8"
          }
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ProtectedLayout;
