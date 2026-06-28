import { BookingIdAndReferenceApiResponse } from "@/types/booking-types";
import { GET_BOOKINGS_ID_AND_REFERENCES_DATA_FE } from "@/utils/frontEndConstant";

export class BookingService {
  static async getBookingIdAndReferences(): Promise<BookingIdAndReferenceApiResponse> {
    try {
      const response = await fetch(GET_BOOKINGS_ID_AND_REFERENCES_DATA_FE, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BookingIdAndReferenceApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to fetch booking IDs and references",
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching booking IDs and references:", error);
      throw error;
    }
  }
}
