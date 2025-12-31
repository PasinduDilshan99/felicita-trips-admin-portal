// services/tourService.ts
import {
  TourFilterParams,
  ApiResponse,
  SingleTourApiResponse,
  AddTourRequest,
  UpdateTourRequest,
  Tour,
  Schedule
} from "@/types/tour-types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export class TourService {
  private static getAuthHeaders(): HeadersInit {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("auth-token") : null;

    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Fetch tours with filters
  static async getTours(
    params: TourFilterParams
  ): Promise<ApiResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/felicita/v0/api/tour/tours`,
        {
          method: "POST",
          headers: this.getAuthHeaders(),
          body: JSON.stringify({
            name: params.name || null,
            minPrice: params.minPrice || null,
            maxPrice: params.maxPrice || null,
            duration: params.duration || null,
            tourType: params.tourType || null,
            tourCategory: params.tourCategory || null,
            season: params.season || null,
            location: params.location || null,
            pageNumber: params.pageNumber,
            pageSize: params.pageSize,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching tours:", error);
      throw error;
    }
  }

  // Get single tour by ID
  static async getTourById(
    id: number
  ): Promise<SingleTourApiResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/felicita/v0/api/tour/${id}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SingleTourApiResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching tour:", error);
      throw error;
    }
  }

  // Helper methods to extract unique values for filters
  static extractTourTypes(tours: Tour[]): string[] {
    const types = tours.map((tour) => tour.tourTypeName);
    return Array.from(new Set(types)).filter(Boolean);
  }

  static extractTourCategories(tours: Tour[]): string[] {
    const categories = tours.map((tour) => tour.tourCategoryName);
    return Array.from(new Set(categories)).filter(Boolean);
  }

  static extractSeasons(tours: Tour[]): string[] {
    const seasons = tours.map((tour) => tour.seasonName);
    return Array.from(new Set(seasons)).filter(Boolean);
  }

  static extractLocations(tours: Tour[]): string[] {
    const locations: string[] = [];
    tours.forEach((tour) => {
      locations.push(tour.startLocation);
      locations.push(tour.endLocation);
    });
    return Array.from(new Set(locations)).filter(Boolean);
  }

  // Get available tour types (static list or from API)
  static async getTourTypes(): Promise<string[]> {
    return [
      "Adventure",
      "Cultural",
      "Wildlife",
      "Beach",
      "Food & Dining",
      "Historical",
      "Photography",
      "Wellness",
      "Educational",
      "Religious",
    ];
  }

  // Get available tour categories
  static async getTourCategories(): Promise<string[]> {
    return [
      "Solo",
      "Budget",
      "Family",
      "Group",
      "Luxury",
      "Corporate",
      "Honeymoon",
      "Backpacker",
      "Custom",
      "Private",
    ];
  }

  // Get available seasons
  static async getSeasons(): Promise<string[]> {
    return [
      "Spring",
      "Summer",
      "Winter",
      "Monsoon",
      "Fall",
      "Dry Season",
      "Rainy Season",
      "Peak Season",
      "Off Season",
    ];
  }

  // Add new tour
  static async addTour(
    tourData: AddTourRequest
  ): Promise<any> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/felicita/v0/api/tour/add-tour`,
        {
          method: "POST",
          headers: this.getAuthHeaders(),
          body: JSON.stringify(tourData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error adding tour:", error);
      throw error;
    }
  }

  // Update tour
  static async updateTour(
    tourData: UpdateTourRequest
  ): Promise<any> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/felicita/v0/api/tour/update-tour`,
        {
          method: "POST",
          headers: this.getAuthHeaders(),
          body: JSON.stringify(tourData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating tour:", error);
      throw error;
    }
  }

  // Delete/terminate tour
  static async deleteTour(
    tourId: number
  ): Promise<any> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/felicita/v0/api/tour/delete-tour/${tourId}`,
        {
          method: "DELETE",
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting tour:", error);
      throw error;
    }
  }

  // Get upcoming schedules (optional)
  static getUpcomingSchedules(tour: Tour): Schedule[] {
    const today = new Date();
    return tour.schedules.filter(schedule => {
      const endDate = new Date(schedule.assumeEndDate);
      return endDate >= today;
    });
  }

  // Calculate schedule count for the next 3 months
  static getScheduleCountForNextMonths(tour: Tour, months: number = 3): number {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setMonth(today.getMonth() + months);
    
    return tour.schedules.filter(schedule => {
      const startDate = new Date(schedule.assumeStartDate);
      return startDate <= futureDate;
    }).length;
  }
}