export function SlotMeter({ marked, total }: { marked: number; total: number }) {
  const pct = total > 0 ? Math.min(100, (marked / total) * 100) : 0;
  const full = total > 0 && marked >= total;
  const fillColor = full ? "bg-ink-400" : pct >= 80 ? "bg-amber-500" : "bg-emerald-500";
  const left = Math.max(0, total - marked);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-body">
          {marked} of {total} marked
        </span>
        {!full && (
          <span className="eyebrow text-brand-600 dark:text-brand-400">{left} left</span>
        )}
      </div>
      <div className="h-2 rounded-full bg-surface-muted">
        <div
          className={`h-2 rounded-full transition-[width] duration-300 ${fillColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
