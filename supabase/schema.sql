-- Attendance Tracker schema
-- Run this in the Supabase project's SQL editor (Dashboard -> SQL Editor -> New query).

create type member_group as enum ('coordinator', 'core_member');
create type attendance_status as enum ('present', 'absent', 'informed');

create table members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  roll_no text not null,
  group_type member_group not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (group_type, roll_no)
);

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  created_at timestamptz not null default now()
);

create table meetings (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  description text not null,
  created_by uuid references profiles (id),
  created_at timestamptz not null default now()
);

create table attendance_records (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references meetings (id) on delete cascade,
  member_id uuid not null references members (id) on delete cascade,
  status attendance_status not null,
  marked_by uuid not null references profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (meeting_id, member_id)
);

create index attendance_records_meeting_id_idx on attendance_records (meeting_id);
create index attendance_records_member_id_idx on attendance_records (member_id);
create index members_group_type_idx on members (group_type);

-- Row Level Security: every manager/admin (any authenticated Supabase user)
-- has full read/write access. No delete policies -- members are soft-deleted
-- via is_active, attendance corrections are upserts.

alter table members enable row level security;
alter table profiles enable row level security;
alter table meetings enable row level security;
alter table attendance_records enable row level security;

create policy "authenticated read members" on members
  for select using (auth.role() = 'authenticated');
create policy "authenticated insert members" on members
  for insert with check (auth.role() = 'authenticated');
create policy "authenticated update members" on members
  for update using (auth.role() = 'authenticated');

create policy "authenticated read profiles" on profiles
  for select using (auth.role() = 'authenticated');
create policy "users update own profile" on profiles
  for update using (auth.uid() = id);

create policy "authenticated read meetings" on meetings
  for select using (auth.role() = 'authenticated');
create policy "authenticated insert meetings" on meetings
  for insert with check (auth.role() = 'authenticated');
create policy "authenticated update meetings" on meetings
  for update using (auth.role() = 'authenticated');

create policy "authenticated read attendance" on attendance_records
  for select using (auth.role() = 'authenticated');
create policy "authenticated insert attendance" on attendance_records
  for insert with check (auth.role() = 'authenticated');
create policy "authenticated update attendance" on attendance_records
  for update using (auth.role() = 'authenticated');

-- After running this file, provision managers manually:
-- 1. Dashboard -> Authentication -> Add user (email + password, or send invite)
-- 2. Then run, for each new user:
--    insert into profiles (id, display_name) values ('<auth-user-uuid>', 'Their Name');
