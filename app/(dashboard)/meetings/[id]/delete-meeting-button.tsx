"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function DeleteMeetingButton({
  meetingId,
  meetingDescription,
}: {
  meetingId: string;
  meetingDescription: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${meetingDescription}"? This permanently removes the meeting and every attendance mark recorded for it. This cannot be undone.`
    );
    if (!confirmed) return;

    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.from("meetings").delete().eq("id", meetingId);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/meetings");
    router.refresh();
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button onClick={handleDelete} disabled={loading} className="btn-danger">
        {loading ? "Deleting..." : "Delete meeting"}
      </button>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
