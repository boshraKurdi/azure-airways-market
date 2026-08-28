export type Stop = {
  airport: string;
  city: string;
  layover: string;
};

export type Flight = {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  from: { code: string; city: string; airport: string; country: string };
  to: { code: string; city: string; airport: string; country: string };
  departDate: string;
  departTime: string;
  arriveTime: string;
  arriveOffset?: string;
  duration: string;
  durationMinutes: number;
  stops: Stop[];
  cabin: "Economy" | "Premium Economy" | "Business";
  baggage: { cabin: string; checked: string };
  price: number;
  currency: string;
  seatsLeft: number;
  verifiedMinutesAgo: number;
  recommended?: boolean;
  tag?: string;
};

export const airlines = [
  "Turkish Airlines",
  "Qatar Airways",
  "Emirates",
  "Egyptair",
  "Royal Jordanian",
  "Pegasus",
  "Etihad Airways",
];

export const airports = [
  { code: "DAM", city: "Damascus", airport: "Damascus Intl", country: "Syria" },
  { code: "IST", city: "Istanbul", airport: "Istanbul Airport", country: "Türkiye" },
  { code: "DXB", city: "Dubai", airport: "Dubai Intl", country: "UAE" },
  { code: "DOH", city: "Doha", airport: "Hamad Intl", country: "Qatar" },
  { code: "CAI", city: "Cairo", airport: "Cairo Intl", country: "Egypt" },
  { code: "BEY", city: "Beirut", airport: "Rafic Hariri Intl", country: "Lebanon" },
  { code: "AMM", city: "Amman", airport: "Queen Alia Intl", country: "Jordan" },
  { code: "CDG", city: "Paris", airport: "Charles de Gaulle", country: "France" },
  { code: "LHR", city: "London", airport: "Heathrow", country: "United Kingdom" },
  { code: "BER", city: "Berlin", airport: "Brandenburg", country: "Germany" },
];

const ap = (code: string) => airports.find((a) => a.code === code)!;

