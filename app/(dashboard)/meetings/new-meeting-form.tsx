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
    <form onSubmit={handleSubmit} className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-end">
      <div className="flex flex-col gap-1">
        <label className="label">Date</label>
        <input
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <label className="label">Meeting description</label>
        <input
          type="text"
          required
          placeholder="e.g. Weekly sync"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input"
        />
      </div>
      {error && <p className="field-error">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? "Creating..." : "New meeting"}
      </button>
    </form>
  );
}
