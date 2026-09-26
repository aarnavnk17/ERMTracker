"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { AdminRole } from "@/lib/types";
import { SegmentedControl } from "@/components/SegmentedControl";

type Preference = "system" | "light" | "dark";

const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: "Super admin",
  vertical_head: "Vertical head",
};

function readPreference(): Preference {
  try {
    return (localStorage.getItem("theme") as Preference | null) ?? "system";
  } catch {
    return "system";
  }
}

function applyPreference(pref: Preference) {
  const resolved =
    pref === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : pref;
  document.documentElement.dataset.theme = resolved;
  try {
    localStorage.setItem("theme", pref);
  } catch {}
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

const THEME_OPTIONS: { value: Preference; label: string; icon: React.ReactNode }[] = [
  {
    value: "system",
    label: "Auto",
    icon: (
      <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="8" r="5.5" />
        <path d="M8 2.5v11A5.5 5.5 0 0 0 8 2.5Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    value: "light",
    label: "Light",
    icon: (
      <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="8" cy="8" r="3" />
        <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3 3l1 1M12 12l1 1M3 13l1-1M12 4l1-1" />
      </svg>
    ),
  },
  {
    value: "dark",
    label: "Dark",
    icon: (
      <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor">
        <path d="M13.5 9.6A5.8 5.8 0 0 1 6.4 2.5a5.8 5.8 0 1 0 7.1 7.1Z" />
      </svg>
    ),
  },
];

export function AccountMenu({
  displayName,
  role,
}: {
  displayName: string;
  role: AdminRole;
}) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [pref, setPref] = useState<Preference>("system");

  // Follow OS appearance changes while the preference is "system".
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (readPreference() === "system") applyPreference("system");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function toggle() {
    if (!open) setPref(readPreference());
    setOpen((o) => !o);
  }

  function choose(next: Preference) {
    setPref(next);
    applyPreference(next);
  }

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={toggle}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="account-menu"
        aria-label={`Account: ${displayName}`}
        className="flex size-8 items-center justify-center rounded-full bg-brand-500 text-xs font-semibold text-ink-950 ring-brand-500/25 transition-[scale,box-shadow] duration-150 hover:ring-4 active:scale-90"
      >
        {initials(displayName)}
      </button>

      <div
        id="account-menu"
        className={`glass-panel absolute right-0 top-full mt-2 w-64 origin-top-right rounded-2xl p-1.5 transition-[opacity,scale,filter,visibility] duration-200 ease-out ${
          open
            ? "visible scale-100 opacity-100 blur-none"
            : "pointer-events-none invisible scale-95 opacity-0 blur-[2px]"
        }`}
      >
        <div className="px-3 pb-3 pt-2">
          <p className="truncate text-sm font-semibold text-body">{displayName}</p>
          <p className="text-xs text-muted">{ROLE_LABELS[role]}</p>
        </div>

        <div className="px-1.5 pb-2">
          <p className="px-1 pb-1.5 text-xs text-muted">Appearance</p>
          <SegmentedControl
            ariaLabel="Appearance"
            size="sm"
            options={THEME_OPTIONS.map((o) => ({
              value: o.value,
              label: (
                <>
                  {o.icon}
                  {o.label}
                </>
              ),
            }))}
            value={pref}
            onChange={choose}
          />
        </div>

        <div className="mx-2 h-px bg-line" />

        <button
          onClick={signOut}
          className="mt-1 w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-500/10 dark:text-red-400"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
