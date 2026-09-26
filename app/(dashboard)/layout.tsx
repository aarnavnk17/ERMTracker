import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/current-profile";
import { Masthead } from "@/components/Masthead";
import { MastheadSubtitle } from "@/components/MastheadSubtitle";
import { AccountMenu } from "@/components/AccountMenu";
import { StickyHeader } from "@/components/StickyHeader";
import { DashboardNav } from "@/components/DashboardNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const profile = await getCurrentProfile(supabase);
  const { data: verticals } = await supabase
    .from("verticals")
    .select("id, name, created_at")
    .order("name");

  const list = verticals ?? [];
  const verticalName =
    profile?.role === "vertical_head"
      ? list.find((v) => v.id === profile.vertical_id)?.name ?? null
      : null;

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Masthead
        subtitle={
          profile ? (
            <MastheadSubtitle
              role={profile.role}
              vertical_id={profile.vertical_id}
              verticals={list}
            />
          ) : undefined
        }
      />
      <StickyHeader>
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-3 gap-y-2 px-5 py-2.5">
          <span className="mr-2 hidden text-[15px] font-semibold tracking-tight text-body lg:inline">
            SU Tracker
          </span>
          {profile && (
            <DashboardNav
              role={profile.role}
              verticals={list}
              verticalName={verticalName}
              defaultVerticalId={list[0]?.id ?? ""}
            />
          )}
          {profile && (
            <div className="ml-auto sm:ml-0">
              <AccountMenu displayName={profile.display_name} role={profile.role} />
            </div>
          )}
        </div>
      </StickyHeader>
      <main id="main-content" className="mx-auto w-full max-w-5xl flex-1 px-5 py-10 sm:py-14">
        {children}
      </main>
      <footer className="border-t border-line py-8 text-center text-xs text-muted">
        SU Tracker
      </footer>
    </div>
  );
}