export const flights: Flight[] = [
  {
    id: "SK-1042",
    airline: "Turkish Airlines",
    airlineCode: "TK",
    flightNumber: "TK 823",
    from: ap("DAM"),
    to: ap("IST"),
    departDate: "2026-09-12",
    departTime: "07:20",
    arriveTime: "09:45",
    duration: "2h 25m",
    durationMinutes: 145,
    stops: [],
    cabin: "Economy",
    baggage: { cabin: "8 kg", checked: "23 kg" },
    price: 189,
    currency: "USD",
    seatsLeft: 6,
    verifiedMinutesAgo: 4,
    recommended: true,
    tag: "Best value",
  },
  {
    id: "SK-2210",
    airline: "Qatar Airways",
    airlineCode: "QR",
    flightNumber: "QR 419",
    from: ap("DAM"),
    to: ap("DOH"),
    departDate: "2026-09-12",
    departTime: "13:10",
    arriveTime: "17:05",
    duration: "3h 55m",
    durationMinutes: 235,
    stops: [],
    cabin: "Economy",
    baggage: { cabin: "7 kg", checked: "30 kg" },
    price: 246,
    currency: "USD",
    seatsLeft: 12,
    verifiedMinutesAgo: 9,
  },
  {
    id: "SK-3388",
    airline: "Emirates",
    airlineCode: "EK",
    flightNumber: "EK 914",
    from: ap("BEY"),
    to: ap("DXB"),
    departDate: "2026-09-14",
    departTime: "02:40",
    arriveTime: "08:05",
    duration: "4h 25m",
    durationMinutes: 265,
    stops: [],
    cabin: "Economy",
    baggage: { cabin: "7 kg", checked: "30 kg" },
    price: 212,
    currency: "USD",
    seatsLeft: 3,
    verifiedMinutesAgo: 2,
    tag: "Almost gone",
  },
  {
    id: "SK-4501",
    airline: "Egyptair",
    airlineCode: "MS",
    flightNumber: "MS 712",
    from: ap("CAI"),
    to: ap("IST"),
    departDate: "2026-09-16",
    departTime: "09:55",
    arriveTime: "13:20",
    duration: "3h 25m",
    durationMinutes: 205,
    stops: [],
    cabin: "Economy",
    baggage: { cabin: "8 kg", checked: "23 kg" },
    price: 168,
    currency: "USD",
    seatsLeft: 18,
    verifiedMinutesAgo: 11,
    tag: "Cheapest",
  },
  {
    id: "SK-5140",
    airline: "Royal Jordanian",
    airlineCode: "RJ",
    flightNumber: "RJ 182",
    from: ap("AMM"),
    to: ap("CDG"),
    departDate: "2026-09-18",
    departTime: "08:30",
    arriveTime: "13:10",
    duration: "5h 40m",
    durationMinutes: 340,
    stops: [],
    cabin: "Economy",
    baggage: { cabin: "8 kg", checked: "23 kg" },
    price: 389,
    currency: "USD",
    seatsLeft: 9,
    verifiedMinutesAgo: 6,
  },
  {
    id: "SK-6023",
    airline: "Pegasus",
    airlineCode: "PC",
    flightNumber: "PC 634",
    from: ap("IST"),
    to: ap("BER"),
    departDate: "2026-09-20",
    departTime: "16:45",
    arriveTime: "19:00",
    duration: "3h 15m",
    durationMinutes: 195,
    stops: [],
    cabin: "Economy",
    baggage: { cabin: "8 kg", checked: "20 kg" },
    price: 134,
    currency: "USD",
    seatsLeft: 21,
    verifiedMinutesAgo: 14,
    tag: "Cheapest",
  },
  {
    id: "SK-7712",
    airline: "Etihad Airways",
    airlineCode: "EY",
    flightNumber: "EY 342",
    from: ap("DAM"),
    to: ap("LHR"),
    departDate: "2026-09-12",
    departTime: "05:15",
    arriveTime: "17:40",
    arriveOffset: "+0",
    duration: "14h 25m",
    durationMinutes: 865,
    stops: [{ airport: "AUH", city: "Abu Dhabi", layover: "4h 10m" }],
    cabin: "Economy",
    baggage: { cabin: "7 kg", checked: "23 kg" },
    price: 462,
    currency: "USD",
    seatsLeft: 7,
    verifiedMinutesAgo: 3,
  },
  {
    id: "SK-8890",
    airline: "Turkish Airlines",
    airlineCode: "TK",
    flightNumber: "TK 1975",
    from: ap("DAM"),
    to: ap("BER"),
    departDate: "2026-09-12",
    departTime: "11:05",
    arriveTime: "20:35",
    duration: "10h 30m",
    durationMinutes: 630,
    stops: [{ airport: "IST", city: "Istanbul", layover: "3h 05m" }],
    cabin: "Economy",
    baggage: { cabin: "8 kg", checked: "23 kg" },
    price: 341,
    currency: "USD",
    seatsLeft: 14,
    verifiedMinutesAgo: 7,
  },
  {
    id: "SK-9134",
    airline: "Qatar Airways",
    airlineCode: "QR",
    flightNumber: "QR 118",
    from: ap("DOH"),
    to: ap("LHR"),
    departDate: "2026-09-22",
    departTime: "01:20",
    arriveTime: "06:55",
    duration: "7h 35m",
    durationMinutes: 455,
    stops: [],
    cabin: "Business",
    baggage: { cabin: "10 kg", checked: "40 kg" },
    price: 1180,
    currency: "USD",
    seatsLeft: 4,
    verifiedMinutesAgo: 5,
  },
];

export const getFlight = (id: string) => flights.find((f) => f.id === id) ?? flights[0]!;

export type BookingStatus = "upcoming" | "completed" | "cancelled";

export type Booking = {
  reference: string;
  flightId: string;
  status: BookingStatus;
  passengers: number;
  total: number;
  paymentStatus: "Paid" | "Pending" | "Refunded";
  passengerName: string;
};

export const bookings: Booking[] = [
  {
    reference: "SKY-8FQ2ML",
    flightId: "SK-1042",
    status: "upcoming",
    passengers: 2,
    total: 402,
    paymentStatus: "Paid",
    passengerName: "Boshra Kurdi",
  },
  {
    reference: "SKY-3TR9AZ",
    flightId: "SK-7712",
    status: "upcoming",
    passengers: 1,
    total: 486,
    paymentStatus: "Pending",
    passengerName: "Boshra Kurdi",
  },
  {
    reference: "SKY-1KD4PW",
    flightId: "SK-4501",
    status: "completed",
    passengers: 1,
    total: 180,
    paymentStatus: "Paid",
    passengerName: "Boshra Kurdi",
  },
  {
    reference: "SKY-6ZM7QX",
    flightId: "SK-6023",
    status: "cancelled",
    passengers: 3,
    total: 426,
    paymentStatus: "Refunded",
    passengerName: "Boshra Kurdi",
  },
];

export const formatPrice = (value: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);

export const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
