import { createClient } from "@/lib/supabase/server";
import { ReportsClient, type MemberSummary } from "./reports-client";

export default async function ReportsPage() {
  const supabase = await createClient();

  const [{ data: members }, { data: records }] = await Promise.all([
    supabase
      .from("members")
      .select("id, full_name, roll_no, group_type")
      .eq("is_active", true),
    supabase.from("attendance_records").select("member_id, status"),
  ]);

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

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="eyebrow text-brand-600 dark:text-brand-400">Reports</p>
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-body sm:text-3xl">
          Attendance summary
        </h1>
      </div>
      <ReportsClient summaries={summaries} />
    </div>
  );
}
