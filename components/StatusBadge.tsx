export function StatusBadge({ full }: { full: boolean }) {
  if (full) {
    return (
      <span className="badge bg-amber-50 text-amber-800 ring-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:ring-amber-800">
        Fully marked
      </span>
    );
  }
  return (
    <span className="badge bg-brand-50 text-brand-800 ring-brand-300 dark:bg-brand-900/40 dark:text-brand-300 dark:ring-brand-700">
      <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
      In progress
    </span>
  );
}
