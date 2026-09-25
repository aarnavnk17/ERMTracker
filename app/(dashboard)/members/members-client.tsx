"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Member, MemberGroup } from "@/lib/types";
import { Toggle } from "@/components/Toggle";

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
    <div className="flex flex-col gap-6">
      <div className="flex gap-1 rounded-md border border-line bg-surface p-1">
        {(["coordinator", "core_member"] as MemberGroup[]).map((g) => (
          <button
            key={g}
            onClick={() => setActiveTab(g)}
            className={`eyebrow flex-1 rounded-md px-3 py-2 transition-colors ${
              activeTab === g
                ? "bg-brand-600 text-ink-950"
                : "text-muted hover:bg-surface-muted"
            }`}
          >
            {GROUP_LABELS[g]}
          </button>
        ))}
      </div>

      <form onSubmit={handleAdd} className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-end">
        <div className="flex flex-1 flex-col gap-1">
          <label className="label">Name</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="input"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="label">Roll no</label>
          <input
            type="text"
            required
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            className="input"
          />
        </div>
        {error && <p className="field-error">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Adding..." : `Add to ${GROUP_LABELS[activeTab]}`}
        </button>
      </form>

      <label className="flex items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          checked={showInactive}
          onChange={(e) => setShowInactive(e.target.checked)}
        />
        Show deactivated members
      </label>

      <div className="card overflow-x-auto">
        {groupMembers.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted">
            No members in this group yet.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                <th className="py-2 pr-4 pl-5 font-medium">Name</th>
                <th className="py-2 pr-4 font-medium">Roll No</th>
                <th className="py-2 pr-5 font-medium">Active</th>
              </tr>
            </thead>
            <tbody>
              {groupMembers.map((m) => (
                <tr key={m.id} className="border-b border-line last:border-0">
                  <td className="py-3 pr-4 pl-5">
                    <input
                      defaultValue={m.full_name}
                      onBlur={(e) => renameMember(m, e.target.value)}
                      className={`w-full rounded border border-transparent bg-transparent font-medium hover:border-line focus:border-brand-400 focus:outline-none ${
                        m.is_active ? "text-body" : "text-muted line-through"
                      }`}
                    />
                  </td>
                  <td className="py-3 pr-4 font-mono text-xs text-muted">{m.roll_no}</td>
                  <td className="py-3 pr-5">
                    <Toggle
                      checked={m.is_active}
                      onChange={() => toggleActive(m)}
                      label={m.is_active ? "Deactivate member" : "Reactivate member"}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
