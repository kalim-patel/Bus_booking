export function Loader({ label = "Loading…" }) {
  return (
    <div className="flex flex-col items-center gap-3 py-8">
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-sky-200 border-t-sky-600"
        role="status"
        aria-label={label}
      />
      <p className="text-sm font-medium text-slate-600">{label}</p>
    </div>
  );
}
