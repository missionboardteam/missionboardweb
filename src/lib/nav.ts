import {
  Home,
  LayoutGrid,
  BookOpen,
  GraduationCap,
  Bell,
  User,
  Bot,
  MessagesSquare,
} from "lucide-react";

export const navItems = [
  { to: "/", label: "Home", icon: Home, brand: false },
  { to: "/channels", label: "Channels", icon: LayoutGrid, brand: false },
  { to: "/books", label: "Books", icon: BookOpen, brand: false },
  { to: "/batches", label: "Batches", icon: GraduationCap, brand: false },
  { to: "/mb-ai", label: "MB AI", icon: Bot, brand: true },
  { to: "/room", label: "Room", icon: MessagesSquare, brand: false },
  { to: "/notifications", label: "Alerts", icon: Bell, brand: false },
  { to: "/account", label: "You", icon: User, brand: false },
] as const;

export const menuLabels: Record<string, string> = {
  "/": "Home",
  "/channels": "Channels",
  "/books": "Books",
  "/batches": "Batches",
  "/mb-ai": "MB AI",
  "/room": "Discussion Room",
  "/notifications": "Notifications",
  "/account": "Account",
};

export type NavItem = (typeof navItems)[number];

export function activeNavIndex(pathname: string) {
  const i = navItems.findIndex(({ to }) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to),
  );
  return Math.max(0, i);
}
