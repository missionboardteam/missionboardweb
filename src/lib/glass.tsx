import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "mb-glass-level";
export const MAX_GLASS = 100;

type GlassContextValue = {
  /** 0 = pure frosted glass, 100 = full liquid glass */
  level: number;
  setLevel: (value: number) => void;
};

const GlassContext = createContext<GlassContextValue>({
  level: MAX_GLASS,
  setLevel: () => {},
});

/** Normalize stored/user values into a safe 0–100 integer. */
export function clampGlass(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return MAX_GLASS;
  return Math.min(MAX_GLASS, Math.max(0, Math.round(n)));
}

export function GlassProvider({ children }: { children: ReactNode }) {
  // Default to full liquid glass; hydrate the stored preference after mount so
  // server and client markup stay identical.
  const [level, setLevelState] = useState(MAX_GLASS);

  useEffect(() => {
    const stored = clampGlass(window.localStorage.getItem(STORAGE_KEY));
    setLevelState(stored);
  }, []);

  const setLevel = (value: number) => {
    const next = clampGlass(value);
    setLevelState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      // storage unavailable — keep the in-memory preference only
    }
  };

  return <GlassContext.Provider value={{ level, setLevel }}>{children}</GlassContext.Provider>;
}

export function useGlass() {
  return useContext(GlassContext);
}
