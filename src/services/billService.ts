import {
  BookingBillingDetailsApiResponse,
  GetBookingBillingDetailsRequest,
} from "@/types/billing-types";
import { GET_BILLING_DETAILS_BY_BOOKING_ID_DATA_FE } from "@/utils/frontEndConstant";

export class BillingService {
  static async getBookingBillingDetails(
    bookingId: number,
  ): Promise<BookingBillingDetailsApiResponse> {
    try {
      const requestBody: GetBookingBillingDetailsRequest = { id: bookingId };

      const response = await fetch(GET_BILLING_DETAILS_BY_BOOKING_ID_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BookingBillingDetailsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to fetch booking billing details",
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching booking billing details:", error);
      throw error;
    }
  }

  /**
   * Helper method to format currency
   */
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  /**
   * Helper method to format date
   */
  static formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  /**
   * Helper method to format date with time
   */
  static formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  /**
   * Helper method to get payment status badge color
   */
  static getPaymentStatusColor(dueAmount: number, paidAmount: number): string {
    if (dueAmount === 0 && paidAmount > 0) {
      return "bg-green-100 text-green-800";
    } else if (paidAmount > 0 && dueAmount > 0) {
      return "bg-yellow-100 text-yellow-800";
    } else {
      return "bg-red-100 text-red-800";
    }
  }

  /**
   * Helper method to get payment status text
   */
  static getPaymentStatusText(dueAmount: number, paidAmount: number): string {
    if (dueAmount === 0 && paidAmount > 0) {
      return "Paid";
    } else if (paidAmount > 0 && dueAmount > 0) {
      return "Partially Paid";
    } else {
      return "Unpaid";
    }
  }

  /**
   * Helper method to get item type badge color
   */
  static getItemTypeColor(itemType: string): string {
    switch (itemType) {
      case "TOUR":
        return "bg-blue-100 text-blue-800";
      case "PACKAGE":
        return "bg-purple-100 text-purple-800";
      case "ACTIVITY":
        return "bg-green-100 text-green-800";
      case "HOTEL":
        return "bg-yellow-100 text-yellow-800";
      case "TRANSPORT":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  /**
   * Helper method to calculate tax percentage
   */
  static calculateTaxPercentage(taxAmount: number, subtotal: number): number {
    if (subtotal === 0) return 0;
    return (taxAmount / subtotal) * 100;
  }

  /**
   * Helper method to get discount percentage
   */
  static calculateDiscountPercentage(
    discountAmount: number,
    subtotal: number,
  ): number {
    if (subtotal === 0) return 0;
    return (discountAmount / subtotal) * 100;
  }

  /**
   * Helper method to get participant full name
   */
  static getParticipantFullName(participant: {
    firstName: string;
    lastName: string;
  }): string {
    return `${participant.firstName} ${participant.lastName}`.trim();
  }
}
