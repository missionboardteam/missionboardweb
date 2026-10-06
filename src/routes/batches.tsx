import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { setChromeHidden } from "@/lib/chrome";
import { ArrowLeft, ArrowRight, GraduationCap, Search, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { MbAiLogo } from "@/components/MbAiLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
      { id: "s2", label: "Server 2", url: "https://nt.studyace.in/" },
      { id: "s3", label: "Server 3", url: "https://studyhulk-ntt.ai.studio/" },
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
      { id: "s2", label: "Server 2", url: "http://mj.Studyace.in" },
      { id: "s3", label: "Server 3", url: "http://mjstudyhulk.vercel.app/" },
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
      { id: "s2", label: "Server 2", url: "http://pwx.studyace.in" },
      { id: "s3", label: "Server 3", url: "https://studyhulk.primestudy.live" },
    ],
    accent: "var(--gradient-pink)",
  },
] as const;

function BatchesPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
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

  const platforms = [
    { id: "pw", name: "Physics Wallah", description: "Premium batches, lectures, notes, and study support", logo: pwLogo.url },
    { id: "nt", name: "Next Toppers", description: "Focused batches for fast revision and exam-ready practice", logo: nextToppersLogo.url },
    { id: "mj", name: "Mission JEET", description: "Exclusive high-speed learning ecosystem", logo: missionJeetLogo.url },
    { id: "practice", name: "Daily Practice 🎯", description: "English, Maths, Science & Social Science · Class 10", logo: null },
  ];
  const filtered = platforms.filter(p => `${p.name} ${p.description}`.toLowerCase().includes(query.toLowerCase().trim()));
  return (
    <main className="platform-page min-h-screen pb-36 font-sans">
      <div className="mx-auto max-w-3xl px-5 pt-10 sm:px-8 sm:pt-14">
        <h1 className="max-w-lg font-display text-4xl leading-tight font-extrabold sm:text-6xl">Choose your<br />platform</h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">Pick a learning ecosystem to open batches, notes and study support.</p>
        <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary/25 px-5 py-3 text-sm font-semibold"><GraduationCap className="h-5 w-5" /><strong className="text-lg">{platforms.length}</strong> platforms</span>
        <div className="relative mt-7"><Search className="pointer-events-none absolute top-1/2 left-5 h-5 w-5 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search platforms or exams" aria-label="Search platforms or exams" className="h-16 rounded-full border-0 bg-secondary pl-14 pr-5 text-base" /></div>
      </div>
      <div className="platform-divider mt-7 h-2 w-full" />
      <div className="mx-auto grid max-w-3xl gap-4 px-5 pt-5 sm:px-8">
        {filtered.map(p=><Button key={p.id} variant="ghost" onClick={()=>{if(p.id==='practice'){navigate({to:'/daily-practice'});return;}setServerId(null);setOpenId(p.id);}} className="platform-row group h-auto w-full justify-start gap-4 whitespace-normal rounded-3xl border border-border/40 bg-card px-4 py-5 text-left hover:bg-secondary sm:gap-5 sm:p-6">
          {p.logo?<img src={p.logo} alt={`${p.name} logo`} className="h-16 w-16 shrink-0 rounded-2xl object-contain sm:h-20 sm:w-20"/>:<span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-4xl sm:h-20 sm:w-20" aria-hidden="true">🎯</span>}
          <span className="min-w-0 flex-1"><span className="block font-display text-lg font-bold sm:text-2xl">{p.name}</span><span className="mt-1 block text-sm leading-relaxed font-normal text-muted-foreground sm:text-base">{p.description}</span>{p.id!=='practice'&&<span className="mt-2 block text-[10px] text-muted-foreground">Server 1 • Server 2 • Server 3</span>}</span>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive text-destructive-foreground transition-transform group-hover:translate-x-1 sm:h-12 sm:w-12"><ArrowRight className="!h-6 !w-6"/></span>
        </Button>)}
        {!filtered.length&&<p className="py-10 text-center text-sm text-muted-foreground">No platforms found.</p>}
      </div>
    </main>
  );
}
