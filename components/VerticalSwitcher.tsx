"use client";

import { useRouter, usePathname } from "next/navigation";
import type { Vertical } from "@/lib/types";

export function VerticalSwitcher({
  verticals,
  currentId,
}: {
  verticals: Vertical[];
  currentId: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="relative w-full sm:w-auto">
      <select
        value={currentId}
        aria-label="Vertical"
        onChange={(e) => router.push(`${pathname}?v=${e.target.value}`)}
        className="w-full cursor-pointer appearance-none rounded-full bg-surface-muted py-1.5 pl-3.5 pr-8 text-sm font-medium text-body transition-colors hover:bg-ink-200 dark:hover:bg-ink-700"
      >
        {verticals.map((v) => (
          <option key={v.id} value={v.id}>
            {v.name}
          </option>
        ))}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 12 12"
        className="pointer-events-none absolute right-3 top-1/2 size-3 -translate-y-1/2 text-muted"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 4.5 6 7.5l3-3" />
      </svg>
    </div>
  );
}
