/** Derive demo seat labels without DB schema changes */
export function seatLabel(index) {
  return `A${index + 1}`;
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
