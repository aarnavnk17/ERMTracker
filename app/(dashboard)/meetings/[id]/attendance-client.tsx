"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { AttendanceStatus, MemberGroup } from "@/lib/types";

type MemberRow = {
  id: string;
  full_name: string;
  roll_no: string | null;
  group_type: MemberGroup;
  status: AttendanceStatus | null;
};

const GROUP_LABELS: Record<MemberGroup, string> = {
  coordinator: "Team Coordinators",
  core_member: "Core Team Members",
};

const STATUS_LABELS: Record<AttendanceStatus, string> = {
  present: "Present",
  absent: "Absent",
  informed: "Informed",
};

type FilterValue = "all" | "unmarked" | AttendanceStatus;
const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unmarked", label: "Not marked" },
  { value: "present", label: "Present" },
  { value: "absent", label: "Absent" },
  { value: "informed", label: "Informed" },
];

export function MeetingAttendance({
  meetingId,
  members,
}: {
  meetingId: string;
  members: MemberRow[];
}) {
  const [activeTab, setActiveTab] = useState<MemberGroup>("coordinator");
  const [rows, setRows] = useState<MemberRow[]>(members);
  const [search, setSearch] = useState<Record<MemberGroup, string>>({
    coordinator: "",
    core_member: "",
  });
  const [filter, setFilter] = useState<Record<MemberGroup, FilterValue>>({
    coordinator: "all",
    core_member: "all",
  });
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);

  async function mark(memberId: string, status: AttendanceStatus) {
    const previous = rows.find((r) => r.id === memberId)?.status ?? null;
    setRows((prev) =>
      prev.map((r) => (r.id === memberId ? { ...r, status } : r))
    );
    setPendingId(memberId);
    setErrorId(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("attendance_records").upsert(
      {
        meeting_id: meetingId,
        member_id: memberId,
        status,
        marked_by: user?.id,
      },
      { onConflict: "meeting_id,member_id" }
    );

    setPendingId(null);
    if (error) {
      setRows((prev) =>
        prev.map((r) => (r.id === memberId ? { ...r, status: previous } : r))
      );
      setErrorId(memberId);
    }
  }

  const groupRows = useMemo(
    () => rows.filter((r) => r.group_type === activeTab),
    [rows, activeTab]
  );

  const visibleRows = useMemo(() => {
    const q = search[activeTab].trim().toLowerCase();
    const f = filter[activeTab];
    return groupRows.filter((r) => {
      if (
        q &&
        !r.full_name.toLowerCase().includes(q) &&
        !(r.roll_no ?? "").toLowerCase().includes(q)
      ) {
        return false;
      }
      if (f === "unmarked") return r.status === null;
      if (f !== "all") return r.status === f;
      return true;
    });
  }, [groupRows, search, filter, activeTab]);

  const counts = useMemo(() => {
    const c = { present: 0, absent: 0, informed: 0, unmarked: 0 };
    for (const r of groupRows) {
      if (r.status === null) c.unmarked++;
      else c[r.status]++;
    }
    return c;
  }, [groupRows]);

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

      <div className="sticky top-0 z-10 -mx-5 flex flex-wrap items-center justify-between gap-3 border-b border-line bg-page/90 px-5 py-3 backdrop-blur-sm sm:mx-0 sm:rounded-md sm:border sm:px-4">
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() =>
                setFilter((prev) => ({ ...prev, [activeTab]: f.value }))
              }
              className={`eyebrow rounded-md px-3 py-1.5 ${
                filter[activeTab] === f.value
                  ? "bg-brand-600 text-ink-950"
                  : "text-muted hover:bg-surface-muted"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search name or roll no..."
          value={search[activeTab]}
          onChange={(e) =>
            setSearch((s) => ({ ...s, [activeTab]: e.target.value }))
          }
          className="input max-w-xs"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="badge bg-emerald-50 text-emerald-800 ring-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-800">
          {counts.present} Present
        </span>
        <span className="badge bg-red-50 text-red-800 ring-red-300 dark:bg-red-950/40 dark:text-red-300 dark:ring-red-800">
          {counts.absent} Absent
        </span>
        <span className="badge bg-brand-50 text-brand-800 ring-brand-300 dark:bg-brand-900/40 dark:text-brand-300 dark:ring-brand-700">
          {counts.informed} Informed
        </span>
        <span className="badge bg-surface-muted text-muted ring-line">
          {counts.unmarked} Not marked
        </span>
      </div>

      <div className="card overflow-hidden">
        {visibleRows.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted">
            No members match this search/filter.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {visibleRows.map((r) => (
              <li
                key={r.id}
                className="flex flex-col gap-3 px-5 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-body">{r.full_name}</p>
                  <p className="font-mono text-xs text-muted">{r.roll_no}</p>
                  {errorId === r.id && (
                    <p className="field-error">Could not save — try again.</p>
                  )}
                </div>
                <div className="flex gap-1.5">
                  {(["present", "absent", "informed"] as AttendanceStatus[]).map(
                    (status) => (
                      <button
                        key={status}
                        disabled={pendingId === r.id}
                        onClick={() => mark(r.id, status)}
                        className={`eyebrow rounded-md px-3 py-1.5 transition-colors disabled:opacity-50 ${
                          r.status === status
                            ? status === "present"
                              ? "bg-emerald-600 text-white"
                              : status === "absent"
                              ? "bg-red-600 text-white"
                              : "bg-brand-500 text-ink-950"
                            : "bg-surface-muted text-muted hover:text-body"
                        }`}
                      >
                        {STATUS_LABELS[status]}
                      </button>
                    )
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
