"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton({ dark = false }: { dark?: boolean }) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className={
        dark
          ? "eyebrow rounded-md px-2.5 py-1.5 text-brand-300/70 hover:bg-ink-800 hover:text-brand-300"
          : "eyebrow rounded-md px-2.5 py-1.5 text-muted hover:bg-surface-muted"
      }
    >
      Sign out
    </button>
  );
}
