import {
  BookOpen,
  ClipboardList,
  HeartHandshake,
  LayoutGrid,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: (pathname: string) => boolean;
};

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/",
    label: "Dashboard",
    icon: LayoutGrid,
    isActive: (pathname) => pathname === "/",
  },
  {
    href: "/membership",
    label: "Membership",
    icon: Users,
    isActive: (pathname) => pathname.startsWith("/membership"),
  },
  {
    href: "/attendance",
    label: "Attendance",
    icon: ClipboardList,
    isActive: (pathname) => pathname.startsWith("/attendance"),
  },
  {
    href: "/bible-study-groups",
    label: "Bible Study Groups",
    icon: BookOpen,
    isActive: (pathname) => pathname.startsWith("/bible-study-groups"),
  },
  {
    href: "/funeral-contributions",
    label: "Funeral Contributions",
    icon: HeartHandshake,
    isActive: (pathname) => pathname.startsWith("/funeral-contributions"),
  },
];
