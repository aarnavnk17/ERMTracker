import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MeetingAttendance } from "./attendance-client";

export default async function MeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: meeting }, { data: members }, { data: records }] =
    await Promise.all([
      supabase.from("meetings").select("id, date, description").eq("id", id).single(),
      supabase
        .from("members")
        .select("id, full_name, roll_no, group_type")
        .eq("is_active", true)
        .order("full_name"),
      supabase
        .from("attendance_records")
        .select("member_id, status")
        .eq("meeting_id", id),
    ]);

  if (!meeting) notFound();

  const statusByMember = new Map(
    (records ?? []).map((r) => [r.member_id, r.status])
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-display text-lg font-semibold tracking-tight text-ink-900 dark:text-ink-100">
          {meeting.description}
        </h1>
        <p className="text-sm text-ink-500">
          {new Date(meeting.date + "T00:00:00").toLocaleDateString(
            undefined,
            { year: "numeric", month: "long", day: "numeric" }
          )}
        </p>
      </div>

      <MeetingAttendance
        meetingId={meeting.id}
        members={(members ?? []).map((m) => ({
          ...m,
          status: statusByMember.get(m.id) ?? null,
        }))}
      />
    </div>
  );
}
