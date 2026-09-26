"use client";

import { useMemo, useState } from "react";
import type { MemberGroup } from "@/lib/types";
import { SegmentedControl } from "@/components/SegmentedControl";
import {
  MeetingTrendChart,
  RateDistributionChart,
  ReportStats,
  type MeetingStat,
} from "./charts";

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

const GROUP_OPTIONS = (["coordinator", "core_member"] as MemberGroup[]).map((value) => ({
  value,
  label: GROUP_LABELS[value],
}));

type SortKey = "full_name" | "present" | "absent" | "informed" | "total" | "rate";
const COLUMNS: { key: SortKey; label: string; numeric: boolean }[] = [
  { key: "full_name", label: "Name", numeric: false },
  { key: "present", label: "Present", numeric: true },
  { key: "absent", label: "Absent", numeric: true },
  { key: "informed", label: "Informed", numeric: true },
  { key: "total", label: "Total", numeric: true },
  { key: "rate", label: "Attendance", numeric: true },
];

function rate(r: MemberSummary) {
  return r.total > 0 ? r.present / r.total : -1;
}

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
      <p className="text-sm font-semibold text-body">{title}</p>
      {top.length === 0 ? (
        <p className="mt-3 text-sm text-muted">No data yet.</p>
      ) : (
        <ol className="mt-3 flex flex-col gap-1.5">
          {top.map((r, i) => (
            <li key={r.id} className="flex items-center justify-between text-sm">
              <span className="text-muted">
                {i + 1}. {r.full_name}
              </span>
              <span className="font-medium tabular-nums text-body">{r[metric]}</span>
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

export function ReportsClient({
  summaries,
  meetings,
}: {
  summaries: MemberSummary[];
  meetings: MeetingStat[];
}) {
  const [activeTab, setActiveTab] = useState<MemberGroup>("coordinator");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({
    key: "full_name",
    dir: "asc",
  });

  const groupRows = useMemo(
    () =>
      summaries
        .filter((s) => s.group_type === activeTab)
        .sort((a, b) => a.full_name.localeCompare(b.full_name)),
    [summaries, activeTab]
  );

  const sortedRows = useMemo(() => {
    const value = (r: MemberSummary) => (sort.key === "rate" ? rate(r) : r[sort.key]);
    const sign = sort.dir === "asc" ? 1 : -1;
    return [...groupRows].sort((a, b) => {
      const va = value(a);
      const vb = value(b);
      const cmp =
        typeof va === "string" ? va.localeCompare(vb as string) : (va as number) - (vb as number);
      return cmp * sign || a.full_name.localeCompare(b.full_name);
    });
  }, [groupRows, sort]);

  const rates = groupRows.filter((r) => r.total > 0).map((r) => r.present / r.total);

  function sortBy(key: SortKey, numeric: boolean) {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: numeric ? "desc" : "asc" }
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <SegmentedControl
        ariaLabel="Member group"
        options={GROUP_OPTIONS}
        value={activeTab}
        onChange={setActiveTab}
      />

      <ReportStats
        meetings={meetings}
        group={activeTab}
        groupSize={groupRows.length}
        rates={rates}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <MeetingTrendChart meetings={meetings} group={activeTab} groupSize={groupRows.length} />
        </div>
        <div className="lg:col-span-2">
          <RateDistributionChart rates={rates} unrated={groupRows.length - rates.length} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Leaderboard title="Most present" rows={groupRows} metric="present" />
        <Leaderboard title="Most absences" rows={groupRows} metric="absent" />
        <Leaderboard title="Most informed" rows={groupRows} metric="informed" />
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
          <h2 className="text-[15px] font-semibold tracking-tight text-body">
            {GROUP_LABELS[activeTab]} summary
          </h2>
          <button
            onClick={() =>
              downloadCsv(`${activeTab}-attendance-summary.csv`, toCsv(sortedRows))
            }
            className="btn-secondary h-8 px-4"
          >
            Export CSV
          </button>
        </div>
        {groupRows.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-muted">No members yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-xs text-muted">
                  {COLUMNS.map((c, i) => {
                    const active = sort.key === c.key;
                    return (
                      <th
                        key={c.key}
                        aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
                        className={`py-1.5 font-medium ${i === 0 ? "pl-3" : ""} ${
                          i === COLUMNS.length - 1 ? "pr-3" : ""
                        } ${c.numeric ? "text-right" : "text-left"}`}
                      >
                        <button
                          onClick={() => sortBy(c.key, c.numeric)}
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-1 transition-colors hover:bg-surface-muted hover:text-body ${
                            active ? "text-body" : ""
                          }`}
                        >
                          {c.label}
                          <svg
                            aria-hidden
                            viewBox="0 0 10 10"
                            className={`size-2.5 transition-[opacity,rotate] duration-200 ${
                              active ? "opacity-100" : "opacity-0"
                            } ${active && sort.dir === "asc" ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M2.5 4 5 6.5 7.5 4" />
                          </svg>
                        </button>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {sortedRows.map((r) => {
                  const pct = rate(r);
                  return (
                    <tr key={r.id} className="border-b border-line last:border-0">
                      <td className="py-3 pl-5 pr-4">
                        <p className="font-medium text-body">{r.full_name}</p>
                        {r.roll_no && (
                          <p className="text-xs tabular-nums text-muted">{r.roll_no}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-body">{r.present}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-body">{r.absent}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-body">{r.informed}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-muted">{r.total}</td>
                      <td className="py-3 pl-4 pr-5">
                        {pct < 0 ? (
                          <p className="text-right text-muted">—</p>
                        ) : (
                          <div className="flex items-center justify-end gap-2.5">
                            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-surface-muted">
                              <div
                                className={`bar-segment h-full rounded-full ${
                                  pct >= 0.75
                                    ? "bg-emerald-500"
                                    : pct >= 0.5
                                      ? "bg-brand-400"
                                      : "bg-red-500"
                                }`}
                                style={{ width: `${pct * 100}%` }}
                              />
                            </div>
                            <span className="w-10 text-right font-medium tabular-nums text-body">
                              {Math.round(pct * 100)}%
                            </span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
