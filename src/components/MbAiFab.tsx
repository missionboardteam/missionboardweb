import { Link, useLocation } from "@tanstack/react-router";
import { MbAiLogo } from "@/components/MbAiLogo";

/** Floating MB AI shortcut, shown above the bottom nav on every tab except MB AI. */
export function MbAiFab() {
  const { pathname } = useLocation();
  if (pathname.startsWith("/mb-ai")) return null;

  return (
    <Link
      to="/mb-ai"
      aria-label="Open MB AI"
      className="fixed right-4 bottom-24 z-40 flex items-center gap-2 rounded-full border border-accent/40 bg-card/70 py-1.5 pr-3.5 pl-1.5 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.75)] backdrop-blur-xl"
      style={{ animation: "mb-float 3.8s ease-in-out infinite" }}
    >
      <span
        className="pointer-events-none absolute inset-0 -z-10 rounded-full opacity-60 blur-lg"
        style={{
          backgroundImage: "var(--gradient-gold)",
          animation: "mbai-pulse 2.6s ease-in-out infinite",
        }}
      />
      <MbAiLogo className="h-9 w-9" />
      <span className="font-display text-xs font-extrabold tracking-tight text-accent">MB AI</span>
    </Link>
  );
}
