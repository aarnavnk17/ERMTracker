"use client";

import { useState } from "react";
import type { AttendanceStatus, MemberGroup } from "@/lib/types";

type Counts = Record<AttendanceStatus, number>;

export type MeetingStat = {
  id: string;
  date: string;
  description: string;
  coordinator: Counts;
  core_member: Counts;
};

// Same status colours the attendance controls and progress bars use.
const SERIES: { key: AttendanceStatus; label: string; fill: string }[] = [
  { key: "present", label: "Present", fill: "bg-emerald-500" },
  { key: "absent", label: "Absent", fill: "bg-red-500" },
  { key: "informed", label: "Informed", fill: "bg-brand-400" },
];

const MAX_MEETINGS = 12;
const PLOT_H = 180;

function shortDate(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
}

function longDate(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Round an axis maximum up to a clean value and return evenly spaced ticks.
function niceTicks(max: number) {
  if (max <= 0) return [0, 1];
  const rough = max / 4;
  const pow = 10 ** Math.floor(Math.log10(rough));
  const step = [1, 2, 5, 10].map((m) => m * pow).find((s) => s >= rough) ?? rough;
  const top = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let t = 0; t <= top + 1e-9; t += step) ticks.push(Math.round(t));
  return ticks;
}

const pct = (n: number) => `${Math.round(n * 100)}%`;

