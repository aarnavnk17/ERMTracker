-- Auto-generated seed script: historical meetings + attendance from spreadsheets
-- Run this once. Members and attendance_records inserts are safe to re-run
-- (ON CONFLICT DO NOTHING), but the meetings insert is NOT -- it has no natural
-- unique key, so re-running it would create duplicate meetings.

-- 1. Meetings (run this seed only once -- re-running would create duplicate meetings)
insert into meetings (id, date, description, created_by) values
  (gen_random_uuid(), '2026-08-25', 'ERM Initial Meeting', 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'), -- m1
  (gen_random_uuid(), '2026-09-10', 'Club POC Meeting', 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'), -- m2
  (gen_random_uuid(), '2026-09-25', 'ERM Portal Lunch Meeting', 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'), -- m3
  (gen_random_uuid(), '2026-09-25', 'ERM Portal Evening Meet', 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d') -- m4
;

-- 2. Members
insert into members (full_name, roll_no, group_type) values
  ('Rishwanth T', '24P218', 'coordinator'),
  ('Kannan D', '24Y112', 'coordinator'),
  ('Jayantan B', '24P213', 'coordinator'),
  ('Ganesh Sakthi S', '24P210', 'coordinator'),
  ('Ananya E', '24B207', 'coordinator'),
  ('R. Nethra', '24I345', 'coordinator'),
  ('Aarnav N', '24Z301', 'coordinator'),
  ('Shakthi Abinaya V', '24N254', 'coordinator'),
  ('Sharmisthaa K', '24I376', 'coordinator'),
  ('Rithika A V', '24C127', 'coordinator'),
  ('Abhinav A', '24L101', 'coordinator'),
  ('Santhosh A S', '24Y124', 'coordinator'),
  ('Prithikka B', '24Z257', 'coordinator'),
  ('K K Shivani Prithika', '24Z232', 'coordinator'),
  ('Thellothama UB', '24D245', 'coordinator'),
  ('Sanjay S', '24Y123', 'coordinator'),
  ('Asif Hussein', '24P606', 'coordinator'),
  ('Nimalan E', '24P626', 'coordinator'),
  ('Annie Rachel Augustine', '24D206', 'core_member'),
  ('Arul kavin V', '25S048', 'core_member'),
  ('Ashwin G', '25B206', 'core_member'),
  ('Asmitha', '25L205', 'core_member'),
  ('Dharsana P', '25P104', 'core_member'),
  ('Harani A C', '25A218', 'core_member'),
  ('Jessicca juliet B', '25L213', 'core_member'),
  ('Kavyadharshini R', '25L215', 'core_member'),
  ('Madhumitha R', '25D221', 'core_member'),
  ('Manoj T', '25Y115', 'core_member'),
  ('Mariyam J', '25E137', 'core_member'),
  ('Naga Keerthana S R', '25E231', 'core_member'),
  ('Nandikaa D', '25P213', 'core_member'),
  ('Negha Sree SM', '25X029', 'core_member'),
  ('Nethraa Saravanan', '25PD14', 'core_member'),
  ('Pranav J', '25T116', 'core_member'),
  ('Sanjana Ramkumar', '25L249', 'core_member'),
  ('Selva kumaar R', '25L149', 'core_member'),
  ('Shriya LT', '25S044', 'core_member'),
  ('Shivani Sree B S', '25Y223', 'core_member'),
  ('Shahrin Jahana J S', '25PD30', 'core_member'),
  ('Thanushree Sirumugai Vijayamuniraj', '25Z273', 'core_member'),
  ('Visalatshe RC', '25Z380', 'core_member')
on conflict (group_type, roll_no) do nothing;

-- 3. Attendance records
insert into attendance_records (meeting_id, member_id, status, marked_by)
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-08-25' and m.description = 'ERM Initial Meeting'
    and mem.roll_no = '24P218' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'informed'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-10' and m.description = 'Club POC Meeting'
    and mem.roll_no = '24P218' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Lunch Meeting'
    and mem.roll_no = '24P218' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Evening Meet'
    and mem.roll_no = '24P218' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-08-25' and m.description = 'ERM Initial Meeting'
    and mem.roll_no = '24Y112' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-10' and m.description = 'Club POC Meeting'
    and mem.roll_no = '24Y112' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Lunch Meeting'
    and mem.roll_no = '24Y112' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Evening Meet'
    and mem.roll_no = '24Y112' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-08-25' and m.description = 'ERM Initial Meeting'
    and mem.roll_no = '24P213' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'informed'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-10' and m.description = 'Club POC Meeting'
    and mem.roll_no = '24P213' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Lunch Meeting'
    and mem.roll_no = '24P213' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Evening Meet'
    and mem.roll_no = '24P213' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-08-25' and m.description = 'ERM Initial Meeting'
    and mem.roll_no = '24P210' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'informed'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-10' and m.description = 'Club POC Meeting'
    and mem.roll_no = '24P210' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Lunch Meeting'
    and mem.roll_no = '24P210' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Evening Meet'
    and mem.roll_no = '24P210' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-08-25' and m.description = 'ERM Initial Meeting'
    and mem.roll_no = '24B207' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'informed'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-10' and m.description = 'Club POC Meeting'
    and mem.roll_no = '24B207' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'informed'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Lunch Meeting'
    and mem.roll_no = '24B207' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'informed'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Evening Meet'
    and mem.roll_no = '24B207' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-08-25' and m.description = 'ERM Initial Meeting'
    and mem.roll_no = '24I345' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-10' and m.description = 'Club POC Meeting'
    and mem.roll_no = '24I345' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Lunch Meeting'
    and mem.roll_no = '24I345' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Evening Meet'
    and mem.roll_no = '24I345' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-08-25' and m.description = 'ERM Initial Meeting'
    and mem.roll_no = '24Z301' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-10' and m.description = 'Club POC Meeting'
    and mem.roll_no = '24Z301' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Lunch Meeting'
    and mem.roll_no = '24Z301' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Evening Meet'
    and mem.roll_no = '24Z301' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-08-25' and m.description = 'ERM Initial Meeting'
    and mem.roll_no = '24N254' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-10' and m.description = 'Club POC Meeting'
    and mem.roll_no = '24N254' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Lunch Meeting'
    and mem.roll_no = '24N254' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Evening Meet'
    and mem.roll_no = '24N254' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-08-25' and m.description = 'ERM Initial Meeting'
    and mem.roll_no = '24I376' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-10' and m.description = 'Club POC Meeting'
    and mem.roll_no = '24I376' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Lunch Meeting'
    and mem.roll_no = '24I376' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Evening Meet'
    and mem.roll_no = '24I376' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'informed'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-08-25' and m.description = 'ERM Initial Meeting'
    and mem.roll_no = '24C127' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-10' and m.description = 'Club POC Meeting'
    and mem.roll_no = '24C127' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Lunch Meeting'
    and mem.roll_no = '24C127' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Evening Meet'
    and mem.roll_no = '24C127' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-08-25' and m.description = 'ERM Initial Meeting'
    and mem.roll_no = '24L101' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'informed'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-10' and m.description = 'Club POC Meeting'
    and mem.roll_no = '24L101' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'absent'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Lunch Meeting'
    and mem.roll_no = '24L101' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'absent'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Evening Meet'
    and mem.roll_no = '24L101' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-08-25' and m.description = 'ERM Initial Meeting'
    and mem.roll_no = '24Y124' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-10' and m.description = 'Club POC Meeting'
    and mem.roll_no = '24Y124' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Lunch Meeting'
    and mem.roll_no = '24Y124' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Evening Meet'
    and mem.roll_no = '24Y124' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-08-25' and m.description = 'ERM Initial Meeting'
    and mem.roll_no = '24Z257' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'informed'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-10' and m.description = 'Club POC Meeting'
    and mem.roll_no = '24Z257' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'absent'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Lunch Meeting'
    and mem.roll_no = '24Z257' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'absent'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Evening Meet'
    and mem.roll_no = '24Z257' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-08-25' and m.description = 'ERM Initial Meeting'
    and mem.roll_no = '24Z232' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'informed'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-10' and m.description = 'Club POC Meeting'
    and mem.roll_no = '24Z232' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Lunch Meeting'
    and mem.roll_no = '24Z232' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'informed'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Evening Meet'
    and mem.roll_no = '24Z232' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-08-25' and m.description = 'ERM Initial Meeting'
    and mem.roll_no = '24D245' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'absent'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-10' and m.description = 'Club POC Meeting'
    and mem.roll_no = '24D245' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Lunch Meeting'
    and mem.roll_no = '24D245' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Evening Meet'
    and mem.roll_no = '24D245' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-08-25' and m.description = 'ERM Initial Meeting'
    and mem.roll_no = '24Y123' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-10' and m.description = 'Club POC Meeting'
    and mem.roll_no = '24Y123' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Lunch Meeting'
    and mem.roll_no = '24Y123' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Evening Meet'
    and mem.roll_no = '24Y123' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-08-25' and m.description = 'ERM Initial Meeting'
    and mem.roll_no = '24P606' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'informed'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-10' and m.description = 'Club POC Meeting'
    and mem.roll_no = '24P606' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Lunch Meeting'
    and mem.roll_no = '24P606' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Evening Meet'
    and mem.roll_no = '24P606' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-08-25' and m.description = 'ERM Initial Meeting'
    and mem.roll_no = '24P626' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'informed'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-10' and m.description = 'Club POC Meeting'
    and mem.roll_no = '24P626' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Lunch Meeting'
    and mem.roll_no = '24P626' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'informed'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Evening Meet'
    and mem.roll_no = '24P626' and mem.group_type = 'coordinator'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-08-25' and m.description = 'ERM Initial Meeting'
    and mem.roll_no = '24D206' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'absent'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-10' and m.description = 'Club POC Meeting'
    and mem.roll_no = '24D206' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Lunch Meeting'
    and mem.roll_no = '24D206' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Evening Meet'
    and mem.roll_no = '24D206' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-08-25' and m.description = 'ERM Initial Meeting'
    and mem.roll_no = '25S048' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-10' and m.description = 'Club POC Meeting'
    and mem.roll_no = '25S048' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Lunch Meeting'
    and mem.roll_no = '25S048' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Evening Meet'
    and mem.roll_no = '25S048' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-08-25' and m.description = 'ERM Initial Meeting'
    and mem.roll_no = '25B206' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-10' and m.description = 'Club POC Meeting'
    and mem.roll_no = '25B206' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Lunch Meeting'
    and mem.roll_no = '25B206' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Evening Meet'
    and mem.roll_no = '25B206' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-08-25' and m.description = 'ERM Initial Meeting'
    and mem.roll_no = '25L205' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'informed'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-10' and m.description = 'Club POC Meeting'
    and mem.roll_no = '25L205' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'absent'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Lunch Meeting'
    and mem.roll_no = '25L205' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'informed'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Evening Meet'
    and mem.roll_no = '25L205' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-08-25' and m.description = 'ERM Initial Meeting'
    and mem.roll_no = '25P104' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-10' and m.description = 'Club POC Meeting'
    and mem.roll_no = '25P104' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Lunch Meeting'
    and mem.roll_no = '25P104' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Evening Meet'
    and mem.roll_no = '25P104' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-08-25' and m.description = 'ERM Initial Meeting'
    and mem.roll_no = '25A218' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-10' and m.description = 'Club POC Meeting'
    and mem.roll_no = '25A218' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Lunch Meeting'
    and mem.roll_no = '25A218' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Evening Meet'
    and mem.roll_no = '25A218' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-08-25' and m.description = 'ERM Initial Meeting'
    and mem.roll_no = '25L213' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-10' and m.description = 'Club POC Meeting'
    and mem.roll_no = '25L213' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Lunch Meeting'
    and mem.roll_no = '25L213' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Evening Meet'
    and mem.roll_no = '25L213' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-08-25' and m.description = 'ERM Initial Meeting'
    and mem.roll_no = '25L215' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-10' and m.description = 'Club POC Meeting'
    and mem.roll_no = '25L215' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Lunch Meeting'
    and mem.roll_no = '25L215' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Evening Meet'
    and mem.roll_no = '25L215' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-08-25' and m.description = 'ERM Initial Meeting'
    and mem.roll_no = '25D221' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-10' and m.description = 'Club POC Meeting'
    and mem.roll_no = '25D221' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Lunch Meeting'
    and mem.roll_no = '25D221' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Evening Meet'
    and mem.roll_no = '25D221' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-08-25' and m.description = 'ERM Initial Meeting'
    and mem.roll_no = '25Y115' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-10' and m.description = 'Club POC Meeting'
    and mem.roll_no = '25Y115' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Lunch Meeting'
    and mem.roll_no = '25Y115' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Evening Meet'
    and mem.roll_no = '25Y115' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-08-25' and m.description = 'ERM Initial Meeting'
    and mem.roll_no = '25E137' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-10' and m.description = 'Club POC Meeting'
    and mem.roll_no = '25E137' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Lunch Meeting'
    and mem.roll_no = '25E137' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Evening Meet'
    and mem.roll_no = '25E137' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-08-25' and m.description = 'ERM Initial Meeting'
    and mem.roll_no = '25E231' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-10' and m.description = 'Club POC Meeting'
    and mem.roll_no = '25E231' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Lunch Meeting'
    and mem.roll_no = '25E231' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Evening Meet'
    and mem.roll_no = '25E231' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-08-25' and m.description = 'ERM Initial Meeting'
    and mem.roll_no = '25P213' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-10' and m.description = 'Club POC Meeting'
    and mem.roll_no = '25P213' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Lunch Meeting'
    and mem.roll_no = '25P213' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Evening Meet'
    and mem.roll_no = '25P213' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-08-25' and m.description = 'ERM Initial Meeting'
    and mem.roll_no = '25X029' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-10' and m.description = 'Club POC Meeting'
    and mem.roll_no = '25X029' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'informed'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Lunch Meeting'
    and mem.roll_no = '25X029' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'absent'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Evening Meet'
    and mem.roll_no = '25X029' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-08-25' and m.description = 'ERM Initial Meeting'
    and mem.roll_no = '25PD14' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-10' and m.description = 'Club POC Meeting'
    and mem.roll_no = '25PD14' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'informed'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Lunch Meeting'
    and mem.roll_no = '25PD14' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'absent'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Evening Meet'
    and mem.roll_no = '25PD14' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-08-25' and m.description = 'ERM Initial Meeting'
    and mem.roll_no = '25T116' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-10' and m.description = 'Club POC Meeting'
    and mem.roll_no = '25T116' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Lunch Meeting'
    and mem.roll_no = '25T116' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'informed'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Evening Meet'
    and mem.roll_no = '25T116' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-08-25' and m.description = 'ERM Initial Meeting'
    and mem.roll_no = '25L249' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-10' and m.description = 'Club POC Meeting'
    and mem.roll_no = '25L249' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Lunch Meeting'
    and mem.roll_no = '25L249' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Evening Meet'
    and mem.roll_no = '25L249' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-08-25' and m.description = 'ERM Initial Meeting'
    and mem.roll_no = '25L149' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'informed'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-10' and m.description = 'Club POC Meeting'
    and mem.roll_no = '25L149' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Lunch Meeting'
    and mem.roll_no = '25L149' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Evening Meet'
    and mem.roll_no = '25L149' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'absent'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-08-25' and m.description = 'ERM Initial Meeting'
    and mem.roll_no = '25S044' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'informed'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-10' and m.description = 'Club POC Meeting'
    and mem.roll_no = '25S044' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'informed'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Lunch Meeting'
    and mem.roll_no = '25S044' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'absent'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Evening Meet'
    and mem.roll_no = '25S044' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-08-25' and m.description = 'ERM Initial Meeting'
    and mem.roll_no = '25Y223' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-10' and m.description = 'Club POC Meeting'
    and mem.roll_no = '25Y223' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Lunch Meeting'
    and mem.roll_no = '25Y223' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Evening Meet'
    and mem.roll_no = '25Y223' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-08-25' and m.description = 'ERM Initial Meeting'
    and mem.roll_no = '25PD30' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-10' and m.description = 'Club POC Meeting'
    and mem.roll_no = '25PD30' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'informed'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Lunch Meeting'
    and mem.roll_no = '25PD30' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'absent'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Evening Meet'
    and mem.roll_no = '25PD30' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-08-25' and m.description = 'ERM Initial Meeting'
    and mem.roll_no = '25Z273' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'absent'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-10' and m.description = 'Club POC Meeting'
    and mem.roll_no = '25Z273' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Lunch Meeting'
    and mem.roll_no = '25Z273' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'informed'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Evening Meet'
    and mem.roll_no = '25Z273' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-08-25' and m.description = 'ERM Initial Meeting'
    and mem.roll_no = '25Z380' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'absent'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-10' and m.description = 'Club POC Meeting'
    and mem.roll_no = '25Z380' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'present'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Lunch Meeting'
    and mem.roll_no = '25Z380' and mem.group_type = 'core_member'
union all
select m.id, mem.id, 'informed'::attendance_status, 'ddc1ef6a-fdf9-4737-a8b0-2e8c3b98424d'::uuid
  from meetings m, members mem
  where m.date = '2026-09-25' and m.description = 'ERM Portal Evening Meet'
    and mem.roll_no = '25Z380' and mem.group_type = 'core_member'
on conflict (meeting_id, member_id) do nothing;

