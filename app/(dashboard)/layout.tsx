import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/SignOutButton";
import { Masthead } from "@/components/Masthead";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let displayName = user?.email ?? "";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .single();
    if (profile?.display_name) displayName = profile.display_name;
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Masthead />
      <header className="border-b border-ink-800 bg-ink-950">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-6">
            <span className="font-display text-sm font-semibold text-brand-300">
              Attendance Tracker
            </span>
            <nav className="flex items-center gap-1">
              <Link href="/meetings" className="eyebrow rounded-md px-3 py-1.5 text-brand-300/70 hover:text-brand-300">
                Meetings
              </Link>
              <Link href="/members" className="eyebrow rounded-md px-3 py-1.5 text-brand-300/70 hover:text-brand-300">
                Members
              </Link>
              <Link href="/reports" className="eyebrow rounded-md px-3 py-1.5 text-brand-300/70 hover:text-brand-300">
                Reports
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-ink-400 sm:inline">{displayName}</span>
            <ThemeToggle />
            <SignOutButton dark />
          </div>
        </div>
      </header>
      <main id="main-content" className="mx-auto w-full max-w-5xl flex-1 px-5 py-10 sm:py-14">
        {children}
      </main>
      <footer className="border-t border-line py-6 text-center text-sm text-muted">
        SU ERM Tracker
      </footer>
    </div>
  );
}
