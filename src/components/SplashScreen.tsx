import { useEffect, useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import introVideo from "@/assets/splash-intro-v2.mp4.asset.json";

const VIDEO_DURATION = 10050;
const CREDITS_DURATION = 3000;
const FADE_DURATION = 500;

const SEEN_KEY = "splash-seen-v2";

export const CREDITS = [
  { role: "Owner", name: "Waymaker", handle: "Navaansandhu_og" },
  { role: "Admin (Co-Owner)", name: "Soham Tekawade", handle: "Tekawade_Soham13" },
  { role: "Admin (Collaborator)", name: "Divyansh", handle: "divyanshhhh00" },
  { role: "Tech Manager (Website Builder)", name: "Mrigan", handle: "mriganx_XD" },
];

export function SplashScreen() {
  const [state, setState] = useState<"pending" | "video" | "credits" | "done">("pending");
  const [needsTapForSound, setNeedsTapForSound] = useState(false);
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
    // Sound is compulsory: try full-volume playback first. If the device
    // blocks unmuted autoplay, fall back to muted video with a tap-for-sound
    // prompt so audio still plays the moment the user taps.
    el.muted = false;
    el.volume = 1;
    el.play().catch(() => {
      el.muted = true;
      el.play().catch(() => undefined);
      setNeedsTapForSound(true);
    });
  }, [state]);

  function enableSound() {
    const el = videoRef.current;
    if (!el) return;
    el.muted = false;
    el.volume = 1;
    el.currentTime = 0;
    el.play().catch(() => undefined);
    setNeedsTapForSound(false);
  }

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
        <h1 className="animate-in fade-in slide-in-from-bottom-2 font-display text-2xl leading-tight font-extrabold tracking-tight text-foreground duration-500">
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
