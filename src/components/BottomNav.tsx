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

  const activeIndex = Math.max(
    0,
    items.findIndex(({ to }) => (to === "/" ? pathname === "/" : pathname.startsWith(to))),
  );

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3">
      <div className="relative mx-auto max-w-lg overflow-hidden rounded-[28px] border border-white/20 bg-white/[0.07] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.28),inset_0_-1px_0_rgba(255,255,255,0.06)] backdrop-blur-3xl backdrop-saturate-200">
        {/* specular sheen */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 38%, rgba(255,255,255,0) 62%, rgba(255,255,255,0.05) 100%)",
          }}
        />
        {/* edge refraction */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[28px] opacity-70"
          style={{
            background:
              "radial-gradient(120% 100% at 50% -20%, rgba(255,255,255,0.18), transparent 60%)",
          }}
        />

        <div className="relative px-1.5 py-1.5">
          {/* sliding liquid-glass pill */}
          <div
            className="pointer-events-none absolute top-1.5 bottom-1.5 left-1.5 z-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1.2,0.32,1)]"
            style={{
              width: `calc((100% - 0.75rem) / ${items.length})`,
              transform: `translateX(calc(${activeIndex} * 100%))`,
            }}
          >
            <div className="relative h-full w-full overflow-hidden rounded-[22px] border border-white/30 bg-white/[0.14] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),inset_0_-8px_18px_-10px_rgba(255,255,255,0.25),0_6px_18px_-8px_rgba(0,0,0,0.6)] backdrop-blur-xl backdrop-saturate-200">
              <div
                className="absolute inset-x-0 top-0 h-1/2 opacity-80"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0))",
                }}
              />
              <div
                className="absolute -inset-x-2 -bottom-3 h-6 opacity-60 blur-md"
                style={{ background: "var(--gradient-gold)" }}
              />
            </div>
          </div>

          <ul className="relative z-10 flex items-stretch justify-between">
            {items.map(({ to, label, icon: Icon }, i) => {
              const active = i === activeIndex;
              return (
                <li key={to} className="flex-1">
                  <Link
                    to={to}
                    className={`relative flex flex-col items-center gap-1 rounded-[22px] px-1 py-2 text-[10.5px] font-semibold transition-colors duration-300 ${
                      active
                        ? "text-accent"
                        : "text-muted-foreground hover:text-foreground active:scale-95"
                    }`}
                  >
                    <Icon
                      className="h-5 w-5 transition-transform duration-300"
                      strokeWidth={active ? 2.5 : 2}
                      style={
                        active
                          ? { filter: "drop-shadow(0 0 6px color-mix(in oklab, var(--accent) 65%, transparent))" }
                          : undefined
                      }
                    />
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
