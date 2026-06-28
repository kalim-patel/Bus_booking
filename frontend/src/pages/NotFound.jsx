import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function NotFound() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-sky-50 px-4 py-16 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-md text-center">
        <p className="font-display text-7xl font-bold text-sky-600 dark:text-sky-400" aria-hidden="true">
          404
        </p>
        <h1 className="mt-4 font-display text-2xl font-bold text-slate-900 dark:text-white">Page not found</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          The page you are looking for does not exist or may have been moved.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-sky-500 hover:to-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:from-sky-500 dark:to-indigo-500"
          >
            Back Home
          </Link>
          <Link
            to={isAuthenticated ? "/dashboard" : "/signin"}
            className="inline-flex rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Search Buses
          </Link>
        </div>
      </div>
    </div>
  );
}
