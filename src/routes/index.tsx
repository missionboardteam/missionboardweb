import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, GraduationCap, Sparkles } from "lucide-react";
import ntLogo from "@/assets/batch-nt-logo.webp.asset.json";
import mjLogo from "@/assets/batch-mj-logo.png.asset.json";
import pwLogo from "@/assets/batch-pw-logo.png.asset.json";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SplashScreen, CREDITS } from "@/components/SplashScreen";
import { FamilyBanner } from "@/components/FamilyBanner";
import {
  channels,
  ChannelCard,
  TelegramIcon,
  MISSION_LINK,
  NEXTGEN_LINK,
  CLASS10_DISCUSSION_LINK,
} from "@/lib/channels";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mission Board Class 10, 11 & 12 | Free Study Material" },
      {
        name: "description",
        content:
          "Free CBSE Class 10 Board 2027 and Class 11-12 JEE/NEET notes, PDFs and exclusive material. Join our Telegram channels for daily updates.",
      },
      {
        property: "og:title",
        content: "Mission Board Class 10, 11 & 12 | Free Study Material",
      },
      {
        property: "og:description",
        content:
          "Premium notes, sample papers and exclusive material for Class 10, 11 and 12 — absolutely free on Telegram.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        property: "og:image",
        content:
          "https://missionboardweb.lovable.app/__l5e/assets-v1/d9fd4746-0575-4ae9-ae16-b79de379db07/mission-board-10-v2.jpg",
      },
      { property: "og:image:width", content: "640" },
      { property: "og:image:height", content: "640" },
      { property: "og:image:type", content: "image/jpeg" },
      {
        name: "twitter:image",
        content:
          "https://missionboardweb.lovable.app/__l5e/assets-v1/d9fd4746-0575-4ae9-ae16-b79de379db07/mission-board-10-v2.jpg",
      },
    ],
  }),
  component: Index,
});

const stats = [
  { value: "5", label: "Telegram channels" },
  { value: "100%", label: "Free forever" },
  { value: "10–12", label: "Classes covered" },
];

const faqs = [
  {
    q: "What are these channels about?",
    a: "Mission Board Class 10 2027 covers everything for the CBSE Class 10 board exams, while Mission Board Class 11 & 12 covers Class 11 and 12 (CBSE boards plus JEE and NEET foundation). Both share notes, books and exclusive study material.",
  },
  {
    q: "Is everything really free?",
    a: "Yes. Every note, book and PDF shared on both channels is completely free. There is no paid plan, no hidden charges and no subscription of any kind.",
  },
  {
    q: "How do I join?",
    a: "Tap the join button on either channel card above. Telegram will open and you can join with a single tap — no sign-up form and no personal details needed.",
  },
  {
    q: "Which subjects are covered?",
    a: "Class 10: Science, Mathematics, Social Science, English and Hindi. Class 11 and 12: Physics, Chemistry, Mathematics and Biology, along with board-focused resources.",
  },
  {
    q: "What kind of material is shared?",
    a: "Chapter-wise notes, NCERT solutions, sample papers, previous year questions, mind maps, formula sheets, revision material and important question banks.",
  },
  {
    q: "How often is new content posted?",
    a: "New material is posted regularly — usually every day — and uploads increase around exam season and before board exams.",
  },
  {
    q: "Can I request specific notes or books?",
    a: "Yes. Post your request in the channel comments and we try to arrange the material as soon as possible.",
  },
  {
    q: "Do I need a Telegram account?",
    a: "Yes, a free Telegram account is required. Install Telegram from the Play Store or App Store, sign up with your phone number and then tap the join link.",
  },
  {
    q: "Is the material useful for other boards too?",
    a: "The content is designed around the CBSE and NCERT syllabus, but most state boards follow a similar syllabus, so the notes are helpful for them as well.",
  },
  {
    q: "How can I contact the admin?",
    a: "Message directly inside the channel or reply to any post. Admins respond to genuine study-related queries.",
  },
];

