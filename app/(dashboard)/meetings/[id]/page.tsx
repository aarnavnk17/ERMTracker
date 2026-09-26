import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MeetingAttendance } from "./attendance-client";
import { StatusBadge } from "@/components/StatusBadge";
import { VerticalBadge } from "@/components/VerticalBadge";
import { DeleteMeetingButton } from "./delete-meeting-button";

export default async function MeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: meeting } = await supabase
    .from("meetings")
    .select("id, date, description, vertical_id")
    .eq("id", id)
    .single();

  if (!meeting) notFound();

  const { data: vertical } = await supabase
    .from("verticals")
    .select("name")
    .eq("id", meeting.vertical_id)
    .single();

  const [{ count: totalActive }, { data: members }, { data: records }] =
    await Promise.all([
      supabase
        .from("members")
        .select("id", { count: "exact", head: true })
        .eq("vertical_id", meeting.vertical_id)
        .eq("is_active", true),
      supabase
        .from("members")
        .select("id, full_name, roll_no, group_type")
        .eq("vertical_id", meeting.vertical_id)
        .eq("is_active", true)
        .order("full_name"),
      supabase
        .from("attendance_records")
        .select("member_id, status")
        .eq("meeting_id", id),
    ]);

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
          <VerticalBadge name={vertical?.name ?? ""} />
          <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-body sm:text-3xl">
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
        <div className="flex flex-col items-end gap-2">
          <StatusBadge full={full} />
          <DeleteMeetingButton
            meetingId={meeting.id}
            meetingDescription={meeting.description}
          />
        </div>
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
