import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Sidebar, MobileNav } from "../components/Sidebar.jsx";
import { SkeletonList } from "../components/SkeletonLoader.jsx";
import { EmptyState, BookingsEmptyIcon } from "../components/EmptyState.jsx";
import { getBookingState, formatBookingState, stateBadgeClass } from "../utils/bookingHelpers.js";

export default function MyBookings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");

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

  const handleBookAgain = (booking) => {
    navigate("/dashboard", { 
      state: { 
        prefill: {
          from: booking.bus?.from,
          to: booking.bus?.to,
        }
      } 
    });
  };

  // Group bookings by state
  const groupedBookings = bookings.reduce((acc, booking) => {
    const state = getBookingState(booking.travelDate, booking.status);
    if (!acc[state]) acc[state] = [];
    acc[state].push(booking);
    return acc;
  }, {});

  const upcomingCount = groupedBookings.upcoming?.length || 0;
  const completedCount = groupedBookings.completed?.length || 0;
  const cancelledCount = groupedBookings.cancelled?.length || 0;

  const filteredBookings = groupedBookings[activeTab] || [];

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

          {/* Tabs */}
          <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
            {[
              { id: "upcoming", label: "Upcoming", count: upcomingCount },
              { id: "completed", label: "Completed", count: completedCount },
              { id: "cancelled", label: "Cancelled", count: cancelledCount },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? "border-b-2 border-sky-600 text-sky-700 dark:border-sky-400 dark:text-sky-400"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {loading ? (
            <SkeletonList count={2} />
          ) : filteredBookings.length === 0 ? (
            <EmptyState
              icon={<BookingsEmptyIcon />}
              title={`No ${activeTab} bookings.`}
              description={
                activeTab === "upcoming"
                  ? "You don't have any upcoming journeys. Book a new ticket to get started."
                  : activeTab === "completed"
                  ? "You haven't completed any journeys yet."
                  : "You haven't cancelled any bookings."
              }
              actionLabel={activeTab === "upcoming" ? "Book Now" : undefined}
              actionTo={activeTab === "upcoming" ? "/dashboard" : undefined}
            />
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => {
                const state = getBookingState(booking.travelDate, booking.status);
                return (
                  <article
                    key={booking._id}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${stateBadgeClass(state)}`}
                          >
                            {formatBookingState(state)}
                          </span>
                          <p className="text-xs text-slate-500 dark:text-slate-500">Booking ID: {booking._id}</p>
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
                            <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Seat Numbers</p>
                            <p className="font-semibold text-slate-800 dark:text-slate-200">
                              {booking.seatNumbers?.length > 0 
                                ? booking.seatNumbers.sort().join(", ") 
                                : `${booking.seatCount} seat${booking.seatCount > 1 ? "s" : ""}`
                              }
                            </p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Passenger Count</p>
                            <p className="font-semibold text-slate-800 dark:text-slate-200">{booking.seatCount}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Fare Per Seat</p>
                            <p className="font-semibold text-slate-800 dark:text-slate-200">₹{booking.bus?.price}</p>
                          </div>
                          <div className="sm:col-span-2">
                            <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Total Fare</p>
                            <p className="font-semibold text-slate-800 dark:text-slate-200">₹{booking.totalAmount}</p>
                          </div>
                        </div>

                        {booking.rating && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-amber-500">⭐</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{booking.rating}/5</span>
                            {booking.review && (
                              <span className="text-slate-600 dark:text-slate-400">- {booking.review}</span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 sm:flex-col">
                        <Link
                          to={`/ticket/${booking._id}`}
                          className="rounded-xl border border-sky-200 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-sky-800 dark:text-sky-400 dark:hover:bg-sky-900/30"
                        >
                          {state === "cancelled" ? "View Details" : "🎫 View Ticket"}
                        </Link>

                        {state === "upcoming" && (
                          <button
                            type="button"
                            onClick={() => handleCancel(booking._id)}
                            disabled={cancelling === booking._id}
                            className="rounded-xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-900/30"
                          >
                            {cancelling === booking._id ? "Cancelling…" : "Cancel Booking"}
                          </button>
                        )}

                        {state === "completed" && (
                          <>
                            {!booking.rating && (
                              <button
                                type="button"
                                onClick={() => navigate(`/rate-journey/${booking._id}`)}
                                className="rounded-xl border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-900/30"
                              >
                                ⭐ Rate Journey
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleBookAgain(booking)}
                              className="rounded-xl border border-sky-200 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-50 dark:border-sky-800 dark:text-sky-400 dark:hover:bg-sky-900/30"
                            >
                              🔁 Book Again
                            </button>
                          </>
                        )}

                        {state === "cancelled" && (
                          <button
                            type="button"
                            onClick={() => handleBookAgain(booking)}
                            className="rounded-xl border border-sky-200 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-50 dark:border-sky-800 dark:text-sky-400 dark:hover:bg-sky-900/30"
                          >
                            🔁 Book Again
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>

      <MobileNav onLogout={handleLogout} />
    </div>
  );
}
