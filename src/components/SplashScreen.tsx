import { useEffect, useState } from "react";
import missionLogo from "@/assets/mission-board-10-v2.jpg.asset.json";
import nextgenLogo from "@/assets/mission-board-1112-v2.jpg.asset.json";

const DURATION = 4600;
const FADE_DURATION = 500;

const SEEN_KEY = "splash-seen";

export function SplashScreen() {
  const [state, setState] = useState<"pending" | "playing" | "done">("pending");

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) {
      setState("done");
      return;
    }
    sessionStorage.setItem(SEEN_KEY, "1");
    setState("playing");

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => {
      setState("done");
      document.body.style.overflow = prev;
    }, DURATION + FADE_DURATION + 100);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = prev;
    };
  }, []);

  if (state !== "playing") return null;


  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-background px-6"
      style={{ animation: `splash-fade ${DURATION}ms linear forwards` }}
      role="status"
      aria-label="Loading"
    >
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{ backgroundImage: "var(--gradient-gold)" }}
      />
      <div
        className="pointer-events-none absolute top-1/3 -left-24 h-72 w-72 rounded-full opacity-45 blur-3xl"
        style={{ backgroundImage: "var(--gradient-gold)" }}
      />
      <div
        className="pointer-events-none absolute top-1/2 -right-24 h-72 w-72 rounded-full opacity-45 blur-3xl"
        style={{ backgroundImage: "var(--gradient-gold)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full opacity-50 blur-3xl"
        style={{ backgroundImage: "var(--gradient-gold)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-16 right-0 h-56 w-56 rounded-full opacity-15 blur-3xl"
        style={{ backgroundImage: "var(--gradient-blue)" }}
      />

      <div className="relative w-full max-w-md text-center">
        <h1 className="animate-in fade-in slide-in-from-bottom-2 font-display text-2xl leading-tight font-extrabold tracking-tight text-foreground duration-700 sm:text-3xl">
          Mission Board presents
        </h1>

        <img
          src={missionLogo.url}
          alt="Mission Board Class 10 2027 logo"
          className="animate-in fade-in zoom-in-75 mx-auto mt-6 h-28 w-28 rounded-3xl object-cover ring-1 ring-border delay-200 duration-700 fill-mode-backwards sm:h-32 sm:w-32"
        />

        <div className="animate-in fade-in mx-auto mt-6 grid max-w-xs gap-2.5 delay-500 duration-1000 fill-mode-backwards">
          {[
            {
              role: "Owner (Powered & Produced by)",
              name: "Navaan Sandhu",
              handle: "Navaansandhu_og",
            },
            { role: "Co-Owner", name: "Soham Tekawade", handle: "Tekawade_Soham13" },
            { role: "Tech Manager", name: "Mrigan", handle: "mriganx_XD" },
          ].map((p) => (
            <div
              key={p.handle}
              className="rounded-2xl border border-border bg-card/70 px-4 py-2.5 text-xs backdrop-blur"
            >
              <p className="font-semibold tracking-wide text-muted-foreground uppercase">
                {p.role}
              </p>
              <p className="mt-0.5 font-display text-base font-extrabold tracking-tight text-gold">
                {p.name}
              </p>
              <a
                href={`https://t.me/${p.handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                @{p.handle}
              </a>
            </div>
          ))}
        </div>

        <div className="animate-in fade-in mt-6 flex flex-col items-center delay-1000 duration-1000 fill-mode-backwards">
          <img
            src={nextgenLogo.url}
            alt="Mission Board Class 11 & 12 logo"
            className="h-14 w-14 rounded-2xl object-cover ring-1 ring-border"
          />
          <h2 className="mt-2 font-display text-base leading-tight font-bold tracking-tight">
            Mission Board Class 11 &amp; 12
          </h2>
          <p className="text-[11px] text-muted-foreground">(A Part Of Mission Board Family)</p>
        </div>
      </div>


      <style>{`
        @keyframes splash-fade {
          0% { opacity: 1; }
          ${((DURATION - FADE_DURATION) / DURATION) * 100}% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
