import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { setChromeHidden } from "@/lib/chrome";
import { ArrowLeft, ExternalLink, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { MbAiLogo } from "@/components/MbAiLogo";

function AskMbAiButton({ url }: { url: string }) {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [busy, setBusy] = useState(false);

  async function ask() {
    const userId = session?.user.id;
    if (!userId) {
      toast.error("Sign in to ask MB AI about this page");
      return;
    }
    setBusy(true);
    try {
      const { data, error } = await supabase
        .from("ai_threads")
        .insert({ user_id: userId, title: "About this batch page" })
        .select("id")
        .single();
      if (error) throw error;
      const shot = `https://image.thum.io/get/png/width/1024/crop/1400/${url}`;
      navigate({
        to: "/mb-ai/$threadId",
        params: { threadId: data.id },
        search: { model: "gemini", q: "I want to know more about this page.", shot },
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't open MB AI");
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={ask}
      disabled={busy}
      aria-label="Ask MB AI about this page"
      className="fixed right-4 bottom-40 z-50 flex items-center gap-2 rounded-full border border-accent/50 bg-card/80 py-1.5 pr-4 pl-1.5 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.75)] backdrop-blur-xl transition-transform active:scale-95 disabled:opacity-80"
    >
      <span
        className="pointer-events-none absolute inset-0 -z-10 rounded-full opacity-60 blur-lg"
        style={{ backgroundImage: "var(--gradient-gold)", animation: "mbai-pulse 2.6s ease-in-out infinite" }}
      />
      <span
        className="absolute -top-2.5 -left-1 rotate-[-8deg] rounded-full px-2 py-0.5 font-display text-[9px] font-extrabold tracking-widest text-primary-foreground shadow-md ring-2 ring-background"
        style={{ backgroundImage: "var(--gradient-pink)" }}
      >
        ✨ NEW
      </span>
      {busy ? <Loader2 className="h-9 w-9 animate-spin p-2 text-accent" /> : <MbAiLogo className="h-9 w-9" />}
      <span className="text-left leading-tight">
        <span className="block font-display text-xs font-extrabold tracking-tight text-accent">Ask MB AI</span>
        <span className="block text-[10px] font-semibold text-muted-foreground">about this page</span>
      </span>
    </button>
  );
}
import nextToppersLogo from "@/assets/batch-nt-logo.webp.asset.json";
import missionJeetLogo from "@/assets/batch-mj-logo.png.asset.json";
import pwLogo from "@/assets/batch-pw-logo.png.asset.json";

export const Route = createFileRoute("/batches")({
  head: () => ({
    meta: [
      { title: "Batches — Next Toppers, Mission JEET & PW" },
      {
        name: "description",
        content:
          "Open the 2026-27 batches of Next Toppers, Mission JEET and Physics Wallah right inside our website — no redirects.",
      },
      { property: "og:title", content: "Batches — Next Toppers, Mission JEET & PW" },
      {
        property: "og:description",
        content: "NEW 2026-27 batches available in one place, opened inside our own site.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BatchesPage,
});

const JOIN_TELEGRAM = "https://t.me/+pzCrMzIlK0cyMWRl";

const batches = [
  {
    id: "nt",
    name: "Next Toppers",
    tag: "Class 9-12 · Batches",
    logo: nextToppersLogo.url,
    servers: [
      { id: "s1", label: "Server 1", url: "https://nexthope.pages.dev/nt/" },
      { id: "s2", label: "Server 2", url: "https://studypanda.live/nexttoppers" },
      { id: "s3", label: "Server 3", url: "https://nt.studybeepro.site/" },
    ],
    accent: "var(--gradient-blue)",
  },
  {
    id: "mj",
    name: "Mission JEET",
    tag: "Board + Competitive",
    logo: missionJeetLogo.url,
    servers: [
      { id: "s1", label: "Server 1", url: "https://nexthope.pages.dev/mj" },
      { id: "s2", label: "Server 2", url: "https://studypanda.live/missionjeet" },
      { id: "s3", label: "Server 3", url: "https://studybeepro.site/mj/" },
    ],
    accent: "var(--gradient-gold)",
  },
  {
    id: "pw",
    name: "Physics Wallah (PW)",
    tag: "JEE / NEET / Boards",
    logo: pwLogo.url,
    servers: [
      { id: "s1", label: "Server 1", url: "https://nexthope.pages.dev/pw" },
      { id: "s2", label: "Server 2", url: "https://pw.studypanda.live/study/batches" },
      { id: "s3", label: "Server 3", url: "https://pw.studybeepro.site/study/batches" },
    ],
    accent: "var(--gradient-pink)",
  },
] as const;

function BatchesPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [serverId, setServerId] = useState<string | null>(null);
  const active = batches.find((b) => b.id === openId);
  const activeServer = serverId ? active?.servers.find((s) => s.id === serverId) : undefined;

  useEffect(() => {
    setChromeHidden(!!active);
    return () => setChromeHidden(false);
  }, [active]);

  if (active && !activeServer) {
    return (
      <div className="min-h-screen pb-28 font-sans">
        <div className="flex items-center gap-3 border-b border-border/70 bg-card/60 px-4 py-3 backdrop-blur">
          <button
            type="button"
            onClick={() => setOpenId(null)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-secondary/70"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <span className="ml-auto font-display text-sm font-extrabold tracking-tight text-gold">
            Mission Board
          </span>
        </div>

        <div className="mx-auto max-w-lg px-4 py-10 text-center">
          <img
            src={active.logo}
            alt={`${active.name} logo`}
            loading="lazy"
            className="mx-auto h-20 w-20 rounded-2xl bg-white object-contain p-2 ring-1 ring-border"
          />
          <h1 className="mt-5 font-display text-2xl font-extrabold tracking-tight">
            Select a Server to continue to <span className="text-gold">{active.name}</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            If one server is slow or down, simply pick another one.
          </p>

          <div className="mt-7 grid gap-3 text-left">
            {active.servers.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setServerId(s.id)}
                className="card-elevated flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-4 transition-transform duration-300 hover:-translate-y-0.5"
              >
                <span className="font-display text-base font-bold">{s.label}</span>
                <span
                  className="glow rounded-xl px-4 py-2 font-display text-xs font-bold text-primary-foreground"
                  style={{ backgroundImage: active.accent }}
                >
                  Continue
                </span>
              </button>
            ))}
          </div>

          <a
            href={JOIN_TELEGRAM}
            target="_blank"
            rel="noopener"
            className="mt-6 inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary px-4 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary/70"
          >
            <Send className="h-3.5 w-3.5" />
            Join Telegram
          </a>
        </div>
      </div>
    );
  }

  if (active && activeServer) {

    return (
      <div className="flex min-h-screen flex-col pb-28 font-sans">
        <div className="flex items-center gap-3 border-b border-border/70 bg-card/60 px-4 py-3 backdrop-blur">
          <button
            type="button"
            onClick={() => setServerId(null)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-secondary/70"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <img
            src={active.logo}
            alt={`${active.name} logo`}
            loading="lazy"
            className="h-8 w-8 rounded-lg bg-white object-contain p-0.5"
          />
          <p className="font-display text-sm font-bold">{active.name}</p>
          <span className="ml-auto font-display text-sm font-extrabold tracking-tight text-gold">
            Mission Board
          </span>
        </div>

        <div className="flex items-center gap-2 border-b border-border/70 bg-card/40 px-4 py-2 backdrop-blur">
          {active.servers.map((s) => {
            const isActive = s.id === activeServer.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setServerId(s.id)}
                className={`rounded-xl px-3 py-2 font-display text-xs font-bold transition-all duration-300 ${
                  isActive
                    ? "text-accent-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
                    : "border border-border bg-secondary text-muted-foreground hover:text-foreground"
                }`}
                style={isActive ? { backgroundImage: active.accent } : undefined}
              >
                {s.label}
              </button>
            );
          })}
          <a
            href={JOIN_TELEGRAM}
            target="_blank"
            rel="noopener"
            className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-border bg-secondary px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-secondary/70"
          >
            <Send className="h-3.5 w-3.5" />
            Join Telegram
          </a>
        </div>

        <iframe
          key={activeServer.url}
          src={activeServer.url}
          title={`${active.name} — ${activeServer.label}`}
          className="h-[calc(100vh-13rem)] w-full border-0 bg-white"
          allow="fullscreen; clipboard-read; clipboard-write; autoplay; encrypted-media"
          allowFullScreen
        />
        <AskMbAiButton url={activeServer.url} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 font-sans">
      <div className="hero-surface border-b border-border/70 px-4 py-12 text-center">
        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          <span className="text-gold">Batches</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          NEW 2026-27 batches — open them right here, you never leave our website.
        </p>
      </div>

      <div className="mx-auto grid max-w-2xl gap-4 px-4 py-8">
        {batches.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => {
              setServerId(null);
              setOpenId(b.id);
            }}
            className="card-elevated group relative overflow-hidden rounded-3xl border border-border bg-card p-5 text-left transition-transform duration-300 hover:-translate-y-1"
          >
            <div
              className="pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full opacity-25 blur-3xl"
              style={{ backgroundImage: b.accent }}
            />
            <div className="relative flex items-center gap-4">
              <img
                src={b.logo}
                alt={`${b.name} logo`}
                loading="lazy"
                className="h-16 w-16 shrink-0 rounded-2xl bg-white object-contain p-2 ring-1 ring-border"
              />

              <div className="min-w-0">
                <span className="inline-block rounded-full border border-border bg-secondary px-2.5 py-1 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                  {b.tag}
                </span>
                <h2 className="mt-2 font-display text-lg leading-tight font-bold">{b.name}</h2>
                <p className="mt-1 text-xs text-muted-foreground">Server 1 • Server 2 • Server 3</p>
              </div>
              <ExternalLink className="ml-auto h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
            </div>
            <span
              className="glow relative mt-5 flex w-full items-center justify-center rounded-xl px-5 py-3 font-display text-sm font-bold text-primary-foreground"
              style={{ backgroundImage: b.accent }}
            >
              Open {b.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
