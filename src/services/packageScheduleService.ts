// services/packageScheduleService.ts

import {
  PackageScheduleListApiResponse,
  PackageScheduleFilterParams,
  PackageScheduleParamsApiResponse,
  PackageScheduleDetailsApiResponse,
  CreatePackageScheduleRequest,
  CreatePackageScheduleApiResponse,
  UpdatePackageScheduleRequest,
  UpdatePackageScheduleApiResponse,
  TerminatePackageScheduleApiResponse,
  GetPackageScheduleDetailsRequest,
  TerminatePackageScheduleRequest,
  PackageScheduleIdAndNamesApiResponse,
} from "@/types/package-schedule-types";
import {
  ADD_PACKAGE_SCHEDULE_DATA_FE,
  GET_PACKAGE_SCHEDULE_DATA_FE,
  GET_PACKAGE_SCHEDULE_DETAILS_BY_ID_DATA_FE,
  GET_PACKAGE_SCHEDULE_ID_AND_NAMES_DATA_FE,
  GET_PACKAGE_SCHEDULE_PARAMS_FOR_REQUEST_DATA_FE,
  TERMINATE_PACKAGE_SCHEDULE_DATA_FE,
  UPDATE_PACKAGE_SCHEDULE_DATA_FE,
} from "@/utils/frontEndConstant";

export class PackageScheduleService {
  /**
   * Get package schedules with pagination and filtering
   */
  static async getPackageSchedules(
    params: PackageScheduleFilterParams,
  ): Promise<PackageScheduleListApiResponse> {
    try {
      const response = await fetch(GET_PACKAGE_SCHEDULE_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: params.name || null,
          packageId: params.packageId || null,
          tourScheduleId: params.tourScheduleId || null,
          tourId: params.tourId || null,
          startDate: params.startDate || null,
          endDate: params.endDate || null,
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

      const data: PackageScheduleListApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch package schedules");
      }

      return data;
    } catch (error) {
      console.error("Error fetching package schedules:", error);
      throw error;
    }
  }

  /**
   * Get package schedule filter parameters (tours, packages, tour schedules, sort options)
   */
  static async getPackageScheduleParams(): Promise<PackageScheduleParamsApiResponse> {
    try {
      const response = await fetch(
        GET_PACKAGE_SCHEDULE_PARAMS_FOR_REQUEST_DATA_FE,
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

      const data: PackageScheduleParamsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to fetch package schedule parameters",
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching package schedule parameters:", error);
      throw error;
    }
  }

  /**
   * Get package schedule details by ID
   * @param id - The ID of the package schedule to fetch
   */
  static async getPackageScheduleDetails(
    id: number,
  ): Promise<PackageScheduleDetailsApiResponse> {
    try {
      const requestBody: GetPackageScheduleDetailsRequest = { id };

      const response = await fetch(GET_PACKAGE_SCHEDULE_DETAILS_BY_ID_DATA_FE, {
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

      const data: PackageScheduleDetailsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to fetch package schedule details",
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching package schedule details:", error);
      throw error;
    }
  }

  /**
   * Create a new package schedule
   * @param scheduleData - The package schedule data to create
   */
  static async createPackageSchedule(
    scheduleData: CreatePackageScheduleRequest,
  ): Promise<CreatePackageScheduleApiResponse> {
    try {
      const response = await fetch(ADD_PACKAGE_SCHEDULE_DATA_FE, {
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

      const data: CreatePackageScheduleApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to create package schedule");
      }

      return data;
    } catch (error) {
      console.error("Error creating package schedule:", error);
      throw error;
    }
  }

  /**
   * Update an existing package schedule
   * @param scheduleData - The package schedule data to update
   */
  static async updatePackageSchedule(
    scheduleData: UpdatePackageScheduleRequest,
  ): Promise<UpdatePackageScheduleApiResponse> {
    try {
      const response = await fetch(UPDATE_PACKAGE_SCHEDULE_DATA_FE, {
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

      const data: UpdatePackageScheduleApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to update package schedule");
      }

      return data;
    } catch (error) {
      console.error("Error updating package schedule:", error);
      throw error;
    }
  }

  // Add this method to the PackageScheduleService class

/**
 * Get all package schedule IDs and names for dropdown/selection
 */
static async getPackageScheduleIdAndNames(): Promise<PackageScheduleIdAndNamesApiResponse> {
  try {
    const response = await fetch(GET_PACKAGE_SCHEDULE_ID_AND_NAMES_DATA_FE, {
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

    const data: PackageScheduleIdAndNamesApiResponse = await response.json();

    if (data.code !== 200) {
      throw new Error(data.message || "Failed to fetch package schedule IDs and names");
    }

    return data;
  } catch (error) {
    console.error("Error fetching package schedule IDs and names:", error);
    throw error;
  }
}

  /**
   * Terminate a package schedule
   * @param id - The ID of the package schedule to terminate
   */
  static async terminatePackageSchedule(
    id: number,
  ): Promise<TerminatePackageScheduleApiResponse> {
    try {
      const requestBody: TerminatePackageScheduleRequest = { id };

      const response = await fetch(TERMINATE_PACKAGE_SCHEDULE_DATA_FE, {
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

      const data: TerminatePackageScheduleApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to terminate package schedule");
      }

      return data;
    } catch (error) {
      console.error("Error terminating package schedule:", error);
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
      default:
        return status;
    }
  }

  /**
   * Helper method to get default form data for creating a package schedule
   */
  static getDefaultCreateFormData(): CreatePackageScheduleRequest {
    return {
      packageScheduleName: "",
      packageId: 0,
      assumeStartDate: new Date().toISOString(),
      assumeEndDate: new Date().toISOString(),
      durationStart: 0,
      durationEnd: 0,
      specialNote: "",
      description: "",
      status: "ACTIVE",
      tourScheduleId: 0,
    };
  }

  /**
   * Helper method to get default update form data
   */
  static getDefaultUpdateFormData(
    scheduleId: number,
  ): UpdatePackageScheduleRequest {
    return {
      packageScheduleId: scheduleId,
      packageScheduleName: "",
      packageId: 0,
      assumeStartDate: new Date().toISOString(),
      assumeEndDate: new Date().toISOString(),
      durationStart: 0,
      durationEnd: 0,
      specialNote: "",
      description: "",
      status: "ACTIVE",
      tourScheduleId: 0,
    };
  }

  /**
   * Helper method to validate package schedule form data
   */
  static validatePackageScheduleForm(
    formData: Partial<CreatePackageScheduleRequest>,
  ): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!formData.packageScheduleName?.trim()) {
      errors.packageScheduleName = "Schedule name is required";
    } else if (formData.packageScheduleName.length < 3) {
      errors.packageScheduleName =
        "Schedule name must be at least 3 characters";
    }

    if (!formData.packageId || formData.packageId <= 0) {
      errors.packageId = "Package selection is required";
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

    if (!formData.durationStart || formData.durationStart <= 0) {
      errors.durationStart = "Valid start duration is required";
    }

    if (!formData.durationEnd || formData.durationEnd <= 0) {
      errors.durationEnd = "Valid end duration is required";
    }

    if (
      formData.durationStart &&
      formData.durationEnd &&
      formData.durationStart >= formData.durationEnd
    ) {
      errors.durationEnd = "End duration must be greater than start duration";
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
}
