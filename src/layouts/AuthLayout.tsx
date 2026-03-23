import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-dvh bg-[#F8FAFB]">
      <main className="flex min-h-dvh items-center justify-center px-4 py-6 sm:px-6 sm:py-10">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;