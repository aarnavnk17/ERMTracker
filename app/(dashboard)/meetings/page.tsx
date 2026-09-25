import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { NewMeetingForm } from "./new-meeting-form";
import { SlotMeter } from "@/components/SlotMeter";
import { StatusBadge } from "@/components/StatusBadge";

export default async function MeetingsPage() {
  const supabase = await createClient();

  const [{ data: meetings }, { count: totalActive }, { data: records }] =
    await Promise.all([
      supabase
        .from("meetings")
        .select("id, date, description")
        .order("date", { ascending: false })
        .order("created_at", { ascending: false }),
      supabase
        .from("members")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true),
      supabase.from("attendance_records").select("meeting_id"),
    ]);

  const markedCounts = new Map<string, number>();
  for (const r of records ?? []) {
    markedCounts.set(r.meeting_id, (markedCounts.get(r.meeting_id) ?? 0) + 1);
  }
  const total = totalActive ?? 0;
  const list = meetings ?? [];
  const fullyMarked = list.filter((m) => (markedCounts.get(m.id) ?? 0) >= total).length;

  return (
    <div className="flex flex-col gap-10">
      <div className="max-w-2xl">
        <p className="eyebrow text-brand-600 dark:text-brand-400">Meetings</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-balance text-body sm:text-4xl">
          Meeting attendance
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted">
          Log a meeting and mark Present, Absent or Informed for each member.
        </p>

        <dl className="mt-8 grid grid-cols-3 gap-4 border-y border-line py-5">
          <div>
            <dt className="eyebrow text-muted">Meetings</dt>
            <dd className="font-mono text-2xl font-semibold text-body sm:text-3xl">
              {list.length}
            </dd>
          </div>
          <div>
            <dt className="eyebrow text-muted">Fully marked</dt>
            <dd className="font-mono text-2xl font-semibold text-body sm:text-3xl">
              {fullyMarked}
            </dd>
          </div>
          <div>
            <dt className="eyebrow text-muted">Active members</dt>
            <dd className="font-mono text-2xl font-semibold text-body sm:text-3xl">
              {total}
            </dd>
          </div>
        </dl>
      </div>

      <NewMeetingForm />

      {list.length === 0 ? (
        <div className="card px-6 py-16 text-center">
          <p className="text-base font-medium text-body">No meetings yet</p>
          <p className="mt-1 text-sm text-muted">
            Create one above to start marking attendance.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((m, i) => {
            const marked = markedCounts.get(m.id) ?? 0;
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
                  <SlotMeter marked={marked} total={total} />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