function ChartCard({
  title,
  subtitle,
  legend,
  children,
}: {
  title: string;
  subtitle?: string;
  legend?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="card h-full p-5">
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
        <div>
          <h3 className="text-[15px] font-semibold tracking-tight text-body">{title}</h3>
          {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
        </div>
        {legend && (
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
            {SERIES.map((s) => (
              <li key={s.key} className="flex items-center gap-1.5">
                <span className={`size-2.5 rounded-[3px] ${s.fill}`} />
                {s.label}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function YAxis({ ticks }: { ticks: number[] }) {
  const top = ticks[ticks.length - 1];
  return (
    <>
      {ticks.map((t) => (
        <div
          key={t}
          aria-hidden
          className="absolute inset-x-0 flex items-center"
          style={{ bottom: `${(t / top) * 100}%`, transform: "translateY(50%)" }}
        >
          <span className="w-7 shrink-0 pr-2 text-right text-[11px] tabular-nums text-muted">
            {t}
          </span>
          <span className={`h-px flex-1 ${t === 0 ? "bg-ink-300 dark:bg-ink-600" : "bg-line"}`} />
        </div>
      ))}
    </>
  );
}

function Tooltip({
  align,
  children,
}: {
  align: "start" | "center" | "end";
  children: React.ReactNode;
}) {
  const pos =
    align === "start" ? "left-0" : align === "end" ? "right-0" : "left-1/2 -translate-x-1/2";
  return (
    <div
      role="tooltip"
      className={`glass-panel pointer-events-none absolute bottom-full z-20 mb-2 w-max min-w-44 max-w-60 rounded-xl px-3 py-2.5 text-xs ${pos}`}
    >
      {children}
    </div>
  );
}

function TooltipRow({ value, label, fill }: { value: string; label: string; fill?: string }) {
  return (
    <div className="flex items-center gap-2 py-0.5">
      {fill ? <span className={`h-0.5 w-3 rounded-full ${fill}`} /> : <span className="w-3" />}
      <span className="font-semibold tabular-nums text-body">{value}</span>
      <span className="text-muted">{label}</span>
    </div>
  );
}

export function ReportStats({
  meetings,
  group,
  groupSize,
  rates,
}: {
  meetings: MeetingStat[];
  group: MemberGroup;
  groupSize: number;
  rates: number[];
}) {
  let present = 0;
  let marks = 0;
  let heldForGroup = 0;
  for (const m of meetings) {
    const c = m[group];
    const n = c.present + c.absent + c.informed;
    present += c.present;
    marks += n;
    if (n > 0) heldForGroup++;
  }
  const low = rates.filter((r) => r < 0.5).length;

  const tiles = [
    {
      label: "Attendance rate",
      value: marks > 0 ? pct(present / marks) : "—",
      note: marks > 0 ? `${present} of ${marks} marks were present` : "No marks yet",
    },
    {
      label: "Meetings held",
      value: String(meetings.length),
      note: `${heldForGroup} with this group marked`,
    },
    {
      label: "Avg. present",
      value: heldForGroup > 0 ? (present / heldForGroup).toFixed(1).replace(/\.0$/, "") : "—",
      note: `per meeting, of ${groupSize} members`,
    },
    {
      label: "Below 50%",
      value: String(low),
      note: low === 1 ? "member needs a follow-up" : "members need a follow-up",
    },
  ];

  return (
    <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {tiles.map((t) => (
        <div key={t.label} className="card px-4 py-3.5 sm:px-5 sm:py-4">
          <dt className="text-xs font-medium text-muted sm:text-sm">{t.label}</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-body">{t.value}</dd>
          <dd className="mt-0.5 text-xs text-muted">{t.note}</dd>
        </div>
      ))}
    </dl>
  );
}

export function MeetingTrendChart({
  meetings,
  group,
  groupSize,
}: {
  meetings: MeetingStat[];
  group: MemberGroup;
  groupSize: number;
}) {
  const [active, setActive] = useState<string | null>(null);
  const [showTable, setShowTable] = useState(false);
  const shown = meetings.slice(-MAX_MEETINGS);

  const subtitle =
    meetings.length > MAX_MEETINGS
      ? `Last ${MAX_MEETINGS} of ${meetings.length} meetings, oldest to newest`
      : "Oldest to newest";

  if (shown.length === 0) {
    return (
      <ChartCard title="Attendance by meeting">
        <p className="py-10 text-center text-sm text-muted">
          No meetings yet. Charts appear once attendance is marked.
        </p>
      </ChartCard>
    );
  }

  const peak = Math.max(
    groupSize,
    ...shown.map((m) => m[group].present + m[group].absent + m[group].informed)
  );
  const ticks = niceTicks(peak);
  const top = ticks[ticks.length - 1];
  const labelEvery = Math.ceil(shown.length / 8);
  const last = shown[shown.length - 1];
  const lastCounts = last[group];
  const lastMarked = lastCounts.present + lastCounts.absent + lastCounts.informed;

  return (
    <ChartCard title="Attendance by meeting" subtitle={subtitle} legend>
      <div className="relative" style={{ height: PLOT_H }}>
        <YAxis ticks={ticks} />
        <div className="absolute inset-y-0 left-7 right-0 flex">
          {shown.map((m, i) => {
            const c = m[group];
            const marked = c.present + c.absent + c.informed;
            const unmarked = Math.max(0, groupSize - marked);
            const isActive = active === m.id;
            const isLast = i === shown.length - 1;
            const align = i < 2 ? "start" : i > shown.length - 3 ? "end" : "center";
            return (
              <div
                key={m.id}
                tabIndex={0}
                aria-label={`${m.description}, ${longDate(m.date)}: ${c.present} present, ${c.absent} absent, ${c.informed} informed, ${unmarked} not marked`}
                onPointerEnter={() => setActive(m.id)}
                onPointerLeave={() => setActive((a) => (a === m.id ? null : a))}
                onFocus={() => setActive(m.id)}
                onBlur={() => setActive((a) => (a === m.id ? null : a))}
                className="relative flex h-full flex-1 cursor-default items-end justify-center rounded-md outline-offset-0 transition-colors hover:bg-surface-muted/60 focus-visible:bg-surface-muted/60"
              >
                <div
                  className={`bar-grow relative flex w-full max-w-6 flex-col-reverse gap-[2px] overflow-hidden rounded-t-[4px] transition-[height,filter,opacity] duration-500 ease-(--ease-out-soft) ${
                    active && !isActive ? "saturate-50 opacity-60" : ""
                  }`}
                  style={{ height: `${(marked / top) * 100}%` }}
                >
                  {SERIES.map((s) =>
                    c[s.key] > 0 ? (
                      <div key={s.key} className={s.fill} style={{ flexGrow: c[s.key] }} />
                    ) : null
                  )}
                </div>
                {isLast && lastMarked > 0 && !isActive && (
                  <span
                    className="pointer-events-none absolute text-[11px] font-semibold tabular-nums text-body"
                    style={{ bottom: `calc(${(marked / top) * 100}% + 4px)` }}
                  >
                    {pct(c.present / lastMarked)}
                  </span>
                )}
                {isActive && (
                  <Tooltip align={align}>
                    <p className="font-semibold text-body">{m.description}</p>
                    <p className="mb-1.5 text-muted">{longDate(m.date)}</p>
                    {SERIES.map((s) => (
                      <TooltipRow key={s.key} value={String(c[s.key])} label={s.label} fill={s.fill} />
                    ))}
                    {unmarked > 0 && <TooltipRow value={String(unmarked)} label="Not marked" />}
                    {marked > 0 && (
                      <p className="mt-1.5 border-t border-line pt-1.5 text-muted">
                        <span className="font-semibold text-body">{pct(c.present / marked)}</span>{" "}
                        attendance
                      </p>
                    )}
                  </Tooltip>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="ml-7 mt-2 flex">
        {shown.map((m, i) => (
          <span
            key={m.id}
            className="flex-1 truncate text-center text-[11px] tabular-nums text-muted"
          >
            {i % labelEvery === 0 || i === shown.length - 1 ? shortDate(m.date) : ""}
          </span>
        ))}
      </div>

      <button
        onClick={() => setShowTable((v) => !v)}
        aria-expanded={showTable}
        className="mt-4 text-xs font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400"
      >
        {showTable ? "Hide data" : "View as table"}
      </button>
      {showTable && (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-line text-left text-muted">
                <th className="py-1.5 pr-3 font-medium">Meeting</th>
                <th className="py-1.5 pr-3 font-medium">Date</th>
                {SERIES.map((s) => (
                  <th key={s.key} className="py-1.5 pr-3 text-right font-medium">
                    {s.label}
                  </th>
                ))}
                <th className="py-1.5 text-right font-medium">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {[...shown].reverse().map((m) => {
                const c = m[group];
                const marked = c.present + c.absent + c.informed;
                return (
                  <tr key={m.id} className="border-b border-line last:border-0">
                    <td className="py-1.5 pr-3 text-body">{m.description}</td>
                    <td className="whitespace-nowrap py-1.5 pr-3 tabular-nums text-muted">
                      {shortDate(m.date)}
                    </td>
                    {SERIES.map((s) => (
                      <td key={s.key} className="py-1.5 pr-3 text-right tabular-nums text-body">
                        {c[s.key]}
                      </td>
                    ))}
                    <td className="py-1.5 text-right tabular-nums text-body">
                      {marked > 0 ? pct(c.present / marked) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </ChartCard>
  );
}

const BINS = [
  { label: "Under 25%", test: (r: number) => r < 0.25 },
  { label: "25–49%", test: (r: number) => r >= 0.25 && r < 0.5 },
  { label: "50–74%", test: (r: number) => r >= 0.5 && r < 0.75 },
  { label: "75% +", test: (r: number) => r >= 0.75 },
];

export function RateDistributionChart({
  rates,
  unrated,
}: {
  rates: number[];
  unrated: number;
}) {
  const [active, setActive] = useState<number | null>(null);
  const counts = BINS.map((b) => rates.filter(b.test).length);
  const ticks = niceTicks(Math.max(1, ...counts));
  const top = ticks[ticks.length - 1];

  return (
    <ChartCard
      title="How members attend"
      subtitle={
        unrated > 0
          ? `Members by attendance rate · ${unrated} not marked yet`
          : "Members by attendance rate"
      }
    >
      {rates.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted">No attendance marked yet.</p>
      ) : (
        <>
          <div className="relative" style={{ height: PLOT_H }}>
            <YAxis ticks={ticks} />
            <div className="absolute inset-y-0 left-7 right-0 flex">
              {BINS.map((b, i) => (
                <div
                  key={b.label}
                  tabIndex={0}
                  aria-label={`${counts[i]} members at ${b.label} attendance`}
                  onPointerEnter={() => setActive(i)}
                  onPointerLeave={() => setActive((a) => (a === i ? null : a))}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive((a) => (a === i ? null : a))}
                  className="relative flex h-full flex-1 items-end justify-center rounded-md transition-colors hover:bg-surface-muted/60 focus-visible:bg-surface-muted/60"
                >
                  <div
                    className={`bar-grow w-full max-w-6 rounded-t-[4px] bg-brand-500 transition-[height,opacity] duration-500 ease-(--ease-out-soft) ${
                      active !== null && active !== i ? "opacity-50" : ""
                    }`}
                    style={{ height: `${(counts[i] / top) * 100}%` }}
                  />
                  <span
                    className="pointer-events-none absolute text-[11px] font-semibold tabular-nums text-body transition-[bottom] duration-500 ease-(--ease-out-soft)"
                    style={{ bottom: `calc(${(counts[i] / top) * 100}% + 4px)` }}
                  >
                    {counts[i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="ml-7 mt-2 flex">
            {BINS.map((b) => (
              <span key={b.label} className="flex-1 text-center text-[11px] text-muted">
                {b.label}
              </span>
            ))}
          </div>
        </>
      )}
    </ChartCard>
  );
}
