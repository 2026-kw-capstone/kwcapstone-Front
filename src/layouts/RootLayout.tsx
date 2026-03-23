import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/sidebar/Sidebar";

const RootLayout = () => {
  return (
    <div className="h-screen overflow-hidden bg-[#F8FAFB] text-slate-900">
      <Header />
      <Sidebar />

      <main className="mt-20 h-[calc(100vh-80px-76px)] overflow-y-auto md:ml-[260px] md:h-[calc(100vh-80px)]">
        <div className="min-h-full px-4 py-4 pb-24 sm:px-6 sm:py-6 md:p-8 md:pb-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default RootLayout;