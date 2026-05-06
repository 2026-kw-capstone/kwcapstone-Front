import { LockKeyhole } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface LockedSectionProps {
  message: string;
  children: ReactNode;
}

const LockedSection = ({ message, children }: LockedSectionProps) => {
  const { isLoggedIn } = useAuth();

  return (
    <div className="relative">
      <div className={isLoggedIn ? "" : "pointer-events-none opacity-35"}>
        {children}
      </div>

      {!isLoggedIn && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[24px] bg-white/70 px-5 text-center backdrop-blur-[2px]">
          <div className="flex w-full max-w-[250px] flex-col items-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-[#278DFD] shadow-sm">
              <LockKeyhole size={18} />
            </div>
            <p className="mb-4 text-[14px] font-extrabold leading-relaxed text-slate-800">
              {message}
            </p>
            <Link
              to="/login"
              className="inline-flex h-11 items-center justify-center rounded-[14px] bg-[#278DFD] px-5 text-[14px] font-bold text-white shadow-[0_8px_18px_rgba(39,141,253,0.28)] transition active:scale-95"
            >
              로그인하기
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default LockedSection;
