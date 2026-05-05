import { ChevronLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { getPageTitle, isRootTabPath } from "../constants/navigation";

const Header = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const title = getPageTitle(pathname);
  const isRootTab = isRootTabPath(pathname);

  return (
    <header className="relative z-30 flex h-[60px] shrink-0 items-center justify-between border-b border-slate-100 bg-white px-5">
      <div className="flex w-10 items-center justify-start">
        {!isRootTab && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="이전 페이지로 이동"
            className="-ml-1.5 rounded-full p-1.5 text-slate-800 transition-colors hover:bg-slate-100 active:scale-95"
          >
            <ChevronLeft size={26} strokeWidth={2.5} />
          </button>
        )}
      </div>

      <h1
        className={`flex-1 truncate text-[17px] font-black text-slate-900 ${
          isRootTab ? "ml-2 text-left text-xl text-[#278DFD]" : "text-center"
        }`}
      >
        {title}
      </h1>

      <div className="flex w-10 items-center justify-end" />
    </header>
  );
};

export default Header;
