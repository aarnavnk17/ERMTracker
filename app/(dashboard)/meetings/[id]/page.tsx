import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MeetingAttendance } from "./attendance-client";
import { StatusBadge } from "@/components/StatusBadge";

export default async function MeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: meeting }, { count: totalActive }, { data: members }, { data: records }] =
    await Promise.all([
      supabase.from("meetings").select("id, date, description").eq("id", id).single(),
      supabase.from("members").select("id", { count: "exact", head: true }).eq("is_active", true),
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
  const total = totalActive ?? 0;
  const full = total > 0 && (records ?? []).length >= total;

  return (
    <div className="flex flex-col gap-6">
      <Link href="/meetings" className="text-sm font-medium text-muted hover:text-body">
        ← Back
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-body sm:text-3xl">
            {meeting.description}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {new Date(meeting.date + "T00:00:00").toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <StatusBadge full={full} />
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
