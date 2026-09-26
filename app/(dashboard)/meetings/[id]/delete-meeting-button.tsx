"use client";

import { useRef, useState } from "react";
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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function close() {
    if (!loading) dialogRef.current?.close();
  }

  async function handleDelete() {
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
    <>
      <button onClick={() => dialogRef.current?.showModal()} className="btn-danger">
        Delete meeting
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="delete-meeting-title"
        aria-describedby="delete-meeting-body"
        onCancel={(e) => {
          if (loading) e.preventDefault();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        className="sheet w-[calc(100%-2rem)] max-w-sm rounded-3xl bg-surface p-0 text-body shadow-[0_24px_64px_rgba(0,0,0,0.3)]"
      >
        <div className="flex flex-col items-center px-6 pb-5 pt-6 text-center">
          <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-red-500/10 text-red-600 dark:text-red-400">
            <svg viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h12M8 6V4.5A1 1 0 0 1 9 3.5h2a1 1 0 0 1 1 1V6M5.5 6l.7 9.6a1.5 1.5 0 0 0 1.5 1.4h4.6a1.5 1.5 0 0 0 1.5-1.4L14.5 6" />
            </svg>
          </div>
          <h2 id="delete-meeting-title" className="text-lg font-semibold tracking-tight">
            Delete this meeting?
          </h2>
          <p id="delete-meeting-body" className="mt-1.5 text-sm text-muted">
            &ldquo;{meetingDescription}&rdquo; and every attendance mark recorded for it will be
            permanently removed. This can&rsquo;t be undone.
          </p>
          {error && <p className="field-error">{error}</p>}
        </div>
        <div className="grid grid-cols-2 gap-2 px-4 pb-4">
          <button onClick={close} disabled={loading} autoFocus className="btn-secondary">
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="btn bg-red-600 text-white hover:bg-red-500"
          >
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </dialog>
    </>
  );
}
