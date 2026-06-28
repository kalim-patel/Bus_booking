import { Link, NavLink } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `text-sm font-medium transition hover:text-sky-700 focus:outline-none focus-visible:underline dark:hover:text-sky-400 ${
    isActive ? "text-sky-600 dark:text-sky-400" : "text-slate-600 dark:text-slate-300"
  }`;

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition hover:text-white focus:outline-none focus-visible:underline ${
    isActive ? "text-sky-400" : "text-slate-300 dark:text-slate-400"
  }`;

/** Landing / marketing top bar */
export function Navbar({ variant = "dark" }) {
  const isDark = variant === "dark";

  return (
    <header
      className={
        isDark
          ? "sticky top-0 z-40 border-b border-white/10 bg-slate-900/70 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/90"
          : "sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/90"
      }
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-indigo-600 text-lg font-bold text-white shadow-lg shadow-sky-500/30">
            BT
          </span>
          <span className={`font-display text-lg font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900 dark:text-white"}`}>
            BUS TRACK
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex lg:gap-8" aria-label="Main navigation">
          <NavLink to="/" end className={isDark ? navLinkClass : linkClass}>
            Home
          </NavLink>
          <NavLink to="/about" className={isDark ? navLinkClass : linkClass}>
            About
          </NavLink>
          <NavLink to="/faq" className={isDark ? navLinkClass : linkClass}>
            FAQ
          </NavLink>
          <NavLink to="/support" className={isDark ? navLinkClass : linkClass}>
            Support
          </NavLink>
        </nav>

        <Link
          to="/signin"
          className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-md transition hover:bg-sky-50 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
        >
          SIGN IN
        </Link>
      </div>
    </header>
  );
}
