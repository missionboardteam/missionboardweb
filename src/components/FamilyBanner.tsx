import banner from "@/assets/family-banner-v2.png.asset.json";

export function FamilyBanner() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 pt-4">
      <div className="card-elevated overflow-hidden rounded-2xl border border-border bg-card">
        <img
          src={banner.url}
          alt="Mission CBSE Board Class 10, Mission Board Class 11 & 12 and Class 10 Discussion Group — join on Telegram"
          className="h-auto w-full object-cover"
          loading="eager"
        />
      </div>
    </div>
  );
}
