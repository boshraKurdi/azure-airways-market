import { apiGet } from "./client";
import type {
  AirportsResponse,
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
  const backendLegs: BackendFlight[] = [];
  const visitedIds = new Set<string>();
  let currentFlight: BackendFlight | null | undefined = backendFlight;

  while (currentFlight && !visitedIds.has(String(currentFlight.id))) {
    visitedIds.add(String(currentFlight.id));
    backendLegs.push(currentFlight);
    currentFlight = currentFlight.nextFlight;
  }

  const legs = backendLegs.map((leg) => {
    const departure = new Date(leg.departureTime);
    const arrival = new Date(leg.arrivalTime);
    const durationMinutes = Math.max(0, (arrival.getTime() - departure.getTime()) / 60000);

    return {
      id: String(leg.id),
      airline: leg.airline?.name ?? "Airline",
      airlineCode: leg.airline?.code ?? "AI",
      flightNumber: leg.flightNumber,
      from: {
        code: leg.departureAirport?.code ?? "",
        city: leg.departureAirport?.city ?? "",
        airport: leg.departureAirport?.name ?? "",
        country: leg.departureAirport?.country ?? "",
      },
      to: {
        code: leg.arrivalAirport?.code ?? "",
        city: leg.arrivalAirport?.city ?? "",
        airport: leg.arrivalAirport?.name ?? "",
        country: leg.arrivalAirport?.country ?? "",
      },
      departDate: formatLocalDate(departure, leg.departureAirport?.timezone),
      arriveDate: formatLocalDate(arrival, leg.arrivalAirport?.timezone),
      departTime: formatTime(departure, leg.departureAirport?.timezone),
      arriveTime: formatTime(arrival, leg.arrivalAirport?.timezone),
      duration: formatDuration(durationMinutes),
    };
  });
  const firstLeg = legs[0]!;
  const finalLeg = legs[legs.length - 1]!;
  const departure = new Date(backendLegs[0]!.departureTime);
  const arrival = new Date(backendLegs[backendLegs.length - 1]!.arrivalTime);
  const durationMinutes = Math.max(0, (arrival.getTime() - departure.getTime()) / 60000);
  const departureDate = firstLeg.departDate;
  const departureTime = firstLeg.departTime;
  const arrivalTime = finalLeg.arriveTime;
  return {
    id: String(backendFlight.id),
    airline: firstLeg.airline,
    airlineCode: firstLeg.airlineCode,
    flightNumber: firstLeg.flightNumber,
    from: firstLeg.from,
    to: finalLeg.to,
    departDate: departureDate,
    departTime: departureTime,
    arriveTime: arrivalTime,
    duration: formatDuration(durationMinutes),
    durationMinutes,
    legs,
    stops: legs.slice(0, -1).map((leg, index) => ({
      airport: leg.to.code,
      city: leg.to.city,
      layover: legs[index + 1]!.departTime,
    })),
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
  const { to, ...originSearchParams } = params;
  const queryString = buildSearchParams(originSearchParams).toString();
  const endpoint = queryString ? `/api/flights/search?${queryString}` : "/api/flights/search";

  const response = await apiGet<FlightsResponse>(endpoint);
  const flights = Array.isArray(response?.data) ? response.data : [];
  const transformedFlights = flights.map(transformFlight);

  return to
    ? transformedFlights.filter((flight) => flight.to.code.toUpperCase() === to.toUpperCase())
    : transformedFlights;
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

export async function getAirports(): Promise<
  Array<{ code: string; city: string; airport: string; country: string }>
> {
  const response = await apiGet<AirportsResponse>("/api/flights/airports");

  return (response?.data ?? []).map(({ code, city, name, country }) => ({
    code,
    city,
    airport: name,
    country,
  }));
}
