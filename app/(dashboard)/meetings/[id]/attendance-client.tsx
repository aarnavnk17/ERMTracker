"use client";

import { useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { AttendanceStatus, MemberGroup } from "@/lib/types";
import { SegmentedControl } from "@/components/SegmentedControl";
import { AttendanceBar } from "@/components/AttendanceBar";
import { SearchField } from "@/components/SearchField";

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
const STATUS_THUMB: Record<AttendanceStatus, string> = {
  present: "bg-emerald-600",
  absent: "bg-red-600",
  informed: "bg-brand-500",
};
const STATUS_TEXT: Record<AttendanceStatus, string> = {
  present: "text-white",
  absent: "text-white",
  informed: "text-ink-950",
};
const STATUS_OPTIONS = (["present", "absent", "informed"] as AttendanceStatus[]).map(
  (value) => ({ value, label: STATUS_LABELS[value] })
);
const GROUP_OPTIONS = (["coordinator", "core_member"] as MemberGroup[]).map((value) => ({
  value,
  label: GROUP_LABELS[value],
}));

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
  const [errorId, setErrorId] = useState<string | null>(null);
  // Writes for one member run in order, so fast re-taps never land out of sequence.
  const queues = useRef(new Map<string, Promise<void>>());
  const latest = useRef(new Map<string, number>());

  function mark(memberId: string, status: AttendanceStatus) {
    const previous = rows.find((r) => r.id === memberId)?.status ?? null;
    if (previous === status) return;
    setRows((prev) => prev.map((r) => (r.id === memberId ? { ...r, status } : r)));
    setErrorId(null);

    const seq = (latest.current.get(memberId) ?? 0) + 1;
    latest.current.set(memberId, seq);

    const run = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { error } = await supabase.from("attendance_records").upsert(
        { meeting_id: meetingId, member_id: memberId, status, marked_by: user?.id },
        { onConflict: "meeting_id,member_id" }
      );
      if (error && latest.current.get(memberId) === seq) {
        setRows((prev) =>
          prev.map((r) => (r.id === memberId ? { ...r, status: previous } : r))
        );
        setErrorId(memberId);
      }
    };
    const next = (queues.current.get(memberId) ?? Promise.resolve()).then(run);
    queues.current.set(memberId, next);
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

  const filterCounts: Record<FilterValue, number> = {
    all: groupRows.length,
    ...counts,
  };

  return (
    <div className="flex flex-col gap-6">
      <SegmentedControl
        ariaLabel="Member group"
        options={GROUP_OPTIONS}
        value={activeTab}
        onChange={setActiveTab}
      />

      <AttendanceBar
        present={counts.present}
        absent={counts.absent}
        informed={counts.informed}
        total={groupRows.length}
      />

      <div className="glass-bar sticky top-[calc(var(--header-h,0px)+0.75rem)] z-10 -mx-5 flex flex-wrap items-center justify-between gap-3 border-y border-line px-5 py-3 sm:mx-0 sm:rounded-2xl sm:border sm:px-3">
        <div className="flex flex-wrap gap-1">
          {FILTERS.map((f) => {
            const active = filter[activeTab] === f.value;
            return (
              <button
                key={f.value}
                aria-pressed={active}
                onClick={() => setFilter((prev) => ({ ...prev, [activeTab]: f.value }))}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium transition-[background-color,color,scale] duration-150 active:scale-95 ${
                  active
                    ? "bg-body text-page"
                    : "text-muted hover:bg-surface-muted hover:text-body"
                }`}
              >
                {f.label}
                <span className={`tabular-nums ${active ? "opacity-60" : "opacity-70"}`}>
                  {filterCounts[f.value]}
                </span>
              </button>
            );
          })}
        </div>
        <SearchField
          placeholder="Search name or roll no"
          value={search[activeTab]}
          onChange={(v) => setSearch((s) => ({ ...s, [activeTab]: v }))}
          className="w-full sm:max-w-xs"
        />
      </div>

      <div className="card overflow-hidden">
        {visibleRows.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-muted">
            No members match this search or filter.
          </p>
        ) : (
          <ul>
            {visibleRows.map((r) => (
              <li
                key={r.id}
                className="relative flex flex-col gap-3 px-5 py-3.5 after:absolute after:bottom-0 after:left-5 after:right-0 after:h-px after:bg-line last:after:hidden sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-medium text-body">{r.full_name}</p>
                  <p className="text-xs tabular-nums text-muted">{r.roll_no}</p>
                  {errorId === r.id && (
                    <p className="field-error">Could not save. Try again.</p>
                  )}
                </div>
                <SegmentedControl
                  ariaLabel={`Attendance for ${r.full_name}`}
                  options={STATUS_OPTIONS}
                  value={r.status}
                  onChange={(status) => mark(r.id, status)}
                  thumbClassName={(v) => STATUS_THUMB[v]}
                  activeTextClassName={(v) => STATUS_TEXT[v]}
                  className="w-full shrink-0 sm:w-72"
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
