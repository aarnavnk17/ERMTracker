-- Migration: multi-vertical attendance tracking
-- Run this once in the Supabase SQL Editor, on top of the existing schema.

-- 1. Verticals
create table verticals (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

insert into verticals (name) values
  ('ERM'), ('Media'), ('Ambiance'), ('PR'), ('Tech'), ('Design');

-- 2. profiles: role + vertical scoping
alter table profiles add column role text not null default 'vertical_head'
  check (role in ('super_admin', 'vertical_head'));
alter table profiles add column vertical_id uuid references verticals (id);

-- Promote the two existing admins to super_admin (no vertical scope) BEFORE
-- adding the check constraint below -- otherwise these rows still sit at
-- the 'vertical_head' default with a null vertical_id and fail it instantly.
update profiles set role = 'super_admin', vertical_id = null
where id in (
  'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d', -- Aarnav
  'd543fb05-0b7b-4107-b8bb-e94600975dac'  -- Chairman
);

alter table profiles add constraint profiles_role_vertical_check check (
  (role = 'super_admin' and vertical_id is null) or
  (role = 'vertical_head' and vertical_id is not null)
);

-- 3. members: vertical scoping + optional roll_no
alter table members add column vertical_id uuid references verticals (id);
update members set vertical_id = (select id from verticals where name = 'ERM');
alter table members alter column vertical_id set not null;
alter table members alter column roll_no drop not null;

-- Drop whatever the old (group_type, roll_no) unique constraint is actually
-- named (found dynamically rather than assumed, to be safe) before adding
-- the new vertical-scoped one.
do $$
declare
  con record;
begin
  for con in
    select conname from pg_constraint
    where conrelid = 'members'::regclass and contype = 'u'
  loop
    execute format('alter table members drop constraint %I', con.conname);
  end loop;
end $$;

alter table members add constraint members_vertical_group_roll_unique
  unique (vertical_id, group_type, roll_no);

create index members_vertical_id_idx on members (vertical_id);

-- 4. meetings: vertical scoping
alter table meetings add column vertical_id uuid references verticals (id);
update meetings set vertical_id = (select id from verticals where name = 'ERM');
alter table meetings alter column vertical_id set not null;

create index meetings_vertical_id_idx on meetings (vertical_id);

-- 5. RLS: verticals
alter table verticals enable row level security;
create policy "authenticated read verticals" on verticals
  for select using (auth.role() = 'authenticated');

-- 6. RLS: replace blanket policies with vertical-scoped ones

drop policy "authenticated read members" on members;
drop policy "authenticated insert members" on members;
drop policy "authenticated update members" on members;

create policy "scoped read members" on members
  for select using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and (p.role = 'super_admin' or p.vertical_id = members.vertical_id)
    )
  );
create policy "scoped insert members" on members
  for insert with check (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and (p.role = 'super_admin' or p.vertical_id = members.vertical_id)
    )
  );
create policy "scoped update members" on members
  for update using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and (p.role = 'super_admin' or p.vertical_id = members.vertical_id)
    )
  );

drop policy "authenticated read meetings" on meetings;
drop policy "authenticated insert meetings" on meetings;
drop policy "authenticated update meetings" on meetings;

create policy "scoped read meetings" on meetings
  for select using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and (p.role = 'super_admin' or p.vertical_id = meetings.vertical_id)
    )
  );
create policy "scoped insert meetings" on meetings
  for insert with check (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and (p.role = 'super_admin' or p.vertical_id = meetings.vertical_id)
    )
  );
create policy "scoped update meetings" on meetings
  for update using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and (p.role = 'super_admin' or p.vertical_id = meetings.vertical_id)
    )
  );
create policy "scoped delete meetings" on meetings
  for delete using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and (p.role = 'super_admin' or p.vertical_id = meetings.vertical_id)
    )
  );

drop policy "authenticated read attendance" on attendance_records;
drop policy "authenticated insert attendance" on attendance_records;
drop policy "authenticated update attendance" on attendance_records;

create policy "scoped read attendance" on attendance_records
  for select using (
    exists (
      select 1 from meetings m
      join profiles p on p.id = auth.uid()
      where m.id = attendance_records.meeting_id
      and (p.role = 'super_admin' or p.vertical_id = m.vertical_id)
    )
  );
create policy "scoped insert attendance" on attendance_records
  for insert with check (
    exists (
      select 1 from meetings m
      join profiles p on p.id = auth.uid()
      where m.id = attendance_records.meeting_id
      and (p.role = 'super_admin' or p.vertical_id = m.vertical_id)
    )
  );
create policy "scoped update attendance" on attendance_records
  for update using (
    exists (
      select 1 from meetings m
      join profiles p on p.id = auth.uid()
      where m.id = attendance_records.meeting_id
      and (p.role = 'super_admin' or p.vertical_id = m.vertical_id)
    )
  );
-- Needed so that ON DELETE CASCADE from a deleted meeting can actually
-- remove its attendance_records under RLS (deleting a meeting is how
-- admins fix wrongly-created/test meetings).
create policy "scoped delete attendance" on attendance_records
  for delete using (
    exists (
      select 1 from meetings m
      join profiles p on p.id = auth.uid()
      where m.id = attendance_records.meeting_id
      and (p.role = 'super_admin' or p.vertical_id = m.vertical_id)
    )
  );

-- After running this file:
-- 1. Run supabase/seed_verticals.sql to import the other 5 verticals' rosters.
-- 2. Provision vertical-head logins the same way admins were provisioned before
--    (Dashboard -> Authentication -> Add user), then:
--    insert into profiles (id, display_name, role, vertical_id)
--    values ('<uuid>', '<Name>', 'vertical_head', (select id from verticals where name = '<Vertical>'));
