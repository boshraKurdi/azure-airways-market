import { apiGet, apiPatch, apiPost } from "./client";
import type {
  Booking,
  BookingResponse,
  BookingsResponse,
  CreateBookingRequest,
} from "@/lib/types/bookings";
import { transformFlight } from "./flights";
import type { BackendFlight } from "@/lib/types/flights";

type BackendBooking = Omit<Booking, "flight"> & { flight: BackendFlight };

function normalizeBooking(booking: BackendBooking): Booking {
  return { ...booking, flight: transformFlight(booking.flight) };
}

export async function getBookings(page = 1, limit = 20) {
  const response = await apiGet<BookingsResponse>(`/api/bookings?page=${page}&limit=${limit}`);
  return {
    bookings: (response.data ?? []).map((booking) => normalizeBooking(booking as BackendBooking)),
    pagination: response.pagination,
  };
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const response = await apiGet<BookingResponse>(`/api/bookings/${id}`);
  return response.data ? normalizeBooking(response.data as unknown as BackendBooking) : null;
}

export async function createBooking(data: CreateBookingRequest): Promise<Booking> {
  const response = await apiPost<BookingResponse | Booking>("/api/bookings", data);
  return "data" in response && response.data
    ? normalizeBooking(response.data as unknown as BackendBooking)
    : normalizeBooking(response as unknown as BackendBooking);
}

export async function cancelBooking(id: number | string): Promise<Booking | null> {
  const response = await apiPatch<BookingResponse | Booking>(`/api/bookings/${id}/cancel`);
  return "data" in response && response.data
    ? normalizeBooking(response.data as unknown as BackendBooking)
    : response
      ? normalizeBooking(response as unknown as BackendBooking)
      : null;
}