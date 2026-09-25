"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function NewMeetingForm() {
  const router = useRouter();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("meetings")
      .insert({ date, description, created_by: user?.id })
      .select("id")
      .single();

    if (error || !data) {
      setError(error?.message ?? "Could not create meeting.");
      setLoading(false);
      return;
    }

    router.push(`/meetings/${data.id}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-xl border border-ink-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end dark:border-ink-800 dark:bg-ink-900"
    >
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-ink-700 dark:text-ink-300">
          Date
        </label>
        <input
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-ink-700 dark:bg-ink-800"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <label className="text-sm font-medium text-ink-700 dark:text-ink-300">
          Meeting description
        </label>
        <input
          type="text"
          required
          placeholder="e.g. Weekly sync"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-ink-700 dark:bg-ink-800"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
      >
        {loading ? "Creating..." : "New meeting"}
      </button>
    </form>
  );
}
