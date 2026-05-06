import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { MenuItem } from "../types/menuItem";

interface MenuSelectCardProps {
  item: MenuItem;
}

const MenuSelectCard = ({ item }: MenuSelectCardProps) => {
  const {
    title,
    description,
    to,
    icon: Icon,
    badgeIcon: BadgeIcon,
    badgeText,
    badgeClassName,
    backgroundIconClassName,
    hoverBorderClassName,
    actionClassName,
    footerText,
    footerIcons,
    variant = "light",
  } = item;

  const isDark = variant === "dark";
  const cardClassName = isDark
    ? "border-slate-700 bg-slate-800"
    : "border-slate-100 bg-white";
  const titleClassName = isDark ? "text-white" : "text-slate-900";
  const descriptionClassName = isDark ? "text-slate-300" : "text-slate-500";
  const footerBorderClassName = isDark ? "border-white/10" : "border-slate-100";
  const actionBaseClassName = isDark ? "bg-white/10" : "bg-slate-50 text-slate-400";
  const backgroundOpacityClassName = isDark ? "opacity-[0.05]" : "opacity-[0.03]";

  return (
    <Link
      to={to}
      className={`group relative overflow-hidden rounded-[28px] border p-6 shadow-[0_8px_24px_rgba(0,0,0,0.03)] transition-all active:scale-[0.98] ${cardClassName} ${hoverBorderClassName}`}
    >
      <div
        className={`absolute -top-6 -right-6 p-6 transition-all duration-500 group-hover:scale-110 group-hover:opacity-[0.08] ${backgroundOpacityClassName} ${backgroundIconClassName}`}
      >
        <Icon size={140} />
      </div>

      <div className="relative z-10">
        <div
          className={`mb-4 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-black ${badgeClassName}`}
        >
          <BadgeIcon size={12} />
          {badgeText}
        </div>

        <h2 className={`mb-2 text-[20px] font-black ${titleClassName}`}>
          {title}
        </h2>
        <p
          className={`max-w-[75%] break-keep text-[14px] font-medium leading-relaxed ${descriptionClassName}`}
        >
          {description}
        </p>

        <div
          className={`mt-6 flex items-center justify-between border-t pt-4 ${footerBorderClassName}`}
        >
          {footerIcons?.length ? (
            <div className="flex -space-x-2">
              {footerIcons.map((FooterIcon, index) => (
                <div
                  key={`${title}-footer-${index}`}
                  className={`flex h-7 w-7 items-center justify-center rounded-full border-2 shadow-sm ${
                    isDark
                      ? "border-slate-800 bg-slate-700 text-slate-300"
                      : "border-white bg-slate-50 text-slate-400"
                  }`}
                >
                  <FooterIcon size={12} />
                </div>
              ))}
            </div>
          ) : (
            <span className="text-[13px] font-bold text-slate-400">
              {footerText}
            </span>
          )}

          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${actionBaseClassName} ${actionClassName}`}
          >
            <ChevronRight size={20} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MenuSelectCard;
