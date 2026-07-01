/** Derive demo seat labels without DB schema changes */
export function seatLabel(index) {
  return `A${index + 1}`;
}

/**
 * Determine booking state based on travel date and cancellation status
 * Returns: 'upcoming' | 'today' | 'completed' | 'cancelled'
 */
export function getBookingState(travelDate, status) {
  if (status === "cancelled") return "cancelled";
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const travel = new Date(travelDate);
  travel.setHours(0, 0, 0, 0);
  
  if (travel.getTime() === today.getTime()) return "today";
  if (travel.getTime() > today.getTime()) return "upcoming";
  return "completed";
}

/**
 * Format booking state for display
 */
export function formatBookingState(state) {
  const stateLabels = {
    upcoming: "Upcoming",
    today: "Today's Journey",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  return stateLabels[state] || state;
}

/**
 * Get badge color class based on booking state
 */
export function stateBadgeClass(state) {
  const badgeClasses = {
    upcoming: "bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
    today: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    completed: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    cancelled: "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  };
  return badgeClasses[state] || "bg-slate-50 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400";
}

export function formatBookingStatus(status) {
  if (status === "cancelled") return "Cancelled";
  return "Confirmed";
}

export function statusBadgeClass(status) {
  return status === "confirmed"
    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
    : "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400";
}
