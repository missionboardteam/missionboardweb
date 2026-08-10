import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { GoogleDriveIcon } from "@/components/GoogleDriveIcon";
import { MbAiLogo } from "@/components/MbAiLogo";

const KEY = "announcements-seen";

const CONFETTI = Array.from({ length: 18 }).map((_, i) => ({
  left: `${(i * 5.5 + (i % 3) * 4) % 100}%`,
  delay: `${(i % 6) * 0.25}s`,
  duration: `${1.8 + (i % 4) * 0.4}s`,
  color: ["#facc15", "#22d3ee", "#f472b6", "#a78bfa", "#fb923c", "#4ade80"][i % 6],
}));

type Stage = "drive" | "batches" | "mbai" | "done";

export function DriveAnnouncement() {
  const { session, loading } = useAuth();
  const [stage, setStage] = useState<Stage | null>(null);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    if (loading || !session) return;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(KEY)) return;
    const show = setTimeout(() => setStage("drive"), 600);
    return () => clearTimeout(show);
  }, [loading, session]);

  useEffect(() => {
    if (!stage || stage === "done") return;
    setCanClose(false);
    const t = setTimeout(() => setCanClose(true), 500);
    return () => clearTimeout(t);
  }, [stage]);

  function next() {
    if (stage === "drive") {
      setStage("batches");
      return;
    }
    if (stage === "batches") {
      setStage("mbai");
      return;
    }
    finish();
  }

  function finish() {
    sessionStorage.setItem(KEY, "1");
    setStage("done");
  }

  if (!stage || stage === "done") return null;

  const isDrive = stage === "drive";
  const isMbAi = stage === "mbai";
  const celebratory = !isDrive;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/70 px-4 backdrop-blur-sm">
      <div
        className={`animate-in fade-in zoom-in-95 card-elevated relative w-full max-w-sm overflow-hidden rounded-3xl border p-7 text-center duration-500 ${
          isDrive ? "border-white/15 bg-card/90" : "border-accent/40"
        }`}
        style={
          isDrive
            ? undefined
            : {
                backgroundImage: isMbAi
                  ? "radial-gradient(120% 90% at 50% 0%, oklch(0.34 0.15 285) 0%, oklch(0.2 0.07 275) 55%, oklch(0.14 0.03 265) 100%)"
                  : "radial-gradient(120% 90% at 50% 0%, oklch(0.32 0.14 265) 0%, oklch(0.18 0.06 265) 55%, oklch(0.14 0.03 265) 100%)",
              }
        }
      >
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full opacity-40 blur-3xl"
          style={{ backgroundImage: "var(--gradient-gold)" }}
        />
        {celebratory && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {CONFETTI.map((c, i) => (
              <span
                key={i}
                className="absolute -top-6 rounded-sm"
                style={{
                  left: c.left,
                  width: 7,
                  height: 12,
                  backgroundColor: c.color,
                  animation: `pop-confetti ${c.duration} linear ${c.delay} infinite`,
                }}
              />
            ))}
            <style>{`@keyframes pop-confetti {
              0% { transform: translateY(0) rotate(0deg); opacity: 0; }
              15% { opacity: 1; }
              100% { transform: translateY(420px) rotate(540deg); opacity: 0; }
            }`}</style>
          </div>
        )}
        {canClose && (
          <button
            type="button"
            aria-label="Close announcement"
            onClick={next}
            className="animate-in fade-in absolute top-3 right-3 z-10 rounded-full border border-border bg-card/80 p-1.5 text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {isMbAi ? (
          <MbAiLogo className="relative mx-auto h-20 w-20" />
        ) : (
          <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-white">
            {isDrive ? <GoogleDriveIcon className="h-7 w-7" /> : <span className="text-2xl">🎉</span>}
          </div>
        )}

        {isDrive && (
          <>
            <h2 className="relative mt-5 font-display text-lg leading-snug font-extrabold tracking-tight">
              GOOGLE DRIVE FOR NEW BOOKS 📚 🎉
            </h2>
            <p className="relative mt-2 text-sm text-muted-foreground">
              now available under Notifications Tab.
            </p>
          </>
        )}

        {stage === "batches" && (
          <>
            <h2
              className="relative mt-5 font-display text-2xl leading-tight font-extrabold tracking-tight"
              style={{
                backgroundImage: "var(--gradient-gold)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              🎊 NEW 2026-27 BATCHES 🎓
            </h2>
            <p className="relative mt-3 text-sm font-semibold text-foreground">
              Next Toppers, Mission JEET and Physics Wallah (PW) batches are now LIVE!
            </p>
            <p className="relative mt-1.5 text-xs text-muted-foreground">
              Open them right inside our website from the Batches tab.
            </p>
          </>
        )}

        {isMbAi && (
          <>
            <h2
              className="relative mt-4 font-display text-2xl leading-tight font-extrabold tracking-tight"
              style={{
                backgroundImage: "var(--gradient-gold)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              ✨ MB AI IS NOW LIVE ✨
            </h2>
            <p className="relative mt-3 text-sm font-semibold text-foreground">
              Mission Board AI — your personal 24x7 study buddy for every doubt.
            </p>
            <ul className="relative mx-auto mt-3 space-y-1.5 text-left text-xs text-muted-foreground">
              <li>📘 Instant doubt solving in Maths, Science, SST & more</li>
              <li>🧮 Step-by-step solutions for numericals and derivations</li>
              <li>🗓️ Personal revision plans, timetables and PYQ strategy</li>
              <li>💬 Ask in English, Hindi or Hinglish — anytime, free</li>
            </ul>
            <p className="relative mt-3 text-[11px] font-semibold text-accent">
              Study smarter, score higher — MB AI never sleeps.
            </p>
          </>
        )}

        <Link
          to={isDrive ? "/notifications" : stage === "batches" ? "/batches" : "/mb-ai"}
          onClick={isMbAi ? finish : next}
          className="glow relative mt-6 flex w-full items-center justify-center rounded-xl px-5 py-3 font-display text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
          style={{
            backgroundImage: isDrive
              ? "var(--gradient-gold)"
              : stage === "batches"
                ? "var(--gradient-pink)"
                : "var(--gradient-gold)",
          }}
        >
          {isDrive ? "Open Notifications" : stage === "batches" ? "🎉 Go to Batches" : "✨ Try MB AI now"}
        </Link>
      </div>
    </div>
  );
}
