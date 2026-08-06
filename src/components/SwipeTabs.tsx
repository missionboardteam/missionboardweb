import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { navItems, activeNavIndex } from "@/lib/nav";

const THRESHOLD = 70;

/**
 * iOS-style swipe navigation between the bottom-nav tabs.
 * Horizontal drags on the page move to the previous/next tab with a
 * rubber-band glass hint that follows the finger.
 */
export function SwipeTabs() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [offset, setOffset] = useState(0);
  const start = useRef<{ x: number; y: number } | null>(null);
  const horizontal = useRef(false);

  useEffect(() => {
    function onStart(e: TouchEvent) {
      if (e.touches.length !== 1) return;
      const t = e.touches[0];
      start.current = { x: t.clientX, y: t.clientY };
      horizontal.current = false;
    }

    function onMove(e: TouchEvent) {
      if (!start.current) return;
      const t = e.touches[0];
      const dx = t.clientX - start.current.x;
      const dy = t.clientY - start.current.y;
      if (!horizontal.current) {
        if (Math.abs(dx) < 12 && Math.abs(dy) < 12) return;
        horizontal.current = Math.abs(dx) > Math.abs(dy) * 1.4;
        if (!horizontal.current) {
          start.current = null;
          return;
        }
      }
      // rubber band
      setOffset(Math.sign(dx) * Math.min(Math.abs(dx) * 0.35, 44));
    }

    function onEnd(e: TouchEvent) {
      const s = start.current;
      start.current = null;
      setOffset(0);
      if (!s || !horizontal.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - s.x;
      if (Math.abs(dx) < THRESHOLD) return;
      const index = activeNavIndex(pathname);
      const next = dx < 0 ? index + 1 : index - 1;
      if (next < 0 || next >= navItems.length) return;
      navigate({ to: navItems[next].to });
    }

    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    window.addEventListener("touchcancel", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("touchcancel", onEnd);
    };
  }, [pathname, navigate]);

  useEffect(() => {
    const el = document.body;
    el.style.transition = offset === 0 ? "transform 350ms cubic-bezier(0.22,1.2,0.32,1)" : "none";
    el.style.transform = offset === 0 ? "" : `translateX(${offset}px)`;
    return () => {
      el.style.transform = "";
    };
  }, [offset]);

  return null;
}
