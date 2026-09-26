"use client";

type Option<T extends string> = { value: T; label: React.ReactNode };

// Equal-width segments with a thumb that slides between them. A null value hides the thumb.
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  size = "md",
  thumbClassName,
  activeTextClassName,
  className = "",
}: {
  options: Option<T>[];
  value: T | null;
  onChange: (value: T) => void;
  ariaLabel: string;
  size?: "sm" | "md";
  thumbClassName?: (value: T) => string;
  activeTextClassName?: (value: T) => string;
  className?: string;
}) {
  const n = options.length;
  const index = value === null ? -1 : options.findIndex((o) => o.value === value);

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`relative grid rounded-xl bg-surface-muted p-0.5 ${className}`}
      style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
    >
      {index >= 0 && (
        <span
          aria-hidden
          className={`segment-thumb absolute inset-y-0.5 left-0.5 rounded-[10px] ${
            thumbClassName?.(value as T) ??
            "bg-surface shadow-[0_1px_3px_rgba(0,0,0,0.1),0_0_0_0.5px_rgba(0,0,0,0.04)] dark:bg-ink-700"
          }`}
          style={{ width: `calc((100% - 4px) / ${n})`, translate: `${index * 100}% 0` }}
        />
      )}
      {options.map((o, i) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={i === index}
          onClick={() => onChange(o.value)}
          className={`relative z-[1] flex min-w-0 items-center justify-center gap-1.5 rounded-[10px] px-3 font-medium whitespace-nowrap transition-[color,scale] duration-200 active:scale-[0.96] ${
            size === "sm" ? "py-1 text-xs" : "py-1.5 text-sm"
          } ${
            i === index
              ? activeTextClassName?.(o.value) ?? "text-body"
              : "text-muted hover:text-body"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
