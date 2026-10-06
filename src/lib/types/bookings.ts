import type { Flight } from "./flights";

export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type BookingPassenger = {
  id?: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  nationality: string;
  passportNumber: string;
};

export type CreateBookingRequest = {
  flightId: number;
  contactPhone: string;
  adults: number;
  children: number;
  infants: number;
  passengers: BookingPassenger[];
};

export type Booking = {
  id: number;
  bookingReference: string;
  status: BookingStatus | string;
  paymentStatus: PaymentStatus | string;
  totalPrice: number | string;
  currency: string;
  contactPhone?: string | null;
  createdAt: string;
  flight: Flight;
  passengers: BookingPassenger[];
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type BookingsResponse = {
  data?: Booking[];
  pagination?: Pagination;
};

export type BookingResponse = {
  data?: Booking;
};