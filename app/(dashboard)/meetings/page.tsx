import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/current-profile";
import { resolveEffectiveVerticalId } from "@/lib/effective-vertical";
import type { AttendanceStatus } from "@/lib/types";
import { NewMeetingForm } from "./new-meeting-form";
import { AttendanceBar } from "@/components/AttendanceBar";
import { StatusBadge } from "@/components/StatusBadge";
import { VerticalBadge } from "@/components/VerticalBadge";

export default async function MeetingsPage({
  searchParams,
}: {
  searchParams: Promise<{ v?: string }>;
}) {
  const { v } = await searchParams;
  const supabase = await createClient();
  const profile = await getCurrentProfile(supabase);
  const { data: verticals } = await supabase
    .from("verticals")
    .select("id, name, created_at")
    .order("name");

  if (!profile || !verticals) return null;
  const verticalId = resolveEffectiveVerticalId(profile, verticals, v);
  const verticalName = verticals.find((ver) => ver.id === verticalId)?.name ?? "";

  const [{ data: meetings }, { count: totalActive }] = await Promise.all([
    supabase
      .from("meetings")
      .select("id, date, description")
      .eq("vertical_id", verticalId)
      .order("date", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase
      .from("members")
      .select("id", { count: "exact", head: true })
      .eq("vertical_id", verticalId)
      .eq("is_active", true),
  ]);

  const total = totalActive ?? 0;
  const list = meetings ?? [];

  const { data: records } =
    list.length > 0
      ? await supabase
          .from("attendance_records")
          .select("meeting_id, status")
          .in("meeting_id", list.map((m) => m.id))
      : { data: [] as { meeting_id: string; status: AttendanceStatus }[] };

  const statusCounts = new Map<string, Record<AttendanceStatus, number>>();
  for (const r of records ?? []) {
    const c = statusCounts.get(r.meeting_id) ?? { present: 0, absent: 0, informed: 0 };
    c[r.status as AttendanceStatus]++;
    statusCounts.set(r.meeting_id, c);
  }
  const markedCount = (id: string) => {
    const c = statusCounts.get(id);
    return c ? c.present + c.absent + c.informed : 0;
  };
  const fullyMarked = list.filter((m) => total > 0 && markedCount(m.id) >= total).length;
  const stats = [
    { label: "Meetings", value: list.length },
    { label: "Fully marked", value: fullyMarked },
    { label: "Active members", value: total },
  ];

  return (
    <div className="flex flex-col gap-10">
      <div className="max-w-2xl">
        <VerticalBadge name={verticalName} />
        <p className="eyebrow mt-4 text-brand-600 dark:text-brand-400">Meetings</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-balance text-body sm:text-4xl">
          Meeting attendance
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted">
          Log a meeting and mark Present, Absent or Informed for each member.
        </p>

        <dl className="mt-8 grid grid-cols-3 gap-3">
          {stats.map((st) => (
            <div key={st.label} className="card px-4 py-3.5 sm:px-5 sm:py-4">
              <dt className="text-xs font-medium text-muted sm:text-sm">{st.label}</dt>
              <dd className="mt-1 font-display text-3xl font-semibold tracking-tight tabular-nums text-body sm:text-4xl">
                {st.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <NewMeetingForm verticalId={verticalId} />

      {list.length === 0 ? (
        <div className="card flex flex-col items-center px-6 py-16 text-center">
          <svg aria-hidden viewBox="0 0 24 24" className="mb-3 size-10 text-ink-300 dark:text-ink-600" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3.5" y="5" width="17" height="15" rx="3" />
            <path d="M3.5 10h17M8 3v4M16 3v4" />
          </svg>
          <p className="text-base font-medium text-body">No meetings yet</p>
          <p className="mt-1 text-sm text-muted">
            Create one above to start marking attendance.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((m, i) => {
            const c = statusCounts.get(m.id) ?? { present: 0, absent: 0, informed: 0 };
            const marked = markedCount(m.id);
            const full = total > 0 && marked >= total;
            return (
              <Link
                key={m.id}
                href={`/meetings/${m.id}`}
                className={`card card-link flex flex-col gap-4 p-5 ${full ? "card-full" : ""}`}
                style={
                  i < 8 ? { animationDelay: `${i * 40}ms` } : undefined
                }
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-base font-semibold leading-snug text-balance text-body">
                    {m.description}
                  </p>
                  <StatusBadge full={full} />
                </div>
                <p className="text-xs text-muted">
                  {new Date(m.date + "T00:00:00").toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <div className="mt-auto">
                  <AttendanceBar
                    present={c.present}
                    absent={c.absent}
                    informed={c.informed}
                    total={total}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
