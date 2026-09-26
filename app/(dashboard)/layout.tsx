import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/current-profile";
import { SignOutButton } from "@/components/SignOutButton";
import { Masthead } from "@/components/Masthead";
import { MastheadSubtitle } from "@/components/MastheadSubtitle";
import { ThemeToggle } from "@/components/ThemeToggle";
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
      <header className="border-b border-ink-800 bg-ink-950">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
          {profile && (
            <DashboardNav
              role={profile.role}
              verticals={list}
              verticalName={verticalName}
              defaultVerticalId={list[0]?.id ?? ""}
            />
          )}
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-ink-400 sm:inline">
              {profile?.display_name}
            </span>
            <ThemeToggle />
            <SignOutButton dark />
          </div>
        </div>
      </header>
      <main id="main-content" className="mx-auto w-full max-w-5xl flex-1 px-5 py-10 sm:py-14">
        {children}
      </main>
      <footer className="border-t border-line py-6 text-center text-sm text-muted">
        SU Tracker
      </footer>
    </div>
  );
}
