import { apiGet } from "./client";
import type {
  BackendFlight,
  Flight,
  FlightDetailsResponse,
  FlightsResponse,
  SearchFlightsParams,
} from "@/lib/types/flights";

const pad = (n: number) => String(n).padStart(2, "0");

const formatLocalDate = (date: Date, timeZone?: string) => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(date);
  const year = parts.find((p) => p.type === "year")?.value ?? "1970";
  const month = parts.find((p) => p.type === "month")?.value ?? "01";
  const day = parts.find((p) => p.type === "day")?.value ?? "01";
  return `${year}-${month}-${day}`;
};

const formatTime = (date: Date, timeZone?: string) => {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const value = formatter.format(date);
  return value.includes(":") ? value : `${value}:00`;
};

const formatDuration = (minutes: number) => {
  const safeMinutes = Math.max(0, Math.round(minutes));
  const hours = Math.floor(safeMinutes / 60);
  const remaining = safeMinutes % 60;

  if (!hours) return `${remaining}m`;
  if (!remaining) return `${hours}h`;
  return `${hours}h ${remaining}m`;
};

export function transformFlight(backendFlight: BackendFlight): Flight {
  const departure = new Date(backendFlight.departureTime);
  const arrival = new Date(backendFlight.arrivalTime);
  const departureAirport = backendFlight.departureAirport;
  const arrivalAirport = backendFlight.arrivalAirport;
  const durationMinutes = Math.max(0, (arrival.getTime() - departure.getTime()) / 60000);

  const departureDate = formatLocalDate(departure, departureAirport?.timezone);
  const departureTime = formatTime(departure, departureAirport?.timezone);
  const arrivalTime = formatTime(arrival, arrivalAirport?.timezone);

  return {
    id: String(backendFlight.id),
    airline: backendFlight.airline?.name ?? "Airline",
    airlineCode: backendFlight.airline?.code ?? "AI",
    flightNumber: backendFlight.flightNumber,
    from: {
      code: departureAirport?.code ?? "",
      city: departureAirport?.city ?? "",
      airport: departureAirport?.name ?? "",
      country: departureAirport?.country ?? "",
    },
    to: {
      code: arrivalAirport?.code ?? "",
      city: arrivalAirport?.city ?? "",
      airport: arrivalAirport?.name ?? "",
      country: arrivalAirport?.country ?? "",
    },
    departDate: departureDate,
    departTime: departureTime,
    arriveTime: arrivalTime,
    duration: formatDuration(durationMinutes),
    durationMinutes,
    stops: [],
    price: Number(backendFlight.price ?? 0),
    currency: backendFlight.currency ?? "USD",
    availableSeats: backendFlight.availableSeats ?? 0,
    verifiedMinutesAgo: 4,
  };
}

const buildSearchParams = (params: SearchFlightsParams = {}) => {
  const searchParams = new URLSearchParams();

  if (params.from) searchParams.set("from", params.from);
  if (params.to) searchParams.set("to", params.to);
  if (params.departureDate) searchParams.set("departureDate", params.departureDate);
  if (params.passengers) searchParams.set("passengers", String(params.passengers));
  if (params.minPrice !== undefined) searchParams.set("minPrice", String(params.minPrice));
  if (params.maxPrice !== undefined) searchParams.set("maxPrice", String(params.maxPrice));
  if (params.airline) searchParams.set("airline", params.airline);
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));

  return searchParams;
};

export async function getFlights(params: SearchFlightsParams = {}): Promise<Flight[]> {
  const queryString = buildSearchParams(params).toString();
  const endpoint = queryString ? `/api/flights?${queryString}` : "/api/flights";

  const response = await apiGet<FlightsResponse>(endpoint);
  const flights = Array.isArray(response?.data) ? response.data : [];

  return flights.map(transformFlight);
}

export async function searchFlights(params: SearchFlightsParams = {}): Promise<Flight[]> {
  const queryString = buildSearchParams(params).toString();
  const endpoint = queryString ? `/api/flights/search?${queryString}` : "/api/flights/search";

  const response = await apiGet<FlightsResponse>(endpoint);
  const flights = Array.isArray(response?.data) ? response.data : [];

  return flights.map(transformFlight);
}

export async function getFlightById(id: string): Promise<Flight | null> {
  try {
    const response = await apiGet<FlightDetailsResponse>(`/api/flights/${id}`);
    const flight = response?.data;
    return flight ? transformFlight(flight) : null;
  } catch {
    return null;
  }
}

export async function getAirports(): Promise<Array<{ code: string; city: string; airport: string; country: string }>> {
  const flights = await getFlights({ page: 1, limit: 200 });
  const map = new Map<string, { code: string; city: string; airport: string; country: string }>();

  flights.forEach((flight) => {
    const airportConfig = [
      {
        code: flight.from.code,
        city: flight.from.city,
        airport: flight.from.airport,
        country: flight.from.country,
      },
      {
        code: flight.to.code,
        city: flight.to.city,
        airport: flight.to.airport,
        country: flight.to.country,
      },
    ];

    airportConfig.forEach((airport) => {
      if (airport.code) {
        map.set(airport.code, airport);
      }
    });
  });

  return Array.from(map.values()).sort((a, b) => a.city.localeCompare(b.city));
}
