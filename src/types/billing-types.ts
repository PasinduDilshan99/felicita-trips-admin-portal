// types/booking-types.ts

import { ApiResponse } from "./common-types";

// Customer Details
export interface BookingCustomer {
  userId: number;
  fullName: string;
  email: string;
  mobileNumber: string;
}

// Tour Details
export interface BookingTour {
  tourId: number;
  tourName: string;
  duration: number;
  startLocation: string;
  endLocation: string;
  travelStartDate: string | null;
  travelEndDate: string | null;
  totalPersons: number;
}

// Package Details
export interface BookingPackageDetails {
  packageId: number;
  packageName: string | null;
  scheduleName: string | null;
}

// Billing Summary
export interface BillingSummary {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  insuranceAmount: number;
  finalAmount: number;
  paidAmount: number;
  dueAmount: number;
}

// Participant
export interface BookingParticipant {
  firstName: string;
  lastName: string;
  passportNumber: string;
}

// Price Breakdown Item
export interface PriceBreakdownItem {
  itemType: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// Booking Billing Details Response
export interface BookingBillingDetails {
  bookingId: number;
  bookingReference: string;
  bookingDate: string;
  customer: BookingCustomer;
  tour: BookingTour;
  packageDetails: BookingPackageDetails;
  billingSummary: BillingSummary;
  participants: BookingParticipant[];
  priceBreakdown: PriceBreakdownItem[];
}

export type BookingBillingDetailsApiResponse = ApiResponse<BookingBillingDetails>;

// Request type
export interface GetBookingBillingDetailsRequest {
  id: number;
}