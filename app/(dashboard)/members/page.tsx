import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/current-profile";
import { resolveEffectiveVerticalId } from "@/lib/effective-vertical";
import { MembersManager } from "./members-client";
import { VerticalBadge } from "@/components/VerticalBadge";

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ v?: string }>;
}) {
  const { v } = await searchParams;
  const supabase = await createClient();
  const profile = await getCurrentProfile(supabase);
  const { data: verticals } = await supabase
    .from("verticals")
    .select("id, name, created_at")
    .order("name");

  if (!profile || !verticals) return null;
  const verticalId = resolveEffectiveVerticalId(profile, verticals, v);
  const verticalName = verticals.find((ver) => ver.id === verticalId)?.name ?? "";

  const { data: members } = await supabase
    .from("members")
    .select("*")
    .eq("vertical_id", verticalId)
    .order("full_name");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <VerticalBadge name={verticalName} />
        <p className="eyebrow mt-4 text-brand-600 dark:text-brand-400">Roster</p>
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-body sm:text-3xl">
          Members
        </h1>
      </div>
      <MembersManager initialMembers={members ?? []} verticalId={verticalId} />
    </div>
  );
}
