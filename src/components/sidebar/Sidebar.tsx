import { useLocation } from "react-router-dom";
import { sidebarMenuItems } from "../../constants/sidebarMenu";
import SidebarMenuItem from "./SidebarMenuItem";

const Sidebar = () => {
  const { pathname } = useLocation();

  return (
    <aside
      className="
        fixed z-40 bg-white/95 backdrop-blur-sm
        left-0 right-0 bottom-0 h-[76px] border-t border-slate-200
        md:left-0 md:right-auto md:top-20 md:h-[calc(100vh-80px)] md:w-[260px] md:border-r md:border-t-0
      "
    >
      <div className="h-full px-2 py-2 md:px-4 md:py-6">
        <nav className="flex h-full items-center justify-around md:flex-col md:items-stretch md:justify-start md:gap-2">
          {sidebarMenuItems.map((item) => (
            <SidebarMenuItem
              key={item.path}
              item={item}
              isActive={item.match(pathname)}
            />
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;