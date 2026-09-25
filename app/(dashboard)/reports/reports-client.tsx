"use client";

import { useMemo, useState } from "react";
import type { MemberGroup } from "@/lib/types";

export type MemberSummary = {
  id: string;
  full_name: string;
  roll_no: string;
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
    <div className="rounded-xl border border-ink-200 bg-white p-4 shadow-sm dark:border-ink-800 dark:bg-ink-900">
      <h3 className="mb-2 text-sm font-medium text-ink-900 dark:text-ink-100">
        {title}
      </h3>
      {top.length === 0 ? (
        <p className="text-sm text-ink-500">No data yet.</p>
      ) : (
        <ol className="flex flex-col gap-1.5">
          {top.map((r, i) => (
            <li
              key={r.id}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-ink-700 dark:text-ink-300">
                {i + 1}. {r.full_name}
              </span>
              <span className="font-medium text-ink-900 dark:text-ink-100">
                {r[metric]}
              </span>
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
    [r.full_name, r.roll_no, r.present, r.absent, r.informed, r.total]
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
    <div className="flex flex-col gap-4">
      <div className="flex gap-1 rounded-lg bg-ink-100 p-1 dark:bg-ink-800">
        {(["coordinator", "core_member"] as MemberGroup[]).map((g) => (
          <button
            key={g}
            onClick={() => setActiveTab(g)}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === g
                ? "bg-white text-ink-900 shadow-sm dark:bg-ink-700 dark:text-ink-100"
                : "text-ink-600 hover:text-ink-900 dark:text-ink-400"
            }`}
          >
            {GROUP_LABELS[g]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Leaderboard
          title="Most present"
          rows={groupRows}
          metric="present"
        />
        <Leaderboard
          title="Most absences"
          rows={groupRows}
          metric="absent"
        />
        <Leaderboard
          title="Most informed"
          rows={groupRows}
          metric="informed"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-ink-200 bg-white shadow-sm dark:border-ink-800 dark:bg-ink-900">
        <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3 dark:border-ink-800">
          <h2 className="text-sm font-medium text-ink-900 dark:text-ink-100">
            {GROUP_LABELS[activeTab]} summary
          </h2>
          <button
            onClick={() =>
              downloadCsv(
                `${activeTab}-attendance-summary.csv`,
                toCsv(groupRows)
              )
            }
            className="rounded-md bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700"
          >
            Export CSV
          </button>
        </div>
        {groupRows.length === 0 ? (
          <p className="px-4 py-6 text-sm text-ink-500">No members yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-100 text-left text-xs text-ink-500 dark:border-ink-800">
                  <th className="px-4 py-2 font-medium">Name</th>
                  <th className="px-4 py-2 font-medium">Roll No</th>
                  <th className="px-4 py-2 font-medium">Present</th>
                  <th className="px-4 py-2 font-medium">Absent</th>
                  <th className="px-4 py-2 font-medium">Informed</th>
                  <th className="px-4 py-2 font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
                {groupRows.map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-2 font-medium text-ink-900 dark:text-ink-100">
                      {r.full_name}
                    </td>
                    <td className="px-4 py-2 text-ink-500">{r.roll_no}</td>
                    <td className="px-4 py-2">{r.present}</td>
                    <td className="px-4 py-2">{r.absent}</td>
                    <td className="px-4 py-2">{r.informed}</td>
                    <td className="px-4 py-2">{r.total}</td>
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
