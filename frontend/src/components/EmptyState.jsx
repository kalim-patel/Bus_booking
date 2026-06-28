import { Link } from "react-router-dom";

export function EmptyState({ icon, title, description, actionLabel, actionTo, onAction }) {
  return (
    <div
      className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center sm:p-12 dark:border-slate-600 dark:bg-slate-800"
      role="status"
    >
      {icon && (
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400">
          {icon}
        </div>
      )}
      <p className="font-display text-lg font-semibold text-slate-900 dark:text-white">{title}</p>
      {description && <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600 dark:text-slate-400">{description}</p>}
      {(actionLabel && actionTo) && (
        <Link
          to={actionTo}
          className="mt-6 inline-flex rounded-full bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:bg-sky-500"
        >
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionTo && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 inline-flex rounded-full bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:bg-sky-500"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function BookingsEmptyIcon() {
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
      />
    </svg>
  );
}
