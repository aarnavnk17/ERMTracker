export function PageGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 hidden dark:block"
    >
      <div
        className="absolute inset-y-0 left-0 w-1/3"
        style={{
          background:
            "linear-gradient(to right, rgba(178,30,20,0.16), transparent)",
        }}
      />
      <div
        className="absolute inset-y-0 right-0 w-1/3"
        style={{
          background:
            "linear-gradient(to left, rgba(178,30,20,0.16), transparent)",
        }}
      />
    </div>
  );
}
