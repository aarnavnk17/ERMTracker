export type MemberGroup = "coordinator" | "core_member";
export type AttendanceStatus = "present" | "absent" | "informed";
export type AdminRole = "super_admin" | "vertical_head";

export type Vertical = {
  id: string;
  name: string;
  created_at: string;
};

export type Member = {
  id: string;
  full_name: string;
  roll_no: string | null;
  group_type: MemberGroup;
  vertical_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  display_name: string;
  role: AdminRole;
  vertical_id: string | null;
  created_at: string;
};

export type Meeting = {
  id: string;
  date: string;
  description: string;
  vertical_id: string;
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
