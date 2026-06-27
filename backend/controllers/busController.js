import { Bus } from "../models/Bus.js";

const STOPS = ["Pune", "Mumbai", "Kolhapur", "Satara", "Sangli", "Nashik", "Nagpur"];

/** Sample buses inserted when collection is empty */
const SAMPLE_BUSES = [
  {
    busName: "BUS TRACK Express",
    busNumber: "BT-101",
    from: "Pune",
    to: "Mumbai",
    departureTime: "06:30",
    arrivalTime: "11:00",
    duration: "4h 30m",
    seatsAvailable: 32,
    price: 450,
    busType: "AC",
  },
  {
    busName: "Deccan Queen",
    busNumber: "DQ-202",
    from: "Pune",
    to: "Mumbai",
    departureTime: "18:00",
    arrivalTime: "22:15",
    duration: "4h 15m",
    seatsAvailable: 18,
    price: 520,
    busType: "AC",
  },
  {
    busName: "West Coast Travels",
    busNumber: "WC-303",
    from: "Mumbai",
    to: "Pune",
    departureTime: "07:00",
    arrivalTime: "11:30",
    duration: "4h 30m",
    seatsAvailable: 24,
    price: 480,
    busType: "Non-AC",
  },
  {
    busName: "Kolhapur Shuttle",
    busNumber: "KS-404",
    from: "Pune",
    to: "Kolhapur",
    departureTime: "09:15",
    arrivalTime: "14:45",
    duration: "5h 30m",
    seatsAvailable: 40,
    price: 380,
    busType: "Non-AC",
  },
  {
    busName: "Satara Swift",
    busNumber: "SS-505",
    from: "Pune",
    to: "Satara",
    departureTime: "10:00",
    arrivalTime: "12:30",
    duration: "2h 30m",
    seatsAvailable: 28,
    price: 220,
    busType: "Non-AC",
  },
  {
    busName: "Sangli Connect",
    busNumber: "SC-606",
    from: "Kolhapur",
    to: "Sangli",
    departureTime: "14:00",
    arrivalTime: "15:30",
    duration: "1h 30m",
    seatsAvailable: 35,
    price: 150,
    busType: "Non-AC",
  },
  {
    busName: "Nashik Navigator",
    busNumber: "NN-707",
    from: "Mumbai",
    to: "Nashik",
    departureTime: "06:00",
    arrivalTime: "10:30",
    duration: "4h 30m",
    seatsAvailable: 22,
    price: 410,
    busType: "AC",
  },
  {
    busName: "Vidarbha Volvo",
    busNumber: "VV-808",
    from: "Nashik",
    to: "Nagpur",
    departureTime: "20:00",
    arrivalTime: "06:00",
    duration: "10h",
    seatsAvailable: 36,
    price: 890,
    busType: "Sleeper",
  },
  {
    busName: "Orange Sleeper",
    busNumber: "OS-909",
    from: "Pune",
    to: "Nagpur",
    departureTime: "19:30",
    arrivalTime: "08:00",
    duration: "12h 30m",
    seatsAvailable: 12,
    price: 1200,
    busType: "Sleeper",
  },
  {
    busName: "Morning Star",
    busNumber: "MS-110",
    from: "Mumbai",
    to: "Kolhapur",
    departureTime: "08:30",
    arrivalTime: "16:00",
    duration: "7h 30m",
    seatsAvailable: 30,
    price: 650,
    busType: "Semi-Sleeper",
  },
  {
    busName: "Evening Glide",
    busNumber: "EG-220",
    from: "Pune",
    to: "Mumbai",
    departureTime: "17:45",
    arrivalTime: "22:30",
    duration: "4h 45m",
    seatsAvailable: 8,
    price: 499,
    busType: "AC",
  },
  {
    busName: "Budget Line",
    busNumber: "BL-330",
    from: "Satara",
    to: "Mumbai",
    departureTime: "11:00",
    arrivalTime: "16:30",
    duration: "5h 30m",
    seatsAvailable: 45,
    price: 299,
    busType: "Non-AC",
  },
  // Extra Pune → Mumbai for richer search results
  {
    busName: "City Link AC",
    busNumber: "CL-441",
    from: "Pune",
    to: "Mumbai",
    departureTime: "05:00",
    arrivalTime: "09:15",
    duration: "4h 15m",
    seatsAvailable: 26,
    price: 550,
    busType: "AC",
  },
  {
    busName: "Shivneri Semi-Sleeper",
    busNumber: "SH-442",
    from: "Pune",
    to: "Mumbai",
    departureTime: "12:00",
    arrivalTime: "16:45",
    duration: "4h 45m",
    seatsAvailable: 20,
    price: 420,
    busType: "Semi-Sleeper",
  },
  {
    busName: "Metro Cruiser",
    busNumber: "MC-443",
    from: "Pune",
    to: "Mumbai",
    departureTime: "15:30",
    arrivalTime: "20:00",
    duration: "4h 30m",
    seatsAvailable: 14,
    price: 460,
    busType: "AC",
  },
  {
    busName: "Neon Night Rider",
    busNumber: "NN-444",
    from: "Pune",
    to: "Mumbai",
    departureTime: "22:00",
    arrivalTime: "02:30",
    duration: "4h 30m",
    seatsAvailable: 10,
    price: 600,
    busType: "Sleeper",
  },
  {
    busName: "Rapid Express",
    busNumber: "RX-445",
    from: "Pune",
    to: "Mumbai",
    departureTime: "08:00",
    arrivalTime: "12:15",
    duration: "4h 15m",
    seatsAvailable: 33,
    price: 390,
    busType: "Non-AC",
  },
  {
    busName: "Skyline AC",
    busNumber: "SK-446",
    from: "Pune",
    to: "Mumbai",
    departureTime: "13:45",
    arrivalTime: "18:30",
    duration: "4h 45m",
    seatsAvailable: 16,
    price: 510,
    busType: "AC",
  },
  {
    busName: "Harbour Hopper",
    busNumber: "HH-447",
    from: "Pune",
    to: "Mumbai",
    departureTime: "16:15",
    arrivalTime: "21:00",
    duration: "4h 45m",
    seatsAvailable: 22,
    price: 475,
    busType: "AC",
  },
  {
    busName: "Sunrise Shuttle",
    busNumber: "SR-448",
    from: "Pune",
    to: "Mumbai",
    departureTime: "04:30",
    arrivalTime: "08:45",
    duration: "4h 15m",
    seatsAvailable: 40,
    price: 360,
    busType: "Non-AC",
  },
  {
    busName: "Twilight Travels",
    busNumber: "TT-449",
    from: "Pune",
    to: "Mumbai",
    departureTime: "21:00",
    arrivalTime: "01:30",
    duration: "4h 30m",
    seatsAvailable: 18,
    price: 540,
    busType: "Semi-Sleeper",
  },
  {
    busName: "Coastal Comfort",
    busNumber: "CC-450",
    from: "Pune",
    to: "Mumbai",
    departureTime: "11:30",
    arrivalTime: "16:00",
    duration: "4h 30m",
    seatsAvailable: 28,
    price: 430,
    busType: "AC",
  },
];

