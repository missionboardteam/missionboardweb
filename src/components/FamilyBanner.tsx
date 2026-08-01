import banner from "@/assets/family-banner.png.asset.json";

export function FamilyBanner() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 pt-4">
      <div className="card-elevated overflow-hidden rounded-2xl border border-border bg-card">
        <img
          src={banner.url}
          alt="Mission CBSE Board 2027, Next Gen Academy and Class 10 Discussion Group — join on Telegram"
          className="h-auto w-full object-cover"
          loading="eager"
        />
      </div>
    </div>
  );
}
