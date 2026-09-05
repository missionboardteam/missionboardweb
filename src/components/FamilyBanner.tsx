import banner from "@/assets/family-banner-v3.jpg.asset.json";

export function FamilyBanner() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 pt-4">
      <div className="card-elevated overflow-hidden rounded-2xl border border-border bg-card">
        <img
          src={banner.url}
          alt="Mission Board Class 10, Mission Board Group Chat, Mission Board Class 11 & 12, Aarambhian Legacy and Aarambhian Legacy Group Chat — join on Telegram"
          className="h-auto w-full object-cover"
          loading="eager"
        />
      </div>
    </div>
  );
}
