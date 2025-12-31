// services/activityService.ts
import {
  ActivityFilterParams,
  ApiResponse,
  SingleActivityApiResponse,
  AddActivityRequest,
  UpdateActivityRequest
} from "@/types/activity-types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export class ActivityService {
  private static getAuthHeaders(): HeadersInit {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("auth-token") : null;

    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Fetch activities with filters
  static async getActivities(
    params: ActivityFilterParams
  ): Promise<ApiResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/felicita/api/v0/activities/activities`,
        {
          method: "POST",
          headers: this.getAuthHeaders(),
          body: JSON.stringify({
            name: params.name || null,
            minPrice: params.minPrice || null,
            maxPrice: params.maxPrice || null,
            duration: params.duration || null,
            activityCategory: params.activityCategory || null,
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

      const data: ApiResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching activities:", error);
      throw error;
    }
  }

  // Get single activity by ID
  static async getActivityById(
    id: number
  ): Promise<SingleActivityApiResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/felicita/api/v0/activities/${id}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SingleActivityApiResponse = await response.json();
      console.log('===============data=====================');
      console.log(data);
      console.log('====================================');
      return data;
    } catch (error) {
      console.error("Error fetching activity:", error);
      throw error;
    }
  }

  // Helper methods to extract unique values for filters
  static extractCategories(activities: any[]): string[] {
    const categories = activities.map((act) => act.activities_category);
    return Array.from(new Set(categories)).filter(Boolean);
  }

  static extractSeasons(activities: any[]): string[] {
    const allSeasons: string[] = [];
    activities.forEach((activity) => {
      const seasons = activity.season.split(",").map((s: string) => s.trim());
      allSeasons.push(...seasons);
    });
    return Array.from(new Set(allSeasons)).filter(Boolean);
  }

  // Get available categories (static list or from API)
  static async getActivityCategories(): Promise<string[]> {
    return [
      "Adventure",
      "Hiking",
      "Cultural",
      "Wildlife",
      "Water Sports",
      "Photography",
      "Food & Dining",
      "Wellness",
      "Educational",
      "Religious",
    ];
  }

  // Get available seasons
  static getSeasons(): string[] {
    return ["Summer", "Winter", "Spring", "Monsoon", "Fall", "Dry Season"];
  }

  // Add new activity
  static async addActivity(
    activityData: AddActivityRequest
  ): Promise<any> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/felicita/v0/api/activities/add-activity`,
        {
          method: "POST",
          headers: this.getAuthHeaders(),
          body: JSON.stringify(activityData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error adding activity:", error);
      throw error;
    }
  }

  // Update activity
  static async updateActivity(
    activityData: UpdateActivityRequest
  ): Promise<any> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/felicita/v0/api/activities/update-activity`,
        {
          method: "POST",
          headers: this.getAuthHeaders(),
          body: JSON.stringify(activityData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating activity:", error);
      throw error;
    }
  }

  // Delete/terminate activity
  static async deleteActivity(
    activityId: number
  ): Promise<any> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/felicita/v0/api/activities/delete-activity/${activityId}`,
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
      console.error("Error deleting activity:", error);
      throw error;
    }
  }
}