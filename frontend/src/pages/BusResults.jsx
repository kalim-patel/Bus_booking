import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../services/api.js";
import { BusCard } from "../components/BusCard.jsx";
import { SkeletonCard } from "../components/SkeletonLoader.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function departureHour(timeStr) {
  const [h] = timeStr.split(":").map(Number);
  return Number.isFinite(h) ? h : 0;
}

export default function BusResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { from, to, date } = location.state || {};
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("all"); // all | morning | afternoon | evening
  const [typeFilter, setTypeFilter] = useState("all"); // all | ac | non-ac | sleeper | semi-sleeper
  const [sortBy, setSortBy] = useState("default"); // default | price-low | price-high | duration | departure

  useEffect(() => {
    if (!from || !to) {
      toast.error("Start your search from the dashboard.");
      navigate("/dashboard", { replace: true });
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/api/buses", {
          params: { from, to, date },
        });
        if (!cancelled) setBuses(data.buses || []);
      } catch (e) {
        if (!cancelled) {
          toast.error(e.message);
          setBuses([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [from, to, date, navigate]);

  const filtered = useMemo(() => {
    let list = [...buses];

    // Time filter
    if (timeFilter === "morning") list = list.filter((b) => departureHour(b.departureTime) < 12);
    if (timeFilter === "afternoon") list = list.filter((b) => departureHour(b.departureTime) >= 12 && departureHour(b.departureTime) < 17);
    if (timeFilter === "evening") list = list.filter((b) => departureHour(b.departureTime) >= 17);

    // Type filter
    if (typeFilter === "ac") list = list.filter((b) => b.busType === "AC");
    if (typeFilter === "non-ac") list = list.filter((b) => b.busType === "Non-AC");
    if (typeFilter === "sleeper") list = list.filter((b) => b.busType === "Sleeper");
    if (typeFilter === "semi-sleeper") list = list.filter((b) => b.busType === "Semi-Sleeper");

    // Sorting
    if (sortBy === "price-low") list.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") list.sort((a, b) => b.price - a.price);
    if (sortBy === "departure") list.sort((a, b) => departureHour(a.departureTime) - departureHour(b.departureTime));
    if (sortBy === "duration") {
      list.sort((a, b) => {
        const parseDuration = (d) => {
          const match = d.match(/(\d+)h\s*(\d+)?m?/);
          if (!match) return 0;
          const hours = parseInt(match[1], 10);
          const mins = match[2] ? parseInt(match[2], 10) : 0;
          return hours * 60 + mins;
        };
        return parseDuration(a.duration) - parseDuration(b.duration);
      });
    }

    return list;
  }, [buses, timeFilter, typeFilter, sortBy]);

  const summary = from && to ? `${from} to ${to} – ${filtered.length} buses found` : "";

  const resetFilters = () => {
    setTimeFilter("all");
    setTypeFilter("all");
    setSortBy("default");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <Link to="/dashboard" className="text-sm font-semibold text-sky-700 hover:underline">
              ← Back to Dashboard
            </Link>
            <h1 className="mt-2 font-display text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">Search results</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">{summary}</p>
            {date && <p className="text-xs text-slate-500 dark:text-slate-500">Travel date: {date}</p>}
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="space-y-4">
          {/* Time Filters */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Time of Day</p>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "All" },
                { id: "morning", label: "Morning (before 12 PM)" },
                { id: "afternoon", label: "Afternoon (12-5 PM)" },
                { id: "evening", label: "Evening (after 5 PM)" },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setTimeFilter(f.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
                    timeFilter === f.id
                      ? "bg-slate-900 text-white shadow-md"
                      : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100 dark:bg-slate-700 dark:text-white dark:ring-slate-600 dark:hover:bg-slate-600"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bus Type Filters */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Bus Type</p>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "All" },
                { id: "ac", label: "AC" },
                { id: "non-ac", label: "Non-AC" },
                { id: "sleeper", label: "Sleeper" },
                { id: "semi-sleeper", label: "Semi-Sleeper" },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setTypeFilter(f.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
                    typeFilter === f.id
                      ? "bg-slate-900 text-white shadow-md"
                      : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100 dark:bg-slate-700 dark:text-white dark:ring-slate-600 dark:hover:bg-slate-600"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sorting */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Sort By</p>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "default", label: "Default" },
                { id: "price-low", label: "Price: Low to High" },
                { id: "price-high", label: "Price: High to Low" },
                { id: "departure", label: "Earliest Departure" },
                { id: "duration", label: "Shortest Duration" },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSortBy(f.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
                    sortBy === f.id
                      ? "bg-slate-900 text-white shadow-md"
                      : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100 dark:bg-slate-700 dark:text-white dark:ring-slate-600 dark:hover:bg-slate-600"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reset Filters */}
          {(timeFilter !== "all" || typeFilter !== "all" || sortBy !== "default") && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-sm font-semibold text-sky-700 hover:underline dark:text-sky-400"
            >
              Reset all filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-600 dark:bg-slate-800">
            <p className="font-display text-lg font-semibold text-slate-900 dark:text-white">No buses found</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Try adjusting your filters or search for a different route.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Reset Filters
            </button>
            <Link
              to="/dashboard"
              className="mt-4 ml-4 inline-flex rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-500 dark:bg-sky-500"
            >
              Change Search
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((bus) => (
              <BusCard
                key={bus._id || bus.busNumber}
                bus={bus}
                onBook={(b) => navigate("/bus-details", { state: { bus: b, from, to, date } })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
