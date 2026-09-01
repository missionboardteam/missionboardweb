import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { navItems, menuLabels, activeNavIndex } from "@/lib/nav";
import { MbAiLogo } from "@/components/MbAiLogo";
import { useChromeHidden } from "@/lib/chrome";

export function StatusBar() {
  const { pathname } = useLocation();
  const hidden = useChromeHidden();
  const [open, setOpen] = useState(false);
  const activeIndex = activeNavIndex(pathname);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (hidden) return null;

  return (
    <>
      <div className="sticky top-0 z-50 px-2 pt-2">
        <div className="mx-auto flex max-w-lg items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.07] px-2.5 py-2 shadow-[0_10px_34px_-16px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-2xl backdrop-saturate-200">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="rounded-xl border border-white/15 bg-white/[0.08] p-2 text-foreground transition-colors hover:bg-white/[0.16]"
          >
            <Menu className="h-4.5 w-4.5" />
          </button>
          <span className="font-display text-sm font-extrabold tracking-tight text-gold">
            Mission Board
          </span>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[70] flex bg-background/70 backdrop-blur-sm">
          <div
            className="animate-in slide-in-from-left h-full w-[78%] max-w-xs overflow-y-auto border-r border-white/15 bg-card/95 p-4 duration-300"
            role="dialog"
            aria-label="Sections"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-base font-extrabold tracking-tight text-gold">
                Mission Board
              </span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="rounded-full border border-border bg-secondary p-1.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="mt-5 grid gap-1.5">
              {navItems.map(({ to, icon: Icon, brand }, i) => {
                const active = i === activeIndex;
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-2xl border px-3.5 py-3 font-display text-sm font-bold transition-colors ${
                      active
                        ? "border-accent/50 bg-secondary text-accent"
                        : "border-border bg-card/60 text-foreground/90 hover:border-primary/40"
                    }`}
                  >
                    {brand ? (
                      <MbAiLogo className="h-5 w-5" />
                    ) : (
                      <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
                    )}
                    {menuLabels[to] ?? to}
                  </Link>
                );
              })}
            </nav>
          </div>
          <button
            type="button"
            aria-label="Close menu"
            className="h-full flex-1"
            onClick={() => setOpen(false)}
          />
        </div>
      )}
    </>
  );
}
