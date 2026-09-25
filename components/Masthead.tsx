export function Masthead() {
  return (
    <div className="relative overflow-hidden border-b border-ink-800 bg-ink-950 py-6 sm:py-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 -top-24 h-72 w-72 rounded-full opacity-60 blur-2xl"
        style={{
          background:
            "radial-gradient(circle, rgba(178,30,20,0.55), rgba(178,30,20,0) 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full opacity-60 blur-2xl"
        style={{
          background:
            "radial-gradient(circle, rgba(178,30,20,0.55), rgba(178,30,20,0) 70%)",
        }}
      />
      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-5 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.jpeg"
          alt="Students Union — Be the Change"
          className="h-28 w-28 rounded-md object-cover sm:h-40 sm:w-40"
        />
        <p className="eyebrow mt-4 text-brand-300/70">ERM Attendance Tracker</p>
      </div>
    </div>
  );
}
