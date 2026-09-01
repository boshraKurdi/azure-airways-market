export type Airline = {
  id: number;
  name: string;
  code: string;
  logo?: string | null;
};

export type Airport = {
  id: number;
  name: string;
  city: string;
  country: string;
  code: string;
  timezone: string;
};

export type BackendFlight = {
  id: number | string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  price: string | number;
  currency?: string;
  totalSeats?: number;
  availableSeats?: number;
  airline: Airline;
  departureAirport: Airport;
  arrivalAirport: Airport;
};

export type Flight = {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  from: {
    code: string;
    city: string;
    airport: string;
    country: string;
  };
  to: {
    code: string;
    city: string;
    airport: string;
    country: string;
  };
  departDate: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  durationMinutes: number;
  stops: Array<{ airport: string; city: string; layover: string }>;
  price: number;
  currency: string;
  availableSeats: number;
  verifiedMinutesAgo: number;
};

export type SearchFlightsParams = {
  from?: string;
  to?: string;
  departureDate?: string;
  passengers?: number;
  minPrice?: number;
  maxPrice?: number;
  airline?: string;
  sortBy?: "cheapest" | "expensive" | "departure" | "latest";
  page?: number;
  limit?: number;
};

export type FlightsResponse = {
  data?: BackendFlight[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type FlightDetailsResponse = {
  data?: BackendFlight;
};
