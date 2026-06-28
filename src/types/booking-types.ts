// Add these to your existing types/booking-types.ts file

import { ApiResponse } from "./common-types";

// Booking ID and Reference Response
export interface BookingIdAndReference {
  bookingId: number;
  bookingReference: string;
}

export type BookingIdAndReferenceApiResponse = ApiResponse<
  BookingIdAndReference[]
>;
