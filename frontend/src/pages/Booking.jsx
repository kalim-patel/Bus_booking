import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const STEPS = [
  { id: 1, title: "Trip", subtitle: "Confirm route & bus" },
  { id: 2, title: "Passengers", subtitle: "Seats & traveller names" },
  { id: 3, title: "Pay & confirm", subtitle: "Review and complete" },
];

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bus, from, to, date } = location.state || {};

  const [step, setStep] = useState(1);
  const [seatCount, setSeatCount] = useState(1);
  const [passengerNames, setPassengerNames] = useState(() => [user?.username?.trim() || ""]);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [submitting, setSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  const maxSeats = useMemo(() => Math.min(6, bus?.seatsAvailable || 6), [bus?.seatsAvailable]);

  useEffect(() => {
    if (!bus?._id) {
      toast.error("Pick a bus from search results first.");
      navigate("/dashboard", { replace: true });
    }
  }, [bus, navigate]);

  useEffect(() => {
    if (user?.username?.trim()) {
      setPassengerNames((prev) => {
        if (prev[0]?.trim()) return prev;
        const next = [...prev];
        next[0] = user.username.trim();
        return next;
      });
    }
  }, [user?.username]);

  useEffect(() => {
    setPassengerNames((prev) => {
      const next = prev.slice(0, seatCount);
      while (next.length < seatCount) next.push("");
      return next;
    });
  }, [seatCount]);

  if (!bus?._id) return null;

  const total = bus.price * seatCount;

  const canGoStep2 = Boolean(from && to && date);
  const canGoStep3 = passengerNames.slice(0, seatCount).every((n) => n.trim().length >= 2);

  const submitBooking = async () => {
    setSubmitting(true);
    try {
      const { data } = await api.post("/api/bookings", {
        busId: bus._id,
        travelDate: date,
        seatCount,
        passengers: passengerNames.slice(0, seatCount).map((fullName) => ({ fullName: fullName.trim() })),
      });
      setBookingResult(data.booking);
      toast.success("Ticket booked!");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (bookingResult) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <header className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
            <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">You&apos;re booked</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Confirmation for {bookingResult.bus?.busName}</p>
          </div>
        </header>
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
          <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm dark:border-emerald-800 dark:bg-slate-800">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">Booking reference</p>
            <p className="mt-1 font-mono text-lg font-bold text-slate-900 dark:text-white">{bookingResult._id}</p>
            <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-slate-500 dark:text-slate-400">Route</dt>
                <dd className="font-semibold text-slate-900 dark:text-slate-200">
                  {bookingResult.bus?.from} → {bookingResult.bus?.to}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500 dark:text-slate-400">Travel date</dt>
                <dd className="font-semibold text-slate-900 dark:text-slate-200">{bookingResult.travelDate}</dd>
              </div>
              <div>
                <dt className="text-slate-500 dark:text-slate-400">Departure</dt>
                <dd className="font-semibold text-slate-900 dark:text-slate-200">{bookingResult.bus?.departureTime}</dd>
              </div>
              <div>
                <dt className="text-slate-500 dark:text-slate-400">Seats</dt>
                <dd className="font-semibold text-slate-900 dark:text-slate-200">{bookingResult.seatCount}</dd>
              </div>
              <div>
                <dt className="text-slate-500 dark:text-slate-400">Passengers</dt>
                <dd className="font-semibold text-slate-900 dark:text-slate-200">
                  {bookingResult.passengers?.map((p) => p.fullName).join(", ")}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500 dark:text-slate-400">Amount paid</dt>
                <dd className="font-semibold text-slate-900 dark:text-slate-200">₹{bookingResult.totalAmount}</dd>
              </div>
            </dl>
            <p className="mt-6 text-xs text-slate-500 dark:text-slate-400">
              Payment was simulated for this demo. A real app would redirect to a payment gateway here.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/dashboard"
                className="inline-flex rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:from-sky-500 hover:to-indigo-500 dark:from-sky-500 dark:to-indigo-500"
              >
                Back to dashboard
              </Link>
              <Link
                to="/bus-results"
                state={{ from, to, date }}
                className="inline-flex rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Search more buses
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <button
              type="button"
              onClick={() => (step > 1 ? setStep((s) => s - 1) : navigate(-1))}
              className="text-sm font-semibold text-sky-700 hover:underline dark:text-sky-400"
            >
              ← {step > 1 ? "Previous step" : "Back to results"}
            </button>
            <h1 className="mt-2 font-display text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">Book ticket</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">{bus.busName}</p>
          </div>
          <Link to="/dashboard" className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
            Home
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <ol className="flex flex-wrap gap-2 border-b border-slate-200 pb-4 dark:border-slate-700">
          {STEPS.map((s) => (
            <li
              key={s.id}
              className={`flex flex-1 min-w-[120px] flex-col rounded-2xl px-3 py-2 text-left sm:min-w-0 ${
                step === s.id ? "bg-slate-900 text-white" : step > s.id ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-white text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-600"
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wide opacity-80">Step {s.id}</span>
              <span className="text-sm font-semibold">{s.title}</span>
              <span className="hidden text-xs opacity-80 sm:inline">{s.subtitle}</span>
            </li>
          ))}
        </ol>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-700 dark:bg-slate-800">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Trip summary</h2>
              <div className="grid gap-4 rounded-2xl bg-slate-50 p-4 text-sm sm:grid-cols-2 dark:bg-slate-700/50">
                <div>
                  <p className="text-xs uppercase text-slate-500 dark:text-slate-400">From</p>
                  <p className="font-semibold text-slate-900 dark:text-slate-200">{from}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-slate-500 dark:text-slate-400">To</p>
                  <p className="font-semibold text-slate-900 dark:text-slate-200">{to}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Date</p>
                  <p className="font-semibold text-slate-900 dark:text-slate-200">{date}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Bus</p>
                  <p className="font-semibold text-slate-900 dark:text-slate-200">{bus.busNumber}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Departure → Arrival</p>
                  <p className="font-semibold text-slate-900 dark:text-slate-200">
                    {bus.departureTime} → {bus.arrivalTime}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Fare per seat</p>
                  <p className="font-semibold text-slate-900 dark:text-slate-200">₹{bus.price}</p>
                </div>
              </div>
              <button
                type="button"
                disabled={!canGoStep2}
                onClick={() => setStep(2)}
                className="w-full rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-md transition hover:from-sky-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:from-sky-500 dark:to-indigo-500"
              >
                Continue to passengers
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Passengers</h2>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Number of seats</label>
                <select
                  value={seatCount}
                  onChange={(e) => setSeatCount(Number(e.target.value))}
                  className="mt-2 w-full max-w-xs rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                >
                  {Array.from({ length: maxSeats }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} seat{n > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Up to {maxSeats} seat(s) available on this bus.</p>
              </div>
              <div className="space-y-3">
                {passengerNames.slice(0, seatCount).map((name, idx) => (
                  <div key={idx}>
                    <label className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Passenger {idx + 1}</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        const v = e.target.value;
                        setPassengerNames((prev) => {
                          const next = [...prev];
                          next[idx] = v;
                          return next;
                        });
                      }}
                      placeholder="Full name as on ID"
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!canGoStep3}
                  onClick={() => setStep(3)}
                  className="rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:from-sky-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:from-sky-500 dark:to-indigo-500"
                >
                  Continue to payment
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Review & pay</h2>
              <div className="rounded-2xl bg-slate-50 p-4 text-sm dark:bg-slate-700/50">
                <p className="font-semibold text-slate-900 dark:text-slate-200">
                  {from} → {to} · {date}
                </p>
                <p className="mt-1 text-slate-600 dark:text-slate-400">
                  {bus.busName} · {seatCount} × ₹{bus.price}
                </p>
                <p className="mt-3 text-lg font-bold text-slate-900 dark:text-white">Total ₹{total}</p>
              </div>
              <fieldset>
                <legend className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Payment method (demo)</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {[
                    { id: "upi", label: "UPI" },
                    { id: "card", label: "Card" },
                    { id: "netbanking", label: "Net banking" },
                  ].map((m) => (
                    <label
                      key={m.id}
                      className={`cursor-pointer rounded-xl border px-4 py-2 text-sm font-semibold ${
                        paymentMethod === m.id ? "border-sky-500 bg-sky-50 text-sky-900 dark:bg-sky-900/30 dark:text-sky-400" : "border-slate-200 bg-white text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="pay"
                        value={m.id}
                        checked={paymentMethod === m.id}
                        onChange={() => setPaymentMethod(m.id)}
                        className="sr-only"
                      />
                      {m.label}
                    </label>
                  ))}
                </div>
              </fieldset>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tapping confirm will record your booking and reduce available seats. No real charge is made.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={submitBooking}
                  className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:from-emerald-500 hover:to-teal-500 disabled:cursor-not-allowed disabled:opacity-60 dark:from-emerald-500 dark:to-teal-500"
                >
                  {submitting ? "Confirming…" : "Confirm booking"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
