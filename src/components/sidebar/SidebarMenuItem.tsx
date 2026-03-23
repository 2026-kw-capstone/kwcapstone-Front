import { Link } from "react-router-dom";
import type { SidebarMenuItemType } from "../../constants/sidebarMenu";

interface SidebarMenuItemProps {
  item: SidebarMenuItemType;
  isActive: boolean;
}

const SidebarMenuItem = ({ item, isActive }: SidebarMenuItemProps) => {
  const Icon = item.icon;

  return (
    <Link
      to={item.path}
      className={`group flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-semibold transition-all
        md:flex-row md:justify-start md:gap-3 md:px-4 md:py-4 md:text-sm
        ${
          isActive
            ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-100"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        }`}
    >
      <Icon
        size={20}
        className={`${isActive ? "text-white" : "text-slate-500"} shrink-0`}
      />
      <span className="truncate">{item.label}</span>
    </Link>
  );
};

export default SidebarMenuItem;