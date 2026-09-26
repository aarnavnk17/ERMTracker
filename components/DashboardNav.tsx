"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { AdminRole, Vertical } from "@/lib/types";
import { VerticalSwitcher } from "@/components/VerticalSwitcher";

const LINKS = [
  { href: "/meetings", label: "Meetings" },
  { href: "/members", label: "Members" },
  { href: "/reports", label: "Reports" },
];

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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentV = searchParams.get("v") ?? defaultVerticalId;
  const suffix = role === "super_admin" ? `?v=${currentV}` : "";

  return (
    <>
      <nav className="flex items-center gap-0.5 rounded-full bg-surface-muted p-1">
        {LINKS.map((l) => {
          const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
          return (
            <Link
              key={l.href}
              href={`${l.href}${suffix}`}
              aria-current={active ? "page" : undefined}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-[background-color,color,box-shadow,scale] duration-200 active:scale-95 ${
                active
                  ? "bg-surface text-body shadow-[0_1px_3px_rgba(0,0,0,0.08),0_0_0_0.5px_rgba(0,0,0,0.04)] dark:bg-ink-700"
                  : "text-muted hover:text-body"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
      <div className="order-last w-full sm:order-none sm:ml-auto sm:w-auto">
        {role === "super_admin" ? (
          <VerticalSwitcher verticals={verticals} currentId={currentV} />
        ) : (
          <span className="inline-flex rounded-full bg-surface-muted px-3 py-1.5 text-sm font-medium text-body">
            {verticalName}
          </span>
        )}
      </div>
    </>
  );
}
