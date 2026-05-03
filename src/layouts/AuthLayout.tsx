import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#E9EBEF]">
      <main className="mx-auto flex min-h-screen min-h-[100dvh] w-full max-w-[430px] items-start justify-center overflow-y-auto bg-[#F8FAFB] px-4 py-6 sm:items-center">
        <div className="w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
