import { useEffect, useMemo, useState } from "react";
import missionLogo from "@/assets/mission-board.jpg.asset.json";
import nextgenLogo from "@/assets/nextgen-academy.jpg.asset.json";

const DURATION = 4600;

const CONFETTI_COLORS = [
  "#facc15", // yellow-400
  "#22d3ee", // cyan-400
  "#f472b6", // pink-400
  "#a78bfa", // violet-400
  "#fb923c", // orange-400
  "#4ade80", // green-400
];

function CelebrationBackground() {
  const confetti = useMemo(() => {
    return Array.from({ length: 48 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 1.5}s`,
      duration: `${2 + Math.random() * 2}s`,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 360,
    }));
  }, []);

  const balloons = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      left: `${5 + Math.random() * 90}%`,
      delay: `${Math.random() * 1.2}s`,
      duration: `${3.5 + Math.random() * 2}s`,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: 24 + Math.random() * 40,
    }));
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {balloons.map((b) => (
        <div
          key={`balloon-${b.id}`}
          className="absolute -bottom-20 rounded-full opacity-40 blur-[1px]"
          style={{
            left: b.left,
            width: b.size,
            height: b.size * 1.15,
            backgroundColor: b.color,
            animation: `balloon-rise ${b.duration} ease-in-out ${b.delay} infinite`,
          }}
        />
      ))}
      {confetti.map((c) => (
        <div
          key={`confetti-${c.id}`}
          className="absolute -top-8 rounded-sm opacity-80"
          style={{
            left: c.left,
            width: c.size,
            height: c.size * 0.55,
            backgroundColor: c.color,
            transform: `rotate(${c.rotation}deg)`,
            animation: `confetti-fall ${c.duration} linear ${c.delay} infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes balloon-rise {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 0.5; }
          50% { transform: translateY(-50vh) translateX(10px); }
          100% { transform: translateY(-110vh) translateX(-10px); opacity: 0; }
        }
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.9; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

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

      <CelebrationBackground />

      <div className="relative w-full max-w-md text-center">
        <h1 className="animate-in fade-in slide-in-from-bottom-2 font-display text-xl leading-tight font-extrabold tracking-tight text-foreground duration-700 sm:text-2xl">
          Mission Board Class 10 2027 presents you a brand new website
        </h1>

        <div className="mt-8 flex items-end justify-center gap-5 sm:gap-6">
          <img
            src={missionLogo.url}
            alt="Mission Board Class 10 2027 logo"
            className="animate-in fade-in zoom-in-75 h-28 w-28 rounded-2xl object-cover ring-1 ring-border delay-300 duration-700 fill-mode-backwards sm:h-32 sm:w-32"
          />
          <div className="animate-in fade-in zoom-in-75 flex flex-col items-center delay-500 duration-700 fill-mode-backwards">
            <img
              src={nextgenLogo.url}
              alt="Next Generation Academy logo"
              className="h-16 w-16 rounded-2xl object-cover ring-1 ring-border sm:h-20 sm:w-20"
            />
            <h2 className="mt-2 font-display text-lg font-bold leading-tight tracking-tight sm:text-xl">
              Next Generation Academy
            </h2>
            <p className="text-xs text-muted-foreground">(A Part Of Mission Board Family)</p>
          </div>
        </div>


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
