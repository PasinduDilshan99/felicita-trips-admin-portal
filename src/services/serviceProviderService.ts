import { ServiceProviderIdNameResponse } from "@/types/service-provider-types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export class ServiceProviderService {
  private static getAuthHeaders(): HeadersInit {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("auth-token") : null;

    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Get all service providers (id and name) - includes hotels
  static async getAllServiceProviders(): Promise<ServiceProviderIdNameResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/felicita/api/v0/service-provider/names-and-ids`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ServiceProviderIdNameResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching service providers:", error);
      throw error;
    }
  }
}