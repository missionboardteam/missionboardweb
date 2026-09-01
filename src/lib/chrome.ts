import { useSyncExternalStore } from "react";

/**
 * Tiny store telling the app chrome (top status bar) to hide itself,
 * e.g. while an embedded batch website is open full-screen.
 */
let hidden = false;
const listeners = new Set<() => void>();

export function setChromeHidden(next: boolean) {
  if (hidden === next) return;
  hidden = next;
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useChromeHidden() {
  return useSyncExternalStore(
    subscribe,
    () => hidden,
    () => false,
  );
}
