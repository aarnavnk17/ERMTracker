import { createClient } from "@/lib/supabase/server";
import { MembersManager } from "./members-client";

export default async function MembersPage() {
  const supabase = await createClient();
  const { data: members } = await supabase
    .from("members")
    .select("*")
    .order("full_name");

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-lg font-semibold tracking-tight text-ink-900 dark:text-ink-100">
        Members
      </h1>
      <MembersManager initialMembers={members ?? []} />
    </div>
  );
}
