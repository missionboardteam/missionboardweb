import { useEffect, useState } from "react";
import missionLogo from "@/assets/mission-board.jpg.asset.json";
import nextgenLogo from "@/assets/nextgen-academy.jpg.asset.json";

const DURATION = 4600;

export function SplashScreen() {
  const [phase, setPhase] = useState<"in" | "out" | "done">("in");

  useEffect(() => {
    const out = setTimeout(() => setPhase("out"), DURATION);
    const done = setTimeout(() => setPhase("done"), DURATION + 600);
    return () => {
      clearTimeout(out);
      clearTimeout(done);
    };
  }, []);

  useEffect(() => {
    if (phase === "done") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-background px-6 transition-opacity duration-500 ${
        phase === "out" ? "opacity-0" : "opacity-100"
      }`}
      role="status"
      aria-label="Loading"
    >
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{ backgroundImage: "var(--gradient-gold)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full opacity-25 blur-3xl"
        style={{ backgroundImage: "var(--gradient-blue)" }}
      />

      <div className="relative w-full max-w-md text-center">
        <p className="animate-in fade-in slide-in-from-bottom-2 text-xs font-semibold tracking-[0.25em] text-muted-foreground uppercase duration-700">
          Mission Board Class 10 2027
        </p>
        <p className="animate-in fade-in mt-2 text-sm text-muted-foreground delay-200 duration-700 fill-mode-backwards">
          presents you a brand new website
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <img
            src={missionLogo.url}
            alt="Mission Board Class 10 2027 logo"
            className="animate-in fade-in zoom-in-75 h-24 w-24 rounded-2xl object-cover ring-1 ring-border delay-300 duration-700 fill-mode-backwards sm:h-28 sm:w-28"
          />
          <img
            src={nextgenLogo.url}
            alt="Next Generation Academy logo"
            className="animate-in fade-in zoom-in-75 h-24 w-24 rounded-2xl object-cover ring-1 ring-border delay-500 duration-700 fill-mode-backwards sm:h-28 sm:w-28"
          />
        </div>

        <h1 className="animate-in fade-in slide-in-from-bottom-3 mt-8 font-display text-2xl leading-tight font-extrabold tracking-tight delay-700 duration-700 fill-mode-backwards sm:text-3xl">
          Next Generation Academy
        </h1>
        <p className="animate-in fade-in mt-2 text-xs text-muted-foreground delay-1000 duration-700 fill-mode-backwards">
          (A Part Of Mission Board Family)
        </p>

        <div className="animate-in fade-in mx-auto mt-10 max-w-xs space-y-3 rounded-2xl border border-border bg-card/60 px-5 py-4 text-xs delay-1000 duration-1000 fill-mode-backwards">
          <div>
            <p className="text-muted-foreground">Owned By (Powered & Produced by)</p>
            <p className="mt-0.5 font-display font-bold text-gold">Navaan Sandhu</p>
            <a
              href="https://t.me/Navaansandhu_og"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              @Navaansandhu_og
            </a>
          </div>
          <div className="border-t border-border pt-3">
            <p className="text-muted-foreground">Website developed by</p>
            <p className="mt-0.5 font-display font-bold">BLU LEGACY</p>
            <a
              href="https://t.me/blu_legacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              @blu_legacy
            </a>
          </div>
        </div>

        <div className="mx-auto mt-8 h-1 w-40 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full"
            style={{
              backgroundImage: "var(--gradient-gold)",
              animation: `splash-progress ${DURATION}ms linear forwards`,
            }}
          />
        </div>
      </div>

      <style>{`@keyframes splash-progress { from { width: 0% } to { width: 100% } }`}</style>
    </div>
  );
}
