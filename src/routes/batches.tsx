import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { ExternalLink } from "lucide-react";
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

const SERVER2_TELEGRAM = "https://t.me/+pzCrMzIlK0cyMWRl";

const batches = [
  {
    id: "nt",
    name: "Next Toppers",
    tag: "Class 9-12 · Batches",
    logo: nextToppersLogo.url,
    servers: [
      { id: "s1", label: "Server 1", url: "https://nexthope.pages.dev/nt/" },
      { id: "s2", label: "Server 2", url: "https://studypanda.live/nexttoppers" },
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
    ],
    accent: "var(--gradient-pink)",
  },
] as const;

function BatchesPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [serverId, setServerId] = useState<string>("s1");
  const active = batches.find((b) => b.id === openId);
  const activeServer = active?.servers.find((s) => s.id === serverId) ?? active?.servers[0];

  if (active && activeServer) {
    return (
      <div className="flex min-h-screen flex-col pb-28 font-sans">
        <div className="flex items-center gap-3 border-b border-border/70 bg-card/60 px-4 py-3 backdrop-blur">
          <button
            type="button"
            onClick={() => setOpenId(null)}
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
          {activeServer.id === "s2" && (
            <a
              href={SERVER2_TELEGRAM}
              target="_blank"
              rel="noopener"
              className="ml-auto inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-secondary/70"
            >
              <Send className="h-3.5 w-3.5" />
              Join Telegram
            </a>
          )}
        </div>

        <iframe
          key={activeServer.url}
          src={activeServer.url}
          title={`${active.name} — ${activeServer.label}`}
          className="h-[calc(100vh-13rem)] w-full border-0 bg-white"
          allow="fullscreen; clipboard-read; clipboard-write; autoplay; encrypted-media"
          allowFullScreen
        />
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
              setServerId("s1");
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
                <p className="mt-1 text-xs text-muted-foreground">Server 1 · Server 2</p>
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
