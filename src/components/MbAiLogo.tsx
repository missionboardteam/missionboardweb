import mbAiLogo from "@/assets/mb-ai-logo.png";

export function MbAiLogo({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <span className={`relative inline-flex shrink-0 ${className}`}>
      <span
        className="absolute inset-0 -z-10 rounded-[28%] opacity-70 blur-md"
        style={{ backgroundImage: "var(--gradient-gold)", animation: "mbai-pulse 2.4s ease-in-out infinite" }}
      />
      <img
        src={mbAiLogo}
        alt="MB AI logo"
        loading="lazy"
        width={816}
        height={816}
        className="mbai-shine h-full w-full object-contain"
      />
    </span>
  );
}
