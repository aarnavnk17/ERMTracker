function LogoChip({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="flex h-14 items-center rounded-md bg-white px-2.5 py-1.5 sm:h-20">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="h-full w-auto object-contain" />
    </div>
  );
}

export function Masthead() {
  return (
    <div className="relative overflow-hidden border-b border-ink-800 bg-ink-950 py-6 sm:py-8">
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-40 w-56 opacity-90 sm:h-56 sm:w-72"
        style={{
          backgroundImage: "url(/su-smoke-tl.png)",
          backgroundSize: "900px 900px",
          backgroundPosition: "top left",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-40 w-56 opacity-90 sm:h-56 sm:w-72"
        style={{
          backgroundImage: "url(/su-smoke-br.png)",
          backgroundSize: "900px 900px",
          backgroundPosition: "bottom right",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="relative mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-6 gap-y-4 px-5 sm:justify-between">
        <div className="flex items-center gap-3">
          <LogoChip src="/psg-diamond.png" alt="PSG - In Nation Building since 1926" />
          <LogoChip src="/psg-centenary.png" alt="PSG Centenary" />
        </div>

        <div className="flex flex-col items-center text-center">
          <p className="font-wordmark text-2xl font-semibold uppercase tracking-[0.3em] text-brand-300 sm:text-4xl">
            Students Union
          </p>
          <p className="font-script text-2xl text-brand-400 sm:text-3xl">
            Be the Change
          </p>
          <p className="eyebrow mt-2 text-brand-300/70">ERM Attendance Tracker</p>
        </div>

        <div className="flex items-center gap-3">
          <LogoChip src="/psg-75th.png" alt="PSG College of Technology - 75 Years" />
          <LogoChip src="/su-logo.png" alt="Students Union crest" />
        </div>
      </div>
    </div>
  );
}
