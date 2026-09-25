import { createClient } from "@/lib/supabase/server";
import { MembersManager } from "./members-client";

export default async function MembersPage() {
  const supabase = await createClient();
  const { data: members } = await supabase
    .from("members")
    .select("*")
    .order("full_name");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="eyebrow text-brand-600 dark:text-brand-400">Roster</p>
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-body sm:text-3xl">
          Members
        </h1>
      </div>
      <MembersManager initialMembers={members ?? []} />
    </div>
  );
}
