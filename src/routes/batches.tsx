import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
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

const batches = [
  {
    id: "nt",
    name: "Next Toppers",
    tag: "Class 9-12 · Batches",
    logo: nextToppersLogo,
    url: "https://nexthope.pages.dev/nt/",
    accent: "var(--gradient-blue)",
  },
  {
    id: "mj",
    name: "Mission JEET",
    tag: "Board + Competitive",
    logo: missionJeetLogo,
    url: "https://nexthope.pages.dev/mj",
    accent: "var(--gradient-gold)",
  },
  {
    id: "pw",
    name: "Physics Wallah (PW)",
    tag: "JEE / NEET / Boards",
    logo: pwLogo,
    url: "https://nexthope.pages.dev/pw",
    accent: "var(--gradient-pink)",
  },
] as const;

function BatchesPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const active = batches.find((b) => b.id === openId);

  if (active) {
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
            width={512}
            height={512}
            className="h-8 w-8 rounded-lg bg-white/5 object-contain"
          />
          <p className="font-display text-sm font-bold">{active.name}</p>
        </div>
        <iframe
          src={active.url}
          title={active.name}
          className="h-[calc(100vh-9.5rem)] w-full border-0 bg-white"
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
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
            onClick={() => setOpenId(b.id)}
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
                width={512}
                height={512}
                className="h-16 w-16 shrink-0 rounded-2xl bg-white/5 object-contain ring-1 ring-border"
              />
              <div className="min-w-0">
                <span className="inline-block rounded-full border border-border bg-secondary px-2.5 py-1 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                  {b.tag}
                </span>
                <h2 className="mt-2 font-display text-lg leading-tight font-bold">{b.name}</h2>
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
