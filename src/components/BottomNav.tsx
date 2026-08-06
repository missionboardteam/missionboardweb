import { Link, useLocation } from "@tanstack/react-router";
import { navItems as items, activeNavIndex } from "@/lib/nav";

export function BottomNav() {
  const { pathname } = useLocation();
  const activeIndex = activeNavIndex(pathname);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 px-2 pb-3">
      <div className="relative mx-auto max-w-lg overflow-hidden rounded-[30px] border border-white/20 bg-white/[0.06] shadow-[0_12px_46px_-12px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.07)] backdrop-blur-3xl backdrop-saturate-200">
        {/* specular sheen */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.06) 38%, rgba(255,255,255,0) 62%, rgba(255,255,255,0.05) 100%)",
          }}
        />
        {/* edge refraction */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[30px] opacity-70"
          style={{
            background:
              "radial-gradient(120% 100% at 50% -20%, rgba(255,255,255,0.2), transparent 60%)",
          }}
        />

        <div className="relative px-1.5 py-1.5">
          {/* sliding liquid-glass pill */}
          <div
            className="pointer-events-none absolute top-1.5 bottom-1.5 left-1.5 z-0 transition-transform duration-[550ms] ease-[cubic-bezier(0.22,1.2,0.32,1)]"
            style={{
              width: `calc((100% - 0.75rem) / ${items.length})`,
              transform: `translateX(calc(${activeIndex} * 100%))`,
            }}
          >
            <div className="relative h-full w-full overflow-hidden rounded-[24px] border border-white/35 bg-white/[0.16] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-10px_20px_-12px_rgba(255,255,255,0.3),0_8px_22px_-10px_rgba(0,0,0,0.65)] backdrop-blur-xl backdrop-saturate-200">
              <div
                className="absolute inset-x-0 top-0 h-1/2 opacity-85"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.4), rgba(255,255,255,0))",
                }}
              />
              <div
                className="absolute -inset-x-2 -bottom-3 h-7 opacity-70 blur-md"
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
                    className={`relative flex flex-col items-center gap-1 rounded-[24px] px-0.5 py-2 text-[9.5px] font-semibold transition-all duration-300 ${
                      active
                        ? "scale-[1.06] text-accent"
                        : "text-muted-foreground hover:text-foreground active:scale-95"
                    }`}
                  >
                    <Icon
                      className="h-[19px] w-[19px] transition-transform duration-300"
                      strokeWidth={active ? 2.6 : 2}
                      style={
                        active
                          ? {
                              filter:
                                "drop-shadow(0 0 7px color-mix(in oklab, var(--accent) 70%, transparent))",
                            }
                          : undefined
                      }
                    />
                    <span className={active ? "tracking-tight" : undefined}>{label}</span>
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
