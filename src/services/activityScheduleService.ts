// services/activityScheduleService.ts

import {
  ActivityScheduleListApiResponse,
  ActivityScheduleFilterParams,
  ActivityScheduleParamsApiResponse,
  ActivityScheduleDetailsApiResponse,
  CreateActivityScheduleRequest,
  CreateActivityScheduleApiResponse,
  UpdateActivityScheduleRequest,
  UpdateActivityScheduleApiResponse,
  TerminateActivityScheduleApiResponse,
  GetActivityScheduleDetailsRequest,
  TerminateActivityScheduleRequest,
} from "@/types/activity-schedule-types";
import {
  ADD_ACTIVITY_SCHEDULE_DATA_FE,
  GET_ACTIVITY_SCHEDULE_DATA_FE,
  GET_ACTIVITY_SCHEDULE_DETAILS_BY_ID_DATA_FE,
  GET_ACTIVITY_SCHEDULE_PARAMS_FOR_REQUEST_DATA_FE,
  TERMINATE_ACTIVITY_SCHEDULE_DATA_FE,
  UPDATE_ACTIVITY_SCHEDULE_DATA_FE,
} from "@/utils/frontEndConstant";

export class ActivityScheduleService {
  /**
   * Get activity schedules with pagination and filtering
   */
  static async getActivitySchedules(
    params: ActivityScheduleFilterParams,
  ): Promise<ActivityScheduleListApiResponse> {
    try {
      const response = await fetch(GET_ACTIVITY_SCHEDULE_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: params.name || null,
          duration: params.duration || null,
          activityId: params.activityId || null,
          destinationId: params.destinationId || null,
          packageScheduleId: params.packageScheduleId || null,
          tourScheduleId: params.tourScheduleId || null,
          activityCategory: params.activityCategory || null,
          fromDate: params.fromDate || null,
          toDate: params.toDate || null,
          season: params.season || null,
          status: params.status || null,
          pageSize: params.pageSize,
          pageNumber: params.pageNumber,
          sortBy: params.sortBy,
          sortDirection: params.sortDirection,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ActivityScheduleListApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch activity schedules");
      }

      return data;
    } catch (error) {
      console.error("Error fetching activity schedules:", error);
      throw error;
    }
  }

