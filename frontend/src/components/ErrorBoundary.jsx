import { Component } from "react";
import { Link } from "react-router-dom";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-900">
          <div className="max-w-md rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-lg dark:border-rose-800 dark:bg-slate-800">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30">
              <svg className="h-8 w-8 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Something went wrong</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              An unexpected error occurred. Please refresh the page or return home.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:from-sky-500 hover:to-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                Refresh Page
              </button>
              <Link
                to="/"
                className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Back Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
