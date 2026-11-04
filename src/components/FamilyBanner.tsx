import banner from "@/assets/family-banner-v3.jpg.asset.json";

export function FamilyBanner() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 pt-4">
      <div className="glass-panel shine-sweep overflow-hidden rounded-2xl p-1 transition-transform duration-500 hover:scale-[1.01]">
        <img
          src={banner.url}
          alt="Mission Board Class 10, Mission Board Group Chat, Mission Board Class 11 & 12, Aarambhian Legacy and Aarambhian Legacy Group Chat — join on Telegram"
          className="h-auto w-full rounded-[14px] object-cover"
          loading="eager"
        />
      </div>
    </div>
  );
}
