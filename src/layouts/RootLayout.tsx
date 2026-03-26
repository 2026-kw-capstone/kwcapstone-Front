import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/sidebar/Sidebar";

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-[#E9EBEF]">
      <div className="relative mx-auto h-screen w-full max-w-[430px] overflow-hidden bg-[#F8FAFB] text-slate-900">
        <Header />
        <Sidebar />

        <main className="mt-16 h-[calc(100vh-64px-72px)] overflow-y-auto">
          <div className="min-h-full px-4 py-4 pb-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default RootLayout;
