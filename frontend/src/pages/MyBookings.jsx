import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Sidebar, MobileNav } from "../components/Sidebar.jsx";
import { Loader } from "../components/Loader.jsx";

export default function MyBookings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/api/bookings/mine");
        if (!cancelled) setBookings(data.bookings || []);
      } catch {
        if (!cancelled) setBookings([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/", { replace: true });
  };

  const handleCancel = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    
    setCancelling(bookingId);
    try {
      await api.delete(`/api/bookings/${bookingId}`);
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      toast.success("Booking cancelled successfully");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCancelling(null);
    }
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
        <main className="flex-1 space-y-8 px-4 py-8 sm:px-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">My Bookings</h1>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              Manage your bus tickets and view booking history.
            </p>
          </div>

          {loading ? (
            <Loader label="Loading bookings…" />
          ) : bookings.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-600 dark:bg-slate-800">
              <p className="font-display text-lg font-semibold text-slate-900 dark:text-white">No bookings yet</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                You haven't booked any tickets yet. Search for buses and complete your first booking.
              </p>
              <Link
                to="/dashboard"
                className="mt-6 inline-flex rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-500 dark:bg-sky-500"
              >
                Search Buses
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <article
                  key={booking._id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            booking.status === "confirmed"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {booking.status === "confirmed" ? "Confirmed" : "Cancelled"}
                        </span>
                        <p className="text-xs text-slate-500 dark:text-slate-500">Ref: {booking._id}</p>
                      </div>

                      <div>
                        <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                          {booking.bus?.busName}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Bus No. {booking.bus?.busNumber}</p>
                      </div>

                      <div className="grid gap-3 text-sm sm:grid-cols-2">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Route</p>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">
                            {booking.bus?.from} → {booking.bus?.to}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Travel Date</p>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{booking.travelDate}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Departure → Arrival</p>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">
                            {booking.bus?.departureTime} → {booking.bus?.arrivalTime}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Seats</p>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">
                            {booking.seatCount} seat{booking.seatCount > 1 ? "s" : ""}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Passengers</p>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">
                            {booking.passengers?.map((p) => p.fullName).join(", ")}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Total Amount</p>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">₹{booking.totalAmount}</p>
                        </div>
                      </div>
                    </div>

                    {booking.status === "confirmed" && (
                      <div className="flex sm:flex-col sm:gap-2">
                        <button
                          type="button"
                          onClick={() => handleCancel(booking._id)}
                          disabled={cancelling === booking._id}
                          className="rounded-xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-900/30"
                        >
                          {cancelling === booking._id ? "Cancelling…" : "Cancel Booking"}
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>

      <MobileNav onLogout={handleLogout} />
    </div>
  );
}
