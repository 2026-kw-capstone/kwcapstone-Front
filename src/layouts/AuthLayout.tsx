import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[#E9EBEF]">
      <main className="mx-auto flex min-h-screen w-full max-w-[430px] items-center justify-center bg-[#F8FAFB] px-4 py-6">
        <div className="w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
