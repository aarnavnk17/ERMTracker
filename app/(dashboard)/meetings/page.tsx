import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { NewMeetingForm } from "./new-meeting-form";

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

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-lg font-semibold tracking-tight text-ink-900 dark:text-ink-100">
        Meetings
      </h1>

      <NewMeetingForm />

      <div className="overflow-hidden rounded-xl border border-ink-200 bg-white shadow-sm dark:border-ink-800 dark:bg-ink-900">
        <div className="border-b border-ink-100 px-4 py-3 dark:border-ink-800">
          <h2 className="text-sm font-medium text-ink-900 dark:text-ink-100">
            Past meetings
          </h2>
        </div>
        {!meetings || meetings.length === 0 ? (
          <p className="px-4 py-6 text-sm text-ink-500">
            No meetings yet — create one above to start marking attendance.
          </p>
        ) : (
          <ul className="divide-y divide-ink-100 dark:divide-ink-800">
            {meetings.map((m) => {
              const marked = markedCounts.get(m.id) ?? 0;
              const total = totalActive ?? 0;
              const full = total > 0 && marked >= total;
              return (
                <li key={m.id}>
                  <Link
                    href={`/meetings/${m.id}`}
                    className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-brand-50/60 dark:hover:bg-ink-800"
                  >
                    <div>
                      <p className="text-sm font-medium text-ink-900 dark:text-ink-100">
                        {m.description}
                      </p>
                      <p className="text-xs text-ink-500">
                        {new Date(m.date + "T00:00:00").toLocaleDateString(
                          undefined,
                          { year: "numeric", month: "long", day: "numeric" }
                        )}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                        full
                          ? "bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-300"
                          : "bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-300"
                      }`}
                    >
                      {marked} of {total} marked
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
