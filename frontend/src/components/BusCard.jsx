export function BusCard({ bus, onBook }) {
  const getBusTypeColor = (type) => {
    switch (type) {
      case "AC":
        return "bg-sky-50 text-sky-700";
      case "Sleeper":
        return "bg-purple-50 text-purple-700";
      case "Semi-Sleeper":
        return "bg-amber-50 text-amber-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <article className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-slate-900">{bus.busName}</h3>
          <p className="text-sm text-slate-500">Bus No. {bus.busNumber}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {bus.seatsAvailable} seats
          </span>
          {bus.busType && (
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${getBusTypeColor(bus.busType)}`}>
              {bus.busType}
            </span>
          )}
        </div>
      </div>

      <p className="mt-3 text-sm font-medium text-sky-700">
        {bus.from} → {bus.to}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Departure</p>
          <p className="font-semibold text-slate-800">{bus.departureTime}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Arrival</p>
          <p className="font-semibold text-slate-800">{bus.arrivalTime}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Duration</p>
          <p className="font-semibold text-slate-800">{bus.duration}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Fare</p>
          <p className="font-semibold text-slate-800">₹{bus.price}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onBook?.(bus)}
        disabled={!onBook || bus.seatsAvailable < 1}
        className="mt-5 w-full rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-sky-500 hover:to-indigo-500 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
      >
        {bus.seatsAvailable < 1 ? "Sold out" : "BOOK NOW"}
      </button>
    </article>
  );
}
