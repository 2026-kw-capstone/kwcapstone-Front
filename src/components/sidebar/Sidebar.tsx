import { useLocation } from "react-router-dom";
import { sidebarMenuItems } from "../../constants/sidebarMenu";
import SidebarMenuItem from "./SidebarMenuItem";

const Sidebar = () => {
  const { pathname } = useLocation();

  return (
    <aside
      className="
        fixed bottom-0 left-1/2 z-40 h-[72px] w-full max-w-[430px] -translate-x-1/2
        border-t border-slate-200 bg-white/95 backdrop-blur-sm
      "
    >
      <div className="h-full px-2 py-2">
        <nav className="flex h-full items-center justify-around">
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
