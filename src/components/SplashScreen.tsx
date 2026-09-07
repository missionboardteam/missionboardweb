import { useEffect, useRef, useState } from "react";
import missionLogo from "@/assets/mission-board-10-v2.jpg.asset.json";
import nextgenLogo from "@/assets/mission-board-1112-v2.jpg.asset.json";
import introVideo from "@/assets/splash-intro.mp4.asset.json";

const VIDEO_DURATION = 7400;
const CREDITS_DURATION = 2500;
const FADE_DURATION = 500;

const SEEN_KEY = "splash-seen";

const CREDITS = [
  { role: "Owner", name: "Waymaker", handle: "Navaansandhu_og" },
  { role: "Admin (Co-Owner)", name: "Soham Tekawade", handle: "Tekawade_Soham13" },
  { role: "Admin (Collaborator)", name: "Divyansh", handle: "divyanshhhh00" },
  { role: "Tech Manager (Website Builder)", name: "Mrigan", handle: "mriganx_XD" },
];

export function SplashScreen() {
  const [state, setState] = useState<"pending" | "video" | "credits" | "done">("pending");
  const [muted, setMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) {
      setState("done");
      return;
    }
    sessionStorage.setItem(SEEN_KEY, "1");
    setState("video");

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const toCredits = setTimeout(() => setState("credits"), VIDEO_DURATION);
    const toDone = setTimeout(
      () => {
        setState("done");
        document.body.style.overflow = prev;
      },
      VIDEO_DURATION + CREDITS_DURATION + FADE_DURATION,
    );

    return () => {
      clearTimeout(toCredits);
      clearTimeout(toDone);
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    if (state !== "video") return;
    const el = videoRef.current;
    if (!el) return;
    el.play().catch(() => {
      el.muted = true;
      setMuted(true);
      el.play().catch(() => undefined);
    });
  }, [state]);

  if (state === "pending" || state === "done") return null;

  if (state === "video") {
    return (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black"
        role="status"
        aria-label="Loading"
      >
        <video
          ref={videoRef}
          src={introVideo.url}
          className="h-full w-full object-cover"
          playsInline
          autoPlay
          preload="auto"
        />
        {muted && (
          <button
            type="button"
            onClick={() => {
              const el = videoRef.current;
              if (!el) return;
              el.muted = false;
              setMuted(false);
              el.play().catch(() => undefined);
            }}
            className="absolute bottom-8 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur"
          >
            Tap for sound
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-background px-6"
      style={{ animation: `splash-fade ${CREDITS_DURATION + FADE_DURATION}ms linear forwards` }}
      role="status"
      aria-label="Loading"
    >
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{ backgroundImage: "var(--gradient-gold)" }}
      />
      <div
        className="pointer-events-none absolute top-1/2 -left-24 h-72 w-72 rounded-full opacity-45 blur-3xl"
        style={{ backgroundImage: "var(--gradient-gold)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full opacity-50 blur-3xl"
        style={{ backgroundImage: "var(--gradient-gold)" }}
      />

      <div className="relative w-full max-w-md text-center">
        <img
          src={missionLogo.url}
          alt="Mission Board Class 10 2027 logo"
          className="animate-in fade-in zoom-in-75 mx-auto h-20 w-20 rounded-3xl object-cover ring-1 ring-border duration-500"
        />
        <h1 className="animate-in fade-in slide-in-from-bottom-2 mt-4 font-display text-2xl leading-tight font-extrabold tracking-tight text-foreground duration-500">
          Mission Board presents
        </h1>

        <div className="animate-in fade-in mx-auto mt-4 grid max-w-xs gap-2 delay-200 duration-700 fill-mode-backwards">
          {CREDITS.map((p) => (
            <div
              key={p.handle}
              className="rounded-2xl border border-border bg-card/70 px-4 py-2 text-xs backdrop-blur"
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

        <div className="animate-in fade-in mt-4 flex flex-col items-center delay-500 duration-700 fill-mode-backwards">
          <img
            src={nextgenLogo.url}
            alt="Mission Board Class 11 & 12 logo"
            className="h-12 w-12 rounded-2xl object-cover ring-1 ring-border"
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            Mission Board Class 11 &amp; 12 (A Part Of Mission Board Family)
          </p>
        </div>
      </div>

      <style>{`
        @keyframes splash-fade {
          0% { opacity: 1; }
          ${(CREDITS_DURATION / (CREDITS_DURATION + FADE_DURATION)) * 100}% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
