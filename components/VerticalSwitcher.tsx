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
    <select
      value={currentId}
      onChange={(e) => router.push(`${pathname}?v=${e.target.value}`)}
      className="eyebrow rounded-md border border-ink-800 bg-ink-900 px-2.5 py-1.5 text-brand-300"
    >
      {verticals.map((v) => (
        <option key={v.id} value={v.id}>
          {v.name}
        </option>
      ))}
    </select>
  );
}
