// services/destinationService.ts
import {
  DestinationFilterParams,
  DestinationApiResponse,
  Destination,
  SingleDestinationApiResponse,
  AddDestinationRequest,
  AddDestinationApiResponse,
  TerminateDestinationApiResponse,
  DestinationsForTerminateResponse,
  UpdateDestinationRequest,
  UpdateDestinationApiResponse,
} from "@/types/destination-types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export class DestinationService {
  private static getAuthHeaders(): HeadersInit {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("auth-token") : null;

    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  static async getDestinations(
    params: DestinationFilterParams
  ): Promise<DestinationApiResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/felicita/api/v0/destination/destinations`,
        {
          method: "POST",
          headers: this.getAuthHeaders(),
          body: JSON.stringify({
            name: params.name || null,
            minPrice: params.minPrice || null,
            maxPrice: params.maxPrice || null,
            duration: params.duration || null,
            destinationCategory: params.destinationCategory || null,
            season: params.season || null,
            status: params.status || null,
            pageSize: params.pageSize,
            pageNumber: params.pageNumber,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: DestinationApiResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching destinations:", error);
      throw error;
    }
  }

  // Helper method to get unique categories from destinations
  // static extractCategories(destinations: Destination[]): string[] {
  //   const categories = destinations.map((dest) => dest.categoryName);
  //   return Array.from(new Set(categories));
  // }

  // Helper method to get unique seasons from activities
  static extractSeasons(destinations: Destination[]): string[] {
    const allSeasons: string[] = [];
    destinations.forEach((dest) => {
      dest.activities.forEach((activity) => {
        const seasons = activity.season.split(",").map((s) => s.trim());
        allSeasons.push(...seasons);
      });
    });
    return Array.from(new Set(allSeasons));
  }

  static async getDestinationById(
    id: number
  ): Promise<SingleDestinationApiResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/felicita/api/v0/destination/${id}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SingleDestinationApiResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching destination:", error);
      throw error;
    }
  }

  static async addDestination(
    destinationData: AddDestinationRequest
  ): Promise<AddDestinationApiResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/felicita/api/v0/destination/add-destination`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify(destinationData),
        }
      );

      const data: AddDestinationApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to add destination");
      }

      return data;
    } catch (error) {
      console.error("Error adding destination:", error);
      throw error;
    }
  }

  static async getDestinationsForTerminate(): Promise<DestinationsForTerminateResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/felicita/api/v0/destination/destination-for-terminate`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: DestinationsForTerminateResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching destinations for terminate:", error);
      throw error;
    }
  }

  static async terminateDestination(
    destinationId: number
  ): Promise<TerminateDestinationApiResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/felicita/api/v0/destination/terminate-destination`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ destinationId }),
        }
      );
      const data: TerminateDestinationApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to terminate destination");
      }

      return data;
    } catch (error) {
      console.error("Error terminating destination:", error);
      throw error;
    }
  }

  static async updateDestination(
    destinationData: UpdateDestinationRequest
  ): Promise<UpdateDestinationApiResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/felicita/api/v0/destination/update-destination`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify(destinationData),
        }
      );

      const data: UpdateDestinationApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to update destination");
      }

      return data;
    } catch (error) {
      console.error("Error updating destination:", error);
      throw error;
    }
  }

  // Get available activity categories
  static async getActivityCategories(): Promise<string[]> {
    // Implement based on your API
    return [
      "Adventure",
      "Hiking",
      "Cultural",
      "Wildlife",
      "Water Sports",
      "Photography",
      "Food & Dining",
    ];
  }

  // Get available seasons
  static getSeasons(): string[] {
    return ["Summer", "Winter", "Spring", "Monsoon"];
  }

  static async getCategories(): Promise<string[]> {
    return ["Adventure", "Wildlife", "Cultural", "Beach", "Historical"];
  }
}
