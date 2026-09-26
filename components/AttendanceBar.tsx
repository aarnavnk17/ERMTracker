export function AttendanceBar({
  present,
  absent,
  informed,
  total,
  showLabel = true,
}: {
  present: number;
  absent: number;
  informed: number;
  total: number;
  showLabel?: boolean;
}) {
  const marked = present + absent + informed;
  const left = Math.max(0, total - marked);
  const pct = (n: number) => (total > 0 ? Math.min(100, (n / total) * 100) : 0);

  return (
    <div className="flex flex-col gap-1.5">
      {showLabel && (
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium tabular-nums text-body">
            {marked} of {total} marked
          </span>
          {left > 0 && (
            <span className="text-xs font-medium tabular-nums text-muted">{left} left</span>
          )}
        </div>
      )}
      <div
        role="img"
        aria-label={`${present} present, ${absent} absent, ${informed} informed, ${left} not marked`}
        className="flex h-1.5 overflow-hidden rounded-full bg-surface-muted"
      >
        <div className="bar-segment bg-emerald-500" style={{ width: `${pct(present)}%` }} />
        <div className="bar-segment bg-red-500" style={{ width: `${pct(absent)}%` }} />
        <div className="bar-segment bg-brand-400" style={{ width: `${pct(informed)}%` }} />
      </div>
    </div>
  );
}
