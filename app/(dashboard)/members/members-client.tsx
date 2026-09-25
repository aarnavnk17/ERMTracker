"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Member, MemberGroup } from "@/lib/types";

const GROUP_LABELS: Record<MemberGroup, string> = {
  coordinator: "Team Coordinators",
  core_member: "Core Team Members",
};

export function MembersManager({ initialMembers }: { initialMembers: Member[] }) {
  const [activeTab, setActiveTab] = useState<MemberGroup>("coordinator");
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [fullName, setFullName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showInactive, setShowInactive] = useState(false);

  const groupMembers = useMemo(
    () =>
      members
        .filter((m) => m.group_type === activeTab)
        .filter((m) => showInactive || m.is_active)
        .sort((a, b) => a.full_name.localeCompare(b.full_name)),
    [members, activeTab, showInactive]
  );

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase
      .from("members")
      .insert({
        full_name: fullName,
        roll_no: rollNo,
        group_type: activeTab,
      })
      .select()
      .single();

    setLoading(false);
    if (error || !data) {
      setError(error?.message ?? "Could not add member.");
      return;
    }

    setMembers((prev) => [...prev, data as Member]);
    setFullName("");
    setRollNo("");
  }

  async function toggleActive(member: Member) {
    const supabase = createClient();
    const { error } = await supabase
      .from("members")
      .update({ is_active: !member.is_active })
      .eq("id", member.id);

    if (!error) {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === member.id ? { ...m, is_active: !m.is_active } : m
        )
      );
    }
  }

  async function renameMember(member: Member, newName: string) {
    if (!newName.trim() || newName === member.full_name) return;
    const supabase = createClient();
    const { error } = await supabase
      .from("members")
      .update({ full_name: newName })
      .eq("id", member.id);

    if (!error) {
      setMembers((prev) =>
        prev.map((m) => (m.id === member.id ? { ...m, full_name: newName } : m))
      );
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-1 rounded-lg bg-ink-100 p-1 dark:bg-ink-800">
        {(["coordinator", "core_member"] as MemberGroup[]).map((g) => (
          <button
            key={g}
            onClick={() => setActiveTab(g)}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === g
                ? "bg-white text-ink-900 shadow-sm dark:bg-ink-700 dark:text-ink-100"
                : "text-ink-600 hover:text-ink-900 dark:text-ink-400"
            }`}
          >
            {GROUP_LABELS[g]}
          </button>
        ))}
      </div>

      <form
        onSubmit={handleAdd}
        className="flex flex-col gap-3 rounded-xl border border-ink-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end dark:border-ink-800 dark:bg-ink-900"
      >
        <div className="flex flex-1 flex-col gap-1">
          <label className="text-sm font-medium text-ink-700 dark:text-ink-300">
            Name
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-ink-700 dark:bg-ink-800"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-ink-700 dark:text-ink-300">
            Roll no
          </label>
          <input
            type="text"
            required
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            className="rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-ink-700 dark:bg-ink-800"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {loading ? "Adding..." : `Add to ${GROUP_LABELS[activeTab]}`}
        </button>
      </form>

      <label className="flex items-center gap-2 text-sm text-ink-600 dark:text-ink-400">
        <input
          type="checkbox"
          checked={showInactive}
          onChange={(e) => setShowInactive(e.target.checked)}
        />
        Show deactivated members
      </label>

      <div className="overflow-hidden rounded-xl border border-ink-200 bg-white shadow-sm dark:border-ink-800 dark:bg-ink-900">
        {groupMembers.length === 0 ? (
          <p className="px-4 py-6 text-sm text-ink-500">
            No members in this group yet.
          </p>
        ) : (
          <ul className="divide-y divide-ink-100 dark:divide-ink-800">
            {groupMembers.map((m) => (
              <li
                key={m.id}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <div className="flex-1">
                  <input
                    defaultValue={m.full_name}
                    onBlur={(e) => renameMember(m, e.target.value)}
                    className={`w-full rounded border border-transparent bg-transparent text-sm font-medium hover:border-ink-200 focus:border-brand-400 focus:outline-none dark:hover:border-ink-700 ${
                      m.is_active
                        ? "text-ink-900 dark:text-ink-100"
                        : "text-ink-400 line-through"
                    }`}
                  />
                  <p className="text-xs text-ink-500">{m.roll_no}</p>
                </div>
                <button
                  onClick={() => toggleActive(m)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                    m.is_active
                      ? "bg-red-50 text-red-700 hover:bg-red-100"
                      : "bg-green-50 text-green-700 hover:bg-green-100"
                  }`}
                >
                  {m.is_active ? "Deactivate" : "Reactivate"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
