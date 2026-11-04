import type { CSSProperties } from "react";
import {
  Atom,
  BookOpen,
  GraduationCap,
  PenLine,
  Sparkles,
  Star,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { useGlass } from "@/lib/glass";

type Chip = {
  Icon: LucideIcon;
  color: string;
  pos: CSSProperties;
  delay: string;
  dur: string;
};

const ICON_CHIPS: Chip[] = [
  { Icon: GraduationCap, color: "var(--accent)", pos: { top: "15%", left: "7%" }, delay: "0s", dur: "6.5s" },
  { Icon: BookOpen, color: "var(--primary)", pos: { top: "37%", right: "6%" }, delay: "1.2s", dur: "7.5s" },
  { Icon: Trophy, color: "var(--accent)", pos: { top: "62%", left: "9%" }, delay: "2.1s", dur: "8s" },
  { Icon: Sparkles, color: "oklch(0.75 0.18 340)", pos: { top: "74%", right: "10%" }, delay: "0.6s", dur: "6s" },
  { Icon: PenLine, color: "oklch(0.72 0.16 148)", pos: { top: "9%", right: "18%" }, delay: "1.8s", dur: "7s" },
  { Icon: Star, color: "var(--accent)", pos: { bottom: "10%", left: "30%" }, delay: "3s", dur: "9s" },
  { Icon: Atom, color: "var(--primary)", pos: { top: "50%", left: "3%" }, delay: "2.6s", dur: "8.5s" },
];

/**
 * Site-wide decorative layer: slowly drifting liquid-glass orbs and floating
 * glass icon chips that live behind the page content. Intensity follows the
 * frosted ↔ liquid appearance slider.
 */
export function FloatingGlassAssets() {
  const { level } = useGlass();
  const t = level / 100; // 0 = frosted, 1 = liquid
  const orbOpacity = 0.16 + t * 0.3;
  const chipOpacity = 0.45 + t * 0.4;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* drifting liquid-glass orbs */}
      <div
        className="mb-drift absolute top-[10%] left-[-8%] h-56 w-56 rounded-full border border-white/10"
        style={{
          opacity: orbOpacity,
          background:
            "radial-gradient(circle at 30% 30%, color-mix(in oklab, var(--primary) 55%, transparent), transparent 70%)",
          animationDuration: "22s",
        }}
      />
      <div
        className="mb-drift absolute top-[45%] right-[-10%] h-72 w-72 rounded-full border border-white/10"
        style={{
          opacity: orbOpacity,
          background:
            "radial-gradient(circle at 60% 40%, color-mix(in oklab, var(--accent) 45%, transparent), transparent 70%)",
          animationDuration: "27s",
          animationDelay: "3s",
        }}
      />
      <div
        className="mb-drift absolute bottom-[-6%] left-[15%] h-64 w-64 rounded-full border border-white/10"
        style={{
          opacity: orbOpacity,
          background:
            "radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--primary) 35%, transparent), transparent 70%)",
          animationDuration: "24s",
          animationDelay: "6s",
        }}
      />

      {/* floating glass icon chips */}
      {ICON_CHIPS.map(({ Icon, color, pos, delay, dur }, i) => (
        <span
          key={i}
          className="absolute rounded-2xl border border-white/20 bg-white/[0.07] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_10px_26px_-14px_rgba(0,0,0,0.8)] backdrop-blur-md"
          style={{
            ...pos,
            opacity: chipOpacity,
            animation: `mb-float ${dur} ease-in-out infinite`,
            animationDelay: delay,
          }}
        >
          <Icon className="h-4 w-4" style={{ color }} strokeWidth={2.2} />
        </span>
      ))}
    </div>
  );
}
