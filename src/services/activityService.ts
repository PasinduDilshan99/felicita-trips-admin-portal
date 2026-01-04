// services/activityService.ts
import {
  ActivityFilterParams,
  ApiResponse,
  SingleActivityApiResponse,
  ActivitiesForTerminateResponse,
  TerminateActivityApiResponse,
  AddActivityRequest,
  AddActivityApiResponse,
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
  static async getActivityById(id: number): Promise<SingleActivityApiResponse> {
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
      console.log("===============data=====================");
      console.log(data);
      console.log("====================================");
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

  // Get activities for termination
  static async getActivitiesForTerminate(): Promise<ActivitiesForTerminateResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/felicita/api/v0/activities/activity-for-terminate`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ActivitiesForTerminateResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching activities for terminate:", error);
      throw error;
    }
  }

  // Terminate activity
  static async terminateActivity(
    activityId: number
  ): Promise<TerminateActivityApiResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/felicita/api/v0/activities/terminate-activity`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ activityId }),
        }
      );

      const data: TerminateActivityApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to terminate activity");
      }

      return data;
    } catch (error) {
      console.error("Error terminating activity:", error);
      throw error;
    }
  }


    static async addActivity(
    activityData: AddActivityRequest
  ): Promise<AddActivityApiResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/felicita/api/v0/activities/add-activity`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify(activityData),
        }
      );

      const data: AddActivityApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to add activity");
      }

      return data;
    } catch (error) {
      console.error("Error adding activity:", error);
      throw error;
    }
  }

    // Validate activity form data
  static validateActivityForm(formData: any): Record<string, string> {
    const errors: Record<string, string> = {};

    // Required fields validation
    if (!formData.destinationId) errors.destinationId = "Destination is required";
    if (!formData.name?.trim()) errors.name = "Activity name is required";
    if (!formData.description?.trim()) errors.description = "Description is required";
    if (!formData.activitiesCategory) errors.activitiesCategory = "Category is required";
    if (formData.durationHours === null || formData.durationHours <= 0) 
      errors.durationHours = "Valid duration is required";
    if (!formData.availableFrom) errors.availableFrom = "Start time is required";
    if (!formData.availableTo) errors.availableTo = "End time is required";
    if (formData.priceLocal === null || formData.priceLocal < 0) 
      errors.priceLocal = "Valid local price is required";
    if (formData.priceForeigners === null || formData.priceForeigners < 0) 
      errors.priceForeigners = "Valid foreigner price is required";
    if (formData.minParticipate === null || formData.minParticipate < 1) 
      errors.minParticipate = "Minimum participants must be at least 1";
    if (formData.maxParticipate === null || formData.maxParticipate < 1) 
      errors.maxParticipate = "Maximum participants must be at least 1";
    
    // Validate min/max participants
    if (formData.minParticipate && formData.maxParticipate && 
        formData.minParticipate > formData.maxParticipate) {
      errors.maxParticipate = "Maximum participants must be greater than or equal to minimum";
    }

    // Validate time range
    if (formData.availableFrom && formData.availableTo && 
        formData.availableFrom >= formData.availableTo) {
      errors.availableTo = "End time must be after start time";
    }

    // Images validation
    if (!formData.images || formData.images.length === 0) {
      errors.images = "At least one image is required";
    }

    return errors;
  }

  // Helper to prepare activity data for submission
  static prepareActivityData(formData: any): AddActivityRequest {
    return {
      destinationId: formData.destinationId!,
      name: formData.name.trim(),
      description: formData.description.trim(),
      activitiesCategory: formData.activitiesCategory,
      durationHours: parseFloat(formData.durationHours!.toFixed(1)),
      availableFrom: formData.availableFrom,
      availableTo: formData.availableTo,
      priceLocal: formData.priceLocal!,
      priceForeigners: formData.priceForeigners!,
      minParticipate: formData.minParticipate!,
      maxParticipate: formData.maxParticipate!,
      season: formData.season,
      status: formData.status,
      images: formData.images.map((image: any) => ({
        ...image,
        name: image.name.trim(),
        description: image.description.trim(),
        status: image.status as "ACTIVE" | "INACTIVE",
      })),
      requirements: formData.requirements.map((req: any) => ({
        ...req,
        name: req.name.trim(),
        value: req.value.trim(),
        description: req.description.trim(),
        status: req.status as "ACTIVE" | "INACTIVE",
      })),
    };
  }

  // Get default form data
  static getDefaultFormData(): any {
    return {
      destinationId: null,
      name: "",
      description: "",
      activitiesCategory: "",
      durationHours: null,
      availableFrom: "08:00",
      availableTo: "17:00",
      priceLocal: null,
      priceForeigners: null,
      minParticipate: null,
      maxParticipate: null,
      season: "All year",
      status: "ACTIVE" as "ACTIVE" | "INACTIVE",
      images: [],
      requirements: [],
    };
  }





}
