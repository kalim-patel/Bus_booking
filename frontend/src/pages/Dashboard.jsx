import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import { Sidebar, MobileNav } from "../components/Sidebar.jsx";

const STOPS = ["Pune", "Mumbai", "Kolhapur", "Satara", "Sangli", "Nashik", "Nagpur"];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [from, setFrom] = useState("Pune");
  const [to, setTo] = useState("Mumbai");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  // Handle prefill from Book Again
  useEffect(() => {
    if (location.state?.prefill) {
      const { from: prefillFrom, to: prefillTo } = location.state.prefill;
      if (prefillFrom && STOPS.includes(prefillFrom)) {
        setFrom(prefillFrom);
      }
      if (prefillTo && STOPS.includes(prefillTo)) {
        setTo(prefillTo);
      }
      // Clear the prefill state after using it
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/", { replace: true });
  };

  const search = (e) => {
    e.preventDefault();
    if (from === to) {
      toast.error("From and To must be different.");
      return;
    }
    navigate("/bus-results", { state: { from, to, date } });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 lg:pb-0 dark:bg-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-700 dark:bg-slate-800/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <button type="button" onClick={() => navigate("/dashboard")} className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 text-sm font-bold text-white">
              BT
            </span>
            <span className="font-display text-lg font-bold text-slate-900 dark:text-white">BUS TRACK</span>
          </button>
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-200"
              title={user?.username}
            >
              {(user?.username || "?").slice(0, 1).toUpperCase()}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="hidden rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700 sm:inline"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl">
        <Sidebar onLogout={handleLogout} />
        <main className="flex-1 space-y-10 px-4 py-8 sm:px-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">Welcome to BUS TRACK</h1>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              Hello, <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.username}</span> — plan your next ride below.
            </p>
          </div>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Search buses</h2>
            <form onSubmit={search} className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">From</label>
                <select
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                >
                  {STOPS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">To</label>
                <select
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                >
                  {STOPS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Travel date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-sky-500 hover:to-indigo-500 dark:from-sky-500 dark:to-indigo-500"
                >
                  Search Buses
                </button>
              </div>
            </form>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            {[
              { title: "Available routes", body: "Pune ⇄ Mumbai, Kolhapur, Nashik & more." },
              { title: "Popular destinations", body: "Mumbai, Pune, and Nagpur see the highest demand." },
              { title: "Bus timings", body: "Morning departures from 5 AM — late night options available." },
            ].map((c) => (
              <div key={c.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <h3 className="font-display font-semibold text-slate-900 dark:text-white">{c.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{c.body}</p>
              </div>
            ))}
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Quick Actions</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => navigate("/my-bookings")}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-900 transition hover:border-sky-300 hover:bg-sky-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
              >
                View My Bookings
              </button>
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-900 transition hover:border-sky-300 hover:bg-sky-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
              >
                Edit Profile
              </button>
            </div>
          </section>
        </main>
      </div>

      <MobileNav onLogout={handleLogout} />
    </div>
  );
}
