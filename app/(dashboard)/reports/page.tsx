import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/current-profile";
import { resolveEffectiveVerticalId } from "@/lib/effective-vertical";
import { ReportsClient, type MemberSummary } from "./reports-client";
import type { MeetingStat } from "./charts";
import { VerticalBadge } from "@/components/VerticalBadge";
import type { AttendanceStatus, MemberGroup } from "@/lib/types";

export default async function ReportsPage({
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

  const [{ data: members }, { data: meetings }] = await Promise.all([
    supabase
      .from("members")
      .select("id, full_name, roll_no, group_type")
      .eq("vertical_id", verticalId)
      .eq("is_active", true),
    supabase
      .from("meetings")
      .select("id, date, description")
      .eq("vertical_id", verticalId)
      .order("date", { ascending: true })
      .order("created_at", { ascending: true }),
  ]);

  const memberIds = (members ?? []).map((m) => m.id);
  const { data: records } =
    memberIds.length > 0
      ? await supabase
          .from("attendance_records")
          .select("meeting_id, member_id, status")
          .in("member_id", memberIds)
      : { data: [] as { meeting_id: string; member_id: string; status: string }[] };

  const summaries: MemberSummary[] = (members ?? []).map((m) => {
    const memberRecords = (records ?? []).filter(
      (r) => r.member_id === m.id
    );
    const present = memberRecords.filter((r) => r.status === "present").length;
    const absent = memberRecords.filter((r) => r.status === "absent").length;
    const informed = memberRecords.filter((r) => r.status === "informed").length;

    return {
      id: m.id,
      full_name: m.full_name,
      roll_no: m.roll_no,
      group_type: m.group_type,
      present,
      absent,
      informed,
      total: present + absent + informed,
    };
  });

  const groupOf = new Map((members ?? []).map((m) => [m.id, m.group_type as MemberGroup]));
  const empty = () => ({ present: 0, absent: 0, informed: 0 });
  const statsById = new Map<string, MeetingStat>(
    (meetings ?? []).map((m) => [
      m.id,
      { ...m, coordinator: empty(), core_member: empty() },
    ])
  );
  for (const r of records ?? []) {
    const stat = statsById.get(r.meeting_id);
    const group = groupOf.get(r.member_id);
    if (stat && group) stat[group][r.status as AttendanceStatus]++;
  }
  const meetingStats = [...statsById.values()];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <VerticalBadge name={verticalName} />
        <p className="eyebrow mt-4 text-brand-600 dark:text-brand-400">Reports</p>
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-body sm:text-3xl">
          Attendance summary
        </h1>
      </div>
      <ReportsClient summaries={summaries} meetings={meetingStats} />
    </div>
  );
}
