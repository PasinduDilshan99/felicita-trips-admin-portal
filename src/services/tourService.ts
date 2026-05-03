// services/tourService.ts
import {
  TourFilterParams,
  SingleTourApiResponse,
  Tour,
  Schedule,
  ToursForTerminateResponse,
  TerminateTourApiResponse,
  AddTourRequest,
  AddTourApiResponse,
  TourAllDetailsResponse,
  UpdateTourRequest,
  UpdateTourApiResponse,
  TourNameIdResponse,
  TourFilterApiResponse,
  TourTypeStatisticsApiResponse,
  TourCategoryStatisticsApiResponse,
  TourStatisticsApiResponse,
  TourScheduleStatisticsApiResponse,
  TourDetailsResponse,
} from "@/types/tour-types";
import {
  CREATE_TOUR_DATA_FE,
  GET_TOUR_ALL_DETAILS_BY_ID_DATA_FE,
  GET_TOUR_CATEGORY_STATISTICS_DATA_FE,
  GET_TOUR_DETAILS_BY_ID_DATA_FE,
  GET_TOUR_DETAILS_FOR_PACKAGE_DATA_FE,
  GET_TOUR_IDS_AND_NAMES_DATA_FE,
  GET_TOUR_SCHEDULE_STATISTICS_DATA_FE,
  GET_TOUR_STATISTICS_DATA_FE,
  GET_TOUR_TYPE_STATISTICS_DATA_FE,
  GET_TOURS_DETAILS_BY_REQUEST_DATA_FE,
  GET_TOURS_FOR_TERMINATE_DATA_FE,
  TERMINATE_TOUR_DATA_FE,
  UPDATE_TOUR_DATA_FE,
} from "@/utils/frontEndConstant";

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
    params: TourFilterParams,
  ): Promise<TourFilterApiResponse> {
    try {
      const response = await fetch(GET_TOURS_DETAILS_BY_REQUEST_DATA_FE, {
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
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TourFilterApiResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching tours:", error);
      throw error;
    }
  }

  // Get single tour by ID
  static async getTourById(id: number): Promise<SingleTourApiResponse> {
    try {
      const response = await fetch(`${GET_TOUR_DETAILS_BY_ID_DATA_FE}/${id}`, {
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
      const response = await fetch(GET_TOURS_FOR_TERMINATE_DATA_FE, {
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

      const data: ToursForTerminateResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching tours for terminate:", error);
      throw error;
    }
  }

  // Terminate tour
  static async terminateTour(
    tourId: number,
  ): Promise<TerminateTourApiResponse> {
    try {
      const response = await fetch(TERMINATE_TOUR_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ tourId }),
      });

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

  // Add new tour
  static async addTour(tourData: AddTourRequest): Promise<AddTourApiResponse> {
    try {
      const response = await fetch(CREATE_TOUR_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(tourData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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
      const response = await fetch(GET_TOUR_IDS_AND_NAMES_DATA_FE, {
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

      const data: TourNameIdResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching tour names:", error);
      throw error;
    }
  }

  // Get all tour details by ID
  static async getTourAllDetails(id: number): Promise<TourAllDetailsResponse> {
    try {
      const response = await fetch(
        `${GET_TOUR_ALL_DETAILS_BY_ID_DATA_FE}/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TourAllDetailsResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching tour all details:", error);
      throw error;
    }
  }

  // Update tour
  static async updateTour(
    tourData: UpdateTourRequest,
  ): Promise<UpdateTourApiResponse> {
    try {
      const response = await fetch(UPDATE_TOUR_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(tourData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: UpdateTourApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to update tour");
      }

      return data;
    } catch (error) {
      console.error("Error updating tour:", error);
      throw error;
    }
  }

  // Add these methods to the TourService class

  /**
   * Get tour statistics including popularity, booking status, category performance,
   * type distribution, location distribution, and summary
   */
  static async getTourStatistics(): Promise<TourStatisticsApiResponse> {
    try {
      const response = await fetch(GET_TOUR_STATISTICS_DATA_FE, {
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

      const data: TourStatisticsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch tour statistics");
      }

      return data;
    } catch (error) {
      console.error("Error fetching tour statistics:", error);
      throw error;
    }
  }

  /**
   * Get tour schedule statistics including timeline, duration distribution,
   * execution performance, rating overview, and participation trends
   */
  static async getTourScheduleStatistics(): Promise<TourScheduleStatisticsApiResponse> {
    try {
      const response = await fetch(GET_TOUR_SCHEDULE_STATISTICS_DATA_FE, {
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

      const data: TourScheduleStatisticsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to fetch tour schedule statistics",
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching tour schedule statistics:", error);
      throw error;
    }
  }

  /**
   * Get tour category statistics including distribution, booking performance,
   * rating overview, primary/secondary usage, and participation impact
   */
  static async getTourCategoryStatistics(): Promise<TourCategoryStatisticsApiResponse> {
    try {
      const response = await fetch(GET_TOUR_CATEGORY_STATISTICS_DATA_FE, {
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

      const data: TourCategoryStatisticsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to fetch tour category statistics",
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching tour category statistics:", error);
      throw error;
    }
  }

  static async getTourDetailsForPackage(
    tourId: number,
  ): Promise<TourDetailsResponse> {
    try {
      const response = await fetch(
        `${GET_TOUR_DETAILS_FOR_PACKAGE_DATA_FE}/${tourId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TourDetailsResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching tour details:", error);
      throw error;
    }
  }

  /**
   * Get tour type statistics including distribution, booking performance,
   * rating overview, participation impact, and primary/secondary usage
   */
  static async getTourTypeStatistics(): Promise<TourTypeStatisticsApiResponse> {
    try {
      const response = await fetch(GET_TOUR_TYPE_STATISTICS_DATA_FE, {
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

      const data: TourTypeStatisticsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch tour type statistics");
      }

      return data;
    } catch (error) {
      console.error("Error fetching tour type statistics:", error);
      throw error;
    }
  }
}
