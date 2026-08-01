import { Link, useLocation } from "@tanstack/react-router";
import { Home, LayoutGrid, BookOpen, Bell, User } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/channels", label: "Channels", icon: LayoutGrid },
  { to: "/books", label: "Books", icon: BookOpen },
  { to: "/notifications", label: "Alerts", icon: Bell },
  { to: "/account", label: "Account", icon: User },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3">
      <div className="relative mx-auto max-w-lg overflow-hidden rounded-[26px] border border-white/15 bg-background/40 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-2xl backdrop-saturate-150">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 45%, rgba(255,255,255,0) 100%)",
          }}
        />
        <ul className="relative flex items-stretch justify-between px-1.5 py-1.5">
          {items.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <li key={to} className="flex-1">
                <Link
                  to={to}
                  className={`relative flex flex-col items-center gap-1 rounded-[20px] px-1 py-2 text-[10.5px] font-semibold transition-all duration-300 ${
                    active
                      ? "text-gold"
                      : "text-muted-foreground hover:text-foreground active:scale-95"
                  }`}
                >
                  {active && (
                    <span className="pointer-events-none absolute inset-0 rounded-[20px] border border-white/20 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-md" />
                  )}
                  <Icon
                    className="relative h-5 w-5"
                    strokeWidth={active ? 2.5 : 2}
                  />
                  <span className="relative">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
