import { Link, NavLink } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `text-sm font-medium transition hover:text-sky-700 dark:hover:text-sky-400 ${isActive ? "text-sky-600 dark:text-sky-400" : "text-slate-600 dark:text-slate-300"}`;

/** Landing / marketing top bar */
export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-900/70 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 transition hover:opacity-90">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-indigo-600 text-lg font-bold text-white shadow-lg shadow-sky-500/30">
            BT
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-white dark:text-white">BUS TRACK</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <a href="#why" className="text-sm font-medium text-slate-300 hover:text-white dark:text-slate-400 dark:hover:text-white">
            Why Us
          </a>
          <a href="#features" className="text-sm font-medium text-slate-300 hover:text-white dark:text-slate-400 dark:hover:text-white">
            Features
          </a>
          <a href="#contact" className="text-sm font-medium text-slate-300 hover:text-white dark:text-slate-400 dark:hover:text-white">
            Contact
          </a>
        </nav>

        <Link
          to="/signin"
          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-md transition hover:bg-sky-50 hover:shadow-lg dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
        >
          SIGN IN
        </Link>
      </div>
    </header>
  );
}
