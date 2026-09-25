export type MemberGroup = "coordinator" | "core_member";
export type AttendanceStatus = "present" | "absent" | "informed";

export type Member = {
  id: string;
  full_name: string;
  roll_no: string;
  group_type: MemberGroup;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  display_name: string;
  created_at: string;
};

export type Meeting = {
  id: string;
  date: string;
  description: string;
  created_by: string | null;
  created_at: string;
};

export type AttendanceRecord = {
  id: string;
  meeting_id: string;
  member_id: string;
  status: AttendanceStatus;
  marked_by: string;
  created_at: string;
  updated_at: string;
};
