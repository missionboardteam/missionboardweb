import { useEffect, useState } from "react";
import { X, PartyPopper } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";

const KEY = "drive-announcement-seen";

export function DriveAnnouncement() {
  const { session, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    if (loading || !session) return;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(KEY)) return;
    const show = setTimeout(() => setOpen(true), 600);
    return () => clearTimeout(show);
  }, [loading, session]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => setCanClose(true), 500);
    return () => clearTimeout(t);
  }, [open]);

  function close() {
    sessionStorage.setItem(KEY, "1");
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/70 px-4 backdrop-blur-sm">
      <div className="animate-in fade-in zoom-in-95 card-elevated relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/15 bg-card/90 p-7 text-center duration-500">
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full opacity-40 blur-3xl"
          style={{ backgroundImage: "var(--gradient-gold)" }}
        />
        {canClose && (
          <button
            type="button"
            aria-label="Close announcement"
            onClick={close}
            className="animate-in fade-in absolute top-3 right-3 rounded-full border border-border bg-card/80 p-1.5 text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-secondary">
          <PartyPopper className="h-7 w-7 text-gold" />
        </div>
        <h2 className="relative mt-5 font-display text-lg leading-snug font-extrabold tracking-tight">
          GOOGLE DRIVE FOR NEW BOOKS 📚 🎉
        </h2>
        <p className="relative mt-2 text-sm text-muted-foreground">
          now available under Notifications Tab.
        </p>
        <Link
          to="/notifications"
          onClick={close}
          className="glow relative mt-6 flex w-full items-center justify-center rounded-xl px-5 py-3 font-display text-sm font-bold text-accent-foreground transition-opacity hover:opacity-90"
          style={{ backgroundImage: "var(--gradient-gold)" }}
        >
          Open Notifications
        </Link>
      </div>
    </div>
  );
}
