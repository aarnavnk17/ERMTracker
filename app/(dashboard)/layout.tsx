import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/SignOutButton";

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
    <div className="flex min-h-screen flex-col bg-ink-50 dark:bg-ink-950">
      <header className="border-b border-ink-200 bg-white dark:border-ink-800 dark:bg-ink-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-6">
            <span className="font-display text-sm font-semibold tracking-tight text-ink-900 dark:text-ink-100">
              Attendance Tracker
            </span>
            <nav className="flex items-center gap-1">
              <Link
                href="/meetings"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-ink-700 hover:bg-brand-50 hover:text-brand-800 dark:text-ink-300 dark:hover:bg-ink-800"
              >
                Meetings
              </Link>
              <Link
                href="/members"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-ink-700 hover:bg-brand-50 hover:text-brand-800 dark:text-ink-300 dark:hover:bg-ink-800"
              >
                Members
              </Link>
              <Link
                href="/reports"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-ink-700 hover:bg-brand-50 hover:text-brand-800 dark:text-ink-300 dark:hover:bg-ink-800"
              >
                Reports
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-ink-500">{displayName}</span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        {children}
      </main>
    </div>
  );
}
