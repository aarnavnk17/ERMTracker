"use client";

import { useEffect, useState } from "react";

type Preference = "system" | "light" | "dark";

function resolve(pref: Preference): "light" | "dark" {
  if (pref === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return pref;
}

function apply(pref: Preference) {
  document.documentElement.dataset.theme = resolve(pref);
  localStorage.setItem("theme", pref);
}

const ORDER: Preference[] = ["system", "light", "dark"];
const ICON: Record<Preference, string> = {
  system: "◐",
  light: "☀",
  dark: "☾",
};
const LABEL: Record<Preference, string> = {
  system: "System",
  light: "Light",
  dark: "Dark",
};

export function ThemeToggle() {
  const [pref, setPref] = useState<Preference>("system");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Preference | null;
    setPref(stored ?? "system");

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const current = (localStorage.getItem("theme") as Preference | null) ?? "system";
      if (current === "system") apply("system");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  function cycle() {
    const next = ORDER[(ORDER.indexOf(pref) + 1) % ORDER.length];
    setPref(next);
    apply(next);
  }

  return (
    <button
      onClick={cycle}
      title={`Theme: ${LABEL[pref]}`}
      aria-label={`Theme: ${LABEL[pref]}. Click to change.`}
      className="eyebrow rounded-md px-2.5 py-1.5 text-brand-300/70 hover:bg-ink-800 hover:text-brand-300"
    >
      {ICON[pref]}
    </button>
  );
}
