// services/tourScheduleService.ts

import {
  TourScheduleListApiResponse,
  TourScheduleFilterParams,
  TourScheduleParamsApiResponse,
  TourScheduleDetailsApiResponse,
  CreateTourScheduleRequest,
  CreateTourScheduleApiResponse,
  UpdateTourScheduleRequest,
  UpdateTourScheduleApiResponse,
  TerminateTourScheduleApiResponse,
  GetTourScheduleDetailsRequest,
  TerminateTourScheduleRequest,
} from "@/types/tour-schedule-types";
import {
  ADD_TOUR_SCHEDULE_DATA_FE,
  GET_TOUR_SCHEDULE_DATA_FE,
  GET_TOUR_SCHEDULE_DETAILS_BY_ID_DATA_FE,
  GET_TOUR_SCHEDULE_PARAMS_FOR_REQUEST_DATA_FE,
  TERMINATE_TOUR_SCHEDULE_DATA_FE,
  UPDATE_TOUR_SCHEDULE_DATA_FE,
} from "@/utils/frontEndConstant";

export class TourScheduleService {
  /**
   * Get tour schedules with pagination and filtering
   */
  static async getTourSchedules(
    params: TourScheduleFilterParams,
  ): Promise<TourScheduleListApiResponse> {
    try {
      const response = await fetch(GET_TOUR_SCHEDULE_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: params.name || null,
          duration: params.duration || null,
          tourId: params.tourId || null,
          tourTypeId: params.tourTypeId || null,
          tourCategoryId: params.tourCategoryId || null,
          fromDate: params.fromDate || null,
          toDate: params.toDate || null,
          seasonId: params.seasonId || null,
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

      const data: TourScheduleListApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch tour schedules");
      }

      return data;
    } catch (error) {
      console.error("Error fetching tour schedules:", error);
      throw error;
    }
  }

  /**
   * Get tour schedule filter parameters (durations, tours, seasons, sort options)
   */
  static async getTourScheduleParams(): Promise<TourScheduleParamsApiResponse> {
    try {
      const response = await fetch(
        GET_TOUR_SCHEDULE_PARAMS_FOR_REQUEST_DATA_FE,
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

      const data: TourScheduleParamsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to fetch tour schedule parameters",
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching tour schedule parameters:", error);
      throw error;
    }
  }

  /**
   * Get tour schedule details by ID
   * @param id - The ID of the tour schedule to fetch
   */
  static async getTourScheduleDetails(
    id: number,
  ): Promise<TourScheduleDetailsApiResponse> {
    try {
      const requestBody: GetTourScheduleDetailsRequest = { id };

      const response = await fetch(GET_TOUR_SCHEDULE_DETAILS_BY_ID_DATA_FE, {
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

      const data: TourScheduleDetailsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to fetch tour schedule details",
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching tour schedule details:", error);
      throw error;
    }
  }

  /**
   * Create a new tour schedule
   * @param scheduleData - The tour schedule data to create
   */
  static async createTourSchedule(
    scheduleData: CreateTourScheduleRequest,
  ): Promise<CreateTourScheduleApiResponse> {
    try {
      const response = await fetch(ADD_TOUR_SCHEDULE_DATA_FE, {
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

      const data: CreateTourScheduleApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to create tour schedule");
      }

      return data;
    } catch (error) {
      console.error("Error creating tour schedule:", error);
      throw error;
    }
  }

  /**
   * Update an existing tour schedule
   * @param scheduleData - The tour schedule data to update
   */
  static async updateTourSchedule(
    scheduleData: UpdateTourScheduleRequest,
  ): Promise<UpdateTourScheduleApiResponse> {
    try {
      const response = await fetch(UPDATE_TOUR_SCHEDULE_DATA_FE, {
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

      const data: UpdateTourScheduleApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to update tour schedule");
      }

      return data;
    } catch (error) {
      console.error("Error updating tour schedule:", error);
      throw error;
    }
  }

  /**
   * Terminate a tour schedule
   * @param id - The ID of the tour schedule to terminate
   */
  static async terminateTourSchedule(
    id: number,
  ): Promise<TerminateTourScheduleApiResponse> {
    try {
      const requestBody: TerminateTourScheduleRequest = { id };

      const response = await fetch(TERMINATE_TOUR_SCHEDULE_DATA_FE, {
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

      const data: TerminateTourScheduleApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to terminate tour schedule");
      }

      return data;
    } catch (error) {
      console.error("Error terminating tour schedule:", error);
      throw error;
    }
  }

  /**
   * Helper method to get status badge color
   */
  static getStatusColor(status: string): string {
    switch (status) {
      case "1":
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "0":
      case "INACTIVE":
        return "bg-yellow-100 text-yellow-800";
      case "TERMINATED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  /**
   * Helper method to get schedule status display text
   */
  static getScheduleStatusDisplay(status: string): string {
    switch (status) {
      case "1":
        return "Active";
      case "0":
        return "Inactive";
      case "TERMINATED":
        return "Terminated";
      default:
        return status;
    }
  }

  /**
   * Helper method to get default form data for creating a tour schedule
   */
  static getDefaultCreateFormData(): CreateTourScheduleRequest {
    return {
      tourScheduleName: "",
      tourId: 0,
      assumeStartDate: new Date().toISOString(),
      assumeEndDate: new Date().toISOString(),
      durationHoursStart: 0,
      durationHoursEnd: 0,
      specialNotes: "",
      description: "",
      status: "ACTIVE",
    };
  }

  /**
   * Helper method to get default update form data
   */
  static getDefaultUpdateFormData(
    scheduleId: number,
  ): UpdateTourScheduleRequest {
    return {
      tourScheduleId: scheduleId,
      tourScheduleName: "",
      tourId: 0,
      assumeStartDate: new Date().toISOString(),
      assumeEndDate: new Date().toISOString(),
      durationHoursStart: 0,
      durationHoursEnd: 0,
      specialNotes: "",
      description: "",
      status: "ACTIVE",
    };
  }

  /**
   * Helper method to validate tour schedule form data
   */
  static validateTourScheduleForm(
    formData: Partial<CreateTourScheduleRequest>,
  ): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!formData.tourScheduleName?.trim()) {
      errors.tourScheduleName = "Schedule name is required";
    } else if (formData.tourScheduleName.length < 3) {
      errors.tourScheduleName = "Schedule name must be at least 3 characters";
    }

    if (!formData.tourId || formData.tourId <= 0) {
      errors.tourId = "Tour selection is required";
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
}
