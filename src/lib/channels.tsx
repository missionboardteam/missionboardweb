import missionLogo from "@/assets/mission-board-10-v2.jpg.asset.json";
import nextgenLogo from "@/assets/mission-board-1112-v2.jpg.asset.json";
import discussionLogo from "@/assets/mb-group-chat-dg.jpg.asset.json";
import legacyLogo from "@/assets/aarambhian-legacy.jpg.asset.json";
import legacyDgLogo from "@/assets/aarambhian-legacy-dg.jpg.asset.json";

export const MISSION_LINK = "https://t.me/+T8PdqiLKkfU1ZDU9";
export const NEXTGEN_LINK = "https://t.me/MissionBoardclass11and12";
export const CLASS10_DISCUSSION_LINK = "https://t.me/+AxCXqeqCM-JiYTc1";
export const LEGACY_LINK = "https://t.me/AARAMBHIANLEGACY";
export const LEGACY_DG_LINK = "https://t.me/+LUrgjpZvuiZkOTE1";

export const channels = [
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
    name: "Mission Board Group Chat (DG)",
    tag: "Class 10, 11 & 12 · Doubts & Chat",
    logo: discussionLogo.url,
    link: CLASS10_DISCUSSION_LINK,
    blurb:
      "A lively student community to ask doubts, share resources, discuss chapters and help each other crack the boards together.",
    points: ["Ask doubts 24/7", "Share notes & resources", "Peer discussions"],
    accent: "pink" as const,
  },
  {
    name: "Mission Board Class 11 & 12",
    tag: "Class 11 & 12 · JEE / NEET",
    logo: nextgenLogo.url,
    link: NEXTGEN_LINK,
    blurb:
      "Premium notes for Physics, Chemistry, Maths and Biology — foundation to topper level, built for CBSE boards along with JEE and NEET.",
    points: ["Premium notes, free", "PCM & PCB coverage", "Regular updates"],
    accent: "blue" as const,
  },
  {
    name: "Aarambhian Legacy",
    tag: "A part of Mission Board Family",
    logo: legacyLogo.url,
    link: LEGACY_LINK,
    blurb:
      "The 2026-27 Aarambhian Legacy channel — curated study material, updates and resources for every learner in the Mission Board family.",
    points: ["Curated material", "Regular updates", "Free for everyone"],
    accent: "green" as const,
  },
  {
    name: "Aarambhian Legacy Group Chat (DG)",
    tag: "Discussion · Share · Learn · Grow",
    logo: legacyDgLogo.url,
    link: LEGACY_DG_LINK,
    blurb:
      "The official Aarambhian Legacy discussion group — chat with fellow students, clear doubts and grow together.",
    points: ["Friendly community", "Doubt solving", "Share · Learn · Grow"],
    accent: "green" as const,
  },
];

export type Channel = (typeof channels)[number];

export const accentGradient: Record<Channel["accent"], string> = {
  gold: "var(--gradient-gold)",
  blue: "var(--gradient-blue)",
  pink: "var(--gradient-pink)",
  green: "var(--gradient-green)",
};

export const accentDot: Record<Channel["accent"], string> = {
  gold: "var(--accent)",
  blue: "var(--primary)",
  pink: "oklch(0.75 0.18 340)",
  green: "oklch(0.72 0.16 148)",
};


export function TelegramIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M21.94 4.6 18.9 19.03c-.23 1.02-.84 1.27-1.7.79l-4.7-3.47-2.27 2.19c-.25.25-.46.46-.94.46l.33-4.78 8.7-7.86c.38-.34-.08-.53-.59-.19l-10.75 6.77-4.63-1.45c-1-.32-1.03-1.01.21-1.5l18.1-6.98c.84-.3 1.57.2 1.28 1.59Z" />
    </svg>
  );
}

export function ChannelCard({ channel }: { channel: Channel }) {
  return (
    <article className="card-elevated group relative overflow-hidden rounded-3xl border border-border bg-card p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-8">
      <div
        className="pointer-events-none absolute -top-20 -right-20 h-52 w-52 rounded-full opacity-25 blur-3xl"
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
