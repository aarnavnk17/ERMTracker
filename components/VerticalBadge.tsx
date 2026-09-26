export function VerticalBadge({ name }: { name: string }) {
  return (
    <span className="badge bg-brand-50 text-brand-800 ring-brand-300 dark:bg-brand-900/40 dark:text-brand-300 dark:ring-brand-700">
      {name}
    </span>
  );
}
