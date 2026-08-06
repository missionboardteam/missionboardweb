import { useEffect, useState } from "react";
import { X, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { GoogleDriveIcon } from "@/components/GoogleDriveIcon";

const KEY = "announcements-seen";

type Stage = "drive" | "batches" | "done";

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
    finish();
  }

  function finish() {
    sessionStorage.setItem(KEY, "1");
    setStage("done");
  }

  if (!stage || stage === "done") return null;

  const isDrive = stage === "drive";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/70 px-4 backdrop-blur-sm">
      <div className="animate-in fade-in zoom-in-95 card-elevated relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/15 bg-card/90 p-7 text-center duration-500">
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full opacity-40 blur-3xl"
          style={{ backgroundImage: isDrive ? "var(--gradient-gold)" : "var(--gradient-blue)" }}
        />
        {canClose && (
          <button
            type="button"
            aria-label="Close announcement"
            onClick={next}
            className="animate-in fade-in absolute top-3 right-3 rounded-full border border-border bg-card/80 p-1.5 text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-white">
          {isDrive ? (
            <GoogleDriveIcon className="h-7 w-7" />
          ) : (
            <Sparkles className="h-7 w-7 text-primary" />
          )}
        </div>
        <h2 className="relative mt-5 font-display text-lg leading-snug font-extrabold tracking-tight">
          {isDrive ? "GOOGLE DRIVE FOR NEW BOOKS 📚 🎉" : "NEW 2026-27 BATCHES 🎓 🎉"}
        </h2>
        <p className="relative mt-2 text-sm text-muted-foreground">
          {isDrive ? "now available under Notifications Tab." : "now available in the Batches tab."}
        </p>
        <Link
          to={isDrive ? "/notifications" : "/batches"}
          onClick={finish}
          className="glow relative mt-6 flex w-full items-center justify-center rounded-xl px-5 py-3 font-display text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
          style={{ backgroundImage: isDrive ? "var(--gradient-gold)" : "var(--gradient-blue)" }}
        >
          {isDrive ? "Open Notifications" : "Go to Batches"}
        </Link>
      </div>
    </div>
  );
}
