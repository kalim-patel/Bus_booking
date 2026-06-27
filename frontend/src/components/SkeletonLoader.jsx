export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-3">
          <div className="h-6 w-3/4 rounded-lg bg-slate-200" />
          <div className="h-4 w-1/2 rounded-lg bg-slate-200" />
        </div>
        <div className="h-6 w-16 rounded-full bg-slate-200" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-4 w-1/3 rounded-lg bg-slate-200" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <div className="h-3 w-1/2 rounded bg-slate-200" />
            <div className="h-5 w-3/4 rounded bg-slate-200" />
          </div>
        ))}
      </div>
      <div className="mt-5 h-10 w-full rounded-xl bg-slate-200" />
    </div>
  );
}

export function SkeletonList({ count = 3 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 animate-pulse">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="h-6 w-1/2 rounded-lg bg-slate-200" />
              <div className="h-4 w-1/3 rounded-lg bg-slate-200" />
            </div>
            <div className="h-8 w-24 rounded-xl bg-slate-200" />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, j) => (
              <div key={j} className="space-y-1">
                <div className="h-3 w-1/3 rounded bg-slate-200" />
                <div className="h-5 w-2/3 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonInput() {
  return (
    <div className="space-y-2">
      <div className="h-4 w-1/4 rounded bg-slate-200" />
      <div className="h-10 w-full rounded-xl bg-slate-200" />
    </div>
  );
}
