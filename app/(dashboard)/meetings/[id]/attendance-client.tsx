"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { AttendanceStatus, MemberGroup } from "@/lib/types";

type MemberRow = {
  id: string;
  full_name: string;
  roll_no: string;
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
      if (q && !r.full_name.toLowerCase().includes(q) && !r.roll_no.toLowerCase().includes(q)) {
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

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-green-100 px-2.5 py-1 font-medium text-green-800">
          {counts.present} Present
        </span>
        <span className="rounded-full bg-red-100 px-2.5 py-1 font-medium text-red-800">
          {counts.absent} Absent
        </span>
        <span className="rounded-full bg-brand-100 px-2.5 py-1 font-medium text-brand-800">
          {counts.informed} Informed
        </span>
        <span className="rounded-full bg-ink-200 px-2.5 py-1 font-medium text-ink-700 dark:bg-ink-800 dark:text-ink-300">
          {counts.unmarked} Not marked
        </span>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          placeholder="Search name or roll no..."
          value={search[activeTab]}
          onChange={(e) =>
            setSearch((s) => ({ ...s, [activeTab]: e.target.value }))
          }
          className="flex-1 rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-ink-700 dark:bg-ink-800"
        />
        <select
          value={filter[activeTab]}
          onChange={(e) =>
            setFilter((f) => ({
              ...f,
              [activeTab]: e.target.value as FilterValue,
            }))
          }
          className="rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-ink-700 dark:bg-ink-800"
        >
          <option value="all">All</option>
          <option value="unmarked">Not marked</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="informed">Informed</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-ink-200 bg-white shadow-sm dark:border-ink-800 dark:bg-ink-900">
        {visibleRows.length === 0 ? (
          <p className="px-4 py-6 text-sm text-ink-500">
            No members match this search/filter.
          </p>
        ) : (
          <ul className="divide-y divide-ink-100 dark:divide-ink-800">
            {visibleRows.map((r) => (
              <li
                key={r.id}
                className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-ink-900 dark:text-ink-100">
                    {r.full_name}
                  </p>
                  <p className="text-xs text-ink-500">{r.roll_no}</p>
                  {errorId === r.id && (
                    <p className="text-xs text-red-600">
                      Could not save — try again.
                    </p>
                  )}
                </div>
                <div className="flex gap-1.5">
                  {(["present", "absent", "informed"] as AttendanceStatus[]).map(
                    (status) => (
                      <button
                        key={status}
                        disabled={pendingId === r.id}
                        onClick={() => mark(r.id, status)}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
                          r.status === status
                            ? status === "present"
                              ? "bg-green-600 text-white"
                              : status === "absent"
                              ? "bg-red-600 text-white"
                              : "bg-brand-600 text-white"
                            : "bg-ink-100 text-ink-700 hover:bg-ink-200 dark:bg-ink-800 dark:text-ink-300"
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
