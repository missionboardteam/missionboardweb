import { createFileRoute } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import missionLogo from "@/assets/mission-board.jpg.asset.json";
import nextgenLogo from "@/assets/nextgen-academy.jpg.asset.json";
import discussionLogo from "@/assets/class10-discussion.jpg.asset.json";
import { SplashScreen } from "@/components/SplashScreen";

const MISSION_LINK = "https://t.me/+T8PdqiLKkfU1ZDU9";
const NEXTGEN_LINK = "https://t.me/NextGenerationAcademy07";
const CLASS10_DISCUSSION_LINK = "https://t.me/+AxCXqeqCM-JiYTc1";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mission Board 2027 & Next Gen Academy | Free Study Material" },
      {
        name: "description",
        content:
          "Free CBSE Class 10 Board 2027 and Class 11-12 JEE/NEET notes, PDFs and exclusive material. Join our Telegram channels for daily updates.",
      },
      {
        property: "og:title",
        content: "Mission Board 2027 & Next Gen Academy | Free Study Material",
      },
      {
        property: "og:description",
        content:
          "Premium notes, sample papers and exclusive material for Class 10, 11 and 12 — absolutely free on Telegram.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const channels = [
  {
    name: "Mission Board Class 10 2027",
    tag: "Class 10 · CBSE 2027",
    logo: missionLogo.url,
    link: MISSION_LINK,
    blurb:
      "Complete Class 10 board preparation — chapter-wise notes, NCERT solutions, sample papers, PYQs and exclusive material, updated regularly.",
    points: ["Free books & PDFs", "Sample papers + PYQs", "Exam strategy & tips"],
    accent: "gold" as const,
  },
  {
    name: "Class 10 Discussion Group",
    tag: "Class 10 · Doubts & Chat",
    logo: discussionLogo.url,
    link: CLASS10_DISCUSSION_LINK,
    blurb:
      "A lively student community to ask doubts, share resources, discuss chapters and help each other crack the Class 10 boards together.",
    points: ["Ask doubts 24/7", "Share notes & resources", "Peer discussions"],
    accent: "pink" as const,
  },
  {
    name: "Next Generation Academy",
    tag: "Class 11 & 12 · JEE / NEET",
    logo: nextgenLogo.url,
    link: NEXTGEN_LINK,
    blurb:
      "Premium notes for Physics, Chemistry, Maths and Biology — foundation to topper level, built for CBSE boards along with JEE and NEET.",
    points: ["Premium notes, free", "PCM & PCB coverage", "Regular updates"],
    accent: "blue" as const,
  },
];

const stats = [
  { value: "3", label: "Telegram channels" },
  { value: "100%", label: "Free forever" },
  { value: "Daily", label: "New material" },
  { value: "10–12", label: "Classes covered" },
];

const faqs = [
  {
    q: "What are these channels about?",
    a: "Mission Board Class 10 2027 covers everything for the CBSE Class 10 board exams, while Next Generation Academy covers Class 11 and 12 (CBSE boards plus JEE and NEET foundation). Both share notes, books and exclusive study material.",
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

const accentGradient: Record<(typeof channels)[number]["accent"], string> = {
  gold: "var(--gradient-gold)",
  blue: "var(--gradient-blue)",
  pink: "var(--gradient-pink)",
};

const accentDot: Record<(typeof channels)[number]["accent"], string> = {
  gold: "var(--accent)",
  blue: "var(--primary)",
  pink: "oklch(0.75 0.18 340)",
};

function ChannelCard({ channel }: { channel: (typeof channels)[number] }) {
  return (
    <article className="card-elevated group relative overflow-hidden rounded-3xl border border-border bg-card p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-8">
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full opacity-25 blur-3xl"
        style={{ backgroundImage: accentGradient[channel.accent] }}
      />
      <div className="relative flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left">
        <img
          src={channel.logo}
          alt={`${channel.name} logo`}
          loading="lazy"
          className="h-24 w-24 shrink-0 rounded-2xl object-cover ring-1 ring-border sm:h-28 sm:w-28"
        />
        <div>
          <span className="inline-block rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {channel.tag}
          </span>
          <h3 className="mt-3 font-display text-2xl leading-tight font-bold">{channel.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{channel.blurb}</p>
        </div>
      </div>

      <ul className="relative mt-6 grid gap-2">
        {channel.points.map((p) => (
          <li key={p} className="flex items-center gap-2 text-sm text-foreground/90">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: accentDot[channel.accent] }}
            />
            {p}
          </li>
        ))}
      </ul>

      <a
        href={channel.link}
        target="_blank"
        rel="noopener noreferrer"
        className="glow relative mt-7 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-display text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
        style={{ backgroundImage: accentGradient[channel.accent] }}
      >
        <TelegramIcon />
        Join on Telegram
      </a>
    </article>
  );
}

function TelegramIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M21.94 4.6 18.9 19.03c-.23 1.02-.84 1.27-1.7.79l-4.7-3.47-2.27 2.19c-.25.25-.46.46-.94.46l.33-4.78 8.7-7.86c.38-.34-.08-.53-.59-.19l-10.75 6.77-4.63-1.45c-1-.32-1.03-1.01.21-1.5l18.1-6.98c.84-.3 1.57.2 1.28 1.59Z" />
    </svg>
  );
}

function Index() {
  return (
    <div className="min-h-screen font-sans">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <span className="font-display text-sm font-bold tracking-tight sm:text-base">
            Mission Board <span className="text-muted-foreground">×</span> Next Gen
          </span>
          <a
            href="#channels"
            className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            Join now
          </a>
        </div>
      </header>

      <main>
        <section className="hero-surface relative overflow-hidden border-b border-border">
          <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:py-24">
            <span className="inline-block rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Quality education for all
            </span>
            <h1 className="mt-6 font-display text-4xl leading-[1.1] font-extrabold tracking-tight sm:text-6xl">
              Free notes & books for
              <br />
              <span className="text-gold">Class 10, 11 and 12</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
              Three Telegram channels, one mission — premium study material, doubt discussions
              and daily updates for CBSE boards, JEE and NEET. Absolutely free.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={MISSION_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="glow inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-display text-sm font-bold text-accent-foreground transition-opacity hover:opacity-90"
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
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 font-display text-sm font-bold transition-colors hover:bg-secondary"
              >
                <TelegramIcon />
                Next Gen Academy
              </a>
            </div>

            <dl className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-border bg-card/70 px-3 py-4"
                >
                  <dt className="font-display text-2xl font-bold text-foreground">{s.value}</dt>
                  <dd className="mt-1 text-xs text-muted-foreground">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="channels" className="mx-auto max-w-5xl scroll-mt-20 px-4 py-16 sm:py-20">
          <h2 className="text-center font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Pick your channel
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-sm text-muted-foreground">
            Join the channel that matches your class — or all three, they're free.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {channels.map((c) => (
              <ChannelCard key={c.name} channel={c} />
            ))}
          </div>
        </section>

        <section id="faq" className="border-t border-border bg-card/30">
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
                  className="mb-3 rounded-2xl border border-border bg-card px-5"
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
                className="glow inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-display text-sm font-bold text-accent-foreground transition-opacity hover:opacity-90"
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
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 font-display text-sm font-bold transition-colors hover:bg-secondary"
              >
                <TelegramIcon />
                Next Gen Academy
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Mission Board 2027, Class 10 Discussion Group & Next
          Generation Academy · Free education for every student
        </p>
      </footer>
    </div>
  );
}
