import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../services/api.js";

// Generate seat layout dynamically
const generateSeatLayout = (totalSeats) => {
  const rows = Math.ceil(totalSeats / 4);
  const seats = [];
  const rowLabels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  
  for (let row = 0; row < rows; row++) {
    const rowLabel = rowLabels[row] || `R${row + 1}`;
    // Left side: 2 seats
    seats.push({ id: `${rowLabel}1`, row: rowLabel, number: 1, side: 'left' });
    seats.push({ id: `${rowLabel}2`, row: rowLabel, number: 2, side: 'left' });
    // Right side: 2 seats
    seats.push({ id: `${rowLabel}3`, row: rowLabel, number: 3, side: 'right' });
    seats.push({ id: `${rowLabel}4`, row: rowLabel, number: 4, side: 'right' });
  }
  
  return seats.slice(0, totalSeats);
};

export default function SeatSelection() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bus, from, to, date } = location.state || {};
  
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const maxSeats = 6;
  const totalSeats = Math.min(bus?.seatsAvailable || 40, 40);
  
  const seatLayout = useMemo(() => generateSeatLayout(totalSeats), [totalSeats]);
  
  useEffect(() => {
    if (!bus?._id) {
      toast.error("Pick a bus from search results first.");
      navigate("/dashboard", { replace: true });
      return;
    }
    
    const fetchBookedSeats = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/bookings/bus/${bus._id}/available-seats`, {
          params: { date }
        });
        setBookedSeats(data.bookedSeats || []);
      } catch (error) {
        toast.error(error.message || "Failed to load seat availability");
        setBookedSeats([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookedSeats();
  }, [bus, date, navigate]);
  
  const getSeatStatus = (seatId) => {
    if (bookedSeats.includes(seatId)) return 'booked';
    if (selectedSeats.includes(seatId)) return 'selected';
    return 'available';
  };
  
  const handleSeatClick = (seatId) => {
    const status = getSeatStatus(seatId);
    
    if (status === 'booked') {
      toast.error("This seat is already booked");
      return;
    }
    
    if (status === 'selected') {
      setSelectedSeats(prev => prev.filter(s => s !== seatId));
    } else {
      if (selectedSeats.length >= maxSeats) {
        toast.error(`You can only select up to ${maxSeats} seats`);
        return;
      }
      setSelectedSeats(prev => [...prev, seatId]);
    }
  };
  
  const handleKeyDown = (e, seatId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSeatClick(seatId);
    }
  };
  
  const totalAmount = selectedSeats.length * bus?.price || 0;
  
  const canProceed = selectedSeats.length > 0 && selectedSeats.length <= maxSeats;
  
  const handleContinue = () => {
    if (!canProceed) {
      toast.error("Please select at least one seat");
      return;
    }
    navigate("/booking-summary", { 
      state: { 
        bus, 
        from, 
        to, 
        date, 
        selectedSeats, 
        totalAmount 
      } 
    });
  };
  
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
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-sm font-semibold text-sky-700 hover:underline dark:text-sky-400"
            >
              ← Back to bus details
            </button>
            <h1 className="mt-2 font-display text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">Select Seats</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">{bus.busName}</p>
          </div>
          <Link to="/dashboard" className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
            Home
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        {/* Legend */}
        <div className="mb-6 flex flex-wrap gap-4 rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-800">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-emerald-100 border-2 border-emerald-500 dark:bg-emerald-900/30 dark:border-emerald-400" />
            <span className="text-sm text-slate-700 dark:text-slate-300">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-rose-100 border-2 border-rose-500 dark:bg-rose-900/30 dark:border-rose-400" />
            <span className="text-sm text-slate-700 dark:text-slate-300">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-sky-100 border-2 border-sky-500 dark:bg-sky-900/30 dark:border-sky-400" />
            <span className="text-sm text-slate-700 dark:text-slate-300">Selected</span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-sky-600 dark:border-slate-700 dark:border-t-sky-400" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Seat Layout */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                  Choose your seats (Max {maxSeats})
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Selected: {selectedSeats.length}/{maxSeats}
                </p>
              </div>
              
              {/* Bus front indicator */}
              <div className="mb-6 flex justify-center">
                <div className="w-32 rounded-t-3xl border-4 border-slate-300 bg-slate-100 pt-2 text-center text-xs font-semibold text-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400">
                  FRONT
                </div>
              </div>
              
              {/* Seat Grid */}
              <div className="space-y-3">
                {(() => {
                  const groupedSeats = seatLayout.reduce((rows, seat) => {
                    const currentRow = seat.row;
                    if (!rows[currentRow]) {
                      rows[currentRow] = [];
                    }
                    rows[currentRow].push(seat);
                    return rows;
                  }, {});
                  
                  return Object.entries(groupedSeats).map(([rowLabel, rowSeats]) => (
                    <div key={rowLabel} className="flex items-center justify-center gap-2">
                      {/* Left side */}
                      <div className="flex gap-2">
                        {rowSeats.filter(s => s.side === 'left').map(seat => {
                          const status = getSeatStatus(seat.id);
                          return (
                            <button
                              key={seat.id}
                              type="button"
                              onClick={() => handleSeatClick(seat.id)}
                              onKeyDown={(e) => handleKeyDown(e, seat.id)}
                              disabled={status === 'booked'}
                              aria-label={`Seat ${seat.id} ${status === 'booked' ? 'already booked' : status === 'selected' ? 'selected' : 'available'}`}
                              aria-pressed={status === 'selected'}
                              className={`
                                h-12 w-12 rounded-lg border-2 text-sm font-semibold transition-all
                                focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2
                                ${status === 'available' 
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-400 dark:bg-emerald-900/30 dark:border-emerald-600 dark:text-emerald-400 dark:hover:bg-emerald-900/50' 
                                  : status === 'booked'
                                  ? 'bg-rose-50 border-rose-300 text-rose-700 cursor-not-allowed dark:bg-rose-900/30 dark:border-rose-600 dark:text-rose-400'
                                  : 'bg-sky-50 border-sky-500 text-sky-700 hover:bg-sky-100 dark:bg-sky-900/30 dark:border-sky-400 dark:text-sky-400 dark:hover:bg-sky-900/50'
                                }
                              `}
                            >
                              {seat.id}
                            </button>
                          );
                        })}
                      </div>
                      
                      {/* Aisle */}
                      <div className="w-12 text-center text-xs text-slate-400 dark:text-slate-600">
                        {rowLabel}
                      </div>
                      
                      {/* Right side */}
                      <div className="flex gap-2">
                        {rowSeats.filter(s => s.side === 'right').map(seat => {
                          const status = getSeatStatus(seat.id);
                          return (
                            <button
                              key={seat.id}
                              type="button"
                              onClick={() => handleSeatClick(seat.id)}
                              onKeyDown={(e) => handleKeyDown(e, seat.id)}
                              disabled={status === 'booked'}
                              aria-label={`Seat ${seat.id} ${status === 'booked' ? 'already booked' : status === 'selected' ? 'selected' : 'available'}`}
                              aria-pressed={status === 'selected'}
                              className={`
                                h-12 w-12 rounded-lg border-2 text-sm font-semibold transition-all
                                focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2
                                ${status === 'available' 
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-400 dark:bg-emerald-900/30 dark:border-emerald-600 dark:text-emerald-400 dark:hover:bg-emerald-900/50' 
                                  : status === 'booked'
                                  ? 'bg-rose-50 border-rose-300 text-rose-700 cursor-not-allowed dark:bg-rose-900/30 dark:border-rose-600 dark:text-rose-400'
                                  : 'bg-sky-50 border-sky-500 text-sky-700 hover:bg-sky-100 dark:bg-sky-900/30 dark:border-sky-400 dark:text-sky-400 dark:hover:bg-sky-900/50'
                                }
                              `}
                            >
                              {seat.id}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* Fare Summary */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white mb-4">Fare Summary</h2>
              
              {selectedSeats.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Selected Seats</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-200">
                      {selectedSeats.sort().join(", ")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Fare per seat</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-200">₹{bus.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Number of seats</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-200">{selectedSeats.length}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-3 dark:border-slate-700">
                    <div className="flex justify-between">
                      <span className="text-base font-semibold text-slate-900 dark:text-white">Total Amount</span>
                      <span className="text-lg font-bold text-slate-900 dark:text-white">₹{totalAmount}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-400">Select seats to see fare summary</p>
              )}
            </div>

            {/* Continue Button */}
            <button
              type="button"
              onClick={handleContinue}
              disabled={!canProceed}
              className="w-full rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-md transition hover:from-sky-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:from-sky-500 dark:to-indigo-500"
            >
              {selectedSeats.length === 0 ? "Select seats to continue" : `Continue with ${selectedSeats.length} seat${selectedSeats.length > 1 ? 's' : ''}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
