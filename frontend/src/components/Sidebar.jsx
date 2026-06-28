import { Link } from "react-router-dom";

const item =
  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700";

export function Sidebar({ onLogout }) {
  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-slate-200 bg-white p-4 lg:flex dark:border-slate-700 dark:bg-slate-800">
      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Menu</p>
      <nav className="flex flex-col gap-1">
        <Link to="/dashboard" className={item}>
          Dashboard
        </Link>
        <Link to="/my-bookings" className={item}>
          My Bookings
        </Link>
        <Link to="/profile" className={item}>
          Profile
        </Link>
        <Link to="/support" className={item}>
          Support
        </Link>
        <button type="button" className={`${item} w-full text-left text-rose-600 dark:text-rose-400`} onClick={onLogout}>
          Logout
        </button>
      </nav>
      <div className="mt-8 rounded-xl bg-gradient-to-br from-sky-50 to-indigo-50 p-4 text-xs text-slate-600 dark:from-slate-700/50 dark:to-indigo-900/30 dark:text-slate-400">
        <p className="font-semibold text-slate-800 dark:text-slate-200">Need help?</p>
        <p className="mt-1">Visit our <Link to="/faq" className="font-semibold text-sky-700 hover:underline dark:text-sky-400">FAQ</Link> or <Link to="/support" className="font-semibold text-sky-700 hover:underline dark:text-sky-400">Support</Link> page.</p>
      </div>
    </aside>
  );
}

/** Mobile bottom / drawer style quick links */
export function MobileNav({ onLogout }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur lg:hidden dark:border-slate-700 dark:bg-slate-800/95">
      <Link to="/dashboard" className="flex-1 text-center text-xs font-medium text-slate-700 dark:text-slate-300">
        Home
      </Link>
      <Link to="/my-bookings" className="flex-1 text-center text-xs font-medium text-slate-700 dark:text-slate-300">
        Bookings
      </Link>
      <Link to="/profile" className="flex-1 text-center text-xs font-medium text-slate-700 dark:text-slate-300">
        Profile
      </Link>
      <button type="button" onClick={onLogout} className="flex-1 text-center text-xs font-medium text-rose-600 dark:text-rose-400">
        Logout
      </button>
    </div>
  );
}
