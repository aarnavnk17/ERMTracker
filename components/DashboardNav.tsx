"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { AdminRole, Vertical } from "@/lib/types";
import { VerticalSwitcher } from "@/components/VerticalSwitcher";

export function DashboardNav({
  role,
  verticals,
  verticalName,
  defaultVerticalId,
}: {
  role: AdminRole;
  verticals: Vertical[];
  verticalName: string | null;
  defaultVerticalId: string;
}) {
  const searchParams = useSearchParams();
  const currentV = searchParams.get("v") ?? defaultVerticalId;
  const suffix = role === "super_admin" ? `?v=${currentV}` : "";

  return (
    <div className="flex items-center gap-6">
      <span className="font-display text-sm font-semibold text-brand-300">
        Attendance Tracker
      </span>
      <nav className="flex items-center gap-1">
        <Link
          href={`/meetings${suffix}`}
          className="eyebrow rounded-md px-3 py-1.5 text-brand-300/70 hover:text-brand-300"
        >
          Meetings
        </Link>
        <Link
          href={`/members${suffix}`}
          className="eyebrow rounded-md px-3 py-1.5 text-brand-300/70 hover:text-brand-300"
        >
          Members
        </Link>
        <Link
          href={`/reports${suffix}`}
          className="eyebrow rounded-md px-3 py-1.5 text-brand-300/70 hover:text-brand-300"
        >
          Reports
        </Link>
      </nav>
      {role === "super_admin" ? (
        <VerticalSwitcher verticals={verticals} currentId={currentV} />
      ) : (
        <span className="eyebrow rounded-md border border-ink-800 px-2.5 py-1.5 text-brand-300/70">
          {verticalName}
        </span>
      )}
    </div>
  );
}
