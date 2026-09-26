"use client";

import { useMemo, useState } from "react";
import type { MemberGroup } from "@/lib/types";

export type MemberSummary = {
  id: string;
  full_name: string;
  roll_no: string | null;
  group_type: MemberGroup;
  present: number;
  absent: number;
  informed: number;
  total: number;
};

const GROUP_LABELS: Record<MemberGroup, string> = {
  coordinator: "Team Coordinators",
  core_member: "Core Team Members",
};

function Leaderboard({
  title,
  rows,
  metric,
}: {
  title: string;
  rows: MemberSummary[];
  metric: "present" | "absent" | "informed";
}) {
  const top = [...rows]
    .filter((r) => r[metric] > 0)
    .sort((a, b) => b[metric] - a[metric])
    .slice(0, 5);

  return (
    <div className="card p-5">
      <p className="eyebrow text-muted">{title}</p>
      {top.length === 0 ? (
        <p className="mt-3 text-sm text-muted">No data yet.</p>
      ) : (
        <ol className="mt-3 flex flex-col gap-1.5">
          {top.map((r, i) => (
            <li key={r.id} className="flex items-center justify-between text-sm">
              <span className="text-muted">
                {i + 1}. {r.full_name}
              </span>
              <span className="font-mono font-medium text-body">{r[metric]}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function toCsv(rows: MemberSummary[]): string {
  const header = [
    "Name",
    "Roll No",
    "Present",
    "Absent",
    "Informed",
    "Total Meetings Marked",
  ];
  const lines = rows.map((r) =>
    [r.full_name, r.roll_no ?? "", r.present, r.absent, r.informed, r.total]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  return [header.join(","), ...lines].join("\n");
}

function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function ReportsClient({ summaries }: { summaries: MemberSummary[] }) {
  const [activeTab, setActiveTab] = useState<MemberGroup>("coordinator");

  const groupRows = useMemo(
    () =>
      summaries
        .filter((s) => s.group_type === activeTab)
        .sort((a, b) => a.full_name.localeCompare(b.full_name)),
    [summaries, activeTab]
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-1 rounded-md border border-line bg-surface p-1">
        {(["coordinator", "core_member"] as MemberGroup[]).map((g) => (
          <button
            key={g}
            onClick={() => setActiveTab(g)}
            className={`eyebrow flex-1 rounded-md px-3 py-2 transition-colors ${
              activeTab === g
                ? "bg-brand-600 text-ink-950"
                : "text-muted hover:bg-surface-muted"
            }`}
          >
            {GROUP_LABELS[g]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Leaderboard title="Most present" rows={groupRows} metric="present" />
        <Leaderboard title="Most absences" rows={groupRows} metric="absent" />
        <Leaderboard title="Most informed" rows={groupRows} metric="informed" />
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <h2 className="text-sm font-medium text-body">
            {GROUP_LABELS[activeTab]} summary
          </h2>
          <button
            onClick={() =>
              downloadCsv(`${activeTab}-attendance-summary.csv`, toCsv(groupRows))
            }
            className="btn-secondary"
          >
            Export CSV
          </button>
        </div>
        {groupRows.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted">No members yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                  <th className="py-2 pr-4 pl-5 font-medium">Name</th>
                  <th className="py-2 pr-4 font-medium">Roll No</th>
                  <th className="py-2 pr-4 font-medium">Present</th>
                  <th className="py-2 pr-4 font-medium">Absent</th>
                  <th className="py-2 pr-4 font-medium">Informed</th>
                  <th className="py-2 pr-5 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {groupRows.map((r) => (
                  <tr key={r.id} className="border-b border-line last:border-0">
                    <td className="py-3 pr-4 pl-5 font-medium text-body">{r.full_name}</td>
                    <td className="py-3 pr-4 font-mono text-xs text-muted">{r.roll_no ?? "—"}</td>
                    <td className="py-3 pr-4 text-muted">{r.present}</td>
                    <td className="py-3 pr-4 text-muted">{r.absent}</td>
                    <td className="py-3 pr-4 text-muted">{r.informed}</td>
                    <td className="py-3 pr-5 text-muted">{r.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