  /**
   * Get activity schedule filter parameters
   */
  static async getActivityScheduleParams(): Promise<ActivityScheduleParamsApiResponse> {
    try {
      const response = await fetch(
        GET_ACTIVITY_SCHEDULE_PARAMS_FOR_REQUEST_DATA_FE,
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

      const data: ActivityScheduleParamsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to fetch activity schedule parameters",
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching activity schedule parameters:", error);
      throw error;
    }
  }

  /**
   * Get activity schedule details by ID
   * @param id - The ID of the activity schedule to fetch
   */
  static async getActivityScheduleDetails(
    id: number,
  ): Promise<ActivityScheduleDetailsApiResponse> {
    try {
      const requestBody: GetActivityScheduleDetailsRequest = { id };

      const response = await fetch(
        GET_ACTIVITY_SCHEDULE_DETAILS_BY_ID_DATA_FE,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify(requestBody),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ActivityScheduleDetailsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to fetch activity schedule details",
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching activity schedule details:", error);
      throw error;
    }
  }

  /**
   * Create a new activity schedule
   * @param scheduleData - The activity schedule data to create
   */
  static async createActivitySchedule(
    scheduleData: CreateActivityScheduleRequest,
  ): Promise<CreateActivityScheduleApiResponse> {
    try {
      const response = await fetch(ADD_ACTIVITY_SCHEDULE_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(scheduleData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CreateActivityScheduleApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to create activity schedule");
      }

      return data;
    } catch (error) {
      console.error("Error creating activity schedule:", error);
      throw error;
    }
  }

  /**
   * Update an existing activity schedule
   * @param scheduleData - The activity schedule data to update
   */
  static async updateActivitySchedule(
    scheduleData: UpdateActivityScheduleRequest,
  ): Promise<UpdateActivityScheduleApiResponse> {
    try {
      const response = await fetch(UPDATE_ACTIVITY_SCHEDULE_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(scheduleData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: UpdateActivityScheduleApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to update activity schedule");
      }

      return data;
    } catch (error) {
      console.error("Error updating activity schedule:", error);
      throw error;
    }
  }

  /**
   * Terminate an activity schedule
   * @param id - The ID of the activity schedule to terminate
   */
  static async terminateActivitySchedule(
    id: number,
  ): Promise<TerminateActivityScheduleApiResponse> {
    try {
      const requestBody: TerminateActivityScheduleRequest = { id };

      const response = await fetch(TERMINATE_ACTIVITY_SCHEDULE_DATA_FE, {
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

      const data: TerminateActivityScheduleApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to terminate activity schedule",
        );
      }

      return data;
    } catch (error) {
      console.error("Error terminating activity schedule:", error);
      throw error;
    }
  }

  /**
   * Helper method to get status badge color
   */
  static getStatusColor(status: string): string {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "INACTIVE":
        return "bg-yellow-100 text-yellow-800";
      case "TERMINATED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  /**
   * Helper method to get default form data for creating an activity schedule
   */
  static getDefaultCreateFormData(): CreateActivityScheduleRequest {
    return {
      activityScheduleName: "",
      activityId: 0,
      assumeStartDate: new Date().toISOString(),
      assumeEndDate: new Date().toISOString(),
      durationHoursStart: 0,
      durationHoursEnd: 0,
      specialNotes: "",
      description: "",
      packageScheduleId: 0,
      tourScheduleId: 0,
      status: "ACTIVE",
    };
  }

  /**
   * Helper method to get default update form data
   */
  static getDefaultUpdateFormData(
    scheduleId: number,
  ): UpdateActivityScheduleRequest {
    return {
      activityScheduleId: scheduleId,
      activityScheduleName: "",
      activityId: 0,
      assumeStartDate: new Date().toISOString(),
      assumeEndDate: new Date().toISOString(),
      durationHoursStart: 0,
      durationHoursEnd: 0,
      specialNotes: "",
      description: "",
      packageScheduleId: 0,
      tourScheduleId: 0,
      status: "ACTIVE",
    };
  }

  /**
   * Helper method to validate activity schedule form data
   */
  static validateActivityScheduleForm(
    formData: Partial<CreateActivityScheduleRequest>,
  ): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!formData.activityScheduleName?.trim()) {
      errors.activityScheduleName = "Schedule name is required";
    } else if (formData.activityScheduleName.length < 3) {
      errors.activityScheduleName =
        "Schedule name must be at least 3 characters";
    }

    if (!formData.activityId || formData.activityId <= 0) {
      errors.activityId = "Activity selection is required";
    }

    if (!formData.assumeStartDate) {
      errors.assumeStartDate = "Start date is required";
    }

    if (!formData.assumeEndDate) {
      errors.assumeEndDate = "End date is required";
    }

    if (
      formData.assumeStartDate &&
      formData.assumeEndDate &&
      new Date(formData.assumeStartDate) >= new Date(formData.assumeEndDate)
    ) {
      errors.assumeEndDate = "End date must be after start date";
    }

    if (!formData.durationHoursStart || formData.durationHoursStart <= 0) {
      errors.durationHoursStart = "Valid start duration is required";
    }

    if (!formData.durationHoursEnd || formData.durationHoursEnd <= 0) {
      errors.durationHoursEnd = "Valid end duration is required";
    }

    if (
      formData.durationHoursStart &&
      formData.durationHoursEnd &&
      formData.durationHoursStart >= formData.durationHoursEnd
    ) {
      errors.durationHoursEnd =
        "End duration must be greater than start duration";
    }

    if (!formData.description?.trim()) {
      errors.description = "Description is required";
    } else if (formData.description.length < 10) {
      errors.description = "Description must be at least 10 characters";
    }

    return errors;
  }

  /**
   * Helper method to format date for display
   */
  static formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  /**
   * Helper method to format datetime for display
   */
  static formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  /**
   * Helper method to format currency
   */
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  /**
   * Helper method to get primary category name
   */
  static getPrimaryCategory(
    categories: { name: string; is_primary: boolean }[],
  ): string {
    const primary = categories.find((cat) => cat.is_primary);
    return primary?.name || "Uncategorized";
  }

  /**
   * Helper method to get all category names
   */
  static getAllCategoryNames(categories: { name: string }[]): string {
    return categories.map((cat) => cat.name).join(", ");
  }
}
