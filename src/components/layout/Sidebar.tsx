"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Church } from "lucide-react";
import { APP_NAME } from "@/lib/app-config";
import { NAV_ITEMS } from "./nav-items";

type SidebarProps = {
  isExpanded: boolean;
  isMobileOpen: boolean;
  isHovered: boolean;
  onHoverChange: (hovered: boolean) => void;
  onNavigate: () => void;
};

export default function Sidebar({
  isExpanded,
  isMobileOpen,
  isHovered,
  onHoverChange,
  onNavigate,
}: SidebarProps) {
  const pathname = usePathname();

  const showLabels = isExpanded || isHovered || isMobileOpen;

  return (
    <aside
      onMouseEnter={() => !isExpanded && onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      className={`z-9999 fixed left-0 top-0 flex h-screen flex-col overflow-y-hidden border-r border-gray-200 bg-white px-5 pt-[65px] transition-all duration-300 ease-in-out lg:static lg:translate-x-0 lg:pt-0 ${
        isExpanded || isHovered ? "w-[290px]" : "w-[290px] lg:w-[90px]"
      } ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div
        className={`hidden items-center gap-2 pb-7 pt-8 lg:flex ${
          showLabels ? "justify-between" : "justify-center"
        }`}
      >
        <Link href="/" onClick={onNavigate} className="flex items-center gap-3">
          <span className="bg-brand-500 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
            <Church className="h-5 w-5 text-white" />
          </span>
          {showLabels ? (
            <span className="text-theme-xl font-bold text-gray-800">
              {APP_NAME}
            </span>
          ) : null}
        </Link>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto pt-6 duration-300 ease-linear lg:pt-0">
        <nav>
          <h3
            className={`mb-4 text-xs uppercase leading-[20px] text-gray-400 ${
              showLabels ? "" : "text-center"
            }`}
          >
            {showLabels ? "Menu" : "•••"}
          </h3>

          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const active = item.isActive(pathname);
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    title={showLabels ? undefined : item.label}
                    className={`menu-item group ${
                      active ? "menu-item-active" : "menu-item-inactive"
                    } ${showLabels ? "" : "lg:justify-center"}`}
                  >
                    <Icon
                      className={`h-5 w-5 shrink-0 ${
                        active
                          ? "menu-item-icon-active"
                          : "menu-item-icon-inactive"
                      }`}
                    />
                    {showLabels ? <span>{item.label}</span> : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
