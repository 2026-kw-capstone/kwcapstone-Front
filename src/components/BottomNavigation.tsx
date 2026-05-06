import { NavLink, useLocation } from "react-router-dom";
import { bottomNavigationItems } from "../constants/navigation"; 

const BottomNavigation = () => {
  const { pathname } = useLocation();

  return (
    <nav className="absolute bottom-0 z-40 flex h-[76px] w-full items-center justify-around border-t border-slate-100 bg-white/95 px-3 pb-safe backdrop-blur-xl">
      {bottomNavigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.match(pathname);

        return (
          <NavLink
            key={item.path}
            to={item.path}
            className="flex flex-1 flex-col items-center justify-center gap-1.5 py-2 transition-all duration-200 active:scale-90"
          >
            <Icon
              size={24}
              strokeWidth={isActive ? 2.5 : 2}
              className={
                isActive
                  ? "fill-[#278DFD]/20 text-[#278DFD] drop-shadow-sm"
                  : "text-slate-400"
              }
            />
            <span
              className={`text-[11px] font-black tracking-wide ${
                isActive ? "text-[#278DFD]" : "text-slate-400"
              }`}
            >
              {item.label}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default BottomNavigation;
