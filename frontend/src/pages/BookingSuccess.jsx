import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { formatBookingStatus, seatLabel, statusBadgeClass } from "../utils/bookingHelpers.js";

export default function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  useEffect(() => {
    if (!booking?._id) {
      navigate("/dashboard", { replace: true });
    }
  }, [booking, navigate]);

  if (!booking?._id) return null;

  const passengers = booking.passengers || [];
  const primaryPassenger = passengers[0]?.fullName || "—";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" aria-hidden="true">
              ✓
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Booking confirmed</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">Your ticket has been reserved successfully.</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <article className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm dark:border-emerald-800 dark:bg-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">Booking ID</p>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass(booking.status)}`}>
              {formatBookingStatus(booking.status)}
            </span>
          </div>
          <p className="mt-1 font-mono text-lg font-bold text-slate-900 dark:text-white">{booking._id}</p>

          <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-slate-500 dark:text-slate-400">Passenger</dt>
              <dd className="font-semibold text-slate-900 dark:text-slate-200">
                {passengers.length > 1 ? `${primaryPassenger} +${passengers.length - 1} more` : primaryPassenger}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500 dark:text-slate-400">Bus</dt>
              <dd className="font-semibold text-slate-900 dark:text-slate-200">{booking.bus?.busName}</dd>
            </div>
            <div>
              <dt className="text-slate-500 dark:text-slate-400">Seat{booking.seatCount > 1 ? "s" : ""}</dt>
              <dd className="font-semibold text-slate-900 dark:text-slate-200">
                {booking.seatNumbers?.length > 0 
                  ? booking.seatNumbers.sort().join(", ") 
                  : passengers.map((_, i) => seatLabel(i)).join(", ")
                }
              </dd>
            </div>
            <div>
              <dt className="text-slate-500 dark:text-slate-400">Route</dt>
              <dd className="font-semibold text-slate-900 dark:text-slate-200">
                {booking.bus?.from} → {booking.bus?.to}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500 dark:text-slate-400">Travel date</dt>
              <dd className="font-semibold text-slate-900 dark:text-slate-200">{booking.travelDate}</dd>
            </div>
            <div>
              <dt className="text-slate-500 dark:text-slate-400">Amount</dt>
              <dd className="font-semibold text-slate-900 dark:text-slate-200">₹{booking.totalAmount}</dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/my-bookings"
              className="inline-flex rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:from-sky-500 hover:to-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:from-sky-500 dark:to-indigo-500"
            >
              View My Bookings
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Go Dashboard
            </Link>
            <Link
              to={`/ticket/${booking._id}`}
              className="inline-flex rounded-xl border border-sky-200 px-5 py-2.5 text-sm font-semibold text-sky-700 hover:bg-sky-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-sky-800 dark:text-sky-400 dark:hover:bg-sky-900/30"
            >
              View Ticket
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
