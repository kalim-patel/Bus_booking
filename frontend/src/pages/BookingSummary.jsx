import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function BookingSummary() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bus, from, to, date, selectedSeats, totalAmount } = location.state || {};
  
  const [passengerNames, setPassengerNames] = useState(() => 
    selectedSeats?.length > 0 
      ? Array(selectedSeats.length).fill("").map((_, i) => i === 0 && user?.username?.trim() ? user.username.trim() : "")
      : [""]
  );
  const [passengerErrors, setPassengerErrors] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    if (!bus?._id || !selectedSeats?.length) {
      toast.error("Invalid booking information. Please start over.");
      navigate("/dashboard", { replace: true });
    }
  }, [bus, selectedSeats, navigate]);

  if (!bus?._id || !selectedSeats?.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-900">
        <div className="max-w-md rounded-3xl border border-rose-200 bg-white p-8 text-center dark:border-rose-800 dark:bg-slate-800">
          <h1 className="font-display text-xl font-bold text-slate-900 dark:text-white">Invalid Access</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Please select seats first to proceed with booking.
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
  
  useEffect(() => {
    if (user?.username?.trim() && passengerNames.length > 0) {
      setPassengerNames(prev => {
        if (prev[0]?.trim()) return prev;
        const next = [...prev];
        next[0] = user.username.trim();
        return next;
      });
    }
  }, [user?.username]);
  
  const validatePassengers = () => {
    const errs = passengerNames.map((n) =>
      n.trim().length >= 2 ? "" : "Name must be at least 2 characters."
    );
    setPassengerErrors(errs);
    return errs.every((e) => !e);
  };
  
  const allValid = passengerNames.every((n) => n.trim().length >= 2);
  
  const submitBooking = async () => {
    if (!validatePassengers()) return;
    
    setSubmitting(true);
    try {
      const { data } = await api.post("/api/bookings", {
        busId: bus._id,
        travelDate: date,
        seatCount: selectedSeats.length,
        seatNumbers: selectedSeats,
        passengers: passengerNames.map((fullName) => ({ fullName: fullName.trim() })),
      });
      toast.success("Ticket booked!");
      navigate("/booking-success", { replace: true, state: { booking: data.booking } });
    } catch (e) {
      toast.error(e.message || "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  
  if (!bus?._id || !selectedSeats?.length) return null;
  
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
              ← Back to seat selection
            </button>
            <h1 className="mt-2 font-display text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">Booking Summary</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Review and confirm your booking</p>
          </div>
          <Link to="/dashboard" className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
            Home
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <div className="space-y-6">
          {/* Trip Details */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white mb-4">Trip Details</h2>
            <div className="grid gap-4 rounded-2xl bg-slate-50 p-4 text-sm sm:grid-cols-2 dark:bg-slate-700/50">
              <div>
                <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Bus Name</p>
                <p className="font-semibold text-slate-900 dark:text-slate-200">{bus.busName}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Bus Number</p>
                <p className="font-semibold text-slate-900 dark:text-slate-200">{bus.busNumber}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Operator</p>
                <p className="font-semibold text-slate-900 dark:text-slate-200">{bus.busType}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Route</p>
                <p className="font-semibold text-slate-900 dark:text-slate-200">{from} → {to}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Travel Date</p>
                <p className="font-semibold text-slate-900 dark:text-slate-200">{date}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Departure → Arrival</p>
                <p className="font-semibold text-slate-900 dark:text-slate-200">
                  {bus.departureTime} → {bus.arrivalTime}
                </p>
              </div>
            </div>
          </div>

          {/* Seat Details */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white mb-4">Seat Details</h2>
            <div className="grid gap-4 rounded-2xl bg-slate-50 p-4 text-sm sm:grid-cols-2 dark:bg-slate-700/50">
              <div>
                <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Selected Seats</p>
                <p className="font-semibold text-slate-900 dark:text-slate-200">
                  {selectedSeats.sort().join(", ")}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Passenger Count</p>
                <p className="font-semibold text-slate-900 dark:text-slate-200">{selectedSeats.length}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Fare Per Seat</p>
                <p className="font-semibold text-slate-900 dark:text-slate-200">₹{bus.price}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Total Fare</p>
                <p className="font-semibold text-slate-900 dark:text-slate-200">₹{totalAmount}</p>
              </div>
            </div>
          </div>

          {/* Passenger Details */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white mb-4">Passenger Details</h2>
            <div className="space-y-3">
              {passengerNames.map((name, idx) => (
                <div key={idx}>
                  <label htmlFor={`passenger-${idx}`} className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                    Passenger for Seat {selectedSeats[idx]}
                  </label>
                  <input
                    id={`passenger-${idx}`}
                    type="text"
                    value={name}
                    onChange={(e) => {
                      const v = e.target.value;
                      setPassengerNames(prev => {
                        const next = [...prev];
                        next[idx] = v;
                        return next;
                      });
                      if (passengerErrors[idx]) {
                        setPassengerErrors(prev => {
                          const next = [...prev];
                          next[idx] = v.trim().length >= 2 ? "" : "Name must be at least 2 characters.";
                          return next;
                        });
                      }
                    }}
                    placeholder="Full name as on ID"
                    aria-invalid={Boolean(passengerErrors[idx])}
                    aria-describedby={passengerErrors[idx] ? `passenger-${idx}-error` : undefined}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                  {passengerErrors[idx] && (
                    <p id={`passenger-${idx}-error`} className="mt-1 text-xs text-rose-600" role="alert">
                      {passengerErrors[idx]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <fieldset>
              <legend className="font-display text-lg font-semibold text-slate-900 dark:text-white mb-4">Payment Method (Demo)</legend>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "upi", label: "UPI" },
                  { id: "card", label: "Card" },
                  { id: "netbanking", label: "Net banking" },
                ].map((m) => (
                  <label
                    key={m.id}
                    className={`cursor-pointer rounded-xl border px-4 py-2 text-sm font-semibold ${
                      paymentMethod === m.id 
                        ? "border-sky-500 bg-sky-50 text-sky-900 dark:bg-sky-900/30 dark:text-sky-400" 
                        : "border-slate-200 bg-white text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
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
            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
              Tapping confirm will record your booking and reserve your selected seats. No real charge is made.
            </p>
          </div>

          {/* Confirm Button */}
          <button
            type="button"
            disabled={!allValid || submitting}
            onClick={submitBooking}
            className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-sm font-semibold text-white shadow-md hover:from-emerald-500 hover:to-teal-500 disabled:cursor-not-allowed disabled:opacity-60 dark:from-emerald-500 dark:to-teal-500"
          >
            {submitting ? "Confirming booking…" : `Confirm Booking - ₹${totalAmount}`}
          </button>
        </div>
      </div>
    </div>
  );
}
