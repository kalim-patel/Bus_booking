import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api.js";
import { SkeletonList } from "../components/SkeletonLoader.jsx";
import { formatBookingStatus, seatLabel, statusBadgeClass } from "../utils/bookingHelpers.js";

export default function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/api/bookings/${id}`);
        if (!cancelled) setBooking(data.booking);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-900 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <SkeletonList count={1} />
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-900">
        <div className="max-w-md rounded-3xl border border-rose-200 bg-white p-8 text-center dark:border-rose-800 dark:bg-slate-800">
          <h1 className="font-display text-xl font-bold text-slate-900 dark:text-white">Ticket unavailable</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{error || "Booking not found."}</p>
          <Link
            to="/my-bookings"
            className="mt-6 inline-flex rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-500"
          >
            My Bookings
          </Link>
        </div>
      </div>
    );
  }

  const passengers = booking.passengers || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-sm font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-sky-400"
            >
              ← Back
            </button>
            <h1 className="mt-2 font-display text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">Ticket Details</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Read-only view · Ref {booking._id}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass(booking.status)}`}>
            {formatBookingStatus(booking.status)}
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <article
          className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
          aria-label="Bus ticket"
        >
          <div className="bg-gradient-to-r from-sky-600 to-indigo-600 px-6 py-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-wide opacity-90">BUS TRACK</p>
            <h2 className="mt-1 font-display text-xl font-bold">{booking.bus?.busName}</h2>
            <p className="text-sm opacity-90">Bus No. {booking.bus?.busNumber}</p>
          </div>

          <dl className="grid gap-4 p-6 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase text-slate-500 dark:text-slate-400">Booking ID</dt>
              <dd className="mt-1 font-mono font-semibold text-slate-900 dark:text-slate-200">{booking._id}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-500 dark:text-slate-400">Booking Status</dt>
              <dd className="mt-1 font-semibold text-slate-900 dark:text-slate-200">{formatBookingStatus(booking.status)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-500 dark:text-slate-400">Source</dt>
              <dd className="mt-1 font-semibold text-slate-900 dark:text-slate-200">{booking.bus?.from}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-500 dark:text-slate-400">Destination</dt>
              <dd className="mt-1 font-semibold text-slate-900 dark:text-slate-200">{booking.bus?.to}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-500 dark:text-slate-400">Departure</dt>
              <dd className="mt-1 font-semibold text-slate-900 dark:text-slate-200">{booking.bus?.departureTime}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-500 dark:text-slate-400">Arrival</dt>
              <dd className="mt-1 font-semibold text-slate-900 dark:text-slate-200">{booking.bus?.arrivalTime}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-500 dark:text-slate-400">Travel Date</dt>
              <dd className="mt-1 font-semibold text-slate-900 dark:text-slate-200">{booking.travelDate}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-500 dark:text-slate-400">Total Amount</dt>
              <dd className="mt-1 font-semibold text-slate-900 dark:text-slate-200">₹{booking.totalAmount}</dd>
            </div>
          </dl>

          <div className="border-t border-slate-100 px-6 py-5 dark:border-slate-700">
            <h3 className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Passengers & Seats</h3>
            <ul className="mt-3 space-y-2">
              {passengers.map((p, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm dark:bg-slate-700/50"
                >
                  <span className="font-medium text-slate-900 dark:text-slate-200">{p.fullName}</span>
                  <span className="font-semibold text-sky-700 dark:text-sky-400">Seat {seatLabel(i)}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/my-bookings"
            className="inline-flex rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            My Bookings
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-500"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
