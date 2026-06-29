import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function BusDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bus, from, to, date } = location.state || {};

  useEffect(() => {
    if (!bus?._id) {
      toast.error("Pick a bus from search results first.");
      navigate("/dashboard", { replace: true });
    }
  }, [bus, navigate]);

  if (!bus?._id) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-900">
        <div className="max-w-md rounded-3xl border border-rose-200 bg-white p-8 text-center dark:border-rose-800 dark:bg-slate-800">
          <h1 className="font-display text-xl font-bold text-slate-900 dark:text-white">Invalid Access</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Please select a bus from search results first.
          </p>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="mt-6 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-500"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const getBusTypeColor = (type) => {
    switch (type) {
      case "AC":
        return "bg-sky-50 text-sky-700";
      case "Sleeper":
        return "bg-purple-50 text-purple-700";
      case "Semi-Sleeper":
        return "bg-amber-50 text-amber-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-sm font-semibold text-sky-700 hover:underline dark:text-sky-400"
            >
              ← Back to results
            </button>
            <h1 className="mt-2 font-display text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">Bus Details</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">{bus.busName}</p>
          </div>
          <Link to="/dashboard" className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
            Home
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">{bus.busName}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">Bus No. {bus.busNumber}</p>
            </div>
            {bus.busType && (
              <span className={`rounded-full px-3 py-1 text-sm font-semibold ${getBusTypeColor(bus.busType)}`}>
                {bus.busType}
              </span>
            )}
          </div>

          <div className="mb-6 rounded-2xl bg-slate-50 p-4 dark:bg-slate-700/50">
            <p className="text-lg font-semibold text-sky-700 dark:text-sky-400">
              {from} → {to}
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Travel date: {date}</p>
          </div>

          <div className="grid gap-4 rounded-2xl bg-slate-50 p-4 text-sm sm:grid-cols-2 dark:bg-slate-700/50">
            <div>
              <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Departure Time</p>
              <p className="font-semibold text-slate-900 dark:text-slate-200">{bus.departureTime}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Arrival Time</p>
              <p className="font-semibold text-slate-900 dark:text-slate-200">{bus.arrivalTime}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Duration</p>
              <p className="font-semibold text-slate-900 dark:text-slate-200">{bus.duration}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Fare per seat</p>
              <p className="font-semibold text-slate-900 dark:text-slate-200">₹{bus.price}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Available Seats</p>
              <p className="font-semibold text-slate-900 dark:text-slate-200">{bus.seatsAvailable}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Bus Type</p>
              <p className="font-semibold text-slate-900 dark:text-slate-200">{bus.busType}</p>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="button"
              onClick={() => navigate("/seat-selection", { state: { bus, from, to, date } })}
              disabled={bus.seatsAvailable < 1}
              className="w-full rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-md transition hover:from-sky-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:from-sky-500 dark:to-indigo-500"
            >
              {bus.seatsAvailable < 1 ? "Sold Out" : "Select Seats"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
