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
    <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2">
      <span className="hidden font-display text-sm font-semibold text-brand-300 lg:inline">
        Attendance Tracker
      </span>
      <nav className="flex items-center gap-1">
        <Link
          href={`/meetings${suffix}`}
          className="eyebrow rounded-md px-2 py-1.5 text-brand-300/70 hover:text-brand-300 sm:px-3"
        >
          Meetings
        </Link>
        <Link
          href={`/members${suffix}`}
          className="eyebrow rounded-md px-2 py-1.5 text-brand-300/70 hover:text-brand-300 sm:px-3"
        >
          Members
        </Link>
        <Link
          href={`/reports${suffix}`}
          className="eyebrow rounded-md px-2 py-1.5 text-brand-300/70 hover:text-brand-300 sm:px-3"
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
