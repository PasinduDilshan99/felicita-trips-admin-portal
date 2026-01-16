import { VehicleIdNameResponse } from "@/types/vehicle-types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export class VehicleService {
  private static getAuthHeaders(): HeadersInit {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("auth-token") : null;

    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Get all vehicles (id and register number)
  static async getAllVehicles(): Promise<VehicleIdNameResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/felicita/api/v0/vehicles/names-and-ids`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: VehicleIdNameResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      throw error;
    }
  }
}