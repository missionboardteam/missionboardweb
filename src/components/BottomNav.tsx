import { Link, useLocation } from "@tanstack/react-router";
import { navItems as items, activeNavIndex } from "@/lib/nav";
import { MbAiLogo } from "@/components/MbAiLogo";
import { useGlass } from "@/lib/glass";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Interpolate every visual ingredient of the bar between frosted and liquid. */
function useGlassStyle(level: number) {
  const t = Math.min(1, Math.max(0, level / 100));

  const blur = lerp(26, 9, t); // px — liquid glass stays clearer
  const saturate = lerp(1.4, 2.6, t); // liquid glass bleeds more colour through
  const bgAlpha = lerp(0.11, 0.045, t);
  const borderAlpha = lerp(0.18, 0.4, t);
  const sheenAlpha = lerp(0.12, 0.4, t); // top specular streak
  const refractionAlpha = lerp(0.08, 0.3, t); // top edge refraction arc
  const glowAlpha = lerp(0.1, 0.55, t); // gold inner glow
  const shadowStrength = lerp(0.55, 0.9, t);
  const highlight = lerp(0.28, 0.65, t); // inset top highlight

  return {
    backdropFilter: `blur(${blur.toFixed(2)}px) saturate(${saturate.toFixed(2)}) brightness(${lerp(
      1.05,
      1.12,
      t,
    ).toFixed(2)})`,
    backgroundColor: `rgba(255,255,255,${bgAlpha.toFixed(3)})`,
    borderColor: `rgba(255,255,255,${borderAlpha.toFixed(3)})`,
    boxShadow: `0 12px ${lerp(34, 52, t).toFixed(0)}px -12px rgba(0,0,0,${shadowStrength.toFixed(
      2,
    )}), inset 0 1px 0 rgba(255,255,255,${highlight.toFixed(2)}), inset 0 -1px 0 rgba(255,255,255,${lerp(
      0.06,
      0.14,
      t,
    ).toFixed(2)})`,
    sheenAlpha,
    refractionAlpha,
    glowAlpha,
    t,
  };
}

export function BottomNav() {
  const { pathname } = useLocation();
  const { level } = useGlass();
  const activeIndex = activeNavIndex(pathname);
  const glass = useGlassStyle(level);
  const liquid = glass.t; // 1 = fully liquid

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 px-2 pb-3">
      <div
        className="relative mx-auto max-w-lg overflow-hidden rounded-[30px] border bg-white/[0.06] backdrop-saturate-150"
        style={{
          backdropFilter: glass.backdropFilter,
          backgroundColor: glass.backgroundColor,
          borderColor: glass.borderColor,
          boxShadow: glass.boxShadow,
        }}
      >
        {/* specular sheen — a hard glossy streak on liquid glass */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `linear-gradient(180deg, rgba(255,255,255,${glass.sheenAlpha.toFixed(
              2,
            )}) 0%, rgba(255,255,255,${(glass.sheenAlpha * 0.25).toFixed(
              2,
            )}) 34%, rgba(255,255,255,0) 60%, rgba(255,255,255,${(
              glass.sheenAlpha * 0.3
            ).toFixed(2)}) 100%)`,
          }}
        />
        {/* edge refraction arc that swells with the liquid level */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[30px]"
          style={{
            opacity: 0.4 + liquid * 0.5,
            background: `radial-gradient(130% 110% at 50% -25%, rgba(255,255,255,${glass.refractionAlpha.toFixed(
              2,
            )}), transparent ${lerp(60, 52, liquid).toFixed(0)}%)`,
          }}
        />
        {/* liquid tint ripple — warm/cool colour bleed appears only on liquid glass */}
        {liquid > 0.05 && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: liquid * 0.5,
              background:
                "radial-gradient(60% 90% at 12% 0%, color-mix(in oklab, var(--accent) 26%, transparent), transparent 70%), radial-gradient(70% 100% at 88% 100%, color-mix(in oklab, var(--primary) 22%, transparent), transparent 70%)",
            }}
          />
        )}

        <div className="relative px-1.5 py-1.5">
          {/* sliding liquid-glass pill */}
          <div
            className="pointer-events-none absolute top-1.5 bottom-1.5 left-1.5 z-0 transition-transform duration-[550ms] ease-[cubic-bezier(0.22,1.2,0.32,1)]"
            style={{
              width: `calc((100% - 0.75rem) / ${items.length})`,
              transform: `translateX(calc(${activeIndex} * 100%))`,
            }}
          >
            <div
              className="relative h-full w-full overflow-hidden rounded-[24px] border border-white/35 backdrop-blur-xl backdrop-saturate-200"
              style={{
                backgroundColor: `rgba(255,255,255,${lerp(0.14, 0.1, liquid).toFixed(3)})`,
                boxShadow: `inset 0 1px 0 rgba(255,255,255,${lerp(
                  0.4,
                  0.62,
                  liquid,
                ).toFixed(2)}), inset 0 -10px 20px -12px rgba(255,255,255,${lerp(
                  0.25,
                  0.4,
                  liquid,
                ).toFixed(2)}), 0 8px 22px -10px rgba(0,0,0,0.65)`,
              }}
            >
              <div
                className="absolute inset-x-0 top-0 h-1/2"
                style={{
                  opacity: 0.6 + liquid * 0.35,
                  background: `linear-gradient(180deg, rgba(255,255,255,${lerp(
                    0.32,
                    0.5,
                    liquid,
                  ).toFixed(2)}), rgba(255,255,255,0))`,
                }}
              />
              <div
                className="absolute -inset-x-2 -bottom-3 h-7 blur-md"
                style={{
                  opacity: 0.35 + liquid * 0.45,
                  background: "var(--gradient-gold)",
                }}
              />
            </div>
          </div>

          <ul className="relative z-10 flex items-stretch justify-between">
            {items.map(({ to, label, icon: Icon, brand }, i) => {
              const active = i === activeIndex;
              return (
                <li key={to} className="min-w-0 flex-1">
                  <Link
                    to={to}
                    className={`relative flex flex-col items-center gap-0.5 rounded-[22px] px-0 py-2 text-[8.5px] font-semibold transition-all duration-300 ${
                      active
                        ? "scale-[1.08] text-accent"
                        : brand
                          ? "text-accent/90 hover:text-accent"
                          : "text-muted-foreground hover:text-foreground active:scale-95"
                    }`}
                  >
                    {brand ? (
                      <MbAiLogo className="h-[19px] w-[19px]" />
                    ) : (
                      <Icon
                        className="h-[18px] w-[18px] transition-transform duration-300"
                        strokeWidth={active ? 2.6 : 2}
                        style={
                          active
                            ? {
                                filter: `drop-shadow(0 0 ${lerp(5, 9, liquid).toFixed(
                                  0,
                                )}px color-mix(in oklab, var(--accent) ${lerp(
                                  55,
                                  80,
                                  liquid,
                                ).toFixed(0)}%, transparent))`,
                                animation: "mb-float 3.6s ease-in-out infinite",
                              }
                            : undefined
                        }
                      />
                    )}
                    <span className={`truncate ${active ? "tracking-tight" : ""}`}>{label}</span>
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
