import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/sidebar/Sidebar";

const ProtectedLayout = () => {
  const { pathname } = useLocation();
  const isFreeConversationPage = pathname.startsWith("/ai-practice/free-conversation");

  return (
    <div className="min-h-screen bg-[#E9EBEF]">
      <div className="relative mx-auto h-screen w-full max-w-[430px] overflow-hidden bg-[#F8FAFB] text-slate-900">
        <Header />
        <Sidebar />

        <main
          className={`mt-16 h-[calc(100vh-64px-72px)] ${
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
