import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../services/api.js";
import { getBookingState } from "../utils/bookingHelpers.js";

export default function RateJourney() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/bookings/${id}`);
        
        const state = getBookingState(data.booking.travelDate, data.booking.status);
        if (state !== "completed") {
          toast.error("You can only rate completed journeys.");
          navigate("/my-bookings", { replace: true });
          return;
        }
        
        if (data.booking.rating) {
          toast.error("You have already rated this journey.");
          navigate("/my-bookings", { replace: true });
          return;
        }
        
        setBooking(data.booking);
      } catch (error) {
        toast.error(error.message || "Failed to load booking details");
        navigate("/my-bookings", { replace: true });
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooking();
  }, [id, navigate]);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    
    setSubmitting(true);
    try {
      await api.put(`/api/bookings/${id}/rating`, { rating, review });
      toast.success("Thank you for your feedback!");
      navigate("/my-bookings");
    } catch (error) {
      toast.error(error.message || "Failed to submit rating");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-sky-600 dark:border-slate-700 dark:border-t-sky-400" />
      </div>
    );
  }

  if (!booking) return null;

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
              ← Back to bookings
            </button>
            <h1 className="mt-2 font-display text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">Rate Your Journey</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">{booking.bus?.busName}</p>
          </div>
          <Link to="/dashboard" className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
            Home
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <div className="space-y-6">
          {/* Journey Info */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white mb-4">Journey Details</h2>
            <div className="grid gap-4 rounded-2xl bg-slate-50 p-4 text-sm sm:grid-cols-2 dark:bg-slate-700/50">
              <div>
                <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Route</p>
                <p className="font-semibold text-slate-900 dark:text-slate-200">
                  {booking.bus?.from} → {booking.bus?.to}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Travel Date</p>
                <p className="font-semibold text-slate-900 dark:text-slate-200">{booking.travelDate}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Bus</p>
                <p className="font-semibold text-slate-900 dark:text-slate-200">{booking.bus?.busName}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Seats</p>
                <p className="font-semibold text-slate-900 dark:text-slate-200">
                  {booking.seatNumbers?.length > 0 
                    ? booking.seatNumbers.sort().join(", ") 
                    : `${booking.seatCount} seat${booking.seatCount > 1 ? "s" : ""}`
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white mb-4">How was your journey?</h2>
            <div className="flex items-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="text-4xl transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                  aria-label={`Rate ${star} stars`}
                  aria-pressed={rating === star}
                >
                  <span className={star <= (hoveredRating || rating) ? "text-amber-500" : "text-slate-300 dark:text-slate-600"}>
                    ★
                  </span>
                </button>
              ))}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {rating === 0 ? "Select a rating above" : `You rated: ${rating} star${rating > 1 ? "s" : ""}`}
            </p>
          </div>

          {/* Review */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white mb-4">Add a review (optional)</h2>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience with this journey..."
              rows={4}
              maxLength={500}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white resize-none"
            />
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {review.length}/500 characters
            </p>
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={rating === 0 || submitting}
            className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3 text-sm font-semibold text-white shadow-md transition hover:from-amber-400 hover:to-orange-400 disabled:cursor-not-allowed disabled:opacity-50 dark:from-amber-600 dark:to-orange-600"
          >
            {submitting ? "Submitting..." : "Submit Rating"}
          </button>
        </div>
      </div>
    </div>
  );
}