/** Seed DB if no buses exist */
export async function seedBusesIfEmpty() {
  const count = await Bus.countDocuments();
  if (count === 0) {
    await Bus.insertMany(SAMPLE_BUSES);
    console.log("Sample buses inserted");
  }
}

/** GET /api/buses – all buses, or filter with ?from=&to= */
export async function getBuses(req, res) {
  try {
    const { from, to } = req.query;
    const filter = {};
    if (from && to) {
      if (from === to) {
        return res.status(400).json({ message: "From and To must be different." });
      }
      filter.from = from;
      filter.to = to;
    } else {
      if (from) filter.from = from;
      if (to) filter.to = to;
    }
    const buses = await Bus.find(filter).sort({ price: 1, departureTime: 1 });
    return res.json({ buses, stops: STOPS, count: buses.length });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch buses." });
  }
}

/**
 * GET /api/buses/search?from=&to=&date=
 * Date is accepted for UX; filtering is by route.
 */
export async function searchBuses(req, res) {
  try {
    const { from, to } = req.query;
    if (!from || !to) {
      return res.status(400).json({ message: "From and To locations are required." });
    }
    if (from === to) {
      return res.status(400).json({ message: "From and To must be different." });
    }

    const buses = await Bus.find({ from, to }).sort({ price: 1, departureTime: 1 });
    return res.json({
      buses,
      from,
      to,
      date: req.query.date || null,
      count: buses.length,
      stops: STOPS,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Search failed." });
  }
}
