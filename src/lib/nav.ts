import { Home, LayoutGrid, BookOpen, GraduationCap, Bell, User } from "lucide-react";

export const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/channels", label: "Channels", icon: LayoutGrid },
  { to: "/books", label: "Books", icon: BookOpen },
  { to: "/batches", label: "Batches", icon: GraduationCap },
  { to: "/notifications", label: "Alerts", icon: Bell },
  { to: "/account", label: "Account", icon: User },
] as const;

export type NavItem = (typeof navItems)[number];

export function activeNavIndex(pathname: string) {
  const i = navItems.findIndex(({ to }) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to),
  );
  return Math.max(0, i);
}
