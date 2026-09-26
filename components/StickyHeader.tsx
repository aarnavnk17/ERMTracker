"use client";

import { useEffect, useRef } from "react";

// Publishes the header's live height as --header-h so other sticky bars can sit beneath it.
export function StickyHeader({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = document.documentElement;
    const observer = new ResizeObserver(() => {
      root.style.setProperty("--header-h", `${el.offsetHeight}px`);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--header-h");
    };
  }, []);

  return (
    <header ref={ref} className="glass-bar sticky top-0 z-30 border-b border-line">
      {children}
    </header>
  );
}
