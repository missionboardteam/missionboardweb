import { createFileRoute } from "@tanstack/react-router";
import { channels, ChannelCard } from "@/lib/channels";
import { FamilyBanner } from "@/components/FamilyBanner";

export const Route = createFileRoute("/channels")({
  head: () => ({
    meta: [
      { title: "Channels — Mission Board Class 10, 11 & 12" },
      {
        name: "description",
        content:
          "All Telegram channels: Mission Board Class 10 2027, Class 10 Discussion Group and Mission Board Class 11 & 12.",
      },
      { property: "og:title", content: "Our Telegram Channels" },
      {
        property: "og:description",
        content:
          "Join Mission Board Class 10 2027, the Class 10 Discussion Group and Mission Board Class 11 & 12.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChannelsPage,
});

function ChannelsPage() {
  return (
    <div className="min-h-screen pb-28 font-sans">
      <FamilyBanner />
      <div className="hero-surface border-b border-border/70 px-4 py-12 text-center">
        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Our <span className="text-gold">Channels</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          Everything under the Mission Board family — pick a channel and join instantly on Telegram.
        </p>
      </div>
      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-10 lg:grid-cols-3">
        {channels.map((c) => (
          <ChannelCard key={c.name} channel={c} />
        ))}
      </div>
    </div>
  );
}
