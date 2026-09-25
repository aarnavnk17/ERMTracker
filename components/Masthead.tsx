function LogoChip() {
  return (
    <div className="rounded-md bg-white p-1.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-ink-950 sm:h-12 sm:w-12">
        <span className="font-wordmark text-xs font-semibold tracking-widest text-brand-300 sm:text-sm">
          SU
        </span>
      </div>
    </div>
  );
}

export function Masthead() {
  return (
    <div className="relative overflow-hidden border-b border-ink-800 bg-ink-950 py-6 sm:py-8">
      <div className="relative mx-auto grid max-w-5xl grid-cols-3 items-center px-5">
        <div className="flex justify-start">
          <LogoChip />
        </div>
        <div className="flex flex-col items-center text-center">
          <p className="font-wordmark text-2xl font-semibold uppercase tracking-[0.3em] text-brand-300 sm:text-4xl">
            SU ERM Tracker
          </p>
          <p className="font-script text-2xl text-brand-400 sm:text-3xl">
            Be the Change
          </p>
        </div>
        <div className="flex justify-end">
          <LogoChip />
        </div>
      </div>
    </div>
  );
}