function Index() {
  return (
    <div className="min-h-screen pb-28 font-sans">
      <SplashScreen />
      <FamilyBanner />
      <header className="sticky top-0 z-30 border-b border-white/10 bg-white/[0.04] backdrop-blur-2xl backdrop-saturate-150">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <span className="font-display text-sm font-bold tracking-tight sm:text-base">
            Mission Board × Aarambhian Legacy
          </span>
          <a
            href="#channels"
            className="glass-chip shine-sweep rounded-full px-4 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-white/[0.14]"
          >
            Join now
          </a>
        </div>
      </header>

      <main>
        <section className="hero-surface relative overflow-hidden border-b border-border">
          {/* floating liquid-glass decorations */}
          <div className="pointer-events-none absolute inset-0">
            <div
              className="mb-drift absolute -top-12 left-[4%] h-40 w-40 rounded-full border border-white/10 opacity-40"
              style={{
                background:
                  "radial-gradient(circle at 32% 30%, color-mix(in oklab, var(--primary) 55%, transparent), transparent 70%)",
                animationDuration: "19s",
              }}
            />
            <div
              className="mb-drift absolute top-[30%] right-[2%] h-52 w-52 rounded-full border border-white/10 opacity-35"
              style={{
                background:
                  "radial-gradient(circle at 60% 40%, color-mix(in oklab, var(--accent) 45%, transparent), transparent 70%)",
                animationDuration: "24s",
                animationDelay: "2.5s",
              }}
            />
            <span
              className="glass-chip absolute top-[14%] right-[10%] rounded-2xl p-2.5"
              style={{ animation: "mb-float 6.5s ease-in-out infinite" }}
            >
              <GraduationCap className="h-5 w-5 text-accent" strokeWidth={2.2} />
            </span>
            <span
              className="glass-chip absolute top-[46%] left-[7%] rounded-2xl p-2.5"
              style={{ animation: "mb-float 7.5s ease-in-out infinite", animationDelay: "1.4s" }}
            >
              <BookOpen className="h-5 w-5 text-primary" strokeWidth={2.2} />
            </span>
            <span
              className="glass-chip absolute bottom-[12%] right-[22%] rounded-2xl p-2.5"
              style={{ animation: "mb-float 7s ease-in-out infinite", animationDelay: "2.6s" }}
            >
              <Sparkles className="h-5 w-5 text-accent" strokeWidth={2.2} />
            </span>
          </div>

          <div className="relative mx-auto max-w-5xl px-4 py-16 text-center sm:py-24">
            <span className="glass-chip animate-in fade-in slide-in-from-bottom-2 inline-block rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase duration-500">
              Quality education for all
            </span>
            <h1 className="animate-in fade-in slide-in-from-bottom-4 mt-6 font-display text-4xl leading-[1.1] font-extrabold tracking-tight duration-700 fill-mode-backwards delay-100 sm:text-6xl">
              Free notes & books for
              <br />
              <span className="text-gold">Class 10, 11 and 12</span>
            </h1>
            <p className="animate-in fade-in slide-in-from-bottom-4 mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground duration-700 fill-mode-backwards delay-200">
              Five Telegram channels, one mission — premium study material, doubt discussions
              and daily updates for CBSE boards, JEE and NEET. Absolutely free.
            </p>
            <div className="animate-in fade-in slide-in-from-bottom-4 mt-8 flex flex-wrap justify-center gap-3 duration-700 fill-mode-backwards delay-300">
              <a
                href={MISSION_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="glow shine-sweep inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-display text-sm font-bold text-accent-foreground transition-opacity hover:opacity-90"
                style={{ backgroundImage: "var(--gradient-gold)" }}
              >
                <TelegramIcon />
                Mission Board 2027
              </a>
              <a
                href={CLASS10_DISCUSSION_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="glow inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-display text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
                style={{ backgroundImage: "var(--gradient-pink)" }}
              >
                <TelegramIcon />
                Class 10 Discussion
              </a>
              <a
                href={NEXTGEN_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-chip inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-display text-sm font-bold transition-colors hover:bg-white/[0.14]"
              >
                <TelegramIcon />
                Class 11 &amp; 12
              </a>
            </div>

            <dl className="mx-auto mt-14 grid max-w-3xl grid-cols-3 gap-3">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className={`glass-chip animate-in fade-in slide-in-from-bottom-3 rounded-2xl px-3 py-4 transition-transform duration-300 hover:-translate-y-1 duration-500 fill-mode-backwards ${
                    i === 0 ? "delay-300" : i === 1 ? "delay-[400ms]" : "delay-500"
                  }`}
                >
                  <dt className="font-display text-2xl font-bold text-foreground">{s.value}</dt>
                  <dd className="mt-1 text-xs text-muted-foreground">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 pt-12 sm:pt-16">
          <div className="glass-panel relative overflow-hidden rounded-3xl p-6 sm:p-8">
            <div
              className="pointer-events-none absolute -top-20 -left-16 h-52 w-52 rounded-full opacity-25 blur-3xl"
              style={{ backgroundImage: "var(--gradient-blue)" }}
            />
            <div className="relative flex flex-col items-center gap-5 text-center sm:flex-row sm:justify-between sm:text-left">
              <div>
                <span className="glass-chip inline-block rounded-full px-3 py-1 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                  New · 2026-27
                </span>
                <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
                  Batches are <span className="text-gold">live</span>
                </h2>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  Next Toppers, Mission JEET and Physics Wallah (PW) batches — open them right
                  inside our website.
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                {[ntLogo, mjLogo, pwLogo].map((l, i) => (
                  <img
                    key={l.url}
                    src={l.url}
                    alt="Batch provider logo"
                    loading="lazy"
                    className="mb-float h-14 w-14 rounded-2xl bg-white object-contain p-1.5 ring-1 ring-white/25"
                    style={{ animationDelay: `${i * 0.9}s`, animationDuration: `${5 + i}s` }}
                  />
                ))}
              </div>
            </div>
            <Link
              to="/batches"
              className="glow shine-sweep relative mt-6 flex w-full items-center justify-center rounded-xl px-5 py-3.5 font-display text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
              style={{ backgroundImage: "var(--gradient-blue)" }}
            >
              Go to Batches
            </Link>
          </div>
        </section>

        <section id="channels" className="mx-auto max-w-5xl scroll-mt-20 px-4 py-16 sm:py-20">
          <h2 className="text-center font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Pick your channel
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-sm text-muted-foreground">
            Join ALL channels to access your books.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {channels.map((c) => (
              <ChannelCard key={c.name} channel={c} />
            ))}
          </div>
        </section>

        <section id="contact" className="border-t border-border">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
            <h2 className="text-center font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Contact <span className="text-gold">Us</span>
            </h2>
            <p className="mt-3 text-center text-sm text-muted-foreground">
              Reach the Mission Board team directly on Telegram.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {CREDITS.map((p) => (
                <a
                  key={p.handle}
                  href={`https://t.me/${p.handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-panel rounded-2xl px-5 py-4 text-center transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.1]"
                >
                  <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                    {p.role}
                  </p>
                  <p className="mt-1 font-display text-lg font-extrabold tracking-tight text-gold">
                    {p.name}
                  </p>
                  <p className="mt-1 inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-primary">
                    <TelegramIcon />
                    @{p.handle}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="border-t border-border">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
            <h2 className="text-center font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mt-3 text-center text-sm text-muted-foreground">
              Everything students ask before joining.
            </p>
            <Accordion type="single" collapsible className="mt-10 w-full">
              {faqs.map((f, i) => (
                <AccordionItem
                  key={f.q}
                  value={`item-${i}`}
                  className="glass-panel mb-3 rounded-2xl px-5"
                >
                  <AccordionTrigger className="text-left font-display text-base font-semibold hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="hero-surface border-t border-border">
          <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:py-20">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Learn · Grow · <span className="text-gold">Achieve</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground">
              Join thousands of students already preparing smarter with free premium material and
              peer discussions.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={MISSION_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="glow shine-sweep inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-display text-sm font-bold text-accent-foreground transition-opacity hover:opacity-90"
                style={{ backgroundImage: "var(--gradient-gold)" }}
              >
                <TelegramIcon />
                Mission Board 2027
              </a>
              <a
                href={CLASS10_DISCUSSION_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="glow inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-display text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
                style={{ backgroundImage: "var(--gradient-pink)" }}
              >
                <TelegramIcon />
                Class 10 Discussion
              </a>
              <a
                href={NEXTGEN_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-chip inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-display text-sm font-bold transition-colors hover:bg-white/[0.14]"
              >
                <TelegramIcon />
                Class 11 &amp; 12
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-8">
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Mission Board × Aarambhian Legacy · Free education for every student
        </p>
      </footer>
    </div>
  );
}
