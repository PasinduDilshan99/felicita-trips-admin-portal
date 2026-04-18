// services/tourService.ts
import {
  TourFilterParams,
  ApiResponse,
  SingleTourApiResponse,
  Tour,
  Schedule,
  ToursForTerminateResponse,
  TerminateTourApiResponse,
  AddTourRequest,
  DestinationDetailsResponse,
  AddTourApiResponse,
  EmployeeAssignResponse,
  DestinationsForTourResponse,
  TourAllDetailsResponse,
  UpdateTourRequest,
  UpdateTourApiResponse,
  TourNameIdResponse,
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
  static async getTours(params: TourFilterParams): Promise<ApiResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/felicita/api/v0/tour/tours`,
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
  static async getTourById(id: number): Promise<SingleTourApiResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/felicita/api/v0/tour/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",        }
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

  // Get tours for termination
  static async getToursForTerminate(): Promise<ToursForTerminateResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/felicita/api/v0/tour/tour-for-terminate`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ToursForTerminateResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching tours for terminate:", error);
      throw error;
    }
  }

  // Terminate tour
  static async terminateTour(
    tourId: number
  ): Promise<TerminateTourApiResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/felicita/api/v0/tour/terminate-tour`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ tourId }),
        }
      );

      const data: TerminateTourApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to terminate tour");
      }

      return data;
    } catch (error) {
      console.error("Error terminating tour:", error);
      throw error;
    }
  }

  // services/tourService.ts - Add these methods to your existing TourService class

  // Get employees for tour assignment
  static async getEmployeesForTourAssignment(): Promise<EmployeeAssignResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/felicita/api/v0/employee/employee-details-for-assign-tour`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: EmployeeAssignResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching employees for tour assignment:", error);
      throw error;
    }
  }

  // Get destination names for tour creation
  static async getDestinationNames(): Promise<DestinationsForTourResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/felicita/api/v0/destination/destination-names`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: DestinationsForTourResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching destination names:", error);
      throw error;
    }
  }

  // Get destination details with activities
  static async getDestinationDetails(
    destinationId: number
  ): Promise<DestinationDetailsResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/felicita/api/v0/destination/${destinationId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: DestinationDetailsResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching destination details:", error);
      throw error;
    }
  }

  // Add new tour
  static async addTour(tourData: AddTourRequest): Promise<AddTourApiResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/felicita/api/v0/tour/add-tour`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify(tourData),
        }
      );

      const data: AddTourApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to add tour");
      }

      return data;
    } catch (error) {
      console.error("Error adding tour:", error);
      throw error;
    }
  }

  // Get upcoming schedules (optional)
  static getUpcomingSchedules(tour: Tour): Schedule[] {
    const today = new Date();
    return tour.schedules.filter((schedule) => {
      const endDate = new Date(schedule.assumeEndDate);
      return endDate >= today;
    });
  }

  // Calculate schedule count for the next 3 months
  static getScheduleCountForNextMonths(tour: Tour, months: number = 3): number {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setMonth(today.getMonth() + months);

    return tour.schedules.filter((schedule) => {
      const startDate = new Date(schedule.assumeStartDate);
      return startDate <= futureDate;
    }).length;
  }

  // Add these methods to your existing TourService class

// Get all tour names and IDs for search
static async getAllTourNames(): Promise<TourNameIdResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/felicita/api/v0/tour/tourId-and-tourName`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: TourNameIdResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching tour names:', error);
    throw error;
  }
}

// Get all tour details by ID
static async getTourAllDetails(id: number): Promise<TourAllDetailsResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/felicita/api/v0/tour/tout-all-details/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: TourAllDetailsResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching tour all details:', error);
    throw error;
  }
}

// Update tour
static async updateTour(tourData: UpdateTourRequest): Promise<UpdateTourApiResponse> {
  try {
    console.log('===================tourData=================');
    console.log(tourData);
    console.log('====================================');
    const response = await fetch(
      `${API_BASE_URL}/felicita/api/v0/tour/update-tour`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(tourData),
      }
    );

    const data: UpdateTourApiResponse = await response.json();

    if (data.code !== 200) {
      throw new Error(data.message || 'Failed to update tour');
    }

    return data;
  } catch (error) {
    console.error('Error updating tour:', error);
    throw error;
  }
}


}
