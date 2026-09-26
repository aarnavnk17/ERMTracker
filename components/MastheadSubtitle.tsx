"use client";

import { useSearchParams } from "next/navigation";
import type { AdminRole, Vertical } from "@/lib/types";
import { resolveEffectiveVerticalId } from "@/lib/effective-vertical";

export function MastheadSubtitle({
  role,
  vertical_id,
  verticals,
}: {
  role: AdminRole;
  vertical_id: string | null;
  verticals: Vertical[];
}) {
  const searchParams = useSearchParams();
  const requestedV = searchParams.get("v") ?? undefined;
  const orderedVerticals = [...verticals].sort((a, b) => a.name.localeCompare(b.name));
  const verticalId = resolveEffectiveVerticalId(
    { role, vertical_id },
    orderedVerticals,
    requestedV
  );
  const name = orderedVerticals.find((v) => v.id === verticalId)?.name ?? "";

  return <>{name} Attendance Tracker</>;
}
